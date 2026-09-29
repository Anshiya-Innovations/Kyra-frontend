const fs = require('fs');

// 1. Update controller default targetPersona to "Requester"
const ctrlPath = 'webapp/pages/access/AccessPage.controller.js';
let ctrlContent = fs.readFileSync(ctrlPath, 'utf8');

ctrlContent = ctrlContent.replace(
    /departmentPersona:\s*\{\s*departmentName:\s*"",\s*targetPersona:\s*"[^"]*",\s*status:\s*"Active"\s*\}/,
    `departmentPersona: {\n                    departmentName: "",\n                    targetPersona: "Requester",\n                    status: "Active"\n                }`
);
fs.writeFileSync(ctrlPath, ctrlContent, 'utf8');
console.log('Updated controller default targetPersona to Requester');

// 2. Update view XML files
const viewFiles = [
    'webapp/pages/access/AccessPage.view.xml',
    'webapp/AccessPage.view.xml',
    'dist/pages/access/AccessPage.view.xml'
];

viewFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');

    // Update adminDeptTargetPersonaSelect to strictly have Requester, Approver, Compliance Reviewer
    const deptSelectRegex = /<Select\s+id="adminDeptTargetPersonaSelect"[\s\S]*?<\/Select>/;
    if (deptSelectRegex.test(content)) {
        content = content.replace(deptSelectRegex, `<Select
                                            id="adminDeptTargetPersonaSelect"
                                            selectedKey="{accessModel>/departmentPersona/targetPersona}"
                                            width="100%"
                                            class="kyraDeptSelect">
                                            <core:Item key="Requester" text="Requester" />
                                            <core:Item key="Approver" text="Approver" />
                                            <core:Item key="Compliance Reviewer" text="Compliance Reviewer" />
                                        </Select>`);
        console.log('Updated adminDeptTargetPersonaSelect in:', f);
    }

    // Update adminUserPersonaSelect to strictly have Requester, Approver, Compliance Reviewer
    const userSelectRegex = /<Select\s+id="adminUserPersonaSelect"[\s\S]*?<\/Select>/;
    if (userSelectRegex.test(content)) {
        content = content.replace(userSelectRegex, `<Select
                                                id="adminUserPersonaSelect"
                                                selectedKey="{accessModel>/personaLookupUser/selectedPersona}"
                                                change=".onAdminPersonaDropdownChange"
                                                width="100%"
                                                class="kyraAdminBuilderSelect kyraDeptSelect">
                                                <core:Item key="Requester" text="Requester" />
                                                <core:Item key="Approver" text="Approver" />
                                                <core:Item key="Compliance Reviewer" text="Compliance Reviewer" />
                                            </Select>`);
        console.log('Updated adminUserPersonaSelect in:', f);
    }

    fs.writeFileSync(f, content, 'utf8');
});
console.log('All XML and JS files updated successfully!');
