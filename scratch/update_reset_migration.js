const fs = require('fs');

const files = [
    'webapp/pages/access/AccessPage.controller.js',
    'dist/pages/access/AccessPage.controller.js'
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    const regex = /onResetMigrationWorkflow\s*\(\)\s*\{[\s\S]*?MessageToast\.show\("Workflow reset to Step 1\."\);[\s\S]*?\}/;
    const replacement = `onResetMigrationWorkflow() {
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;
            oModel.setProperty("/dbMigration/currentStep", 1);
            oModel.setProperty("/dbMigration/columnMappings", JSON.parse(JSON.stringify(DEFAULT_MIGRATION_COLUMNS)));
            oModel.setProperty("/dbMigration/hud/visible", false);
            oModel.setProperty("/dbMigration/hud/state", "idle");
            MessageToast.show("Workflow reset to Step 1.");
        }`;

    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(f, content, 'utf8');
        console.log('Updated onResetMigrationWorkflow in:', f);
    } else {
        console.log('Target regex not matched in:', f);
    }
});
