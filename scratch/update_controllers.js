const fs = require('fs');

const files = [
  'webapp/pages/access/AccessPage.controller.js',
  'webapp/AccessPage.controller.js',
  'webapp/page component/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.controller.js',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');

  // 1. Replace the select dropdown in edit service modal to use Active and Deactive
  const oldSelect = `<select id="kyra_edit_svc_status" class="kyra-system-modal-select">
                                    <option value="Active" \${sCurrentStatus === "Active" ? "selected" : ""}>Active</option>
                                    <option value="Inactive" \${sCurrentStatus === "Inactive" ? "selected" : ""}>Inactive</option>
                                </select>`;
  const newSelect = `<select id="kyra_edit_svc_status" class="kyra-system-modal-select">
                                    <option value="Active" \${(sCurrentStatus === "Active" || sCurrentStatus === "Draft") ? "selected" : ""}>Active</option>
                                    <option value="Deactive" \${(sCurrentStatus === "Deactive" || sCurrentStatus === "Inactive") ? "selected" : ""}>Deactive</option>
                                </select>`;

  if (content.includes(oldSelect)) {
    content = content.replace(oldSelect, newSelect);
    console.log('Updated select HTML in:', file);
  } else {
    // Try regex if spacing differs
    const regSelect = /<select id="kyra_edit_svc_status"[\s\S]*?<\/select>/;
    if (regSelect.test(content)) {
      content = content.replace(regSelect, `<select id="kyra_edit_svc_status" class="kyra-system-modal-select">
                                    <option value="Active" \${(sCurrentStatus === "Active" || sCurrentStatus === "Draft") ? "selected" : ""}>Active</option>
                                    <option value="Deactive" \${(sCurrentStatus === "Deactive" || sCurrentStatus === "Inactive") ? "selected" : ""}>Deactive</option>
                                </select>`);
      console.log('Regex updated select HTML in:', file);
    }
  }

  // 2. Ensure isUnsaved: false is set in item update inside onEditAdminService
  const oldItemAssign = `item.serviceName === sOldName ? Object.assign({}, item, {
                                        serviceName: sNewName,
                                        status: sNewStatus
                                    }) : item`;
  const newItemAssign = `item.serviceName === sOldName ? Object.assign({}, item, {
                                        serviceName: sNewName,
                                        status: sNewStatus,
                                        isUnsaved: false
                                    }) : item`;

  if (content.includes(oldItemAssign)) {
    content = content.replace(oldItemAssign, newItemAssign);
    console.log('Updated item assign (clearing isUnsaved) in:', file);
  }

  // 3. Ensure isCurrentServiceUnsaved is cleared when current service is edited
  const oldCurrentCheck = `if (bIsCurrent) {
                                    oModel.setProperty("/selectedAdminServiceName", sNewName);`;
  const newCurrentCheck = `if (bIsCurrent) {
                                    oModel.setProperty("/selectedAdminServiceName", sNewName);
                                    oModel.setProperty("/isCurrentServiceUnsaved", false);`;
  if (content.includes(oldCurrentCheck) && !content.includes('oModel.setProperty("/isCurrentServiceUnsaved", false);')) {
    content = content.replace(oldCurrentCheck, newCurrentCheck);
    console.log('Updated isCurrentServiceUnsaved in:', file);
  }

  // 4. Add onToggleAdminServiceStatus if not already present
  if (!content.includes('onToggleAdminServiceStatus')) {
    const toggleMethod = `
        onToggleAdminServiceStatus(oEvent) {
            const oCtx = oEvent.getSource().getBindingContext("accessModel");
            if (!oCtx) return;
            const oObj = oCtx.getObject();
            if (!oObj) return;
            const oModel = this.getView().getModel("accessModel");
            if (!oModel) return;

            const sCurrent = oObj.status || "Active";
            const sNewStatus = (sCurrent === "Active") ? "Deactive" : "Active";

            const aAll = (oModel.getProperty("/adminServicesAll") || []).map(item =>
                item.serviceName === oObj.serviceName ? Object.assign({}, item, {
                    status: sNewStatus,
                    isUnsaved: false
                }) : item
            );
            oModel.setProperty("/adminServicesAll", aAll);
            oModel.setProperty("/adminServices", aAll.slice());

            if (oModel.getProperty("/selectedAdminServiceName") === oObj.serviceName) {
                oModel.setProperty("/isCurrentServiceUnsaved", false);
            }

            this._savedAdminServicesAll = JSON.parse(JSON.stringify(aAll));
            this._syncAdminConfigToLiveAddAccess(oModel, true);
            this._persistAllCustomizationsToDb(oModel, "Service '" + oObj.serviceName + "' status changed to " + sNewStatus + ".");
            this._showSlideNotification("Status Updated", "Service '" + oObj.serviceName + "' is now " + sNewStatus + " and saved.");
            sap.m.MessageToast.show("Service '" + oObj.serviceName + "' is now " + sNewStatus + ".");
        },
`;
    // Insert right before onEditAdminService
    const editMarker = content.includes('onEditAdminService(') ? 'onEditAdminService(' : 'onEditAdminService:';
    content = content.replace(editMarker, toggleMethod + '\n        ' + editMarker);
    console.log('Added onToggleAdminServiceStatus in:', file);
  }

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Done updating controllers!');
