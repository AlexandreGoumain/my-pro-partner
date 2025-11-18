import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export function CategoryInfoCard() {
    return (
        <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="p-4">
                <div className="flex gap-3">
                    <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">
                            Comment ça marche ?
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                            <li>
                                <strong>Catégorie principale</strong> : Par exemple
                                &quot;Plomberie&quot; ou &quot;Services&quot; - Simple organisation sans champs
                                personnalisés
                            </li>
                            <li>
                                <strong>Sous-catégorie</strong> : Cliquez sur le + à droite
                                d&apos;une catégorie pour créer une sous-catégorie avec un
                                template personnalisé (ex: &quot;Installation&quot; sous &quot;Plomberie&quot;)
                            </li>
                            <li>
                                Survolez une catégorie pour voir les actions disponibles
                            </li>
                        </ul>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
