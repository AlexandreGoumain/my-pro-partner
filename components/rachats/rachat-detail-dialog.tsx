"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRachat } from "@/hooks/use-rachats";
import { ETAT_COLORS, ETAT_LABELS, PROVENANCE_LABELS } from "@/lib/constants/rachats";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    Package,
    User,
    Calendar,
    DollarSign,
    FileText,
    Tag,
    Shield,
    Hash,
} from "lucide-react";

export interface RachatDetailDialogProps {
    rachatId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RachatDetailDialog({
    rachatId,
    open,
    onOpenChange,
}: RachatDetailDialogProps) {
    const { data: rachat, isLoading } = useRachat(rachatId);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl border-black/10 bg-white shadow-sm">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.01em] text-black">
                        Détails du rachat
                    </DialogTitle>
                    <DialogDescription className="text-[14px] text-black/60">
                        Informations complètes sur le rachat
                    </DialogDescription>
                </DialogHeader>

                {isLoading && (
                    <div className="py-12 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
                        <p className="mt-4 text-[14px] text-black/60">
                            Chargement...
                        </p>
                    </div>
                )}

                {!isLoading && rachat && (
                    <div className="space-y-6">
                        {/* Article Section */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Package
                                    className="h-4 w-4 text-black/40"
                                    strokeWidth={2}
                                />
                                <h3 className="text-[15px] font-semibold text-black">
                                    Article
                                </h3>
                            </div>
                            <div className="rounded-lg border border-black/8 bg-black/2 p-4 space-y-2">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-[15px] font-semibold text-black">
                                            {rachat.article.nom}
                                        </p>
                                        <p className="text-[13px] text-black/60 font-mono">
                                            {rachat.article.reference}
                                        </p>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-black/5 text-black/60 border-black/10"
                                    >
                                        {rachat.article.type}
                                    </Badge>
                                </div>
                                {rachat.article.description && (
                                    <p className="text-[14px] text-black/70 mt-2">
                                        {rachat.article.description}
                                    </p>
                                )}
                                {rachat.article.categorie && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <Tag
                                            className="h-3 w-3 text-black/40"
                                            strokeWidth={2}
                                        />
                                        <p className="text-[13px] text-black/60">
                                            {rachat.article.categorie.nom}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator className="bg-black/8" />

                        {/* Rachat Information */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <FileText
                                    className="h-4 w-4 text-black/40"
                                    strokeWidth={2}
                                />
                                <h3 className="text-[15px] font-semibold text-black">
                                    Informations du rachat
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[13px] text-black/60">État</p>
                                    <Badge
                                        variant="outline"
                                        className={`${ETAT_COLORS[rachat.etat]} font-medium`}
                                    >
                                        {ETAT_LABELS[rachat.etat]}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[13px] text-black/60">
                                        Provenance
                                    </p>
                                    <p className="text-[14px] font-medium text-black">
                                        {PROVENANCE_LABELS[rachat.provenance]}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <DollarSign
                                            className="h-3 w-3 text-black/40"
                                            strokeWidth={2}
                                        />
                                        <p className="text-[13px] text-black/60">
                                            Prix de rachat
                                        </p>
                                    </div>
                                    <p className="text-[16px] font-semibold text-black">
                                        {Number(rachat.prixRachat).toFixed(2)} €
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <DollarSign
                                            className="h-3 w-3 text-black/40"
                                            strokeWidth={2}
                                        />
                                        <p className="text-[13px] text-black/60">
                                            Prix de vente
                                        </p>
                                    </div>
                                    <p className="text-[16px] font-semibold text-black">
                                        {Number(rachat.article.prix_ht).toFixed(2)} €
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Calendar
                                            className="h-3 w-3 text-black/40"
                                            strokeWidth={2}
                                        />
                                        <p className="text-[13px] text-black/60">
                                            Date de rachat
                                        </p>
                                    </div>
                                    <p className="text-[14px] text-black">
                                        {format(
                                            new Date(rachat.dateRachat),
                                            "dd MMMM yyyy",
                                            { locale: fr }
                                        )}
                                    </p>
                                </div>
                                {rachat.dureeGarantie && (
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-1">
                                            <Shield
                                                className="h-3 w-3 text-black/40"
                                                strokeWidth={2}
                                            />
                                            <p className="text-[13px] text-black/60">
                                                Garantie
                                            </p>
                                        </div>
                                        <p className="text-[14px] text-black">
                                            {rachat.dureeGarantie} mois
                                        </p>
                                    </div>
                                )}
                            </div>
                            {rachat.numeroSerie && (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                        <Hash
                                            className="h-3 w-3 text-black/40"
                                            strokeWidth={2}
                                        />
                                        <p className="text-[13px] text-black/60">
                                            Numéro de série
                                        </p>
                                    </div>
                                    <p className="text-[14px] text-black font-mono">
                                        {rachat.numeroSerie}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Client Section */}
                        {rachat.client && (
                            <>
                                <Separator className="bg-black/8" />
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <User
                                            className="h-4 w-4 text-black/40"
                                            strokeWidth={2}
                                        />
                                        <h3 className="text-[15px] font-semibold text-black">
                                            Client
                                        </h3>
                                    </div>
                                    <div className="rounded-lg border border-black/8 bg-black/2 p-4">
                                        <p className="text-[15px] font-semibold text-black">
                                            {rachat.client.nom}
                                        </p>
                                        {rachat.client.email && (
                                            <p className="text-[13px] text-black/60 mt-1">
                                                {rachat.client.email}
                                            </p>
                                        )}
                                        {rachat.client.telephone && (
                                            <p className="text-[13px] text-black/60">
                                                {rachat.client.telephone}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Notes Section */}
                        {rachat.notes && (
                            <>
                                <Separator className="bg-black/8" />
                                <div className="space-y-3">
                                    <h3 className="text-[15px] font-semibold text-black">
                                        Notes
                                    </h3>
                                    <div className="rounded-lg border border-black/8 bg-black/2 p-4">
                                        <p className="text-[14px] text-black/70 whitespace-pre-wrap">
                                            {rachat.notes}
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
