const fs = require("fs");
const path = require("path");

const accessControllers = [
    "webapp/pages/access/AccessPage.controller.js",
    "webapp/AccessPage.controller.js",
    "webapp/page component/User Access Management Portal page/AccessPage.controller.js",
    "webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js",
    "webapp/page component/page request/User Access Management Portal.controller.js",
    "webapp/page component/KYRA Frontend-SK/webapp/AccessPage.controller.js",
    "webapp/page component/KYRA Frontend-SK/webapp/page component/User Access Management Portal page/AccessPage.controller.js",
    "webapp/page component/KYRA Frontend-SK/webapp/page component/page request/User Access Management Portal page/AccessPage.controller.js"
];

const newExportDialogImpl = `        _openExportDialog(oConfig) {
            sap.ui.require([
                "sap/m/Dialog",
                "sap/m/VBox",
                "sap/m/HBox",
                "sap/m/Avatar",
                "sap/m/Title",
                "sap/m/Text",
                "sap/m/Button",
                "sap/m/MessageToast"
            ], (Dialog, VBox, HBox, Avatar, Title, Text, Button, MessageToast) => {
                let oDialog;
                // Notification Modal Header with Close button
                const oTopBar = new HBox({
                    justifyContent: "End",
                    items: [
                        new Button({
                            icon: "sap-icon://decline",
                            type: "Transparent",
                            tooltip: "Close",
                            press: () => oDialog.close()
                        }).addStyleClass("kyraExportNotifCloseBtn")
                    ]
                }).addStyleClass("kyraExportNotifTopBar");

                // Excel Icon Circle
                const oIconCircle = new HBox({
                    justifyContent: "Center",
                    items: [
                        new Avatar({
                            src: "sap-icon://excel-attachment",
                            displaySize: "M"
                        })
                    ]
                }).addStyleClass("kyraExportNotifIconCircle");

                // Title & Subtitle
                const oTitle = new Title({
                    text: oConfig.title || "Export to Excel",
                    level: "H3",
                    textAlign: "Center",
                    width: "100%"
                }).addStyleClass("kyraExportNotifTitle");

                const oDesc = new Text({
                    text: oConfig.subtitle || "Download the active filtered records as an Excel spreadsheet (.xlsx).",
                    textAlign: "Center",
                    width: "100%"
                }).addStyleClass("kyraExportNotifDesc");

                // File info card (Excel .xlsx only)
                const oFileCard = new HBox({
                    alignItems: "Center",
                    items: [
                        new Text({ text: ".XLSX" }).addStyleClass("kyraExportNotifFormatPill"),
                        new VBox({
                            items: [
                                new Title({ text: "Excel Spreadsheet (.xlsx)", level: "H5" }).addStyleClass("kyraExportNotifCardTitle"),
                                new Text({ text: "Formatted tabular workbook with audit columns" }).addStyleClass("kyraExportNotifCardSubtitle")
                            ]
                        }).addStyleClass("kyraExportNotifCardInfo")
                    ]
                }).addStyleClass("kyraExportNotifFileCard");

                // Download Handler
                const handleDownload = async () => {
                    oDialog.close();
                    if (typeof oConfig.onConfirmDownload === "function") {
                        await oConfig.onConfirmDownload();
                    }
                };

                // ONLY 2 BUTTONS: Cancel & Download
                const oFooter = new HBox({
                    justifyContent: "End",
                    alignItems: "Center",
                    items: [
                        new Button({
                            text: "Cancel",
                            press: () => oDialog.close()
                        }).addStyleClass("kyraExportNotifCancelBtn"),
                        new Button({
                            text: "Download",
                            icon: "sap-icon://download",
                            type: "Emphasized",
                            press: handleDownload
                        }).addStyleClass("kyraExportNotifDownloadBtn")
                    ]
                }).addStyleClass("kyraExportNotifFooter");

                // Assemble Dialog
                oDialog = new Dialog({
                    showHeader: false,
                    contentWidth: "420px",
                    verticalScrolling: false,
                    horizontalScrolling: false,
                    resizable: false,
                    content: [
                        new VBox({
                            alignItems: "Stretch",
                            items: [
                                oTopBar,
                                oIconCircle,
                                oTitle,
                                oDesc,
                                oFileCard,
                                oFooter
                            ]
                        }).addStyleClass("sapUiNoMargin")
                    ],
                    afterClose: () => oDialog.destroy()
                }).addStyleClass("kyraModernExportNotificationDialog");

                this.getView().addDependent(oDialog);
                oDialog.open();
            });
        },`;

accessControllers.forEach(relPath => {
    const fullPath = path.resolve(__dirname, "..", relPath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, "utf8");

    const oldRegex = /_openExportDialog\(oConfig\)\s*\{\s*if\s*\(oConfig\s*&&\s*oConfig\.filename\s*&&\s*oConfig\.filename\.includes\("Active_Entitlements"\)\)\s*\{\s*this\.onExportAccess\(\);\s*\}\s*else\s*\{\s*this\.onExportRequests\(\);\s*\}\s*\},?/;

    if (oldRegex.test(content)) {
        content = content.replace(oldRegex, newExportDialogImpl);
        fs.writeFileSync(fullPath, content, "utf8");
        console.log("Updated _openExportDialog in:", relPath);
    } else {
        console.log("Old pattern not matched in:", relPath);
    }
});
