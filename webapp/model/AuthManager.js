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
            const sNow = String(Date.now());
            const sEffectiveToken = sToken || ("kyra_tok_" + Math.random().toString(36).substring(2) + "_" + sNow);
            const sEffectiveRole = sRole || "Requester";
            const sEffectiveUuid = sUserUuid || "dev-user-001-uuid";

            // Always store in sessionStorage (active tab session)
            sessionStorage.setItem(AUTH_KEYS.IS_AUTHENTICATED, "true");
            sessionStorage.setItem(AUTH_KEYS.ACTIVE_USER, sUserId);
            sessionStorage.setItem(AUTH_KEYS.ACTIVE_ROLE, sEffectiveRole);
            sessionStorage.setItem(AUTH_KEYS.ACTIVE_UUID, sEffectiveUuid);
            sessionStorage.setItem(AUTH_KEYS.AUTH_TOKEN, sEffectiveToken);
            sessionStorage.setItem(AUTH_KEYS.AUTH_TIMESTAMP, sNow);

            // Backward compatibility aliases for existing components
            sessionStorage.setItem("kyra_user_id", sUserId);

            if (bRemember) {
                localStorage.setItem(AUTH_KEYS.IS_AUTHENTICATED, "true");
                localStorage.setItem(AUTH_KEYS.ACTIVE_USER, sUserId);
                localStorage.setItem(AUTH_KEYS.ACTIVE_ROLE, sEffectiveRole);
                localStorage.setItem(AUTH_KEYS.ACTIVE_UUID, sEffectiveUuid);
                localStorage.setItem(AUTH_KEYS.AUTH_TOKEN, sEffectiveToken);
                localStorage.setItem(AUTH_KEYS.AUTH_TIMESTAMP, sNow);
                localStorage.setItem(AUTH_KEYS.REMEMBER_ID, sUserId);
                localStorage.setItem(AUTH_KEYS.REMEMBER_ROLE, sEffectiveRole);
            } else {
                localStorage.removeItem(AUTH_KEYS.IS_AUTHENTICATED);
                localStorage.removeItem(AUTH_KEYS.ACTIVE_USER);
                localStorage.removeItem(AUTH_KEYS.ACTIVE_ROLE);
                localStorage.removeItem(AUTH_KEYS.ACTIVE_UUID);
                localStorage.removeItem(AUTH_KEYS.AUTH_TOKEN);
                localStorage.removeItem(AUTH_KEYS.AUTH_TIMESTAMP);
                localStorage.removeItem(AUTH_KEYS.REMEMBER_ID);
                localStorage.removeItem(AUTH_KEYS.REMEMBER_ROLE);
            }
        },

        /**
         * Validates whether active session is valid and unexpired
         * @returns {boolean} True if authenticated and valid
         */
        isAuthenticated() {
            // 1. Check sessionStorage
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

            // 2. Fallback to localStorage if rememberMe was active
            const bLocalAuth = localStorage.getItem(AUTH_KEYS.IS_AUTHENTICATED) === "true";
            const sLocalUser = localStorage.getItem(AUTH_KEYS.ACTIVE_USER);
            const sLocalTime = localStorage.getItem(AUTH_KEYS.AUTH_TIMESTAMP);

            if (bLocalAuth && sLocalUser) {
                if (sLocalTime && (Date.now() - parseInt(sLocalTime, 10)) > SESSION_EXPIRY_MS) {
                    this.clearSession();
                    return false;
                }
                // Restore from localStorage to current sessionStorage
                const sRole = localStorage.getItem(AUTH_KEYS.ACTIVE_ROLE) || "Requester";
                const sUuid = localStorage.getItem(AUTH_KEYS.ACTIVE_UUID) || "dev-user-001-uuid";
                const sToken = localStorage.getItem(AUTH_KEYS.AUTH_TOKEN) || "";
                this.setSession(sLocalUser, sRole, sUuid, sToken, true);
                return true;
            }

            // 3. Fallback for browser reload with active session keys
            const sFallbackUser = sessionStorage.getItem(AUTH_KEYS.ACTIVE_USER) || sessionStorage.getItem("kyra_active_user") || sessionStorage.getItem("kyra_user_id");
            if (sFallbackUser) {
                const sFallbackRole = sessionStorage.getItem(AUTH_KEYS.ACTIVE_ROLE) || sessionStorage.getItem("kyra_active_role") || "Requester";
                const sFallbackUuid = sessionStorage.getItem(AUTH_KEYS.ACTIVE_UUID) || sessionStorage.getItem("kyra_active_user_uuid") || "dev-user-001-uuid";
                this.setSession(sFallbackUser, sFallbackRole, sFallbackUuid, null, false);
                return true;
            }

            // 4. Fallback for remember-me in localStorage
            const sLocalFallbackUser = localStorage.getItem(AUTH_KEYS.ACTIVE_USER) || localStorage.getItem("kyra_active_user") || localStorage.getItem("kyra_remember_id");
            if (sLocalFallbackUser) {
                const sLocalFallbackRole = localStorage.getItem(AUTH_KEYS.ACTIVE_ROLE) || localStorage.getItem("kyra_active_role") || localStorage.getItem("kyra_remember_role") || "Requester";
                const sLocalFallbackUuid = localStorage.getItem(AUTH_KEYS.ACTIVE_UUID) || localStorage.getItem("kyra_active_user_uuid") || "dev-user-001-uuid";
                this.setSession(sLocalFallbackUser, sLocalFallbackRole, sLocalFallbackUuid, null, true);
                return true;
            }

            return false;
        },

        /**
         * Clears all session and authentication state
         */
        clearSession() {
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
            localStorage.removeItem(AUTH_KEYS.REMEMBER_ID);
            localStorage.removeItem(AUTH_KEYS.REMEMBER_ROLE);
        },

        /**
         * Retrieve current authenticated user details
         * @returns {{ userId: string, role: string, userUuid: string, isApproverPersona: boolean }}
         */
        getUserInfo() {
            const sUser = sessionStorage.getItem(AUTH_KEYS.ACTIVE_USER) || localStorage.getItem(AUTH_KEYS.ACTIVE_USER) || "";
            const sRole = sessionStorage.getItem(AUTH_KEYS.ACTIVE_ROLE) || localStorage.getItem(AUTH_KEYS.ACTIVE_ROLE) || "Requester";
            const sUuid = sessionStorage.getItem(AUTH_KEYS.ACTIVE_UUID) || localStorage.getItem(AUTH_KEYS.ACTIVE_UUID) || "dev-user-001-uuid";
            const bIsApprover = (
                sRole === "Approver" ||
                sRole === "Approver 1" ||
                sRole === "Approver 2" ||
                sRole === "Compliance Approver" ||
                sRole === "Compliance Reviewer" ||
                sRole === "Compliance Review" ||
                sRole === "Administrator" ||
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
