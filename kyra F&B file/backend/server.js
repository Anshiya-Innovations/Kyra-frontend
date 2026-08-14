import cds from '@sap/cds';
import { EventEmitter } from 'events';

export const syncEvents = new EventEmitter();
// Max listeners setting to handle thousands of concurrent SSE connections cleanly
syncEvents.setMaxListeners(10000);

let globalDbVersion = Date.now();

export function incrementDbVersion() {
    globalDbVersion = Date.now();
    syncEvents.emit('db_mutated', { type: 'MUTATION', version: globalDbVersion });
}

cds.on('bootstrap', (app) => {
  // Ultra-fast light version check endpoint (0 DB queries executed if version has not changed)
  app.get('/api/sync/version', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({ version: globalDbVersion });
  });

  // Enterprise Server-Sent Events (SSE) Stream for cross-device real-time sync
  app.get('/api/sync/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    // Enable socket keepalive for enterprise proxies / load balancers
    if (req.socket) {
      req.socket.setKeepAlive(true);
      req.socket.setTimeout(0);
    }

    // Initial connection heartbeat
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', version: globalDbVersion })}\n\n`);

    // 25-second keepalive ping to prevent proxy/load-balancer timeouts (AWS ALB, Cloudflare, SAP BTP Router)
    const keepAlivePing = setInterval(() => {
      res.write(': ping\n\n');
    }, 25000);

    const onMutation = (data) => {
      res.write(`data: ${JSON.stringify(data || { type: 'MUTATION', version: globalDbVersion })}\n\n`);
    };

    syncEvents.on('db_mutated', onMutation);

    req.on('close', () => {
      clearInterval(keepAlivePing);
      syncEvents.removeListener('db_mutated', onMutation);
    });
  });
});

export default cds.server;
