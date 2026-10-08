const fs = require('fs');

const compFiles = [
  'webapp/Component.js',
  'webapp/page component/KYRA Frontend-SK/webapp/Component.js'
];

for (const f of compFiles) {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    const regex = /_setupModernBusyIndicator\(\)\s*\{[\s\S]*?\},/g;
    const repl = `_setupModernBusyIndicator() {
            // Setup global fetch and BusyIndicator hooks for unified project-themed loading slide
            if (window.KyraLoader && typeof window.KyraLoader.setupGlobalHooks === "function") {
                window.KyraLoader.setupGlobalHooks();
            }
        },`;

    if (regex.test(content)) {
      content = content.replace(regex, repl);
      fs.writeFileSync(f, content, 'utf8');
      console.log('Regex updated _setupModernBusyIndicator in:', f);
    } else {
      console.log('Regex failed in:', f);
    }
  }
}
