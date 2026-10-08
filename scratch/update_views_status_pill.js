const fs = require('fs');

const files = [
  'webapp/pages/access/AccessPage.view.xml',
  'webapp/AccessPage.view.xml',
  'webapp/page component/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml'
];

const oldHBox = `<HBox alignItems="Center" class="kyraAdminStatusPill">
                                                        <customData>
                                                            <core:CustomData key="status" value="{= \${accessModel>isUnsaved} ? 'Draft' : \${accessModel>status} }" writeToDom="true" />
                                                        </customData>
                                                        <HBox class="kyraAdminVectorDot" />
                                                        <Text text="{= \${accessModel>isUnsaved} ? 'Draft' : \${accessModel>status} }" class="kyraAdminPillText" />
                                                    </HBox>`;

const newHBox = `<HBox alignItems="Center" class="kyraAdminStatusPill" press=".onToggleAdminServiceStatus" tooltip="Click to toggle Active / Deactive status">
                                                        <customData>
                                                            <core:CustomData key="status" value="{= \${accessModel>isUnsaved} ? 'Draft' : (\${accessModel>status} === 'Inactive' ? 'Deactive' : \${accessModel>status}) }" writeToDom="true" />
                                                        </customData>
                                                        <HBox class="kyraAdminVectorDot" />
                                                        <Text text="{= \${accessModel>isUnsaved} ? 'Draft' : (\${accessModel>status} === 'Inactive' ? 'Deactive' : \${accessModel>status}) }" class="kyraAdminPillText" />
                                                    </HBox>`;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const isCrlf = content.includes('\r\n');
  const target = isCrlf ? oldHBox.replace(/\n/g, '\r\n') : oldHBox.replace(/\r\n/g, '\n');
  const repl = isCrlf ? newHBox.replace(/\n/g, '\r\n') : newHBox.replace(/\r\n/g, '\n');

  if (content.includes(target)) {
    content = content.replace(target, repl);
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated service status pill in:', file);
  } else {
    console.error('Target not found in:', file);
  }
}
