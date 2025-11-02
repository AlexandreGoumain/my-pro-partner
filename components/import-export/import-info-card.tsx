import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function ImportInfoCard() {
    return (
        <Card>
            <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-base font-semibold">
                        Informations importantes
                    </h3>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-2" />
                        <p>
                            <strong className="font-medium text-foreground">
                                Format CSV :
                            </strong>{" "}
                            Le fichier doit contenir les colonnes suivantes :
                            Nom, Prénom, Email, Téléphone, Adresse, Code Postal,
                            Ville, Pays
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-2" />
                        <p>
                            <strong className="font-medium text-foreground">
                                Encodage :
                            </strong>{" "}
                            Assurez-vous que votre fichier est encodé en UTF-8
                            pour éviter les problèmes d'accents
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-2" />
                        <p>
                            <strong className="font-medium text-foreground">
                                Doublons :
                            </strong>{" "}
                            Les clients avec le même email seront
                            automatiquement détectés et ignorés
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 mt-2" />
                        <p>
                            <strong className="font-medium text-foreground">
                                Validation :
                            </strong>{" "}
                            Toutes les données importées seront validées avant
                            d'être ajoutées à la base
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
