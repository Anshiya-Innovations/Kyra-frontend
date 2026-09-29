const fs = require('fs');

const transcriptPath = 'C:/Users/abcom/.gemini/antigravity/brain/4bb58e77-71b7-4f2a-a9a0-ef3a0703d84d/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').trim().split('\n');

lines.forEach(l => {
    try {
        const obj = JSON.parse(l);
        if (obj.content && (obj.content.includes('1790670206327') || obj.content.includes('1790670364947') || obj.content.includes('1790674780864') || obj.content.includes('1790674833994'))) {
            console.log('Step', obj.step_index, obj.created_at);
            console.log(obj.content);
            console.log('===');
        }
    }catch(e){}
});
