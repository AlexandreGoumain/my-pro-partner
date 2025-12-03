"use client";

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type { EmployeeFormData } from "../types";

interface LeaveNotesSectionProps {
    form: UseFormReturn<EmployeeFormData>;
    showLeaveTitle?: boolean;
    showNotesTitle?: boolean;
    /** Show as two separate sections (for dialog) or combined (for wizard) */
    variant?: "dialog" | "wizard";
}

export function LeaveNotesSection({
    form,
    showLeaveTitle = true,
    showNotesTitle = true,
    variant = "dialog",
}: LeaveNotesSectionProps) {
    if (variant === "wizard") {
        // Wizard variant: combined in one section
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="congesRestants"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[13px] text-black/60">
                                    Congés restants (jours)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="25"
                                        className="h-11 border-black/10 focus:border-black/30"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value) || 25
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="congesPris"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[13px] text-black/60">
                                    Congés pris (jours)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        className="h-11 border-black/10 focus:border-black/30"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="competences"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Compétences
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Plomberie, électricité, soudure..."
                                    rows={3}
                                    className="border-black/10 focus:border-black/30 resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Notes internes
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Remarques, informations complémentaires..."
                                    rows={3}
                                    className="border-black/10 focus:border-black/30 resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        );
    }

    // Dialog variant: two separate sections
    return (
        <>
            {/* Congés */}
            <div className="space-y-4">
                {showLeaveTitle && (
                    <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                        Gestion des congés
                    </h3>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="congesRestants"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[13px] text-black/60">
                                    Congés restants (jours)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="25"
                                        className="h-11 border-black/10 focus:border-black/30"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="congesPris"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[13px] text-black/60">
                                    Congés pris (jours)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        className="h-11 border-black/10 focus:border-black/30"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                parseInt(e.target.value) || 0
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>

            {/* Notes et compétences */}
            <div className="space-y-4">
                {showNotesTitle && (
                    <h3 className="text-[15px] font-medium tracking-[-0.01em] text-black">
                        Informations complémentaires
                    </h3>
                )}

                <FormField
                    control={form.control}
                    name="competences"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Compétences
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Listez les compétences techniques et soft skills..."
                                    rows={3}
                                    className="border-black/10 focus:border-black/30 resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-[13px] text-black/60">
                                Notes internes
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Informations complémentaires..."
                                    rows={3}
                                    className="border-black/10 focus:border-black/30 resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </>
    );
}
