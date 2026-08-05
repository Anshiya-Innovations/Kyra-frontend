sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, MessageToast, MessageBox, Filter, FilterOperator) => {
    "use strict";

    const aInitialSubRoles = [
        { key: "IT Developers (System Administrator)", text: "IT Developers (System Administrator)" },
        { key: "IT Administrators (System Administrator)", text: "IT Administrators (System Administrator)" },
        { key: "Lead Engineer (System Administrator)", text: "Lead Engineer (System Administrator)" },
        { key: "IT Security (System Administrator)", text: "IT Security (System Administrator)" }
    ];

    const oSubRolesMap = {
        "System Administrator": aInitialSubRoles,
        "System Owners": [
            { key: "Technical Product Owner (System Owner)", text: "Technical Product Owner (System Owner)" },
            { key: "Product Group Engineer (System Owner)", text: "Product Group Engineer (System Owner)" }
        ],
        "Stakeholders": [
            { key: "Business Product Owner (Stakeholders)", text: "Business Product Owner (Stakeholders)" },
            { key: "Line Manager (Stakeholders)", text: "Line Manager (Stakeholders)" },
            { key: "Compliance Manager (Stakeholders)", text: "Compliance Manager (Stakeholders)" },
            { key: "Role Owner (Stakeholders)", text: "Role Owner (Stakeholders)" },
            { key: "ISRM (Stakeholders)", text: "ISRM (Stakeholders)" },
            { key: "IAM / GRC Team (Stakeholders)", text: "IAM / GRC Team (Stakeholders)" }
        ]
    };

    return Controller.extend("kyra001.pages.accessPage.AccessPage", {
        onInit() {
            const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";
            const oModel = new JSONModel({
                showAddAccessSector: false,
                showRemoveAccessSector: false,
                selectedTabKey: "myAccess",
                activeRole: sActiveRole,
                isApproverPersona: sActiveRole === "Approver",
                showApprovalHistory: false,

                // 1. My Access Table Data (Assigned Entitlements)
                userAccessList: [
                    {
                        system: "SAP BTP Cloud Platform",
                        roleName: "IT Developers",
                        roleId: "BTP_DEV_GLOBAL_01",
                        category: "System Administrator",
                        grantedDate: "2026-01-15",
                        expiryDate: "Permanent",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    },
                    {
                        system: "KYRA Central Governance",
                        roleName: "Technical Product Owner",
                        roleId: "KYRA_TPO_ADMIN_09",
                        category: "System Owners",
                        grantedDate: "2026-03-10",
                        expiryDate: "Permanent",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    },
                    {
                        system: "SAP S/4HANA Enterprise",
                        roleName: "Lead Engineer",
                        roleId: "S4H_ENG_LEAD_04",
                        category: "System Administrator",
                        grantedDate: "2026-05-20",
                        expiryDate: "2027-05-20",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    },
                    {
                        system: "Active Directory / IAM",
                        roleName: "IT Security",
                        roleId: "IAM_SEC_AUDIT_02",
                        category: "System Administrator",
                        grantedDate: "2026-06-01",
                        expiryDate: "Permanent",
                        status: "Active",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    }
                ],

                // 2. Add Access Form State
                newRequest: {
                    system: "SAP BTP Cloud Platform",
                    category: "System Administrator",
                    roleName: aInitialSubRoles[0].key,
                    duration: "Permanent (Default)",
                    justification: ""
                },
                requestSubRoles: aInitialSubRoles,

                // 3. My Requests Tracking & Audit Log
                requestHistory: [
                    {
                        requestId: "REQ-2026-9041",
                        type: "Addition",
                        system: "SAP BTP Cloud Platform",
                        roleName: "IT Developers",
                        serviceTopic: "System Administrator",
                        selectedPersona: "Frontend & UI Developer Persona (IT Developers)",
                        accessDuration: "Permanent (Default)",
                        submissionDate: "2026-07-27",
                        createdAtRaw: new Date("2026-07-27T10:00:00.000Z").toISOString(),
                        approver: "Sarah Connor (IAM Owner)",
                        status: "Approved",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    },
                    {
                        requestId: "REQ-2026-9055",
                        type: "Addition",
                        system: "KYRA Central Governance",
                        roleName: "Business Product Owner",
                        serviceTopic: "Stakeholders",
                        selectedPersona: "Business Strategy Lead Persona (Business Product Owner)",
                        accessDuration: "Permanent (Default)",
                        submissionDate: "2026-07-28",
                        createdAtRaw: new Date("2026-07-28T14:30:00.000Z").toISOString(),
                        approver: "Line Manager / ISRM Team",
                        status: "Pending Approval",
                        statusState: "Warning",
                        statusIcon: "sap-icon://pending"
                    },
                    {
                        requestId: "REQ-2026-8812",
                        type: "Revocation",
                        system: "Active Directory / IAM",
                        roleName: "Compliance Manager",
                        serviceTopic: "Stakeholders",
                        selectedPersona: "Regulatory Compliance Officer Persona (Compliance Manager)",
                        accessDuration: "30 Days (Temporary)",
                        submissionDate: "2026-06-14",
                        createdAtRaw: new Date("2026-06-14T09:15:00.000Z").toISOString(),
                        approver: "Compliance Board",
                        status: "Approved",
                        statusState: "Success",
                        statusIcon: "sap-icon://sys-enter-2"
                    }
                ]
            });

            this.getOwnerComponent().setModel(oModel, "accessModel");
            this._loadSubmittedRequests(oModel);

            const oRouter = this.getOwnerComponent().getRouter();
            if (oRouter && oRouter.getRoute("AccessPage")) {
                oRouter.getRoute("AccessPage").attachPatternMatched(this._onRouteMatched, this);
            }
        },

        _onRouteMatched() {
            const oModel = this.getView().getModel("accessModel");
            if (oModel) {
                const sActiveRole = sessionStorage.getItem("kyra_active_role") || "Requester";
                oModel.setProperty("/activeRole", sActiveRole);
                oModel.setProperty("/isApproverPersona", sActiveRole === "Approver");
                
                if (sessionStorage.getItem("kyra_show_approval_history") === "true") {
                    oModel.setProperty("/showApprovalHistory", true);
                    sessionStorage.removeItem("kyra_show_approval_history");
                }
                
                this._loadSubmittedRequests(oModel);
            }

            const sScrollTo = sessionStorage.getItem("kyra_scroll_to");
            if (sScrollTo) {
                sessionStorage.removeItem("kyra_scroll_to");
                setTimeout(() => {
                    const oPage = this.byId("accessPortalPage");
                    const oTarget = this.byId(sScrollTo);
                    if (oPage && oTarget) {
                        oPage.scrollToElement(oTarget, 400);
                    }
                }, 500);
            }

            const sTabToSelect = sessionStorage.getItem("kyra_select_tab");
            if (sTabToSelect) {
                sessionStorage.removeItem("kyra_select_tab");
                const oTabBar = this.byId("accessIconTabBar");
                if (oTabBar) {
                    oTabBar.setSelectedKey(sTabToSelect);
                }
                if (oModel) {
                    oModel.setProperty("/selectedTabKey", sTabToSelect);
                }
            }
        },

        async _loadSubmittedRequests(oModel) {
            if (!oModel) return;

            let aDbRequests = [];
            let aRawDbRequests = [];
            try {
                const response = await fetch("/odata/v4/auth/Requests");
                const data = await response.json();
                if (data && data.value) {
                    aRawDbRequests = data.value;
                    aDbRequests = data.value.map(r => {
                        const sDbStatus = (r.status || "PENDING").toUpperCase();
                        let sStatusText = "Pending Approval";
                        let sState = "Warning";
                        let sIcon = "sap-icon://pending";
                        
                        if (sDbStatus === "APPROVED") {
                            sStatusText = "Approved";
                            sState = "Success";
                            sIcon = "sap-icon://sys-enter-2";
                        } else if (sDbStatus === "REJECTED") {
                            sStatusText = "Rejected";
                            sState = "Error";
                            sIcon = "sap-icon://error";
                        }

                        let sPersonaText = r.requester_persona || "Requester";
                        if (sPersonaText.toUpperCase().includes("ADMIN") || sPersonaText.toUpperCase().includes("COMPLIANCE")) {
                            sPersonaText = "Compliance Reviewer";
                        } else {
                            sPersonaText = "Requester";
                        }

                        return {
                            requestId: r.request_number,
                            requesterId: r.requester_username,
                            requesterUsername: r.requester_username,
                            type: "Addition",
                            system: r.target_system,
                            roleName: r.role_name,
                            serviceTopic: r.service_topic,
                            selectedPersona: r.selected_persona,
                            accessDuration: r.access_duration,
                            submissionDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                            createdAtRaw: r.created_at || new Date().toISOString(),
                            approver: "Line Manager / ISRM Team",
                            persona: sPersonaText,
                            status: sStatusText,
                            statusState: sState,
                            statusIcon: sIcon
                        };
                    });
                }
            } catch (err) {
                console.error("Error loading requests from database:", err);
            }

            const oGrouped = {};
            aRawDbRequests.forEach(r => {
                const sStatus = r.status || "PENDING";
                const isPending = sStatus.toUpperCase().includes("PENDING");
                const sGroupKey = (r.requester_username || "User003") + "_" + (r.business_sector || "") + "_" + (r.business_function || "") + "_" + (isPending ? "PENDING" : "PROCESSED");
                
                let sPersonaText = r.requester_persona || "Requester";
                if (sPersonaText.toUpperCase().includes("ADMIN") || sPersonaText.toUpperCase().includes("COMPLIANCE")) {
                    sPersonaText = "Compliance Reviewer";
                } else {
                    sPersonaText = "Requester";
                }

                if (!oGrouped[sGroupKey]) {
                    oGrouped[sGroupKey] = {
                        requestId: r.request_number,
                        requesterId: r.requester_username || "User003",
                        persona: sPersonaText,
                        system: r.target_system || "SAP BTP Cloud Platform",
                        serviceAndRole: (r.role_name || "IT Developers") + " (" + (r.service_topic || "System Administrator") + ")",
                        submissionDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                        decisionDate: r.updated_at ? r.updated_at.split("T")[0] : (r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0]),
                        createdAtRaw: r.created_at || new Date().toISOString(),
                        duration: r.access_duration || "Permanent",
                        sector: r.business_sector || "Information Technology & Security",
                        function: r.business_function || "Identity & Access Governance",
                        region: r.operating_region || "Global Enterprise (ALL)",
                        justification: r.justification || "Business Access Request",
                        status: isPending ? "Pending Approval" : (sStatus === "APPROVED" ? "Approved" : (sStatus === "REJECTED" ? "Rejected" : sStatus)),
                        statusState: isPending ? "Warning" : (sStatus === "APPROVED" ? "Success" : "Error"),
                        statusIcon: isPending ? "sap-icon://pending" : (sStatus === "APPROVED" ? "sap-icon://sys-enter-2" : "sap-icon://error"),
                        entitlements: []
                    };
                }
                
                // Add entitlement to the group
                oGrouped[sGroupKey].entitlements.push({
                    requestId: r.request_number,
                    system: r.target_system,
                    roleName: r.role_name,
                    team: r.service_topic,
                    selectedPersona: r.selected_persona || "Engineering & Developer Persona",
                    grantedDate: r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
                    expiryDate: r.access_duration,
                    status: isPending ? "Pending" : (sStatus === "APPROVED" ? "Approved" : (sStatus === "REJECTED" ? "Rejected" : sStatus)),
                    statusState: isPending ? "Warning" : (sStatus === "APPROVED" ? "Success" : "Error"),
                    statusIcon: isPending ? "sap-icon://pending" : (sStatus === "APPROVED" ? "sap-icon://sys-enter-2" : "sap-icon://error")
                });
            });
            
            const aAllGrouped = Object.values(oGrouped);
            aAllGrouped.sort((a, b) => a.requestId.localeCompare(b.requestId));

            const aPendingRequests = aAllGrouped.filter(r => r.status.toLowerCase().includes("pending"));
            const aProcessedRequests = aAllGrouped.filter(r => !r.status.toLowerCase().includes("pending"));

            oModel.setProperty("/pendingRequests", aPendingRequests);
            oModel.setProperty("/processedRequests", aProcessedRequests);
            oModel.setProperty("/activeRole", sessionStorage.getItem("kyra_active_role") || "Requester");
            oModel.setProperty("/isApproverPersona", (sessionStorage.getItem("kyra_active_role") || "Requester") === "Approver");

            const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
            const aSubmitted = JSON.parse(sessionStorage.getItem("kyra_submitted_requests") || "[]");
            
            // Filter requests strictly for the active logged-in user
            const aUserDbRequests = aDbRequests.filter(r => (r.requesterUsername === sActiveUser || r.requesterId === sActiveUser));
            const aUserSessionRequests = aSubmitted.filter(r => (r.requesterUsername === sActiveUser || r.requesterId === sActiveUser));

            let aCombined = [];

            // Merge DB requests
            aUserDbRequests.forEach(dbReq => {
                if (!aCombined.some(item => item.requestId === dbReq.requestId)) {
                    aCombined.push(dbReq);
                }
            });

            // Merge SessionStorage requests
            aUserSessionRequests.forEach(sessReq => {
                const idx = aCombined.findIndex(item => item.requestId === sessReq.requestId);
                if (idx !== -1) {
                    aCombined[idx] = Object.assign({}, sessReq, aCombined[idx]); // DB status takes precedence
                } else {
                    aCombined.push(sessReq);
                }
            });

            // Sort requests ascending so the newest/latest submissions are at the bottom
            aCombined.sort((a, b) => {
                const dateA = a.createdAtRaw ? new Date(a.createdAtRaw) : new Date(a.submissionDate || 0);
                const dateB = b.createdAtRaw ? new Date(b.createdAtRaw) : new Date(b.submissionDate || 0);
                return dateA - dateB;
            });

            const aMyPending = [];
            const aMyApproved = [];
            const aMyHistory = [];

            aCombined.forEach(r => {
                const sStatus = (r.status || "").toLowerCase();
                const sDuration = r.accessDuration || r.duration || "";
                let bExpired = false;

                if (sStatus.includes("approved") && !sDuration.toLowerCase().includes("permanent")) {
                    const match = sDuration.match(/(\d+)\s*Day/i);
                    if (match) {
                        const iDays = parseInt(match[1], 10);
                        const dSubmission = r.createdAtRaw ? new Date(r.createdAtRaw) : (r.submissionDate ? new Date(r.submissionDate) : new Date());
                        const dExpiry = new Date(dSubmission.getTime() + iDays * 24 * 60 * 60 * 1000);
                        if (new Date() > dExpiry) {
                            bExpired = true;
                        }
                    }
                }

                if (sStatus.includes("pending")) {
                    aMyPending.push(r);
                } else if (sStatus.includes("approved") && !bExpired) {
                    aMyApproved.push(r);
                } else {
                    if (bExpired) {
                        r.status = "Expired";
                        r.statusState = "Error";
                        r.statusIcon = "sap-icon://lateness";
                    }
                    aMyHistory.push(r);
                }
            });

            oModel.setProperty("/myPendingRequests", aMyPending);
            oModel.setProperty("/myApprovedRequests", aMyApproved);
            oModel.setProperty("/myHistoryRequests", aMyHistory);
            oModel.setProperty("/requestHistory", aCombined);

            // Load and filter notifications for active user
            const aAllNotifications = JSON.parse(sessionStorage.getItem("kyra_user_notifications") || "[]");
            const aUserNotifications = aAllNotifications.filter(n => n.requesterId === sActiveUser);
            const iUnreadCount = aUserNotifications.filter(n => n.unread !== false).length;

            oModel.setProperty("/notificationsList", aUserNotifications);
            oModel.setProperty("/notificationsCount", iUnreadCount);
        },

        onOpenAddAccessDialog() {
            sessionStorage.setItem("kyra_reset_add_access", "true");
            sessionStorage.removeItem("kyra_wizard_sector");
            sessionStorage.removeItem("kyra_wizard_function");
            this.getOwnerComponent().getRouter().navTo("AddAccessBusinessSector");
        },

        onCloseAddAccessSector() {
            const oModel = this.getView().getModel("accessModel");
            oModel.setProperty("/showAddAccessSector", false);
        },

        onOpenRemoveAccessDialog() {
            const oModel = this.getView().getModel("accessModel");
            oModel.setProperty("/showRemoveAccessSector", true);
            oModel.setProperty("/showAddAccessSector", false);
            MessageToast.show("Remove Access Revocation section displayed below.");
        },

        onCloseRemoveAccessSector() {
            const oModel = this.getView().getModel("accessModel");
            oModel.setProperty("/showRemoveAccessSector", false);
        },

        onCategoryChange(oEvent) {
            const sCategory = oEvent.getParameter("selectedItem").getKey();
            const oModel = this.getView().getModel("accessModel");

            const aSubRoles = oSubRolesMap[sCategory] || [];
            const sDefaultSubRole = aSubRoles.length > 0 ? aSubRoles[0].key : "";

            oModel.setProperty("/requestSubRoles", aSubRoles);
            oModel.setProperty("/newRequest/roleName", sDefaultSubRole);
        },

        onAddAccessSubmit() {
            const oModel = this.getView().getModel("accessModel");
            const oForm = oModel.getProperty("/newRequest");

            if (!oForm.justification || oForm.justification.trim().length === 0) {
                MessageBox.error("Please provide a business justification before submitting your access request.");
                return;
            }

            const sReqId = "REQ-2026-" + Math.floor(1000 + Math.random() * 9000);
            const aHistory = oModel.getProperty("/requestHistory");

            aHistory.unshift({
                requestId: sReqId,
                type: "Addition",
                system: oForm.system,
                roleName: oForm.roleName,
                submissionDate: new Date().toISOString().split("T")[0],
                createdAtRaw: new Date().toISOString(),
                approver: "Designated Role Owner",
                status: "Pending Approval",
                statusState: "Warning",
                statusIcon: "sap-icon://pending"
            });

            oModel.setProperty("/requestHistory", aHistory);
            oModel.setProperty("/newRequest/justification", "");
            oModel.setProperty("/showAddAccessSector", false);

            MessageBox.success("Access Request " + sReqId + " for '" + oForm.roleName + "' submitted successfully! Routed for role owner approval.", {
                title: "Request Submitted",
                onClose: () => {
                    const oTabBar = this.byId("accessIconTabBar");
                    oTabBar.setSelectedKey("myRequests");
                }
            });
        },

        onClearRequestForm() {
            const oModel = this.getView().getModel("accessModel");
            oModel.setProperty("/newRequest/justification", "");
            MessageToast.show("Form cleared.");
        },

        onRemoveAccessClick(oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oData = oItem.getBindingContext("accessModel").getObject();
            const oModel = this.getView().getModel("accessModel");

            MessageBox.confirm("Are you sure you want to request revocation for role '" + oData.roleName + "' on " + oData.system + "?", {
                title: "Confirm Access Removal",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        const sReqId = "REV-2026-" + Math.floor(1000 + Math.random() * 9000);
                        const aHistory = oModel.getProperty("/requestHistory");

                        aHistory.unshift({
                            requestId: sReqId,
                            type: "Revocation",
                            system: oData.system,
                            roleName: oData.roleName,
                            submissionDate: new Date().toISOString().split("T")[0],
                            createdAtRaw: new Date().toISOString(),
                            approver: "IAM Security Board",
                            status: "Revocation Pending",
                            statusState: "Error",
                            statusIcon: "sap-icon://pending"
                        });

                        oModel.setProperty("/requestHistory", aHistory);
                        oModel.setProperty("/showRemoveAccessSector", false);
                        MessageToast.show("Revocation Request " + sReqId + " submitted successfully.");

                        const oTabBar = this.byId("accessIconTabBar");
                        oTabBar.setSelectedKey("myRequests");
                    }
                }
            });
        },

        onSearchMyAccess(oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const aFilters = [];

            if (sQuery && sQuery.trim().length > 0) {
                aFilters.push(new Filter([
                    new Filter("system", FilterOperator.Contains, sQuery),
                    new Filter("roleName", FilterOperator.Contains, sQuery),
                    new Filter("roleId", FilterOperator.Contains, sQuery),
                    new Filter("category", FilterOperator.Contains, sQuery)
                ], false));
            }

            const oTable = this.byId("myAccessTable");
            const oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        onViewRoleDetails(oEvent) {
            const oItem = oEvent.getSource().getParent().getParent();
            const oData = oItem.getBindingContext("accessModel").getObject();

            MessageBox.information(
                "Role Name: " + oData.roleName + "\n" +
                "Role ID: " + oData.roleId + "\n" +
                "Target System: " + oData.system + "\n" +
                "Category: " + oData.category + "\n" +
                "Granted Date: " + oData.grantedDate + "\n" +
                "Expiration: " + oData.expiryDate + "\n" +
                "Status: " + oData.status,
                { title: "Entitlement Details" }
            );
        },

        onSearchRequests(oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const aFilters = [];

            if (sQuery && sQuery.trim().length > 0) {
                aFilters.push(new Filter([
                    new Filter("requestId", FilterOperator.Contains, sQuery),
                    new Filter("system", FilterOperator.Contains, sQuery),
                    new Filter("roleName", FilterOperator.Contains, sQuery),
                    new Filter("serviceTopic", FilterOperator.Contains, sQuery),
                    new Filter("selectedPersona", FilterOperator.Contains, sQuery),
                    new Filter("accessDuration", FilterOperator.Contains, sQuery),
                    new Filter("status", FilterOperator.Contains, sQuery)
                ], false));
            }

            const oTable = this.byId("myRequestsTable");
            const oBinding = oTable.getBinding("items");
            oBinding.filter(aFilters);
        },

        onExportAccess() {
            MessageToast.show("Exporting My Access entitlements to CSV...");
        },

        onExportRequests() {
            MessageToast.show("Exporting My Requests audit trail to CSV...");
        },

        onRefreshAccess() {
            MessageToast.show("Access page data refreshed.");
        },

        onOpenNotificationsPopover(oEvent) {
            const oSource = oEvent.getSource();
            const oModel = this.getView().getModel("accessModel");
            const aList = oModel.getProperty("/notificationsList") || [];

            sap.ui.require([
                "sap/m/ResponsivePopover", "sap/m/List", "sap/m/CustomListItem",
                "sap/m/HBox", "sap/m/VBox", "sap/m/Avatar", "sap/m/Title", "sap/m/Text", "sap/m/ObjectStatus", "sap/m/Button"
            ], (ResponsivePopover, List, CustomListItem, HBox, VBox, Avatar, Title, Text, ObjectStatus, Button) => {
                
                const aItems = aList.map(n => new CustomListItem({
                    content: [
                        new HBox({
                            class: "sapUiSmallMargin",
                            alignItems: "Center",
                            items: [
                                new Avatar({
                                    src: n.icon || "sap-icon://bell",
                                    displaySize: "S",
                                    backgroundColor: n.state === "Success" ? "Accent8" : (n.state === "Error" ? "Accent2" : "Accent6"),
                                    class: "sapUiSmallMarginEnd"
                                }),
                                new VBox({
                                    items: [
                                        new Title({ text: n.title, level: "H5" }),
                                        new Text({ text: n.description, class: "fioriDescriptionText" }),
                                        new Text({ text: n.timestamp, class: "sapUiTinyMarginTop" })
                                    ]
                                })
                            ]
                        })
                    ]
                }));

                if (aItems.length === 0) {
                    aItems.push(new CustomListItem({
                        content: [
                            new VBox({
                                class: "sapUiMediumMargin",
                                alignItems: "Center",
                                items: [
                                    new Text({ text: "No new notifications." })
                                ]
                            })
                        ]
                    }));
                }

                const oPopover = new ResponsivePopover({
                    title: "Notifications Center (" + aList.length + ")",
                    contentWidth: "380px",
                    placement: "Bottom",
                    content: [
                        new List({ items: aItems })
                    ],
                    endButton: new Button({
                        text: "Clear All",
                        press: () => {
                            const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
                            let aAllNotifications = JSON.parse(sessionStorage.getItem("kyra_user_notifications") || "[]");
                            aAllNotifications = aAllNotifications.filter(n => n.requesterId !== sActiveUser);
                            sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aAllNotifications));
                            oModel.setProperty("/notificationsList", []);
                            oModel.setProperty("/notificationsCount", 0);
                            oPopover.close();
                            MessageToast.show("Notifications cleared.");
                        }
                    })
                });

                // Mark as read
                const sActiveUser = sessionStorage.getItem("kyra_active_user") || "Dev001";
                const aAllNotifications = JSON.parse(sessionStorage.getItem("kyra_user_notifications") || "[]");
                aAllNotifications.forEach(n => {
                    if (n.requesterId === sActiveUser) {
                        n.unread = false;
                    }
                });
                sessionStorage.setItem("kyra_user_notifications", JSON.stringify(aAllNotifications));
                oModel.setProperty("/notificationsCount", 0);

                this.getView().addDependent(oPopover);
                oPopover.openBy(oSource);
            });
        },

        onLogout() {
            MessageBox.confirm("Are you sure you want to sign out?", {
                title: "Sign Out",
                onClose: (oAction) => {
                    if (oAction === MessageBox.Action.OK) {
                        sessionStorage.removeItem("kyra_active_user");
                        sessionStorage.removeItem("kyra_active_role");
                        MessageToast.show("Session ended.");
                        this.getOwnerComponent().getRouter().navTo("Login");
                    }
                }
            });
        }
    });
});
