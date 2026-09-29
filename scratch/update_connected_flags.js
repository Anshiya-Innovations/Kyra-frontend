const fs = require('fs');

const files = [
    'webapp/pages/access/AccessPage.controller.js',
    'dist/pages/access/AccessPage.controller.js'
];

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let ctrl = fs.readFileSync(f, 'utf8');

    // In onTestSourceConnection
    ctrl = ctrl.replace(
        'oModel.setProperty("/dbMigration/source/statusText", "Connected ✓");',
        'oModel.setProperty("/dbMigration/source/statusText", "Connected ✓");\n                    oModel.setProperty("/dbMigration/source/connected", true);'
    );
    ctrl = ctrl.replace(
        'oModel.setProperty("/dbMigration/source/statusText", "Verified ✓");',
        'oModel.setProperty("/dbMigration/source/statusText", "Verified ✓");\n                    oModel.setProperty("/dbMigration/source/connected", true);'
    );

    // In onTestTargetConnection
    ctrl = ctrl.replace(
        'oModel.setProperty("/dbMigration/target/statusText", "Connected ✓");',
        'oModel.setProperty("/dbMigration/target/statusText", "Connected ✓");\n                    oModel.setProperty("/dbMigration/target/connected", true);'
    );
    ctrl = ctrl.replace(
        'oModel.setProperty("/dbMigration/target/statusText", "Verified ✓");',
        'oModel.setProperty("/dbMigration/target/statusText", "Verified ✓");\n                    oModel.setProperty("/dbMigration/target/connected", true);'
    );

    fs.writeFileSync(f, ctrl, 'utf8');
    console.log('Updated connected flag in', f);
});
