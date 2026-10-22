sap.ui.define([], () => {
    "use strict";

    const AUTH_KEYS = {
        IS_AUTHENTICATED: "kyra_is_authenticated",
        ACTIVE_USER: "kyra_active_user",
        ACTIVE_ROLE: "kyra_active_role",
        ACTIVE_UUID: "kyra_active_user_uuid",
        AUTH_TOKEN: "kyra_auth_token",
        AUTH_TIMESTAMP: "kyra_auth_timestamp",
        COMPANY_NAME: "kyra_company_name",
        SCHEMA_KEYWORD: "kyra_schema_keyword",
        REMEMBER_ID: "kyra_remember_id",
        REMEMBER_ROLE: "kyra_remember_role"
    };

    const ACTIVE_WINDOW_SESSION_KEY = "kyra_active_window_session";
    const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
    const HEARTBEAT_INTERVAL_MS = 1000;
    const MAX_HEARTBEAT_AGE_MS = 3500; // After 3.5s with no heartbeat, session is considered inactive

    let oHeartbeatTimer = null;
    const sTabInstanceId = "tab_" + Math.random().toString(36).substring(2) + "_" + Date.now().toString(36);
    let oWindowAuthChannel = null;

    try {
        if (typeof BroadcastChannel !== "undefined") {
            oWindowAuthChannel = new BroadcastChannel("kyra_window_auth_sync");
            oWindowAuthChannel.onmessage = (oEvent) => {
                const data = oEvent.data;
                if (!data) return;
                if (data.type === "LOGOUT") {
                    AuthManager.clearSession(true);
                    if (typeof window !== "undefined" && window.location) {
                        const sHash = window.location.hash || "";
                        if (sHash && !sHash.includes("Login")) {
                            window.location.hash = "#app-preview&/";
                        }
                    }
                }
            };
        }
    } catch(e) {}

    function getCookie(name) {
        if (typeof document === "undefined") return null;
        const nameEQ = name + "=";
        const ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === " ") c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    }

    function setSessionCookie(name, value) {
        if (typeof document === "undefined") return;
        // Browser session cookie without Expires / Max-Age:
        // Automatically deleted by browser kernel when all browser windows are closed.
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
    }

    function deleteCookie(name) {
        if (typeof document === "undefined") return;
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }

    /**
     * Extracts physical window geometry.
     * All tabs in the exact same browser window share identical screen coordinates and outer dimensions.
     */
    function getWindowGeometry() {
        if (typeof window === "undefined") {
            return { x: 0, y: 0, w: 0, h: 0 };
        }
        const x = window.screenX !== undefined ? window.screenX : (window.screenLeft !== undefined ? window.screenLeft : 0);
        const y = window.screenY !== undefined ? window.screenY : (window.screenTop !== undefined ? window.screenTop : 0);
        const w = window.outerWidth || (window.innerWidth || 0);
        const h = window.outerHeight || (window.innerHeight || 0);
        return { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) };
    }

    /**
     * Compares two window geometries with a narrow tolerance for subpixel/fractional DPI scaling.
     */
    function isMatchingWindowGeometry(geoA, geoB) {
        if (!geoA || !geoB) return false;
        return (
            Math.abs(geoA.x - geoB.x) <= 2 &&
            Math.abs(geoA.y - geoB.y) <= 2 &&
            Math.abs(geoA.w - geoB.w) <= 4 &&
            Math.abs(geoA.h - geoB.h) <= 4
        );
    }

    function startHeartbeat() {
        if (oHeartbeatTimer) return;
        oHeartbeatTimer = setInterval(() => {
            const bAuth = sessionStorage.getItem(AUTH_KEYS.IS_AUTHENTICATED) === "true";
            if (!bAuth) {
                stopHeartbeat();
                return;
            }
            const sUser = sessionStorage.getItem(AUTH_KEYS.ACTIVE_USER);
            const sRole = sessionStorage.getItem(AUTH_KEYS.ACTIVE_ROLE);
            const sUuid = sessionStorage.getItem(AUTH_KEYS.ACTIVE_UUID);
            const sToken = sessionStorage.getItem(AUTH_KEYS.AUTH_TOKEN);
            const sTime = sessionStorage.getItem(AUTH_KEYS.AUTH_TIMESTAMP);
            const sCompany = sessionStorage.getItem(AUTH_KEYS.COMPANY_NAME) || "";
            const sSchema = sessionStorage.getItem(AUTH_KEYS.SCHEMA_KEYWORD) || "";
            const geo = getWindowGeometry();

            const oSession = {
                tabId: sTabInstanceId,
                userId: sUser,
                role: sRole,
                userUuid: sUuid,
                token: sToken,
                timestamp: sTime,
                companyName: sCompany,
                schemaKeyword: sSchema,
                windowMetrics: geo,
                lastHeartbeat: Date.now()
            };

            try {
                localStorage.setItem(ACTIVE_WINDOW_SESSION_KEY, JSON.stringify(oSession));
            } catch(e) {}
        }, HEARTBEAT_INTERVAL_MS);
    }

    function stopHeartbeat() {
        if (oHeartbeatTimer) {
            clearInterval(oHeartbeatTimer);
            oHeartbeatTimer = null;
        }
    }

    if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", () => {
            try {
                const raw = localStorage.getItem(ACTIVE_WINDOW_SESSION_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed && parsed.tabId === sTabInstanceId) {
                        parsed.lastHeartbeat = Date.now() - 2500;
                        localStorage.setItem(ACTIVE_WINDOW_SESSION_KEY, JSON.stringify(parsed));
                    }
                }
            } catch(e) {}
            stopHeartbeat();
        });

        window.addEventListener("resize", () => {
            const bAuth = sessionStorage.getItem(AUTH_KEYS.IS_AUTHENTICATED) === "true";
            if (bAuth) {
                try {
                    const raw = localStorage.getItem(ACTIVE_WINDOW_SESSION_KEY);
                    if (raw) {
                        const parsed = JSON.parse(raw);
                        parsed.windowMetrics = getWindowGeometry();
                        parsed.lastHeartbeat = Date.now();
                        localStorage.setItem(ACTIVE_WINDOW_SESSION_KEY, JSON.stringify(parsed));
                    }
                } catch(e) {}
            }
        });
    }

    const AuthManager = {
        /**
         * Persist authentication session state
         * @param {string} sUserId User identifier
         * @param {string} sRole Assigned persona/role
         * @param {string} sUserUuid Backend user UUID
         * @param {string} [sToken] Auth token
         * @param {boolean} [bRemember] Whether remember me is active
         * @param {object} [oExtra] Extra session payload (companyName, schemaKeyword)
         */
        setSession(sUserId, sRole, sUserUuid, sToken, bRemember, oExtra) {
            if (!sUserId) return;
            const sCanonicalUser = String(sUserId).trim().toLowerCase();
            const sNow = String(Date.now());
            const sEffectiveToken = sToken || ("kyra_tok_" + Math.random().toString(36).substring(2) + "_" + sNow);
            const sEffectiveRole = sRole || "Requester";
            const sEffectiveUuid = sUserUuid || "dev-user-001-uuid";
            const sCompany = (oExtra && oExtra.companyName) ? oExtra.companyName : (sessionStorage.getItem("kyra_company_name") || "");
            const sSchema = (oExtra && oExtra.schemaKeyword) ? oExtra.schemaKeyword : (sessionStorage.getItem("kyra_schema_keyword") || "");
            const geo = getWindowGeometry();

            // 1. Session cookies without expiry (purged automatically by browser kernel on browser close)
            setSessionCookie("kyra_browser_session_active", "true");
            setSessionCookie("kyra_session_user", sCanonicalUser);
            setSessionCookie("kyra_session_role", sEffectiveRole);
            setSessionCookie("kyra_session_uuid", sEffectiveUuid);
            setSessionCookie("kyra_session_token", sEffectiveToken);
            setSessionCookie("kyra_session_time", sNow);

            // 2. Active tab sessionStorage
            sessionStorage.setItem(AUTH_KEYS.IS_AUTHENTICATED, "true");
            sessionStorage.setItem(AUTH_KEYS.ACTIVE_USER, sCanonicalUser);
            sessionStorage.setItem(AUTH_KEYS.ACTIVE_ROLE, sEffectiveRole);
            sessionStorage.setItem(AUTH_KEYS.ACTIVE_UUID, sEffectiveUuid);
            sessionStorage.setItem(AUTH_KEYS.AUTH_TOKEN, sEffectiveToken);
            sessionStorage.setItem(AUTH_KEYS.AUTH_TIMESTAMP, sNow);
            sessionStorage.setItem(AUTH_KEYS.COMPANY_NAME, sCompany);
            sessionStorage.setItem(AUTH_KEYS.SCHEMA_KEYWORD, sSchema);

            // Compatibility keys
            sessionStorage.setItem("kyra_user_id", sCanonicalUser);
            sessionStorage.setItem("kyra_active_user", sCanonicalUser);
            sessionStorage.setItem("kyra_active_role", sEffectiveRole);
            sessionStorage.setItem("kyra_active_user_uuid", sEffectiveUuid);
            sessionStorage.setItem("kyra_company_name", sCompany);
            sessionStorage.setItem("kyra_schema_keyword", sSchema);

            // 3. Store active window session in localStorage with window geometry & heartbeat
            const oWindowSession = {
                tabId: sTabInstanceId,
                userId: sCanonicalUser,
                role: sEffectiveRole,
                userUuid: sEffectiveUuid,
                token: sEffectiveToken,
                timestamp: sNow,
                companyName: sCompany,
                schemaKeyword: sSchema,
                windowMetrics: geo,
                lastHeartbeat: Date.now()
            };
            try {
                localStorage.setItem(ACTIVE_WINDOW_SESSION_KEY, JSON.stringify(oWindowSession));
            } catch(e) {}

            startHeartbeat();

            if (bRemember) {
                localStorage.setItem(AUTH_KEYS.REMEMBER_ID, sCanonicalUser);
                localStorage.setItem(AUTH_KEYS.REMEMBER_ROLE, sEffectiveRole);
            } else {
                localStorage.removeItem(AUTH_KEYS.REMEMBER_ID);
                localStorage.removeItem(AUTH_KEYS.REMEMBER_ROLE);
            }
        },

        /**
         * Validates whether active session is valid and unexpired.
         * If the current tab has no sessionStorage (e.g. user pasted URL in a new tab):
         * - Inherits session ONLY IF opened in the SAME WINDOW as an active tab.
         * - Rejects session if opened in a DIFFERENT WINDOW or if the browser was closed/reopened.
         * 
         * @returns {boolean} True if authenticated and valid
         */
        isAuthenticated() {
            // 1. Current tab's active sessionStorage check
            const bSessionAuth = sessionStorage.getItem(AUTH_KEYS.IS_AUTHENTICATED) === "true";
            const sSessionUser = sessionStorage.getItem(AUTH_KEYS.ACTIVE_USER);
            const sSessionTime = sessionStorage.getItem(AUTH_KEYS.AUTH_TIMESTAMP);

            if (bSessionAuth && sSessionUser) {
                if (sSessionTime && (Date.now() - parseInt(sSessionTime, 10)) > SESSION_EXPIRY_MS) {
                    this.clearSession();
                    return false;
                }
                startHeartbeat();
                return true;
            }

            // 2. Check if this is a newly opened tab in the SAME WINDOW as an already logged-in tab
            // A. Browser-level session cookie must be active (purged if browser was closed)
            const sCookieActive = getCookie("kyra_browser_session_active");
            const sCookieUser = getCookie("kyra_session_user");
            if (!sCookieActive && !sCookieUser) {
                // Browser was closed and reopened, or user never logged in!
                return false;
            }

            // B. Active window session must exist in localStorage with a fresh heartbeat
            const rawActive = localStorage.getItem(ACTIVE_WINDOW_SESSION_KEY);
            if (!rawActive) {
                return false;
            }

            let oActiveSession = null;
            try {
                oActiveSession = JSON.parse(rawActive);
            } catch(e) {
                return false;
            }

            if (!oActiveSession || !oActiveSession.userId) {
                return false;
            }

            // Verify heartbeat age (must be actively running within the last 3.5 seconds)
            const nHeartbeatAge = Date.now() - (oActiveSession.lastHeartbeat || 0);
            if (nHeartbeatAge > MAX_HEARTBEAT_AGE_MS) {
                // Tabs were closed or browser closed
                return false;
            }

            // C. WINDOW GEOMETRY CHECK: Verify current tab is in the SAME WINDOW frame
            // All tabs in the same native window share identical coordinates and outer bounds.
            // A different window (or detached window) will have different coordinates.
            const curGeo = getWindowGeometry();
            const storedGeo = oActiveSession.windowMetrics;

            if (!isMatchingWindowGeometry(curGeo, storedGeo)) {
                console.warn("[Kyra Auth Guard] Blocked session inheritance: tab is in a DIFFERENT window frame.", {
                    currentTabWindow: curGeo,
                    activeSessionWindow: storedGeo
                });
                return false;
            }

            // D. Verified: This tab was opened in the SAME window as an authenticated tab!
            // Inherit the session into this tab's sessionStorage
            console.info("[Kyra Auth Guard] Verified same-window tab. Inheriting session for:", oActiveSession.userId);
            this._inheritSession(oActiveSession);
            startHeartbeat();
            return true;
        },

        _inheritSession(oActiveSession) {
            const sUser = oActiveSession.userId;
            const sRole = oActiveSession.role || "Requester";
            const sUuid = oActiveSession.userUuid || "dev-user-001-uuid";
            const sToken = oActiveSession.token || "";
            const sTime = oActiveSession.timestamp || String(Date.now());
            const sCompany = oActiveSession.companyName || "";
            const sSchema = oActiveSession.schemaKeyword || "";

            sessionStorage.setItem(AUTH_KEYS.IS_AUTHENTICATED, "true");
            sessionStorage.setItem(AUTH_KEYS.ACTIVE_USER, sUser);
            sessionStorage.setItem(AUTH_KEYS.ACTIVE_ROLE, sRole);
            sessionStorage.setItem(AUTH_KEYS.ACTIVE_UUID, sUuid);
            sessionStorage.setItem(AUTH_KEYS.AUTH_TOKEN, sToken);
            sessionStorage.setItem(AUTH_KEYS.AUTH_TIMESTAMP, sTime);
            sessionStorage.setItem(AUTH_KEYS.COMPANY_NAME, sCompany);
            sessionStorage.setItem(AUTH_KEYS.SCHEMA_KEYWORD, sSchema);

            // Backward compatibility aliases
            sessionStorage.setItem("kyra_user_id", sUser);
            sessionStorage.setItem("kyra_active_user", sUser);
            sessionStorage.setItem("kyra_active_role", sRole);
            sessionStorage.setItem("kyra_active_user_uuid", sUuid);
            sessionStorage.setItem("kyra_company_name", sCompany);
            sessionStorage.setItem("kyra_schema_keyword", sSchema);
        },

        /**
         * Clears all session and authentication state
         * @param {boolean} [bSkipBroadcast] Avoid re-broadcasting on incoming broadcast
         */
        clearSession(bSkipBroadcast) {
            stopHeartbeat();
            deleteCookie("kyra_browser_session_active");
            deleteCookie("kyra_session_user");
            deleteCookie("kyra_session_role");
            deleteCookie("kyra_session_uuid");
            deleteCookie("kyra_session_token");
            deleteCookie("kyra_session_time");

            sessionStorage.removeItem(AUTH_KEYS.IS_AUTHENTICATED);
            sessionStorage.removeItem(AUTH_KEYS.ACTIVE_USER);
            sessionStorage.removeItem(AUTH_KEYS.ACTIVE_ROLE);
            sessionStorage.removeItem(AUTH_KEYS.ACTIVE_UUID);
            sessionStorage.removeItem(AUTH_KEYS.AUTH_TOKEN);
            sessionStorage.removeItem(AUTH_KEYS.AUTH_TIMESTAMP);
            sessionStorage.removeItem(AUTH_KEYS.COMPANY_NAME);
            sessionStorage.removeItem(AUTH_KEYS.SCHEMA_KEYWORD);
            sessionStorage.removeItem("kyra_active_user");
            sessionStorage.removeItem("kyra_active_role");
            sessionStorage.removeItem("kyra_active_user_uuid");
            sessionStorage.removeItem("kyra_user_id");
            sessionStorage.removeItem("kyra_redirect_route");
            sessionStorage.removeItem("kyra_redirect_args");
            sessionStorage.removeItem("kyra_wizard_sector");
            sessionStorage.removeItem("kyra_wizard_function");
            sessionStorage.removeItem("kyra_reset_add_access");

            try {
                localStorage.removeItem(ACTIVE_WINDOW_SESSION_KEY);
            } catch(e) {}

            if (!bSkipBroadcast && oWindowAuthChannel) {
                try {
                    oWindowAuthChannel.postMessage({ type: "LOGOUT" });
                } catch(e) {}
            }
        },

        /**
         * Retrieve current authenticated user details
         * @returns {{ userId: string, role: string, userUuid: string, isAdminPersona: boolean, isAdmin: boolean, isRequester: boolean, isApproverPersona: boolean, isCompliance: boolean, isComplianceReviewer: boolean }}
         */
        getUserInfo() {
            // First check if current tab has session or if it should be inherited from same window
            this.isAuthenticated();

            const sUser = sessionStorage.getItem(AUTH_KEYS.ACTIVE_USER) || getCookie("kyra_session_user") || "";
            const sRole = sessionStorage.getItem(AUTH_KEYS.ACTIVE_ROLE) || getCookie("kyra_session_role") || "Requester";
            const sUuid = sessionStorage.getItem(AUTH_KEYS.ACTIVE_UUID) || getCookie("kyra_session_uuid") || "dev-user-001-uuid";

            const sRoleLower = (typeof sRole === "string") ? sRole.toLowerCase() : "";
            const bIsAdmin = (sRole === "Admin" || sRole === "Administrator" || sRoleLower === "admin" || sRoleLower === "administrator");
            const bIsRequester = (sRole === "Requester" || sRoleLower === "requester");
            const bIsCompliance = !bIsRequester && !bIsAdmin && (sRoleLower.includes("compliance"));
            const bIsApprover = !bIsRequester && !bIsAdmin && (
                sRole === "Approver" ||
                sRole === "Approver 1" ||
                sRole === "Approver 2" ||
                sRole === "Compliance Approver" ||
                sRole === "Compliance Reviewer" ||
                sRole === "Compliance Review" ||
                sRoleLower.includes("approver") ||
                sRoleLower.includes("compliance")
            );

            return {
                userId: sUser,
                role: sRole,
                userUuid: sUuid,
                isAdminPersona: bIsAdmin,
                isAdmin: bIsAdmin,
                isRequester: bIsRequester,
                isApproverPersona: bIsApprover,
                isCompliance: bIsCompliance,
                isComplianceReviewer: bIsCompliance
            };
        },

        /**
         * Checks if a route name represents a protected application resource
         * @param {string} sRouteName Route name
         * @returns {boolean} True if protected
         */
        isProtectedRoute(sRouteName) {
            if (!sRouteName) {
                return false;
            }
            const aPublicRoutes = ["Login", "AppPreviewLogin"];
            return !aPublicRoutes.includes(sRouteName);
        }
    };

    // Attach to window for global convenience and debugging
    if (typeof window !== "undefined") {
        window.KyraAuthManager = AuthManager;
    }

    return AuthManager;
});
