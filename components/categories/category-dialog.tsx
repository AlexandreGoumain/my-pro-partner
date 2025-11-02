import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { FieldBuilderInline } from "@/components/field-builder-inline";
import type { CategorieWithCount } from "@/lib/types/category";
import type { ChampPersonnaliseCreateInput } from "@/lib/types/custom-fields";
import { ChevronRight, Info, Lightbulb, Loader2 } from "lucide-react";

type Category = CategorieWithCount;

interface CategoryFormData {
    nom: string;
    description: string;
    parentId: string | null;
    champsCustom: ChampPersonnaliseCreateInput[];
}

export interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editMode: boolean;
    formData: CategoryFormData;
    onFormDataChange: (data: CategoryFormData) => void;
    currentStep: number;
    direction: "left" | "right";
    categories: Category[];
    isSubmitting: boolean;
    onSubmit: () => void;
    onNext: () => void;
    onPrevious: () => void;
}

export function CategoryDialog({
    open,
    onOpenChange,
    editMode,
    formData,
    onFormDataChange,
    currentStep,
    direction,
    categories,
    isSubmitting,
    onSubmit,
    onNext,
    onPrevious,
}: CategoryDialogProps) {
    const isSubCategory = !!formData.parentId;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-[80vw] max-h-[90vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        {editMode ? "Modifier" : "Créer"}{" "}
                        {isSubCategory ? "une sous-catégorie" : "une catégorie"}
                    </DialogTitle>
                    <DialogDescription>
                        {isSubCategory ? (
                            <span className="flex items-center gap-1">
                                Cette sous-catégorie sera rangée dans la catégorie parente.
                                La hiérarchie est limitée à 2 niveaux.
                            </span>
                        ) : (
                            "Cette catégorie sera une catégorie principale. Vous pourrez ensuite créer des sous-catégories."
                        )}
                    </DialogDescription>
                </DialogHeader>

                {/* Progress indicator for subcategories */}
                {isSubCategory && (
                    <div className="flex items-center justify-center gap-2 py-4 border-b">
                        <div className="flex items-center gap-2">
                            {[
                                { num: 1, label: "Informations" },
                                { num: 2, label: "Template" },
                            ].map((step, idx) => (
                                <div key={step.num} className="flex items-center">
                                    <div className="flex flex-col items-center gap-1">
                                        <div
                                            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                                                currentStep === step.num
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : currentStep > step.num
                                                    ? "border-primary bg-primary/20 text-primary"
                                                    : "border-muted-foreground/30 text-muted-foreground"
                                            }`}
                                        >
                                            {currentStep > step.num ? (
                                                <ChevronRight className="h-4 w-4" />
                                            ) : (
                                                step.num
                                            )}
                                        </div>
                                        <span
                                            className={`text-xs font-medium ${
                                                currentStep === step.num
                                                    ? "text-primary"
                                                    : "text-muted-foreground"
                                            }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                    {idx < 1 && (
                                        <div
                                            className={`w-20 h-0.5 mx-3 transition-all ${
                                                currentStep > step.num
                                                    ? "bg-primary"
                                                    : "bg-muted-foreground/30"
                                            }`}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto px-1">
                        {/* Main category: simple form */}
                        {!isSubCategory ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nom" className="text-base">
                                        Nom de la catégorie *
                                    </Label>
                                    <Input
                                        id="nom"
                                        placeholder="Ex: Plomberie, Services, Matériaux..."
                                        value={formData.nom}
                                        onChange={(e) =>
                                            onFormDataChange({
                                                ...formData,
                                                nom: e.target.value,
                                            })
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && formData.nom.trim()) {
                                                onSubmit();
                                            }
                                        }}
                                        autoFocus
                                        className="text-base"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Choisissez un nom court et clair
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-base">
                                        Description (optionnel)
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Une courte description pour vous aider à vous souvenir..."
                                        value={formData.description}
                                        onChange={(e) =>
                                            onFormDataChange({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={3}
                                        className="resize-none"
                                    />
                                </div>

                                <Card className="border-amber-200 bg-amber-50/50">
                                    <CardContent className="p-4">
                                        <div className="flex gap-3">
                                            <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="font-medium text-amber-900 mb-1">
                                                    Conseil
                                                </p>
                                                <p className="text-amber-700">
                                                    Créez d'abord vos catégories principales, puis
                                                    créez des sous-catégories avec des templates
                                                    personnalisés si besoin.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <>
                                {/* Step 1: Basic information */}
                                {currentStep === 1 && (
                                    <div
                                        className={`space-y-4 animate-in ${
                                            direction === "right"
                                                ? "slide-in-from-left"
                                                : "slide-in-from-right"
                                        } duration-300`}
                                    >
                                        <Card className="bg-muted/50">
                                            <CardContent className="p-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Info className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">
                                                        Sous-catégorie de :{" "}
                                                        <strong>
                                                            {
                                                                categories.find(
                                                                    (c) => c.id === formData.parentId
                                                                )?.nom
                                                            }
                                                        </strong>
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <div className="space-y-2">
                                            <Label htmlFor="nom" className="text-base">
                                                Nom de la sous-catégorie *
                                            </Label>
                                            <Input
                                                id="nom"
                                                placeholder="Ex: Installation, Réparation..."
                                                value={formData.nom}
                                                onChange={(e) =>
                                                    onFormDataChange({
                                                        ...formData,
                                                        nom: e.target.value,
                                                    })
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && formData.nom.trim()) {
                                                        onNext();
                                                    }
                                                }}
                                                autoFocus
                                                className="text-base"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Choisissez un nom court et clair
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="description" className="text-base">
                                                Description (optionnel)
                                            </Label>
                                            <Textarea
                                                id="description"
                                                placeholder="Une courte description pour vous aider à vous souvenir..."
                                                value={formData.description}
                                                onChange={(e) =>
                                                    onFormDataChange({
                                                        ...formData,
                                                        description: e.target.value,
                                                    })
                                                }
                                                rows={3}
                                                className="resize-none"
                                            />
                                        </div>

                                        <Card className="border-amber-200 bg-amber-50/50">
                                            <CardContent className="p-4">
                                                <div className="flex gap-3">
                                                    <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                    <div className="text-sm">
                                                        <p className="font-medium text-amber-900 mb-1">
                                                            Conseil
                                                        </p>
                                                        <p className="text-amber-700">
                                                            Vous pouvez définir un template spécifique
                                                            pour cette sous-catégorie à l'étape
                                                            suivante.
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}

                                {/* Step 2: Custom template */}
                                {currentStep === 2 && (
                                    <div
                                        className={`space-y-4 animate-in ${
                                            direction === "right"
                                                ? "slide-in-from-right"
                                                : "slide-in-from-left"
                                        } duration-300`}
                                    >
                                        <FieldBuilderInline
                                            fields={formData.champsCustom}
                                            onChange={(fields) =>
                                                onFormDataChange({
                                                    ...formData,
                                                    champsCustom: fields,
                                                })
                                            }
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    {!isSubCategory ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={onSubmit}
                                disabled={!formData.nom.trim() || isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {editMode ? "Enregistrement..." : "Création..."}
                                    </>
                                ) : (
                                    editMode ? "Enregistrer" : "Créer"
                                )}
                            </Button>
                        </>
                    ) : currentStep === 1 ? (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                            <Button
                                onClick={onNext}
                                disabled={!formData.nom.trim() || isSubmitting}
                            >
                                Suivant
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={onPrevious}
                                disabled={isSubmitting}
                            >
                                <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                                Précédent
                            </Button>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={onSubmit}
                                    disabled={!formData.nom.trim() || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Enregistrement...
                                        </>
                                    ) : (
                                        "Passer"
                                    )}
                                </Button>
                                <Button
                                    onClick={onSubmit}
                                    disabled={!formData.nom.trim() || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            {editMode ? "Enregistrement..." : "Création..."}
                                        </>
                                    ) : (
                                        editMode ? "Enregistrer" : "Créer"
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
