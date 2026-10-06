const fs = require("fs");

console.log("Starting move_sections_first.js...");

const viewPath = "webapp/pages/access/AccessPage.view.xml";
let view = fs.readFileSync(viewPath, "utf8");

// Normalize line breaks for robust manipulation
const isCRLF = view.includes("\r\n");
let normView = view.replace(/\r\n/g, "\n");

const startMarker = "<!-- ============================================================== -->\n                        <!-- NEW SECTION: BUSINESS SECTORS & BUSINESS FUNCTION DETAILS (Image 2) -->";
const endMarker = "<!-- 3. BOTTOM FULL-WIDTH CARD: CUSTOM CONFLICT SECTION";

const startIndex = normView.indexOf(startMarker);
const endIndex = normView.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    throw new Error("Could not find start or end marker in view!");
}

// Extract the new sections chunk
let newSectionsChunk = normView.substring(startIndex, endIndex).trim();

// Add close button to Business Function Details header if not already present
const oldFuncHeader = `<Button
                                        text="+ Add Business Function"
                                        press=".onAddAdminBusinessFunction"
                                        type="Emphasized"
                                        class="kyraAdminAddEntityBtn" />`;

const newFuncHeader = `<HBox alignItems="Center">
                                        <Button
                                            text="+ Add Business Function"
                                            press=".onAddAdminBusinessFunction"
                                            type="Emphasized"
                                            class="kyraAdminAddEntityBtn" />
                                        <Button icon="sap-icon://decline" type="Transparent" press=".onCloseAdminSection" tooltip="Close Section" class="kyraCloseIconBtn sapUiTinyMarginBegin" />
                                    </HBox>`;

if (newSectionsChunk.includes(oldFuncHeader) && !newSectionsChunk.includes("onCloseAdminSection")) {
    newSectionsChunk = newSectionsChunk.replace(oldFuncHeader, newFuncHeader);
    console.log("Added close button to Business Function Details header.");
}

// Remove the chunk from its current place
normView = normView.substring(0, startIndex) + normView.substring(endIndex);

// Target where to insert: before System (6)
const systemAnchor = "<!-- 1. TOP FULL-WIDTH CARD: SYSTEM (6) -->";
if (!normView.includes(systemAnchor)) {
    throw new Error("Could not find systemAnchor: " + systemAnchor);
}

normView = normView.replace(
    systemAnchor,
    newSectionsChunk + "\n\n                        " + systemAnchor
);

// Restore original line endings
const finalView = isCRLF ? normView.replace(/\n/g, "\r\n") : normView;

// Write master view
fs.writeFileSync(viewPath, finalView, "utf8");
console.log("Master view updated with sections moved before System!");

// Sync to all duplicates
const viewCopies = [
  'webapp/AccessPage.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/page request/User Access Management Portal page/AccessPage.view.xml',
  'webapp/page component/User Access Management Portal page/AccessPage.view.xml'
];

for (const p of viewCopies) {
  if (fs.existsSync(p)) {
    fs.writeFileSync(p, finalView, "utf8");
    console.log("Synced view to:", p);
  }
}

console.log("All views synchronized successfully!");
