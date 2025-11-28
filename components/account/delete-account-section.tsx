import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Trash2 } from "lucide-react";

interface DeleteAccountSectionProps {
    deleteAccount: {
        dialogOpen: boolean;
        reason: string;
        comment: string;
    };
    setDeleteDialogOpen: (open: boolean) => void;
    setDeleteReason: (reason: string) => void;
    setDeleteComment: (comment: string) => void;
    isLoading: boolean;
    onDelete: () => void;
}

export function DeleteAccountSection({
    deleteAccount,
    setDeleteDialogOpen,
    setDeleteReason,
    setDeleteComment,
    isLoading,
    onDelete,
}: DeleteAccountSectionProps) {
    return (
        <Card className="border-red-300 shadow-sm bg-red-50/30">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <Trash2
                            className="w-5 h-5 text-red-600"
                            strokeWidth={2}
                        />
                    </div>
                    <div>
                        <h2 className="text-[18px] font-semibold tracking-[-0.01em] text-black">
                            Supprimer mon compte
                        </h2>
                        <p className="text-[13px] text-black/40">
                            Action irréversible - toutes vos données seront
                            supprimées
                        </p>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Dialog
                    open={deleteAccount.dialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                >
                    <DialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="border-red-300 text-red-700 hover:bg-red-100 h-11 px-6 text-[14px] font-medium"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer définitivement mon compte
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertTriangle
                                        className="w-6 h-6 text-red-600"
                                        strokeWidth={2}
                                    />
                                </div>
                                <div>
                                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.01em]">
                                        Supprimer votre compte
                                    </DialogTitle>
                                    <DialogDescription className="text-[14px] text-black/60 mt-1">
                                        Cette action est irréversible
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>

                        <div className="space-y-5 py-4">
                            {/* Warning */}
                            <div className="p-4 rounded-md bg-red-50 border border-red-200">
                                <p className="text-[13px] text-red-800 leading-relaxed">
                                    <strong>Attention :</strong> Toutes vos
                                    données seront définitivement supprimées
                                </p>
                            </div>

                            {/* Questionnaire */}
                            <div className="space-y-4">
                                <Label className="text-[14px] font-medium text-black">
                                    Pourquoi souhaitez-vous supprimer votre
                                    compte ?
                                </Label>
                                <RadioGroup
                                    value={deleteAccount.reason}
                                    onValueChange={setDeleteReason}
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="too-expensive"
                                            id="r1"
                                        />
                                        <Label
                                            htmlFor="r1"
                                            className="text-[14px] font-normal cursor-pointer"
                                        >
                                            Trop cher pour mes besoins
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="missing-features"
                                            id="r2"
                                        />
                                        <Label
                                            htmlFor="r2"
                                            className="text-[14px] font-normal cursor-pointer"
                                        >
                                            Fonctionnalités manquantes
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="found-alternative"
                                            id="r3"
                                        />
                                        <Label
                                            htmlFor="r3"
                                            className="text-[14px] font-normal cursor-pointer"
                                        >
                                            J&apos;ai trouvé une alternative
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="difficult-to-use"
                                            id="r4"
                                        />
                                        <Label
                                            htmlFor="r4"
                                            className="text-[14px] font-normal cursor-pointer"
                                        >
                                            Difficile à utiliser
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                            value="no-longer-needed"
                                            id="r5"
                                        />
                                        <Label
                                            htmlFor="r5"
                                            className="text-[14px] font-normal cursor-pointer"
                                        >
                                            Je n&apos;en ai plus besoin
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="other" id="r6" />
                                        <Label
                                            htmlFor="r6"
                                            className="text-[14px] font-normal cursor-pointer"
                                        >
                                            Autre raison
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Optional comment */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="delete-comment"
                                    className="text-[14px] font-medium text-black"
                                >
                                    Commentaire (optionnel)
                                </Label>
                                <Textarea
                                    id="delete-comment"
                                    placeholder="Partagez-nous vos retours pour nous améliorer..."
                                    value={deleteAccount.comment}
                                    onChange={(e) =>
                                        setDeleteComment(e.target.value)
                                    }
                                    className="min-h-[80px] resize-none border-black/10"
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setDeleteDialogOpen(false)}
                                className="border-black/10 hover:bg-black/5"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="button"
                                onClick={onDelete}
                                disabled={isLoading || !deleteAccount.reason}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {isLoading
                                    ? "Suppression..."
                                    : "Supprimer définitivement"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
