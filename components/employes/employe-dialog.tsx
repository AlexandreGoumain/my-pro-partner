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
import { Switch } from "@/components/ui/switch";
import { useEmployeDialog } from "@/hooks/use-employe-dialog";
import type { Employe } from "@/hooks/use-employes";

interface EmployeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    employe?: Employe | null;
}

export function EmployeDialog({
    open,
    onOpenChange,
    onSuccess,
    employe,
}: EmployeDialogProps) {
    const {
        form,
        formKey,
        isEditing,
        isPending,
        colors,
        handleOpenChange,
        handleSubmit,
    } = useEmployeDialog({
        open,
        onOpenChange,
        onSuccess,
        employe,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.02em]">
                        {isEditing ? "Modifier l'employé" : "Nouvel employé"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4 mt-4"
                    >
                        {/* Use key to force re-render on form reset */}
                        <div key={formKey} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="prenom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[14px]">
                                                Prénom
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Marie"
                                                    className="h-11 text-[14px] border-black/10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="nom"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[14px]">
                                                Nom
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Dupont"
                                                    className="h-11 text-[14px] border-black/10"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[14px]">
                                            Email (optionnel)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="marie@exemple.com"
                                                className="h-11 text-[14px] border-black/10"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="telephone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[14px]">
                                            Téléphone (optionnel)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="06 12 34 56 78"
                                                className="h-11 text-[14px] border-black/10"
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
                                        <FormLabel className="text-[14px]">
                                            Couleur (calendrier)
                                        </FormLabel>
                                        <div className="flex gap-2">
                                            {colors.map((color) => (
                                                <button
                                                    key={color}
                                                    type="button"
                                                    className={`w-8 h-8 rounded-full transition-all ${
                                                        field.value === color
                                                            ? "ring-2 ring-offset-2 ring-black"
                                                            : "hover:scale-110"
                                                    }`}
                                                    style={{
                                                        backgroundColor: color,
                                                    }}
                                                    onClick={() =>
                                                        field.onChange(color)
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="actif"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border border-black/10 p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-[14px]">
                                                Employé actif
                                            </FormLabel>
                                            <p className="text-[13px] text-black/50">
                                                Les employés inactifs ne peuvent
                                                pas prendre de RDV
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
                        </div>

                        <DialogActionButtons
                            onCancel={() => handleOpenChange(false)}
                            isLoading={isPending}
                            isEditing={isEditing}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
