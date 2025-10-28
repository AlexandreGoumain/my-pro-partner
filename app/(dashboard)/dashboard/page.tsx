import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ArrowRight,
    FileText,
    Package,
    Plus,
    TrendingUp,
    Users,
} from "lucide-react";

export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div>
                <h2 className="text-2xl font-bold tracking-tight">
                    Tableau de bord
                </h2>
                <p className="text-muted-foreground">
                    Bienvenue sur MyProPartner. Voici un aperçu de votre
                    activité.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Clients
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">24</div>
                        <p className="text-xs text-muted-foreground">
                            +2 ce mois-ci
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Articles
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">156</div>
                        <p className="text-xs text-muted-foreground">
                            +12 ce mois-ci
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Documents
                        </CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">89</div>
                        <p className="text-xs text-muted-foreground">
                            +8 ce mois-ci
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Chiffre d&apos;affaires
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,450€</div>
                        <p className="text-xs text-muted-foreground">
                            +15% ce mois-ci
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Actions rapides
                        </CardTitle>
                        <CardDescription>
                            Créez rapidement de nouveaux éléments
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nouveau client
                        </Button>
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvel article
                        </Button>
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nouveau devis
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Derniers documents
                        </CardTitle>
                        <CardDescription>Vos documents récents</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span>DEV-2024-001</span>
                            <span className="text-muted-foreground">
                                Il y a 2h
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span>FAC-2024-015</span>
                            <span className="text-muted-foreground">Hier</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span>DEV-2024-002</span>
                            <span className="text-muted-foreground">
                                Il y a 3j
                            </span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-2"
                        >
                            Voir tous
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Activité récente
                        </CardTitle>
                        <CardDescription>Les dernières actions</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="text-sm space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span>Nouveau client ajouté</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span>Devis DEV-2024-001 créé</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span>Article mis à jour</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
