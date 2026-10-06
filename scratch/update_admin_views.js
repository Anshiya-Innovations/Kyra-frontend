const fs = require('fs');

const viewFiles = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml'
];

viewFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Update System Card Header Actions
  const oldSysHeaderRegex = /<SearchField\s+placeholder="Search systems\.\.\."\s+width="210px"\s+liveChange="\.onSearchAdminSystems"\s+class="kyraAdminSearchField"\s*\/>\s*<Button\s+text="Add System"\s+icon="sap-icon:\/\/add"\s+type="Emphasized"\s+press="\.onAddAdminSystem"\s+class="kyraAdminAddBlueBtn"\s*\/>\s*<Button\s+icon="sap-icon:\/\/decline"\s+type="Transparent"\s+press="\.onCloseAdminSection"\s+tooltip="Close Section"\s+class="kyraCloseIconBtn sapUiTinyMarginBegin"\s*\/>/;

  const newSysHeader = `<SearchField
                                        placeholder="Search systems..."
                                        width="230px"
                                        liveChange=".onSearchAdminSystems"
                                        class="kyraAdminSearchField" />
                                    <Button
                                        text="Add System"
                                        icon="sap-icon://add"
                                        type="Emphasized"
                                        press=".onAddAdminSystem"
                                        class="kyraAdminAddBlueBtn" />
                                    <Button icon="sap-icon://decline" type="Transparent" press=".onCloseAdminSection" tooltip="Close Section" class="kyraCloseIconBtn" />`;

  if (oldSysHeaderRegex.test(content)) {
    content = content.replace(oldSysHeaderRegex, newSysHeader);
    console.log('Replaced System Header in', file);
  } else {
    console.log('Regex did not match directly in', file);
  }

  // Update Service Card button to use standard icon="sap-icon://add"
  content = content.replace(
    /<Button\s+text="\+ Add Service"\s+press="\.onAddAdminService"\s+type="Emphasized"\s+class="kyraAdminAddBlueBtn"\s*\/>/,
    `<Button
                                                text="Add Service"
                                                icon="sap-icon://add"
                                                press=".onAddAdminService"
                                                type="Emphasized"
                                                class="kyraAdminAddBlueBtn" />`
  );

  fs.writeFileSync(file, content, 'utf8');
});
console.log('Done view updates');
