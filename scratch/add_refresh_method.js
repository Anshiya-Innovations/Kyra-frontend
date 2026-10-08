const fs = require('fs');

const accessControllerFiles = [
  'webapp/pages/access/AccessPage.controller.js',
  'webapp/AccessPage.controller.js',
  'webapp/page component/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js'
];

for (const file of accessControllerFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('onRefreshAccess(') && !content.includes('onRefreshAccess:')) {
      const target = 'onRefreshPendingRequests(';
      const target2 = 'onRefreshPendingRequests:';
      const refreshMethod = `        async onRefreshAccess() {
            const oModel = this.getView().getModel("accessModel");
            if (window.KyraLoader && typeof window.KyraLoader.show === "function") {
                window.KyraLoader.show({
                    title: "Refreshing Governance Data",
                    subtitle: "Synchronizing latest entitlements and request audit logs..."
                });
            }
            try {
                if (typeof this._loadSubmittedRequests === "function") {
                    await this._loadSubmittedRequests(oModel, true);
                }
                if (typeof this._fetchGovernanceHistory === "function") {
                    await this._fetchGovernanceHistory(oModel, true);
                }
                await new Promise(r => setTimeout(r, 650));
                sap.m.MessageToast.show("Data refreshed successfully.");
            } catch (err) {
                console.warn("Refresh error:", err);
            } finally {
                if (window.KyraLoader && typeof window.KyraLoader.hide === "function") {
                    window.KyraLoader.hide();
                }
            }
        },

`;
      if (content.includes(target)) {
        content = content.replace(target, refreshMethod + '        ' + target);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Added onRefreshAccess in:', file);
      } else if (content.includes(target2)) {
        content = content.replace(target2, refreshMethod + '        ' + target2);
        fs.writeFileSync(file, content, 'utf8');
        console.log('Added onRefreshAccess (syntax 2) in:', file);
      } else {
        console.warn('Target not found in:', file);
      }
    } else {
      console.log('onRefreshAccess already exists in:', file);
    }
  }
}
