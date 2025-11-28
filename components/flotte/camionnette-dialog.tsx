"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { DialogActionButtons } from "@/components/ui/dialog-action-buttons";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useCamionnetteDialog } from "@/hooks/use-camionnette-dialog";
import type { Camionnette } from "@/lib/types/flotte";

interface CamionnetteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    camionnette?: Camionnette | null;
}

export function CamionnetteDialog({
    open,
    onOpenChange,
    onSuccess,
    camionnette,
}: CamionnetteDialogProps) {
    const {
        form,
        formKey,
        isEditing,
        isPending,
        users,
        handleOpenChange,
        handleSubmit,
    } = useCamionnetteDialog({
        open,
        onOpenChange,
        onSuccess,
        camionnette,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-[24px] font-semibold">
                        {isEditing
                            ? "Modifier le véhicule"
                            : "Nouveau véhicule"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-6"
                    >
                        {/* Use key to force re-render on form reset */}
                        <div key={formKey} className="space-y-6">
                            {/* Immatriculation */}
                            <FormField
                                control={form.control}
                                name="immatriculation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Immatriculation</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: AB-123-CD"
                                                className="h-11"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Marque & Modèle */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="marque"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Marque</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ex: Renault"
                                                    className="h-11"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="modele"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Modèle</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Ex: Kangoo"
                                                    className="h-11"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Année & Kilométrage */}
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="annee"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Année</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Ex: 2020"
                                                    className="h-11"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="kilometres"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kilométrage</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    className="h-11"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Plombier assigné */}
                            <FormField
                                control={form.control}
                                name="plombierPrincipalId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Technicien assigné (optionnel)
                                        </FormLabel>
                                        <Select
                                            onValueChange={(value) =>
                                                field.onChange(
                                                    value === "none" ? "" : value
                                                )
                                            }
                                            value={field.value || "none"}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Sélectionner un technicien" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">
                                                    Aucun
                                                </SelectItem>
                                                {users.map(
                                                    (user: {
                                                        id: string;
                                                        name: string | null;
                                                    }) => (
                                                        <SelectItem
                                                            key={user.id}
                                                            value={user.id}
                                                        >
                                                            {user.name ||
                                                                "Sans nom"}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Actif */}
                            {isEditing && (
                                <FormField
                                    control={form.control}
                                    name="actif"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between rounded-lg border border-black/10 p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-base">
                                                    Véhicule actif
                                                </FormLabel>
                                                <p className="text-[13px] text-black/50">
                                                    Désactiver si le véhicule
                                                    n&apos;est plus utilisé
                                                </p>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>

                        <DialogActionButtons
                            onCancel={() => handleOpenChange(false)}
                            isLoading={isPending}
                            isEditing={isEditing}
                            submitLabel={
                                isEditing ? "Modifier" : "Créer le véhicule"
                            }
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
