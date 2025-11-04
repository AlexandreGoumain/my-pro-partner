import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { UseFormReturn } from "react-hook-form";
import type { NiveauFideliteCreateInput } from "@/lib/validation";

export interface LoyaltyLevelDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editMode: boolean;
    form: UseFormReturn<NiveauFideliteCreateInput>;
    onSubmit: (values: NiveauFideliteCreateInput) => void;
    isSubmitting: boolean;
}

export function LoyaltyLevelDialog({
    open,
    onOpenChange,
    editMode,
    form,
    onSubmit,
    isSubmitting,
}: LoyaltyLevelDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                        {editMode
                            ? "Modifier le niveau"
                            : "Nouveau niveau de fidélité"}
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-black/60">
                        {editMode
                            ? "Modifiez les paramètres du niveau de fidélité"
                            : "Créez un nouveau niveau pour votre programme de fidélité"}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="nom"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[13px] text-black/60">
                                        Nom du niveau *
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Bronze, Argent, Or..."
                                            className="h-11 border-black/10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[13px] text-black/60">
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            value={field.value || ""}
                                            placeholder="Décrivez ce niveau..."
                                            className="min-h-[80px] border-black/10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="seuilPoints"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] text-black/60">
                                            Seuil de points *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                className="h-11 border-black/10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="remise"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] text-black/60">
                                            Remise (%)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="0.01"
                                                onChange={(e) =>
                                                    field.onChange(
                                                        parseFloat(e.target.value)
                                                    )
                                                }
                                                className="h-11 border-black/10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="couleur"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] text-black/60">
                                            Couleur
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="color"
                                                className="h-11 border-black/10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="avantages"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[13px] text-black/60">
                                        Avantages
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            value={field.value || ""}
                                            placeholder="Listez les avantages de ce niveau..."
                                            className="min-h-[100px] border-black/10"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="border-black/10 hover:bg-black/5 h-11 px-6 text-[14px] font-medium"
                            >
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                            >
                                {isSubmitting
                                    ? "Enregistrement..."
                                    : editMode
                                    ? "Modifier"
                                    : "Créer"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
