import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface Rachat {
    id: string;
    designation: string;
    description?: string;
    categorieId?: string;
    etat?: string;
    provenance?: string;
    prixRachat?: number;
    numeroSerie?: string;
    notes?: string;
}

interface RachatSelectorProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: UseFormReturn<any>;
    rachats: Rachat[] | undefined;
    isLoading: boolean;
    onSelect: (rachatId: string) => void;
}

export function RachatSelector({
    form,
    rachats,
    isLoading,
    onSelect,
}: RachatSelectorProps) {
    return (
        <FormField
            control={form.control}
            name="rachatId"
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="text-[14px]">
                        Sélectionner un rachat{" "}
                        <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                        onValueChange={onSelect}
                        value={field.value}
                        disabled={isLoading}
                    >
                        <FormControl>
                            <SelectTrigger className="h-11">
                                <SelectValue placeholder="Choisir un rachat disponible" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {isLoading ? (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            ) : rachats && rachats.length > 0 ? (
                                rachats.map((rachat) => (
                                    <SelectItem
                                        key={rachat.id}
                                        value={rachat.id}
                                    >
                                        {rachat.designation} -{" "}
                                        {rachat.prixRachat || 0}€
                                    </SelectItem>
                                ))
                            ) : (
                                <div className="text-[13px] text-black/60 text-center py-4">
                                    Aucun rachat disponible
                                </div>
                            )}
                        </SelectContent>
                    </Select>
                    <FormDescription className="text-[12px]">
                        Les informations du rachat seront utilisées
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
