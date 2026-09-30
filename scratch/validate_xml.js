const fs = require('fs');

const files = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'dist/pages/access/AccessPage.view.xml'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  // Simple XML tag matching check
  const tagStack = [];
  const tagRegex = /<(\/)?([a-zA-Z0-9_:]+)([^>]*?)(\/)?>/g;
  let match;
  let line = 1;
  let lastIndex = 0;
  let errors = 0;

  while ((match = tagRegex.exec(content)) !== null) {
    const isClosing = !!match[1];
    const tagName = match[2];
    const isSelfClosing = !!match[4] || match[0].endsWith('/>');

    if (tagName.startsWith('!--') || tagName.startsWith('?xml')) continue;

    if (isSelfClosing) {
      // self closing, no stack change
    } else if (isClosing) {
      const top = tagStack.pop();
      if (top !== tagName) {
        console.error(`[${f}] Mismatched closing tag </${tagName}>, expected </${top}> at index ${match.index}`);
        errors++;
        break;
      }
    } else {
      tagStack.push(tagName);
    }
  }

  if (errors === 0 && tagStack.length === 0) {
    console.log(`[PASS] XML syntax perfectly valid: ${f}`);
  } else if (tagStack.length > 0) {
    console.error(`[FAIL] Unclosed tags in ${f}:`, tagStack.slice(-5));
  }
});
