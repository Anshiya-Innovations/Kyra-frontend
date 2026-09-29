const fs = require('fs');

const transcriptPath = 'C:/Users/abcom/.gemini/antigravity/brain/4bb58e77-71b7-4f2a-a9a0-ef3a0703d84d/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').trim().split('\n');

lines.forEach((line, i) => {
    try {
        const obj = JSON.parse(line);
        if (obj.type === 'USER_INPUT') {
            console.log(`Step ${obj.step_index} [${obj.created_at}]:`);
            console.log(obj.content);
            if (obj.media) {
                console.log('Media:', JSON.stringify(obj.media));
            }
            console.log('---');
        }
    } catch(e){}
});
