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
import type { CategorieWithCount } from "@/lib/types/category";
import { Info, Lightbulb } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

type Category = CategorieWithCount;

interface CategoryFormData {
    nom: string;
    description: string;
    parentId: string | null;
}

export interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editMode: boolean;
    formData: CategoryFormData;
    onFormDataChange: (data: CategoryFormData) => void;
    categories: Category[];
    isSubmitting: boolean;
    onSubmit: () => void;
}

export function CategoryDialog({
    open,
    onOpenChange,
    editMode,
    formData,
    onFormDataChange,
    categories,
    isSubmitting,
    onSubmit,
}: CategoryDialogProps) {
    const isSubCategory = !!formData.parentId;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-[24px] font-semibold">
                        {editMode ? "Modifier" : "Créer"}{" "}
                        {isSubCategory ? "une sous-catégorie" : "une catégorie"}
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-black/60">
                        {isSubCategory ? (
                            <span className="flex items-center gap-1">
                                Cette sous-catégorie sera rangée dans la
                                catégorie parente. La hiérarchie est limitée à 2
                                niveaux.
                            </span>
                        ) : (
                            "Cette catégorie sera une catégorie principale. Vous pourrez ensuite créer des sous-catégories."
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {isSubCategory && (
                        <Card className="bg-black/2 border-black/10">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 text-[14px]">
                                    <Info className="h-4 w-4 text-black/40" />
                                    <span className="text-black/60">
                                        Sous-catégorie de :{" "}
                                        <strong className="text-black">
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
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="nom" className="text-[14px] font-medium">
                            Nom {isSubCategory ? "de la sous-catégorie" : "de la catégorie"} *
                        </Label>
                        <Input
                            id="nom"
                            placeholder={
                                isSubCategory
                                    ? "Ex: Installation, Réparation..."
                                    : "Ex: Plomberie, Services, Matériaux..."
                            }
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
                            className="h-11"
                        />
                        <p className="text-[13px] text-black/40">
                            Choisissez un nom court et clair
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-[14px] font-medium">
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

                    {!isSubCategory && (
                        <Card className="border-black/10 bg-black/2">
                            <CardContent className="p-4">
                                <div className="flex gap-3">
                                    <Lightbulb className="h-5 w-5 text-black/40 flex-shrink-0 mt-0.5" />
                                    <div className="text-[14px]">
                                        <p className="font-medium text-black mb-1">
                                            Conseil
                                        </p>
                                        <p className="text-black/60">
                                            Créez d&apos;abord vos catégories principales,
                                            puis créez des sous-catégories pour mieux
                                            organiser vos articles.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                        className="border-black/10"
                    >
                        Annuler
                    </Button>
                    <Button
                        onClick={onSubmit}
                        disabled={!formData.nom.trim() || isSubmitting}
                        className="bg-black hover:bg-black/90 text-white"
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner className="mr-2" />
                                {editMode ? "Enregistrement..." : "Création..."}
                            </>
                        ) : editMode ? (
                            "Enregistrer"
                        ) : (
                            "Créer"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
