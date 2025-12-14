import { Card } from "@/components/ui/card";

export function ImportInfoCard() {
    return (
        <Card className="group relative overflow-hidden border-black/[0.08] bg-white hover:shadow-sm transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            Informations importantes
                        </h3>
                    </div>
                </div>

                <div className="space-y-3 text-[13px] text-black/70">
                    <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-black/5 flex-shrink-0 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
                        </div>
                        <p>
                            <span className="font-semibold text-black">
                                Format CSV :
                            </span>{" "}
                            Le fichier doit contenir les colonnes suivantes :
                            Nom, Prénom, Email, Téléphone, Adresse, Code Postal,
                            Ville, Pays
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-black/5 flex-shrink-0 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
                        </div>
                        <p>
                            <span className="font-semibold text-black">
                                Encodage :
                            </span>{" "}
                            Assurez-vous que votre fichier est encodé en UTF-8
                            pour éviter les problèmes d&apos;accents
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-black/5 flex-shrink-0 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
                        </div>
                        <p>
                            <span className="font-semibold text-black">
                                Doublons :
                            </span>{" "}
                            Les clients avec le même email seront
                            automatiquement détectés et ignorés
                        </p>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center h-5 w-5 rounded-full bg-black/5 flex-shrink-0 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
                        </div>
                        <p>
                            <span className="font-semibold text-black">
                                Validation :
                            </span>{" "}
                            Toutes les données importées seront validées avant
                            d&apos;être ajoutées à la base
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}
