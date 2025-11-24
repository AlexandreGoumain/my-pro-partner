import {
  FileText,
  Package,
  TrendingUp,
  Users,
  BarChart3,
  Target,
} from "lucide-react";
import { useMemo } from "react";
import { ChatSuggestions, type ChatSuggestion } from "./chat-suggestions";

export interface ChatWelcomeScreenProps {
  onSuggestionClick: (query: string) => void;
  userName?: string;
  currentPage?: string;
}

export function ChatWelcomeScreen({
  onSuggestionClick,
  userName,
  currentPage,
}: ChatWelcomeScreenProps) {
  const greeting = useMemo(() => {
    const greetings = [
      `Bonjour${userName ? ` ${userName}` : ""} ! 👋`,
      `Salut${userName ? ` ${userName}` : ""} !`,
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }, [userName]);

  // Suggestions contextuelles par page
  const suggestions = useMemo((): ChatSuggestion[] => {
    const pageSuggestions: Record<string, ChatSuggestion[]> = {
      DASHBOARD: [
        {
          icon: TrendingUp,
          label: "Mes KPIs",
          query: "Montre-moi mes KPIs du jour",
        },
        {
          icon: BarChart3,
          label: "Évolution CA",
          query: "Évolution du CA ce mois",
        },
        {
          icon: Users,
          label: "Top 5 clients",
          query: "Qui sont mes 5 meilleurs clients ?",
        },
        {
          icon: Package,
          label: "Articles en rupture",
          query: "Quels articles sont en rupture de stock ?",
        },
      ],
      CLIENTS: [
        {
          icon: Users,
          label: "Clients VIP",
          query: "Clients avec plus de 100 points",
        },
        {
          icon: Target,
          label: "Créer segment",
          query: "Créer un nouveau segment",
        },
        {
          icon: BarChart3,
          label: "Clients inactifs",
          query: "Clients inactifs ce mois",
        },
        {
          icon: Users,
          label: "Sans email",
          query: "Clients sans email",
        },
      ],
      ARTICLES: [
        {
          icon: Package,
          label: "Stock faible",
          query: "Articles en rupture de stock",
        },
        {
          icon: TrendingUp,
          label: "Top 10 ventes",
          query: "Top 10 des articles les plus vendus",
        },
        {
          icon: Package,
          label: "Ajuster stock",
          query: "Ajuster le stock d'un article",
        },
        {
          icon: BarChart3,
          label: "Alertes stock",
          query: "Quelles sont les alertes de stock ?",
        },
      ],
      STOCK: [
        {
          icon: Package,
          label: "Alertes stock",
          query: "Alertes de stock actuelles",
        },
        {
          icon: BarChart3,
          label: "Mouvements du jour",
          query: "Mouvements de stock du jour",
        },
        {
          icon: Package,
          label: "Réapprovisionner",
          query: "Articles à réapprovisionner",
        },
        {
          icon: TrendingUp,
          label: "Historique",
          query: "Historique des mouvements de stock",
        },
      ],
      SEGMENTS: [
        {
          icon: Target,
          label: "Segment VIP",
          query: "Créer un segment VIP",
        },
        {
          icon: BarChart3,
          label: "Comparer segments",
          query: "Comparer deux segments",
        },
        {
          icon: Users,
          label: "Actifs vs inactifs",
          query: "Analyse clients actifs vs inactifs",
        },
        {
          icon: Target,
          label: "Mes segments",
          query: "Liste de tous mes segments",
        },
      ],
      CAMPAIGNS: [
        {
          icon: FileText,
          label: "Campagne email",
          query: "Créer une campagne email",
        },
        {
          icon: BarChart3,
          label: "En cours",
          query: "Campagnes en cours",
        },
        {
          icon: TrendingUp,
          label: "Taux d'ouverture",
          query: "Taux d'ouverture moyen des campagnes",
        },
        {
          icon: Target,
          label: "Performances",
          query: "Analyser les performances de mes campagnes",
        },
      ],
    };

    // Suggestions par défaut
    const defaultSuggestions: ChatSuggestion[] = [
      {
        icon: TrendingUp,
        label: "Mes stats du jour",
        query: "Montre-moi mes statistiques d'aujourd'hui",
      },
      {
        icon: Users,
        label: "Top clients",
        query: "Qui sont mes meilleurs clients ?",
      },
      {
        icon: Package,
        label: "Stock faible",
        query: "Quels articles sont en rupture de stock ?",
      },
      {
        icon: FileText,
        label: "Factures impayées",
        query: "Liste les factures impayées",
      },
    ];

    return pageSuggestions[currentPage || ""] || defaultSuggestions;
  }, [currentPage]);

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-8">
      <div className="text-center mb-6">
        <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-black mb-2">
          {greeting}
        </h3>
        <p className="text-[14px] text-black/60">
          Comment puis-je vous aider aujourd'hui ?
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-[12px] font-medium text-black/40 uppercase tracking-wide px-2">
          Suggestions
        </p>
        <ChatSuggestions
          suggestions={suggestions}
          onSelect={onSuggestionClick}
        />
      </div>

      <div className="mt-8 text-center">
        <p className="text-[11px] text-black/30 leading-relaxed">
          Posez-moi des questions sur vos clients, articles, stocks,
          statistiques et bien plus encore.
        </p>
      </div>
    </div>
  );
}
