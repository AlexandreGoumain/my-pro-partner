export const CATEGORY_EXAMPLES = [
    {
        title: "Exemple pour un plombier",
        categories: [
            {
                name: "Plomberie",
                children: ["Installation", "Réparation", "Maintenance"],
            },
            { name: "Sanitaires", children: ["Lavabos", "Douches", "WC"] },
        ],
    },
    {
        title: "Exemple pour un électricien",
        categories: [
            {
                name: "Électricité",
                children: ["Installation", "Dépannage", "Mise aux normes"],
            },
            {
                name: "Matériel",
                children: ["Câbles", "Disjoncteurs", "Prises"],
            },
        ],
    },
    {
        title: "Exemple pour un artisan général",
        categories: [
            {
                name: "Services",
                children: ["Installation", "Réparation", "Conseil"],
            },
            {
                name: "Produits",
                children: ["Matériaux", "Outils", "Fournitures"],
            },
        ],
    },
] as const;
