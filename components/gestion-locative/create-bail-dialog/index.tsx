"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogActionButtons } from "@/components/ui/dialog-action-buttons";
import { DialogHeaderSection } from "@/components/ui/dialog-header-section";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { FormDatePicker } from "@/components/ui/form-date-picker";
import { FormSelect } from "@/components/ui/form-select";

import { BienSearchCombobox } from "./bien-search-combobox";
import { ClientSearchCombobox } from "./client-search-combobox";
import { BailSummary } from "./bail-summary";
import { useCreateBailForm } from "./use-create-bail-form";
import { TYPE_BAIL_OPTIONS, DUREE_OPTIONS, type CreateBailDialogProps } from "./types";

export function CreateBailDialog({
    open,
    onOpenChange,
    onSuccess,
}: CreateBailDialogProps) {
    const {
        form,
        formKey,
        // Locataire
        locataireSearch,
        setLocataireSearch,
        locataireOpen,
        setLocataireOpen,
        selectedLocataire,
        locataires,
        handleLocataireSelect,
        // Proprietaire
        proprietaireSearch,
        setProprietaireSearch,
        proprietaireOpen,
        setProprietaireOpen,
        selectedProprietaire,
        proprietaires,
        handleProprietaireSelect,
        // Bien
        bienOpen,
        setBienOpen,
        selectedBien,
        biens,
        handleBienSelect,
        // Form
        handleOpenChange,
        onSubmit,
        isLoading,
        // Computed
        loyerHC,
        provisions,
        loyerCC,
    } = useCreateBailForm({ onSuccess, onOpenChange });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeaderSection
                    title="Nouveau bail"
                    description="Créez un nouveau contrat de location"
                    titleClassName="text-[18px] font-semibold tracking-[-0.02em]"
                    descriptionClassName="text-[14px] text-black/60"
                />

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                        key={formKey}
                    >
                        {/* Bien */}
                        <FormField
                            control={form.control}
                            name="bienId"
                            render={() => (
                                <BienSearchCombobox
                                    open={bienOpen}
                                    onOpenChange={setBienOpen}
                                    selectedBien={selectedBien}
                                    biens={biens}
                                    onSelect={handleBienSelect}
                                />
                            )}
                        />

                        {/* Locataire */}
                        <FormField
                            control={form.control}
                            name="locataireId"
                            render={() => (
                                <ClientSearchCombobox
                                    label="Locataire"
                                    placeholder="Rechercher un locataire..."
                                    searchPlaceholder="Rechercher par nom, email..."
                                    open={locataireOpen}
                                    onOpenChange={setLocataireOpen}
                                    search={locataireSearch}
                                    onSearchChange={setLocataireSearch}
                                    selectedClient={selectedLocataire}
                                    clients={locataires}
                                    onSelect={handleLocataireSelect}
                                    required
                                />
                            )}
                        />

                        {/* Propriétaire */}
                        <FormField
                            control={form.control}
                            name="proprietaireId"
                            render={() => (
                                <ClientSearchCombobox
                                    label="Propriétaire"
                                    placeholder="Rechercher un propriétaire..."
                                    searchPlaceholder="Rechercher par nom, email..."
                                    open={proprietaireOpen}
                                    onOpenChange={setProprietaireOpen}
                                    search={proprietaireSearch}
                                    onSearchChange={setProprietaireSearch}
                                    selectedClient={selectedProprietaire}
                                    clients={proprietaires}
                                    onSelect={handleProprietaireSelect}
                                    required
                                />
                            )}
                        />

                        {/* Type de bail et Durée */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormSelect
                                control={form.control}
                                name="typeBail"
                                label="Type de bail"
                                options={TYPE_BAIL_OPTIONS}
                                placeholder="Sélectionner"
                                required
                                labelClassName="text-[13px] font-medium"
                            />
                            <FormField
                                control={form.control}
                                name="dureeMois"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] font-medium">
                                            Durée <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <select
                                                className="w-full h-11 border border-black/10 rounded-md px-3 text-[14px]"
                                                value={String(field.value)}
                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                            >
                                                {DUREE_OPTIONS.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Date de début */}
                        <FormDatePicker
                            control={form.control}
                            name="dateDebut"
                            label="Date de début"
                            required
                            labelClassName="text-[13px] font-medium"
                        />

                        {/* Loyer */}
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="loyerHC"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] font-medium">
                                            Loyer HC (€) <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full h-11 border border-black/10 rounded-md px-3 text-[14px]"
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="provisions"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] font-medium">
                                            Provisions (€)
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full h-11 border border-black/10 rounded-md px-3 text-[14px]"
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="depotGarantie"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[13px] font-medium">
                                            Dépôt garantie (€)
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full h-11 border border-black/10 rounded-md px-3 text-[14px]"
                                                value={field.value || ""}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Récapitulatif */}
                        <BailSummary
                            selectedBien={selectedBien}
                            loyerHC={loyerHC}
                            provisions={provisions}
                            loyerCC={loyerCC}
                        />

                        {form.formState.errors.root && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.root.message}
                            </p>
                        )}

                        <DialogActionButtons
                            onCancel={() => handleOpenChange(false)}
                            submitLabel="Créer le bail"
                            isLoading={isLoading}
                        />
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
