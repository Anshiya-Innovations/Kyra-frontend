const fs = require('fs');

const transcriptPath = 'C:/Users/abcom/.gemini/antigravity/brain/4bb58e77-71b7-4f2a-a9a0-ef3a0703d84d/.system_generated/logs/transcript.jsonl';
const lines = fs.readFileSync(transcriptPath, 'utf8').trim().split('\n');

// Find steps between 2:40 PM and 3:20 PM
lines.forEach(l => {
    try {
        const obj = JSON.parse(l);
        if (obj.created_at >= '2026-09-29T09:00:00Z' && obj.created_at <= '2026-09-29T09:40:00Z') {
            if (obj.type === 'PLANNER_RESPONSE') {
                if (obj.tool_calls) {
                    obj.tool_calls.forEach(tc => {
                        console.log(`[${obj.created_at}] Tool: ${tc.name}, Summary: ${tc.args?.toolSummary || tc.args?.Description || ''}`);
                    });
                }
            }
        }
    } catch(e){}
});
