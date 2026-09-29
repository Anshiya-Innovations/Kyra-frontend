const fs = require('fs');

const xml = fs.readFileSync('webapp/pages/access/AccessPage.view.xml', 'utf8');

// Use xmldom or native XML parse check if available
try {
    const { DOMParser } = require('@xmldom/xmldom');
    const parser = new DOMParser({
        errorHandler: {
            error: (e) => console.error('XML Error:', e),
            fatalError: (e) => console.error('XML Fatal Error:', e)
        }
    });
    const doc = parser.parseFromString(xml, 'text/xml');
    console.log('XML parsed successfully with xmldom. Document element:', doc.documentElement.tagName);
} catch (e) {
    console.log('xmldom not installed or error:', e.message);
    // Let's do a fast tag balancing check
    const stack = [];
    const tagRegex = /<(\/)?([a-zA-Z0-9_:]+)([^>]*?)(\/?)>/g;
    let match;
    let line = 1;
    let lastIndex = 0;
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
            } else {
                const popped = stack.pop();
                if (popped.name !== tagName) {
                    console.error(`Tag mismatch at line ${line}: expected </${popped.name}> (opened line ${popped.line}), got </${tagName}>`);
                }
            }
        } else {
            stack.push({ name: tagName, line });
        }
    }
    if (stack.length > 0) {
        console.error('Unclosed tags at end of file:');
        stack.forEach(s => console.error(`  <${s.name}> opened at line ${s.line}`));
    } else {
        console.log('All tags balanced perfectly!');
    }
}
