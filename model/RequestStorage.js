sap.ui.define([], function() {
    "use strict";

    const STORAGE_KEY = "kyra_demo_requests";

    const RequestStorage = {
        /**
         * Load all requests from localStorage
         * @returns {Array<Object>}
         */
        loadRequests: function() {
            try {
                const sData = localStorage.getItem(STORAGE_KEY);
                if (sData) {
                    return JSON.parse(sData);
                }
            } catch (e) {
                console.error("Failed to load requests from localStorage:", e);
            }
            return [];
        },

        /**
         * Save all requests array to localStorage
         * @param {Array<Object>} aRequests
         */
        saveRequests: function(aRequests) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(aRequests || []));
                localStorage.setItem("kyra_last_db_mutation", String(Date.now()));
                
                // Multi-tab sync broadcast if applicable
                if (typeof BroadcastChannel !== "undefined") {
                    try {
                        const ch = new BroadcastChannel("kyra_db_sync_channel");
                        ch.postMessage({ type: "MUTATION", timestamp: Date.now() });
                        ch.close();
                    } catch(e) {}
                }
            } catch (e) {
                console.error("Failed to save requests to localStorage:", e);
            }
        },

        /**
         * Add a new request (or batch of requests)
         * @param {Object|Array<Object>} oRequest
         * @returns {Array<Object>} The updated list
         */
        addRequest: function(oRequest) {
            const aAll = this.loadRequests();
            const aNewItems = Array.isArray(oRequest) ? oRequest : [oRequest];
            
            aNewItems.forEach(item => {
                const sId = item.requestId || item.request_number || ("REQ-2026-" + Math.floor(10000 + Math.random() * 90000));
                const sTimestamp = item.timestamp || item.created_at || new Date().toISOString();
                const sUser = item.requesterId || item.requesterUsername || item.requester_username || sessionStorage.getItem("kyra_active_user") || "Dev001";
                const sRole = item.persona || item.requester_persona || sessionStorage.getItem("kyra_active_role") || "Requester";
                
                const oNewRecord = {
                    requestId: sId,
                    request_number: sId,
                    ID: sId,
                    requester_username: sUser,
                    requesterId: sUser,
                    requesterUsername: sUser,
                    requester_persona: sRole,
                    persona: sRole,
                    target_system: item.system || item.targetSystem || item.target_system || "SAP S/4HANA Enterprise",
                    system: item.system || item.targetSystem || item.target_system || "SAP S/4HANA Enterprise",
                    role_name: item.roleName || item.roleTitle || item.role_name || "Enterprise Entitlement",
                    roleName: item.roleName || item.roleTitle || item.role_name || "Enterprise Entitlement",
                    service_topic: item.serviceTopic || item.category || item.service_topic || "System Administration",
                    serviceTopic: item.serviceTopic || item.category || item.service_topic || "System Administration",
                    business_sector: item.businessSector || item.sector || item.business_sector || "Information Technology & Security",
                    sector: item.businessSector || item.sector || item.business_sector || "Information Technology & Security",
                    business_function: item.businessFunction || item.function || item.business_function || "Identity & Access Governance",
                    function: item.businessFunction || item.function || item.business_function || "Identity & Access Governance",
                    selected_persona: item.selectedPersona || item.persona || item.selected_persona || "Engineering & Developer Persona",
                    selectedPersona: item.selectedPersona || item.persona || item.selected_persona || "Engineering & Developer Persona",
                    operating_region: item.operatingRegion || item.region || item.operating_region || "Global Enterprise (ALL)",
                    region: item.operatingRegion || item.region || item.operating_region || "Global Enterprise (ALL)",
                    access_duration: item.accessDuration || item.duration || item.access_duration || "Permanent (Default)",
                    accessDuration: item.accessDuration || item.duration || item.access_duration || "Permanent (Default)",
                    justification: item.justification || "Access requested for project role",
                    status: (item.status || "Pending Approval"),
                    request_type: item.type || item.requestType || item.request_type || "Addition",
                    type: item.type || item.requestType || item.request_type || "Addition",
                    created_at: sTimestamp,
                    submissionDate: sTimestamp.split("T")[0],
                    timestamp: sTimestamp,
                    entitlements: item.entitlements || []
                };

                // Add to top of array
                aAll.unshift(oNewRecord);
            });

            this.saveRequests(aAll);
            return aAll;
        },

        /**
         * Update request status (e.g. Approved / Rejected)
         * @param {string} sRequestId
         * @param {'Approved'|'Rejected'|'Pending Approval'} sStatus
         * @param {string} [sComment]
         * @param {Array} [aEntitlementDecisions]
         */
        updateRequestStatus: function(sRequestId, sStatus, sComment, aEntitlementDecisions) {
            const aAll = this.loadRequests();
            let bUpdated = false;

            aAll.forEach(r => {
                const rId = r.requestId || r.request_number;
                if (rId === sRequestId) {
                    r.status = sStatus;
                    r.approver_comment = sComment || (`Decision: ${sStatus}`);
                    r.decisionDate = new Date().toISOString().split("T")[0];
                    r.updated_at = new Date().toISOString();
                    
                    if (aEntitlementDecisions && Array.isArray(aEntitlementDecisions)) {
                        r.entitlements = aEntitlementDecisions;
                    } else if (r.entitlements) {
                        r.entitlements.forEach(e => {
                            e.status = sStatus;
                            e.comment = sComment || (`${sStatus} by Approver`);
                        });
                    }

                    bUpdated = true;
                }
            });

            if (bUpdated) {
                this.saveRequests(aAll);
            }
            return bUpdated;
        },

        /**
         * Get Pending Requests
         */
        getPendingRequests: function() {
            return this.loadRequests().filter(r => {
                const s = (r.status || "").toUpperCase();
                return s.includes("PENDING");
            });
        },

        /**
         * Get Completed (Approved/Rejected) Requests
         */
        getCompletedRequests: function() {
            return this.loadRequests().filter(r => {
                const s = (r.status || "").toUpperCase();
                return s.includes("APPROVED") || s.includes("REJECTED");
            });
        },

        /**
         * Get All History Requests
         */
        getHistoryRequests: function() {
            return this.loadRequests();
        },

        /**
         * Clear all requests from localStorage (for test reset)
         */
        clearAllRequests: function() {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.setItem("kyra_last_db_mutation", String(Date.now()));
        }
    };

    // Expose globally for convenience and UI5 compatibility
    if (typeof window !== "undefined") {
        window.KyraRequestStorage = RequestStorage;
    }

    return RequestStorage;
});
