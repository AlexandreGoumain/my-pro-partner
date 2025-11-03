// ============================================
// CHATBOT EXECUTOR - Main Entry Point
// ============================================

import type { ActionResult } from "./chatbot-actions";

// Import all action modules
import {
    addLoyaltyPoints,
    createClient,
    deleteClient,
    exportClients,
    getClientDetails,
    getClientHistory,
    searchClients,
    updateClient,
} from "./executors/client-actions";

import {
    adjustStock,
    createArticle,
    deleteArticle,
    getArticleDetails,
    getStockAlerts,
    getStockHistory,
    listCategories,
    searchArticles,
    updateArticle,
} from "./executors/article-actions";

import {
    addPayment,
    convertQuoteToInvoice,
    createDocument,
    deleteDocument,
    duplicateDocument,
    getDocumentDetails,
    searchDocuments,
    updateDocumentStatus,
} from "./executors/document-actions";

import {
    analyzeSegment,
    cancelCampaign,
    compareSegments,
    createCampaign,
    getCampaignDetails,
    getSegmentClients,
    scheduleCampaign,
    searchSegments,
    sendCampaignNow,
} from "./executors/segment-actions";

import {
    getDashboardKpis,
    getRecentActivity,
    getStatistics,
    quickInvoice,
    searchAll,
} from "./executors/analytics-actions";

import {
    getLoyaltyStats,
    listLoyaltyLevels,
} from "./executors/loyalty-actions";

import { navigateTo } from "./executors/navigation-actions";

/**
 * Execute a chatbot action based on the action name
 */
export async function executeAction(
    actionName: string,
    parameters: Record<string, unknown>,
    baseUrl: string
): Promise<ActionResult> {
    try {
        switch (actionName) {
            // ============================================
            // CLIENTS
            // ============================================
            case "search_clients":
                return await searchClients(parameters, baseUrl);
            case "get_client_details":
                return await getClientDetails(parameters, baseUrl);
            case "create_client":
                return await createClient(parameters, baseUrl);
            case "add_loyalty_points":
                return await addLoyaltyPoints(parameters, baseUrl);
            case "update_client":
                return await updateClient(parameters, baseUrl);
            case "delete_client":
                return await deleteClient(parameters, baseUrl);
            case "get_client_history":
                return await getClientHistory(parameters, baseUrl);
            case "export_clients":
                return await exportClients(parameters, baseUrl);

            // ============================================
            // ARTICLES
            // ============================================
            case "search_articles":
                return await searchArticles(parameters, baseUrl);
            case "get_stock_alerts":
                return await getStockAlerts(parameters, baseUrl);
            case "adjust_stock":
                return await adjustStock(parameters, baseUrl);
            case "create_article":
                return await createArticle(parameters, baseUrl);
            case "update_article":
                return await updateArticle(parameters, baseUrl);
            case "delete_article":
                return await deleteArticle(parameters, baseUrl);
            case "get_article_details":
                return await getArticleDetails(parameters, baseUrl);
            case "get_stock_history":
                return await getStockHistory(parameters, baseUrl);
            case "list_categories":
                return await listCategories(parameters, baseUrl);

            // ============================================
            // DOCUMENTS
            // ============================================
            case "create_document":
                return await createDocument(parameters, baseUrl);
            case "search_documents":
                return await searchDocuments(parameters, baseUrl);
            case "get_document_details":
                return await getDocumentDetails(parameters, baseUrl);
            case "update_document_status":
                return await updateDocumentStatus(parameters, baseUrl);
            case "delete_document":
                return await deleteDocument(parameters, baseUrl);
            case "convert_quote_to_invoice":
                return await convertQuoteToInvoice(parameters, baseUrl);
            case "duplicate_document":
                return await duplicateDocument(parameters, baseUrl);
            case "add_payment":
                return await addPayment(parameters, baseUrl);

            // ============================================
            // SEGMENTS & CAMPAIGNS
            // ============================================
            case "search_segments":
                return await searchSegments(parameters, baseUrl);
            case "create_campaign":
                return await createCampaign(parameters, baseUrl);
            case "get_segment_clients":
                return await getSegmentClients(parameters, baseUrl);
            case "analyze_segment":
                return await analyzeSegment(parameters, baseUrl);
            case "compare_segments":
                return await compareSegments(parameters, baseUrl);
            case "get_campaign_details":
                return await getCampaignDetails(parameters, baseUrl);
            case "schedule_campaign":
                return await scheduleCampaign(parameters, baseUrl);
            case "send_campaign_now":
                return await sendCampaignNow(parameters, baseUrl);
            case "cancel_campaign":
                return await cancelCampaign(parameters, baseUrl);

            // ============================================
            // ANALYTICS & QUICK ACTIONS
            // ============================================
            case "get_statistics":
                return await getStatistics(parameters, baseUrl);
            case "get_dashboard_kpis":
                return await getDashboardKpis(parameters, baseUrl);
            case "search_all":
                return await searchAll(parameters, baseUrl);
            case "quick_invoice":
                return await quickInvoice(parameters, baseUrl);
            case "get_recent_activity":
                return await getRecentActivity(parameters, baseUrl);

            // ============================================
            // LOYALTY
            // ============================================
            case "list_loyalty_levels":
                return await listLoyaltyLevels(parameters, baseUrl);
            case "get_loyalty_stats":
                return await getLoyaltyStats(parameters, baseUrl);

            // ============================================
            // NAVIGATION
            // ============================================
            case "navigate_to":
                return await navigateTo(parameters);

            default:
                return {
                    success: false,
                    error: `Action inconnue: ${actionName}`,
                };
        }
    } catch (error) {
        console.error(
            `Erreur lors de l'exécution de l'action ${actionName}:`,
            error
        );
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
        };
    }
}
