const fs = require('fs');

const transcriptPath = 'C:/Users/abcom/.gemini/antigravity/brain/4bb58e77-71b7-4f2a-a9a0-ef3a0703d84d/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').trim().split('\n');

lines.forEach(l => {
    try {
        const obj = JSON.parse(l);
        if (obj.created_at >= '2026-09-29T08:15:00Z' && obj.created_at <= '2026-09-29T08:35:00Z') {
            if (obj.type === 'USER_INPUT') {
                console.log(`[${obj.created_at}] USER: ${obj.content}`);
            }
            if (obj.type === 'PLANNER_RESPONSE' && obj.tool_calls) {
                obj.tool_calls.forEach(tc => {
                    if (tc.name === 'write_to_file') {
                        console.log(`[${obj.created_at}] Wrote: ${tc.args.TargetFile}`);
                    }
                });
            }
        }
    } catch(e){}
});
