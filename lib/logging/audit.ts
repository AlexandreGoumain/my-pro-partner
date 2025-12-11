/**
 * Audit logging for important user actions
 *
 * This logger is used to track security-relevant and business-critical events
 * for compliance (GDPR) and security monitoring purposes.
 *
 * Usage:
 * ```ts
 * import { auditLog } from '@/lib/logging/audit';
 *
 * auditLog.userAction('LOGIN', userId, { ipAddress });
 * auditLog.dataAccess('READ', 'clients', clientId, userId);
 * auditLog.dataModification('UPDATE', 'documents', docId, userId, { changes });
 * ```
 */

import { logger } from "./logger";

export type AuditAction =
    | "LOGIN"
    | "LOGOUT"
    | "LOGIN_FAILED"
    | "PASSWORD_CHANGE"
    | "PASSWORD_RESET"
    | "USER_CREATED"
    | "USER_UPDATED"
    | "USER_DELETED"
    | "PERMISSION_CHANGE"
    | "ROLE_CHANGE"
    | "DATA_EXPORT"
    | "DATA_DELETE"
    | "SUBSCRIPTION_CHANGE"
    | "PAYMENT_PROCESSED"
    | "SETTINGS_CHANGE"
    | "API_KEY_CREATED"
    | "API_KEY_REVOKED";

export type DataAction = "CREATE" | "READ" | "UPDATE" | "DELETE" | "EXPORT";

export interface AuditContext {
    ipAddress?: string;
    userAgent?: string;
    entrepriseId?: string;
    sessionId?: string;
    changes?: Record<string, { old: unknown; new: unknown }>;
    reason?: string;
    [key: string]: unknown;
}

interface AuditEntry {
    type:
        | "user_action"
        | "data_access"
        | "data_modification"
        | "security_event";
    action: string;
    userId?: string;
    resourceType?: string;
    resourceId?: string;
    context?: AuditContext;
}

class AuditLogger {
    private log(entry: AuditEntry): void {
        // Log with special prefix for audit logs
        logger.info(`[AUDIT] ${entry.type}: ${entry.action}`, {
            ...entry.context,
            auditType: entry.type,
            auditAction: entry.action,
            userId: entry.userId,
            resourceType: entry.resourceType,
            resourceId: entry.resourceId,
        });

        // In production, you might want to also:
        // 1. Store in a separate audit database
        // 2. Send to a compliance/SIEM system
        // 3. Queue for async processing
    }

    /**
     * Log a user action (login, logout, password change, etc.)
     */
    userAction(
        action: AuditAction,
        userId: string | undefined,
        context?: AuditContext
    ): void {
        this.log({
            type: "user_action",
            action,
            userId,
            context,
        });
    }

    /**
     * Log data access (read operations on sensitive data)
     */
    dataAccess(
        action: DataAction,
        resourceType: string,
        resourceId: string,
        userId: string | undefined,
        context?: AuditContext
    ): void {
        this.log({
            type: "data_access",
            action,
            userId,
            resourceType,
            resourceId,
            context,
        });
    }

    /**
     * Log data modifications (create, update, delete)
     */
    dataModification(
        action: DataAction,
        resourceType: string,
        resourceId: string,
        userId: string | undefined,
        context?: AuditContext
    ): void {
        this.log({
            type: "data_modification",
            action,
            userId,
            resourceType,
            resourceId,
            context,
        });
    }

    /**
     * Log security events (failed logins, suspicious activity, etc.)
     */
    securityEvent(
        event: string,
        userId: string | undefined,
        context?: AuditContext
    ): void {
        this.log({
            type: "security_event",
            action: event,
            userId,
            context,
        });
    }

    /**
     * Log subscription/billing events
     */
    billingEvent(
        action: string,
        userId: string | undefined,
        entrepriseId: string,
        context?: AuditContext
    ): void {
        this.log({
            type: "user_action",
            action: `BILLING_${action}`,
            userId,
            context: { ...context, entrepriseId },
        });
    }
}

// Export singleton instance
export const auditLog = new AuditLogger();
