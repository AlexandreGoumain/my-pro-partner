// ============================================
// CHAT TOOL CALL - Affichage des appels d'outils
// ============================================

import { cn } from "@/lib/utils";
import {
    CheckCircle2,
    FileText,
    Loader2,
    Navigation,
    Package,
    PieChart,
    Search,
    Users,
    XCircle,
} from "lucide-react";

interface ToolInvocation {
    toolCallId: string;
    toolName: string;
    args: Record<string, unknown>;
    state: "pending" | "result" | "error";
    result?: unknown;
}

interface ChatToolCallProps {
    toolInvocation: ToolInvocation;
}

// Mapping des noms d'outils vers des labels lisibles
const TOOL_LABELS: Record<string, { label: string; icon: typeof Search }> = {
    search_clients: { label: "Recherche clients", icon: Users },
    get_client_details: { label: "Détails client", icon: Users },
    create_client: { label: "Création client", icon: Users },
    search_articles: { label: "Recherche articles", icon: Package },
    get_stock_alerts: { label: "Alertes stock", icon: Package },
    search_documents: { label: "Recherche documents", icon: FileText },
    create_document: { label: "Création document", icon: FileText },
    get_statistics: { label: "Statistiques", icon: PieChart },
    get_dashboard_kpis: { label: "KPIs Dashboard", icon: PieChart },
    query_unpaid_invoices: { label: "Factures impayées", icon: FileText },
    identify_best_clients: { label: "Meilleurs clients", icon: Users },
    search_all: { label: "Recherche globale", icon: Search },
    navigate_to: { label: "Navigation", icon: Navigation },
};

export function ChatToolCall({ toolInvocation }: ChatToolCallProps) {
    const { toolName, state, args } = toolInvocation;

    const toolInfo = TOOL_LABELS[toolName] || {
        label: toolName,
        icon: Search,
    };
    const Icon = toolInfo.icon;

    // Extraire un résumé des arguments
    const argsSummary = getArgsSummary(args);

    return (
        <div
            className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-[12px]",
                state === "pending" && "bg-black/5 text-black/60",
                state === "result" && "bg-green-50 text-green-700",
                state === "error" && "bg-red-50 text-red-700"
            )}
        >
            {state === "pending" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
            ) : state === "result" ? (
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
            ) : (
                <XCircle className="w-3.5 h-3.5" strokeWidth={2} />
            )}

            <Icon className="w-3.5 h-3.5" strokeWidth={2} />

            <span className="font-medium">{toolInfo.label}</span>

            {argsSummary && (
                <span className="text-black/40 truncate max-w-[150px]">
                    {argsSummary}
                </span>
            )}
        </div>
    );
}

function getArgsSummary(args: Record<string, unknown>): string | null {
    // Extraire les arguments significatifs pour l'affichage
    if (args.query) return `"${args.query}"`;
    if (args.clientId) return `ID: ${args.clientId}`;
    if (args.nom) return args.nom as string;
    if (args.page) return args.page as string;
    if (args.type) return args.type as string;
    if (args.period) return args.period as string;
    return null;
}

// Composant pour afficher une liste de tool calls
interface ChatToolCallsProps {
    toolInvocations: ToolInvocation[];
}

export function ChatToolCalls({ toolInvocations }: ChatToolCallsProps) {
    if (!toolInvocations || toolInvocations.length === 0) return null;

    return (
        <div className="flex flex-col gap-1.5 mb-2">
            {toolInvocations.map((invocation) => (
                <ChatToolCall
                    key={invocation.toolCallId}
                    toolInvocation={invocation}
                />
            ))}
        </div>
    );
}
