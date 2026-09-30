const fs = require('fs');

const unifiedButtonCss = `/* ========================================================================== */
/* KYRA DESIGN SYSTEM: COMPLETE BUTTON SUITE                                  */
/* Strictly aligned with Project Theme, Brand Palette & Reference Screenshots  */
/* ========================================================================== */

/* -------------------------------------------------------------------------- */
/* 1. PRIMARY SOLID TEAL BUTTONS: Save, Save Changes, Enter, Submit           */
/* Matches media_1790761071419.png / media_1790764948109.png:                */
/* - Solid Teal Fill (#008C9C)                                               */
/* - Subtle Dark Teal Border (#007684)                                        */
/* - Crisp Bold White Text (#FFFFFF, 700)                                     */
/* - 9px Rounded Rectangle Curvature (border-radius: 9px)                    */
/* - 38px Standard Height                                                     */
/* - Soft Brand Shadow: box-shadow: 0 2px 6px rgba(0, 140, 156, 0.25)        */
/* -------------------------------------------------------------------------- */
.kyraAdminSaveBtn,
.kyraAdminSaveBtn.sapMBtn,
.kyraDeptSaveBtn,
.kyraDeptSaveBtn.sapMBtn,
.kyra-system-modal-submit-btn {
    height: 38px !important;
    min-height: 38px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
}

.kyraAdminSaveBtn .sapMBtnInner,
.kyraAdminSaveBtn.sapMBtn .sapMBtnInner,
.kyraDeptSaveBtn .sapMBtnInner,
.kyraDeptSaveBtn.sapMBtn .sapMBtnInner,
.kyra-system-modal-submit-btn {
    height: 38px !important;
    min-height: 38px !important;
    line-height: 35px !important;
    padding: 0 24px !important;
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1.5px solid #007684 !important;
    border-radius: 9px !important;
    color: #FFFFFF !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    font-family: inherit !important;
    box-shadow: 0 2px 6px rgba(0, 140, 156, 0.25) !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    cursor: pointer !important;
    outline: none !important;
    box-sizing: border-box !important;
}

.kyraAdminSaveBtn .sapMBtnContent,
.kyraAdminSaveBtn bdi,
.kyraAdminSaveBtn .sapUiIcon,
.kyraDeptSaveBtn .sapMBtnContent,
.kyraDeptSaveBtn bdi,
.kyraDeptSaveBtn .sapUiIcon,
.kyra-system-modal-submit-btn {
    color: #FFFFFF !important;
    font-weight: 700 !important;
    font-size: 14px !important;
}

.kyraAdminSaveBtn:hover .sapMBtnInner,
.kyraAdminSaveBtn.sapMBtn:hover .sapMBtnInner,
.kyraDeptSaveBtn:hover .sapMBtnInner,
.kyraDeptSaveBtn.sapMBtn:hover .sapMBtnInner,
.kyra-system-modal-submit-btn:hover {
    background: #007684 !important;
    background-color: #007684 !important;
    border-color: #005F6B !important;
    box-shadow: 0 4px 14px rgba(0, 140, 156, 0.38) !important;
    transform: translateY(-1px) !important;
}

.kyraAdminSaveBtn:active .sapMBtnInner,
.kyraAdminSaveBtn.sapMBtn:active .sapMBtnInner,
.kyraDeptSaveBtn:active .sapMBtnInner,
.kyra-system-modal-submit-btn:active {
    background: #005F6B !important;
    border-color: #004D57 !important;
    box-shadow: 0 1px 3px rgba(0, 140, 156, 0.2) !important;
    transform: translateY(0px) !important;
}

/* -------------------------------------------------------------------------- */
/* 2. SECONDARY ACTION BUTTONS: Cancel (Page & Modals)                        */
/* Matches media_1790765237466.png / media_1790761566801.png:                */
/* - Soft Ice-Cyan Fill (#E6FAFC)                                             */
/* - Vibrant 2px Cyan Border (#00C3D0)                                        */
/* - Bold Teal Text (#008B95, 700)                                            */
/* - 9px Rounded Curvature (border-radius: 9px)                               */
/* - 38px Standard Height                                                     */
/* - Subtle Cyan Glow: box-shadow: 0 2px 8px rgba(0, 195, 208, 0.18)         */
/* -------------------------------------------------------------------------- */
.kyraAdminCancelBtn,
.kyraAdminCancelBtn.sapMBtn {
    height: 38px !important;
    min-height: 38px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
}

.kyraAdminCancelBtn .sapMBtnInner,
.kyraAdminCancelBtn.sapMBtn .sapMBtnInner,
.kyra-system-modal-cancel-btn,
.kyra-confirm-cancel-btn,
#kyra_del_cancel_btn {
    height: 38px !important;
    min-height: 38px !important;
    line-height: 34px !important;
    padding: 0 22px !important;
    background: #E6FAFC !important;
    background-color: #E6FAFC !important;
    border: 2px solid #00C3D0 !important;
    border-radius: 9px !important;
    color: #008B95 !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    font-family: inherit !important;
    box-shadow: 0 2px 8px rgba(0, 195, 208, 0.18) !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    outline: none !important;
    box-sizing: border-box !important;
    text-decoration: none !important;
}

.kyraAdminCancelBtn .sapMBtnContent,
.kyraAdminCancelBtn bdi,
.kyraAdminCancelBtn .sapUiIcon,
.kyra-system-modal-cancel-btn,
.kyra-confirm-cancel-btn,
#kyra_del_cancel_btn {
    color: #008B95 !important;
    font-weight: 700 !important;
    font-size: 14px !important;
}

.kyraAdminCancelBtn:hover .sapMBtnInner,
.kyraAdminCancelBtn.sapMBtn:hover .sapMBtnInner,
.kyra-system-modal-cancel-btn:hover,
.kyra-confirm-cancel-btn:hover,
#kyra_del_cancel_btn:hover {
    background: #D4F4F8 !important;
    background-color: #D4F4F8 !important;
    border-color: #00AAB6 !important;
    color: #007684 !important;
    box-shadow: 0 4px 14px rgba(0, 195, 208, 0.32) !important;
    transform: translateY(-1px) !important;
}

.kyraAdminCancelBtn:hover .sapMBtnContent,
.kyraAdminCancelBtn:hover bdi,
.kyraAdminCancelBtn:hover .sapUiIcon {
    color: #007684 !important;
}

.kyraAdminCancelBtn:active .sapMBtnInner,
.kyraAdminCancelBtn.sapMBtn:active .sapMBtnInner,
.kyra-system-modal-cancel-btn:active,
.kyra-confirm-cancel-btn:active,
#kyra_del_cancel_btn:active {
    background: #BEEBF2 !important;
    background-color: #BEEBF2 !important;
    border-color: #00939F !important;
    box-shadow: 0 1px 4px rgba(0, 195, 208, 0.2) !important;
    transform: translateY(0px) !important;
}

/* -------------------------------------------------------------------------- */
/* 3. VIEW ALL PILL BUTTON: Matches media_1790761193666.png / media_1790764948113.png */
/* - Solid Teal Pill (border-radius: 20px)                                    */
/* - 9-Dot Grid Icon + White Text                                             */
/* - Soft Cyan Glow Shadow (box-shadow: 0 4px 14px rgba(0, 195, 208, 0.35))   */
/* -------------------------------------------------------------------------- */
.kyraViewAllBtn,
.kyraViewAllBtn.sapMBtn {
    height: 38px !important;
    min-height: 38px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
}

.kyraViewAllBtn .sapMBtnInner,
.kyraViewAllBtn.sapMBtn .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraViewAllBtn.sapMBtnEmphasized .sapMBtnInner {
    height: 38px !important;
    min-height: 38px !important;
    line-height: 36px !important;
    padding: 0 20px !important;
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1.5px solid transparent !important;
    border-radius: 20px !important;
    color: #FFFFFF !important;
    font-size: 13.5px !important;
    font-weight: 700 !important;
    box-shadow: 0 4px 14px rgba(0, 195, 208, 0.35) !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
}

.kyraViewAllBtn .sapMBtnContent,
.kyraViewAllBtn bdi,
.kyraViewAllBtn .sapMBtnIcon,
.kyraViewAllBtn .sapUiIcon {
    color: #FFFFFF !important;
    font-weight: 700 !important;
}

.kyraViewAllBtn:hover .sapMBtnInner,
.kyraViewAllBtn.sapMBtn:hover .sapMBtnInner,
html body .sapUiTheme-sap_horizon .kyraViewAllBtn.sapMBtnEmphasized:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    border-color: #00E5FF !important;
    box-shadow: 0 6px 18px rgba(0, 195, 208, 0.5) !important;
    transform: translateY(-1px) !important;
}

/* -------------------------------------------------------------------------- */
/* 4. DASHED OUTLINE SUB-ADD BUTTONS: + Add Team, + Add Persona               */
/* Matches media_1790759658817.png:                                           */
/* - Soft Tinted Background (#F0FDFA)                                         */
/* - 1.5px Dashed Cyan/Teal Border (#008C9C)                                  */
/* - Dark Teal Plus & Text (#007684)                                          */
/* - 8px Rounded Rectangle                                                    */
/* -------------------------------------------------------------------------- */
.kyraAdminSubAddBtn,
.kyraAdminSubAddBtn.sapMBtn,
.kyraAdminAddSubClassBtn,
.kyraAdminAddSubClassBtn.sapMBtn {
    height: 38px !important;
    min-height: 38px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
}

.kyraAdminSubAddBtn .sapMBtnInner,
.kyraAdminSubAddBtn.sapMBtn .sapMBtnInner,
.kyraAdminAddSubClassBtn .sapMBtnInner,
.kyraAdminAddSubClassBtn.sapMBtn .sapMBtnInner {
    height: 38px !important;
    min-height: 38px !important;
    line-height: 35px !important;
    padding: 0 16px !important;
    background: #F0FDFA !important;
    background-color: #F0FDFA !important;
    border: 1.5px dashed #008C9C !important;
    border-radius: 8px !important;
    color: #007684 !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    font-family: inherit !important;
    box-shadow: none !important;
    transition: all 0.2s ease !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    cursor: pointer !important;
    width: 100% !important;
    box-sizing: border-box !important;
}

.kyraAdminSubAddBtn .sapMBtnContent,
.kyraAdminSubAddBtn bdi,
.kyraAdminSubAddBtn .sapMBtnIcon,
.kyraAdminSubAddBtn .sapUiIcon,
.kyraAdminAddSubClassBtn .sapMBtnContent,
.kyraAdminAddSubClassBtn bdi,
.kyraAdminAddSubClassBtn .sapMBtnIcon,
.kyraAdminAddSubClassBtn .sapUiIcon {
    color: #007684 !important;
    font-weight: 600 !important;
    font-size: 13px !important;
}

.kyraAdminSubAddBtn:hover .sapMBtnInner,
.kyraAdminSubAddBtn.sapMBtn:hover .sapMBtnInner,
.kyraAdminAddSubClassBtn:hover .sapMBtnInner,
.kyraAdminAddSubClassBtn.sapMBtn:hover .sapMBtnInner {
    background: #CCFBF1 !important;
    background-color: #CCFBF1 !important;
    border-color: #005F6B !important;
    color: #005F6B !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.15) !important;
}

.kyraAdminSubAddBtn:hover .sapMBtnContent,
.kyraAdminSubAddBtn:hover bdi,
.kyraAdminSubAddBtn:hover .sapUiIcon,
.kyraAdminAddSubClassBtn:hover .sapMBtnContent,
.kyraAdminAddSubClassBtn:hover bdi,
.kyraAdminAddSubClassBtn:hover .sapUiIcon {
    color: #005F6B !important;
}

/* -------------------------------------------------------------------------- */
/* 5. HEADER ACTION BUTTONS: + Add New System, + Add Service, + Define Conflict */
/* - Solid Teal Fill (#008C9C)                                               */
/* - 8px Rounded Rectangle                                                    */
/* - White Text & Plus Icon (#FFFFFF)                                         */
/* -------------------------------------------------------------------------- */
.kyraAdminAddBlueBtn,
.kyraAdminAddBlueBtn.sapMBtn,
.kyraAdminCreateConflictBtn,
.kyraAdminCreateConflictBtn.sapMBtn {
    height: 36px !important;
    min-height: 36px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
}

.kyraAdminAddBlueBtn .sapMBtnInner,
.kyraAdminAddBlueBtn.sapMBtn .sapMBtnInner,
.kyraAdminCreateConflictBtn .sapMBtnInner,
.kyraAdminCreateConflictBtn.sapMBtn .sapMBtnInner {
    height: 36px !important;
    min-height: 36px !important;
    line-height: 34px !important;
    padding: 0 16px !important;
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #007684 !important;
    border-radius: 8px !important;
    color: #FFFFFF !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    box-shadow: 0 2px 6px rgba(0, 140, 156, 0.22) !important;
    transition: all 0.2s ease !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    gap: 6px !important;
    cursor: pointer !important;
}

.kyraAdminAddBlueBtn .sapMBtnContent,
.kyraAdminAddBlueBtn bdi,
.kyraAdminAddBlueBtn .sapUiIcon,
.kyraAdminCreateConflictBtn .sapMBtnContent,
.kyraAdminCreateConflictBtn bdi,
.kyraAdminCreateConflictBtn .sapUiIcon {
    color: #FFFFFF !important;
    font-weight: 600 !important;
    font-size: 13px !important;
}

.kyraAdminAddBlueBtn:hover .sapMBtnInner,
.kyraAdminAddBlueBtn.sapMBtn:hover .sapMBtnInner,
.kyraAdminCreateConflictBtn:hover .sapMBtnInner,
.kyraAdminCreateConflictBtn.sapMBtn:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    border-color: #005F6B !important;
    box-shadow: 0 4px 12px rgba(0, 140, 156, 0.32) !important;
    transform: translateY(-1px) !important;
}

/* -------------------------------------------------------------------------- */
/* 6. ROW ACTION ICON BUTTONS: Edit (Teal) & Delete (Red)                      */
/* Matches media_1790759658817.png:                                           */
/* - Edit: Solid Teal Squircle (32x32) with White Pencil Icon                 */
/* - Delete: Light Coral Squircle (32x32) with Red Trash Icon                 */
/* -------------------------------------------------------------------------- */
.kyraAdminSystemEditBtn,
.kyraAdminSystemEditBtn.sapMBtn {
    width: 32px !important;
    min-width: 32px !important;
    max-width: 32px !important;
    height: 32px !important;
    min-height: 32px !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraAdminSystemEditBtn .sapMBtnInner,
.kyraAdminSystemEditBtn.sapMBtn .sapMBtnInner {
    width: 32px !important;
    min-width: 32px !important;
    height: 32px !important;
    min-height: 32px !important;
    line-height: 30px !important;
    padding: 0 !important;
    background: #008C9C !important;
    background-color: #008C9C !important;
    border: 1px solid #008C9C !important;
    border-radius: 6px !important;
    box-shadow: none !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
}

.kyraAdminSystemEditBtn .sapUiIcon,
.kyraAdminSystemEditBtn.sapMBtn .sapUiIcon {
    color: #FFFFFF !important;
    font-size: 13px !important;
}

.kyraAdminSystemEditBtn:hover .sapMBtnInner,
.kyraAdminSystemEditBtn.sapMBtn:hover .sapMBtnInner {
    background: #007684 !important;
    background-color: #007684 !important;
    border-color: #007684 !important;
    transform: scale(1.04) !important;
}

.kyraAdminSystemDeleteBtn,
.kyraAdminSystemDeleteBtn.sapMBtn {
    width: 32px !important;
    min-width: 32px !important;
    max-width: 32px !important;
    height: 32px !important;
    min-height: 32px !important;
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraAdminSystemDeleteBtn .sapMBtnInner,
.kyraAdminSystemDeleteBtn.sapMBtn .sapMBtnInner {
    width: 32px !important;
    min-width: 32px !important;
    height: 32px !important;
    min-height: 32px !important;
    line-height: 30px !important;
    padding: 0 !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    border: 1px solid #FCA5A5 !important;
    border-radius: 6px !important;
    box-shadow: none !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
}

.kyraAdminSystemDeleteBtn .sapUiIcon,
.kyraAdminSystemDeleteBtn.sapMBtn .sapUiIcon {
    color: #EF4444 !important;
    font-size: 13px !important;
}

.kyraAdminSystemDeleteBtn:hover .sapMBtnInner,
.kyraAdminSystemDeleteBtn.sapMBtn:hover .sapMBtnInner {
    background: #FEF2F2 !important;
    background-color: #FEF2F2 !important;
    border-color: #EF4444 !important;
    transform: scale(1.04) !important;
}

/* -------------------------------------------------------------------------- */
/* 7. PREVIEW USERS (Outline Secondary Button)                                */
/* -------------------------------------------------------------------------- */
.kyraDeptPreviewBtn,
.kyraDeptPreviewBtn.sapMBtn {
    height: 38px !important;
    min-height: 38px !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
}

.kyraDeptPreviewBtn .sapMBtnInner {
    height: 38px !important;
    min-height: 38px !important;
    line-height: 35px !important;
    padding: 0 18px !important;
    border: 1.5px solid #CBD5E1 !important;
    border-radius: 9px !important;
    background: #FFFFFF !important;
    background-color: #FFFFFF !important;
    color: #0F172A !important;
    font-weight: 600 !important;
    font-size: 13.5px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    transition: all 0.15s ease !important;
}

.kyraDeptPreviewBtn .sapUiIcon {
    color: #008C9C !important;
    font-size: 14px !important;
    margin-right: 6px !important;
}

.kyraDeptPreviewBtn:hover .sapMBtnInner {
    border-color: #008C9C !important;
    background: #F0FDFA !important;
    color: #008C9C !important;
    box-shadow: 0 2px 8px rgba(0, 140, 156, 0.18) !important;
}

/* -------------------------------------------------------------------------- */
/* 8. FOOTERS & FLEX ALIGNMENT                                                */
/* -------------------------------------------------------------------------- */
.kyraAdminServiceDetailsFooter,
.kyraAdminConflictEditFooterBar,
.kyraPersonaDropdownActionBar {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-end !important;
    gap: 12px !important;
}
`;

const cssFiles = [
  'webapp/pages/access/style.css',
  'webapp/css/style.css',
  'dist/pages/access/style.css',
  'dist/css/style.css'
];

cssFiles.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');

  // Find start of the admin button override section
  // It starts around "/* 3. Primary Admin Buttons" or "/* ==========================================================================\n   IMAGE-MATCHED"
  const startMarker = '/* 3. Primary Admin Buttons: Pill Shape with Cyan Glowing Hover Drop Shadow';
  const startIdx = content.indexOf(startMarker);

  if (startIdx !== -1) {
    content = content.substring(0, startIdx) + unifiedButtonCss;
  } else {
    // If startMarker not found, check if "KYRA DESIGN SYSTEM: COMPLETE BUTTON SUITE" already exists
    const suiteMarker = '/* ==========================================================================\n/* KYRA DESIGN SYSTEM: COMPLETE BUTTON SUITE';
    const suiteIdx = content.indexOf('/* KYRA DESIGN SYSTEM: COMPLETE BUTTON SUITE');
    if (suiteIdx !== -1) {
      const topIdx = content.lastIndexOf('/* ==========================================================================', suiteIdx);
      content = content.substring(0, topIdx !== -1 ? topIdx : suiteIdx) + unifiedButtonCss;
    } else {
      content += '\n\n' + unifiedButtonCss;
    }
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`[UPDATED] ${file}`);
});

console.log('Unified button CSS applied to all stylesheets.');
