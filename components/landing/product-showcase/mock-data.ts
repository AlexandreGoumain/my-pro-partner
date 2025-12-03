import {
    FileText,
    Users,
    BarChart3,
    Package,
    MessageSquare,
    Calendar,
    TrendingUp,
    Clock,
    AlertCircle,
    Euro,
    Wrench,
} from "lucide-react";

export const features = [
    {
        id: "dashboard",
        icon: BarChart3,
        title: "Dashboard",
        description: "Vue d'ensemble de votre activité en temps réel",
    },
    {
        id: "documents",
        icon: FileText,
        title: "Documents",
        description: "Devis, factures et avoirs en quelques clics",
    },
    {
        id: "clients",
        icon: Users,
        title: "Clients",
        description: "Fichier client complet avec historique",
    },
    {
        id: "stock",
        icon: Package,
        title: "Stock",
        description: "Gestion des stocks et alertes automatiques",
    },
    {
        id: "atelier",
        icon: Wrench,
        title: "Atelier",
        description: "Suivi des interventions et réparations",
    },
    {
        id: "ai",
        icon: MessageSquare,
        title: "Assistant IA",
        description: "Parlez, l'IA exécute",
    },
    {
        id: "agenda",
        icon: Calendar,
        title: "Agenda",
        description: "Planning et rendez-vous synchronisés",
    },
];

export const mockStats = [
    { label: "CA du mois", value: "12 840€", change: "+23%", icon: Euro, positive: true },
    { label: "Factures en attente", value: "3", change: "2 890€", icon: Clock, positive: false },
    { label: "Devis à relancer", value: "7", change: "15 200€", icon: AlertCircle, positive: false },
    { label: "Taux conversion", value: "68%", change: "+5%", icon: TrendingUp, positive: true },
];

export const mockDocuments = [
    { type: "Facture", numero: "FAC-2024-089", client: "Martin Construction", montant: "1 250€", statut: "Payée", date: "28 nov" },
    { type: "Devis", numero: "DEV-2024-112", client: "Dupont Rénovation", montant: "3 400€", statut: "En attente", date: "27 nov" },
    { type: "Facture", numero: "FAC-2024-088", client: "Garage Central", montant: "890€", statut: "En retard", date: "15 nov" },
    { type: "Avoir", numero: "AVO-2024-012", client: "Salon Élégance", montant: "-250€", statut: "Émis", date: "26 nov" },
    { type: "Devis", numero: "DEV-2024-111", client: "Boulangerie Paul", montant: "1 800€", statut: "Accepté", date: "25 nov" },
];

export const mockClients = [
    { name: "Martin Construction", email: "contact@martin-construction.fr", phone: "06 12 34 56 78", ca: "12 450€", docs: 8, ville: "Lyon" },
    { name: "Dupont Rénovation", email: "dupont.reno@gmail.com", phone: "06 98 76 54 32", ca: "8 200€", docs: 5, ville: "Villeurbanne" },
    { name: "Garage Central", email: "garage.central@orange.fr", phone: "04 78 12 34 56", ca: "4 890€", docs: 3, ville: "Lyon 3ème" },
    { name: "Salon Élégance", email: "contact@elegance.fr", phone: "06 45 67 89 01", ca: "2 100€", docs: 2, ville: "Caluire" },
];

export const mockStock = [
    { name: "Joint de culasse universel", ref: "JDC-001", qty: 45, seuil: 10, prix: "85€", categorie: "Pièces moteur" },
    { name: "Filtre à huile premium", ref: "FAH-023", qty: 3, seuil: 15, prix: "12€", categorie: "Filtres" },
    { name: "Bougie d'allumage NGK", ref: "BA-NGK-05", qty: 120, seuil: 50, prix: "8€", categorie: "Allumage" },
    { name: "Plaquettes de frein AV", ref: "PF-AV-87", qty: 8, seuil: 10, prix: "45€", categorie: "Freinage" },
    { name: "Huile moteur 5W40 5L", ref: "HM-5W40-5", qty: 22, seuil: 8, prix: "38€", categorie: "Lubrifiants" },
    { name: "Courroie distribution", ref: "CD-VAG-12", qty: 5, seuil: 5, prix: "125€", categorie: "Distribution" },
];

export const mockConversation = [
    { role: "user", message: "Crée un devis pour M. Dupont, 2 jours de travail à 350€/jour" },
    { role: "ai", message: "Devis DEV-2024-113 créé : 2 jours × 350€ = 700€ HT (840€ TTC). Envoyé par email à M. Dupont." },
    { role: "user", message: "Quels clients n'ont pas payé ce mois ?" },
    { role: "ai", message: "3 factures en attente : Garage Central (890€, 13 jours), Dupont Rénovation (1 200€, 5 jours), Martin Construction (450€, 2 jours). Voulez-vous envoyer des relances ?" },
];

export const mockAgenda = [
    { jour: "Lun", date: 2, events: [{ heure: "09:00", titre: "M. Martin", type: "rdv" }] },
    { jour: "Mar", date: 3, events: [{ heure: "14:00", titre: "Devis Dupont", type: "rdv" }, { heure: "16:30", titre: "Rappel client", type: "task" }] },
    { jour: "Mer", date: 4, events: [] },
    { jour: "Jeu", date: 5, events: [{ heure: "08:00", titre: "Chantier Lyon", type: "chantier" }, { heure: "17:00", titre: "Livraison", type: "task" }] },
    { jour: "Ven", date: 6, events: [{ heure: "10:00", titre: "Mme Durand", type: "rdv" }] },
];

export const mockAtelier = [
    { id: "INT-2024-045", vehicule: "Peugeot 308 - AB-123-CD", client: "M. Dupont", travaux: "Révision complète + freins", statut: "En cours", avancement: 75, technicien: "Jean" },
    { id: "INT-2024-044", vehicule: "Renault Clio - EF-456-GH", client: "Mme Martin", travaux: "Diagnostic moteur", statut: "En attente pièces", avancement: 40, technicien: "Pierre" },
    { id: "INT-2024-043", vehicule: "VW Golf - IJ-789-KL", client: "Garage Central", travaux: "Distribution + pompe à eau", statut: "Terminé", avancement: 100, technicien: "Jean" },
    { id: "INT-2024-042", vehicule: "BMW Série 3 - MN-012-OP", client: "M. Bernard", travaux: "Climatisation", statut: "À facturer", avancement: 100, technicien: "Marc" },
];

export type FeatureId = "dashboard" | "documents" | "clients" | "stock" | "atelier" | "ai" | "agenda";
