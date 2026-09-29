const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

const stack = [];
const tagRegex = /<(\/)?([a-zA-Z0-9_:]+)([^>]*?)(\/?)>/g;
let match;
let line = 1;
let lastIndex = 0;
let errorCount = 0;

while ((match = tagRegex.exec(xml)) !== null) {
    const textBefore = xml.substring(lastIndex, match.index);
    line += (textBefore.match(/\n/g) || []).length;
    lastIndex = match.index;

    const isClosing = match[1] === '/';
    const tagName = match[2];
    const isSelfClosing = match[4] === '/';

    if (tagName.startsWith('!--') || tagName.startsWith('?')) continue;

    if (isSelfClosing) {
        // self closing
    } else if (isClosing) {
        if (stack.length === 0) {
            console.error(`Unexpected closing tag </${tagName}> at line ${line}`);
            errorCount++;
            if (errorCount > 5) break;
        } else {
            const popped = stack.pop();
            if (popped.name !== tagName) {
                console.error(`Tag mismatch at line ${line}: expected </${popped.name}> (opened line ${popped.line}), got </${tagName}>`);
                errorCount++;
                if (errorCount > 5) break;
            }
        }
    } else {
        stack.push({ name: tagName, line });
    }
}
