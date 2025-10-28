export const ARTICLE_STATUSES = {
  ACTIF: {
    label: "Disponible",
    shortLabel: "Actif",
    variant: "default" as const,
    className: "bg-green-500/10 text-green-700 border-green-500/20",
  },
  INACTIF: {
    label: "Inactif",
    shortLabel: "Inactif",
    variant: "secondary" as const,
    className: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  },
  RUPTURE: {
    label: "Rupture de stock",
    shortLabel: "Rupture",
    variant: "destructive" as const,
    className: "bg-red-500/10 text-red-700 border-red-500/20",
  },
} as const;

export type ArticleStatus = keyof typeof ARTICLE_STATUSES;

export const getArticleStatusConfig = (status: ArticleStatus) => {
  return (
    ARTICLE_STATUSES[status] || {
      label: status,
      shortLabel: status,
      variant: "secondary" as const,
      className: "",
    }
  );
};
