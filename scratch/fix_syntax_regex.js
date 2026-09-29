const fs = require('fs');

const files = [
    'webapp/pages/access/AccessPage.controller.js',
    'dist/pages/access/AccessPage.controller.js'
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    const regex = /onGoToStep3\(\)\s*\{[\s\S]*?\}\s*\}\s*,\s*async onVerifySourceTable\(\)/;
    
    const replacement = `onGoToStep3() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/dbMigration/currentStep", 3);
                setTimeout(() => {
                    this._smoothScrollTo("step3MigrationContainer", 16);
                }, 40);
            }
        },

        async onVerifySourceTable()`;

    if (regex.test(content)) {
        content = content.replace(regex, replacement);
        fs.writeFileSync(f, content, 'utf8');
        console.log('Successfully fixed extra brace in:', f);
    } else {
        console.log('Regex did not match in:', f);
    }
});
