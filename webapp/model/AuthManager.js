sap.ui.define([], () => {
    "use strict";

    const AUTH_KEYS = {
        IS_AUTHENTICATED: "kyra_is_authenticated",
        ACTIVE_USER: "kyra_active_user",
        ACTIVE_ROLE: "kyra_active_role",
        ACTIVE_UUID: "kyra_active_user_uuid",
        AUTH_TOKEN: "kyra_auth_token",
        AUTH_TIMESTAMP: "kyra_auth_timestamp",
        REMEMBER_ID: "kyra_remember_id",
        REMEMBER_ROLE: "kyra_remember_role"
    };

    // 24 hours session validity
    const SESSION_EXPIRY_MS = 24 * 60 * 60 * 1000;

    function getCookie(name) {
        if (typeof document === "undefined") {
            return null;
        }
        const nameEQ = name + "=";
        const ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === " ") {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    }

    function setSessionCookie(name, value) {
        if (typeof document === "undefined") {
            return;
        }
        // Browser session cookie without Expires/Max-Age:
        // Automatically deleted by browser on close, but shared across tabs in the same browser.
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`;
    }

    function deleteCookie(name) {
        if (typeof document === "undefined") {
            return;
        }
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
    }

    const AuthManager = {
        /**
         * Persist authentication session state
         * @param {string} sUserId User identifier
         * @param {string} sRole Assigned persona/role
         * @param {string} sUserUuid Backend user UUID
         * @param {string} [sToken] Auth token
         * @param {boolean} [bRemember] Whether remember me is active
         */
        setSession(sUserId, sRole, sUserUuid, sToken, bRemember) {
            if (!sUserId) {
                return;
            }
            const sCanonicalUser = String(sUserId).trim().toLowerCase();
            const sNow = String(Date.now());
            const sEffectiveToken = sToken || ("kyra_tok_" + Math.random().toString(36).substring(2) + "_" + sNow);
            const sEffectiveRole = sRole || "Requester";
            const sEffectiveUuid = sUserUuid || "dev-user-001-uuid";

            // 1. Set document session cookies (no Expires / no Max-Age)
            // Persists across tabs in the same browser; purged automatically when the browser closes.
            setSessionCookie("kyra_session_user", sCanonicalUser);
            setSessionCookie("kyra_session_role", sEffectiveRole);
            setSessionCookie("kyra_session_uuid", sEffectiveUuid);
            setSessionCookie("kyra_session_token", sEffectiveToken);
            setSessionCookie("kyra_session_time", sNow);

            // 2. Store in sessionStorage (active tab session)
            sessionStorage.setItem(AUTH_KEYS.IS_AUTHENTICATED, "true");
            sessionStorage.setItem(AUTH_KEYS.ACTIVE_USER, sCanonicalUser);
            sessionStorage.setItem(AUTH_KEYS.ACTIVE_ROLE, sEffectiveRole);
            sessionStorage.setItem(AUTH_KEYS.ACTIVE_UUID, sEffectiveUuid);
            sessionStorage.setItem(AUTH_KEYS.AUTH_TOKEN, sEffectiveToken);
            sessionStorage.setItem(AUTH_KEYS.AUTH_TIMESTAMP, sNow);

            // Backward compatibility aliases for existing components
            sessionStorage.setItem("kyra_user_id", sCanonicalUser);
            sessionStorage.setItem("kyra_active_user", sCanonicalUser);
            sessionStorage.setItem("kyra_active_role", sEffectiveRole);

            // 3. Remove permanent authentication keys from localStorage so closing browser requires re-login
            localStorage.removeItem(AUTH_KEYS.IS_AUTHENTICATED);
            localStorage.removeItem(AUTH_KEYS.ACTIVE_USER);
            localStorage.removeItem(AUTH_KEYS.ACTIVE_ROLE);
            localStorage.removeItem(AUTH_KEYS.ACTIVE_UUID);
            localStorage.removeItem(AUTH_KEYS.AUTH_TOKEN);
            localStorage.removeItem(AUTH_KEYS.AUTH_TIMESTAMP);
            localStorage.removeItem("kyra_active_user");
            localStorage.removeItem("kyra_user_id");

            // Remember-me: only save the user identifier and role to prefill the login input
            // Does NOT authenticate the user automatically
            if (bRemember) {
                localStorage.setItem(AUTH_KEYS.REMEMBER_ID, sCanonicalUser);
                localStorage.setItem(AUTH_KEYS.REMEMBER_ROLE, sEffectiveRole);
            } else {
                localStorage.removeItem(AUTH_KEYS.REMEMBER_ID);
                localStorage.removeItem(AUTH_KEYS.REMEMBER_ROLE);
            }
        },

        /**
         * Validates whether active session is valid and unexpired
         * @returns {boolean} True if authenticated and valid
         */
        isAuthenticated() {
            // 1. Check current tab sessionStorage
            const bSessionAuth = sessionStorage.getItem(AUTH_KEYS.IS_AUTHENTICATED) === "true";
            const sSessionUser = sessionStorage.getItem(AUTH_KEYS.ACTIVE_USER);
            const sSessionTime = sessionStorage.getItem(AUTH_KEYS.AUTH_TIMESTAMP);

            if (bSessionAuth && sSessionUser) {
                if (sSessionTime && (Date.now() - parseInt(sSessionTime, 10)) > SESSION_EXPIRY_MS) {
                    this.clearSession();
                    return false;
                }
                return true;
            }

            // 2. Check session cookie (new tab in same browser)
            // Session cookie exists if user is logged in within the same browser session.
            // It does NOT exist in a different browser, incognito, or after the browser was closed.
            const sCookieUser = getCookie("kyra_session_user");
            if (sCookieUser) {
                const sCookieTime = getCookie("kyra_session_time");
                if (sCookieTime && (Date.now() - parseInt(sCookieTime, 10)) > SESSION_EXPIRY_MS) {
                    this.clearSession();
                    return false;
                }
                const sRole = getCookie("kyra_session_role") || "Requester";
                const sUuid = getCookie("kyra_session_uuid") || "dev-user-001-uuid";
                const sToken = getCookie("kyra_session_token") || "";

                // Hydrate sessionStorage for this new tab
                sessionStorage.setItem(AUTH_KEYS.IS_AUTHENTICATED, "true");
                sessionStorage.setItem(AUTH_KEYS.ACTIVE_USER, sCookieUser);
                sessionStorage.setItem(AUTH_KEYS.ACTIVE_ROLE, sRole);
                sessionStorage.setItem(AUTH_KEYS.ACTIVE_UUID, sUuid);
                sessionStorage.setItem(AUTH_KEYS.AUTH_TOKEN, sToken);
                sessionStorage.setItem(AUTH_KEYS.AUTH_TIMESTAMP, sCookieTime || String(Date.now()));
                sessionStorage.setItem("kyra_user_id", sCookieUser);
                sessionStorage.setItem("kyra_active_user", sCookieUser);
                sessionStorage.setItem("kyra_active_role", sRole);
                return true;
            }

            return false;
        },

        /**
         * Clears all session and authentication state
         */
        clearSession() {
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
            sessionStorage.removeItem("kyra_active_user");
            sessionStorage.removeItem("kyra_active_role");
            sessionStorage.removeItem("kyra_active_user_uuid");
            sessionStorage.removeItem("kyra_user_id");
            sessionStorage.removeItem("kyra_redirect_route");
            sessionStorage.removeItem("kyra_redirect_args");
            sessionStorage.removeItem("kyra_wizard_sector");
            sessionStorage.removeItem("kyra_wizard_function");
            sessionStorage.removeItem("kyra_reset_add_access");

            localStorage.removeItem(AUTH_KEYS.IS_AUTHENTICATED);
            localStorage.removeItem(AUTH_KEYS.ACTIVE_USER);
            localStorage.removeItem(AUTH_KEYS.ACTIVE_ROLE);
            localStorage.removeItem(AUTH_KEYS.ACTIVE_UUID);
            localStorage.removeItem(AUTH_KEYS.AUTH_TOKEN);
            localStorage.removeItem(AUTH_KEYS.AUTH_TIMESTAMP);
            localStorage.removeItem("kyra_active_user");
            localStorage.removeItem("kyra_user_id");
        },

        /**
         * Retrieve current authenticated user details
         * @returns {{ userId: string, role: string, userUuid: string, isApproverPersona: boolean }}
         */
        getUserInfo() {
            const sUser = sessionStorage.getItem(AUTH_KEYS.ACTIVE_USER) || getCookie("kyra_session_user") || "";
            const sRole = sessionStorage.getItem(AUTH_KEYS.ACTIVE_ROLE) || getCookie("kyra_session_role") || "Requester";
            const sUuid = sessionStorage.getItem(AUTH_KEYS.ACTIVE_UUID) || getCookie("kyra_session_uuid") || "dev-user-001-uuid";
            const bIsRequester = (sRole === "Requester" || (typeof sRole === "string" && sRole.toLowerCase() === "requester"));
            const bIsApprover = !bIsRequester && (
                sRole === "Approver" ||
                sRole === "Approver 1" ||
                sRole === "Approver 2" ||
                sRole === "Compliance Approver" ||
                sRole === "Compliance Reviewer" ||
                sRole === "Compliance Review" ||
                (typeof sRole === "string" && (sRole.toLowerCase().includes("approver") || sRole.toLowerCase().includes("compliance")))
            );

            return {
                userId: sUser,
                role: sRole,
                userUuid: sUuid,
                isApproverPersona: bIsApprover
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
