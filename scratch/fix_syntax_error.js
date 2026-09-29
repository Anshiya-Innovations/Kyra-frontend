const fs = require('fs');

const files = [
    'webapp/pages/access/AccessPage.controller.js',
    'dist/pages/access/AccessPage.controller.js'
];

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    const bad = `        onGoToStep3() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/dbMigration/currentStep", 3);
                setTimeout(() => {
                    this._smoothScrollTo("step3MigrationContainer", 16);
                }, 40);
            }
        }
        },`;

    const good = `        onGoToStep3() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                oModel.setProperty("/dbMigration/currentStep", 3);
                setTimeout(() => {
                    this._smoothScrollTo("step3MigrationContainer", 16);
                }, 40);
            }
        },`;

    if (content.includes(bad)) {
        content = content.replace(bad, good);
        fs.writeFileSync(f, content, 'utf8');
        console.log('Fixed extra brace in:', f);
    } else {
        console.log('Could not find bad pattern in:', f);
    }
});
