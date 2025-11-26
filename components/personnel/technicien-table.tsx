"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { Technicien } from "@/hooks/use-techniciens";
import { Mail, Phone, Pencil, Trash2, Truck, Clock } from "lucide-react";

export interface TechnicienTableProps {
    techniciens: Technicien[];
    onEdit?: (technicien: Technicien) => void;
    onDelete?: (technicien: Technicien) => void;
    onResendInvitation?: (technicien: Technicien) => void;
    businessLabel?: string;
    showVehicles?: boolean;
}

/**
 * Status badge component
 */
function StatusBadge({ status, isPending }: { status?: string; isPending?: boolean }) {
    if (isPending || status === "INVITED") {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[12px] font-medium bg-black/[0.05] text-black/50">
                <Clock className="w-3 h-3" strokeWidth={2} />
                En attente
            </span>
        );
    }

    return (
        <span className="inline-flex items-center px-2 py-1 rounded text-[12px] font-medium bg-black/[0.05] text-black/70">
            Actif
        </span>
    );
}

/**
 * Get full name of technicien
 */
function getTechnicienName(technicien: Technicien): string {
    const prenom = technicien.prenom || "";
    const nom = technicien.nom || "";
    return `${prenom} ${nom}`.trim() || technicien.email;
}

export function TechnicienTable({
    techniciens,
    onEdit,
    onDelete,
    onResendInvitation,
    businessLabel = "technicien",
    showVehicles = false,
}: TechnicienTableProps) {
    if (techniciens.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 border border-black/[0.08] rounded-lg bg-white">
                <div className="text-center">
                    <div className="text-[16px] font-medium text-black/70 mb-2">
                        Aucun {businessLabel.toLowerCase()}
                    </div>
                    <p className="text-[14px] text-black/40">
                        Commencez par ajouter votre premier {businessLabel.toLowerCase()}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-black/[0.08] rounded-lg overflow-hidden bg-white shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-black/[0.02] hover:bg-black/[0.02]">
                        <TableHead className="text-[13px] font-medium text-black/70">
                            Nom
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/70">
                            Poste
                        </TableHead>
                        {showVehicles && (
                            <TableHead className="text-[13px] font-medium text-black/70">
                                Véhicule
                            </TableHead>
                        )}
                        <TableHead className="text-[13px] font-medium text-black/70">
                            Statut
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/70 text-center">
                            Interventions
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/70 text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {techniciens.map((technicien) => {
                        const isPending = technicien.isPending || technicien.status === "INVITED";

                        return (
                            <TableRow
                                key={technicien.id}
                                className={`hover:bg-black/[0.02] transition-colors ${isPending ? "opacity-70" : ""}`}
                            >
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-[14px] font-medium text-black">
                                            {getTechnicienName(technicien)}
                                        </span>
                                        <div className="flex items-center gap-3 mt-1">
                                            {technicien.email && (
                                                <a
                                                    href={`mailto:${technicien.email}`}
                                                    className="flex items-center gap-1 text-[12px] text-black/40 hover:text-black/70 transition-colors"
                                                >
                                                    <Mail className="h-3 w-3" strokeWidth={2} />
                                                    {technicien.email}
                                                </a>
                                            )}
                                            {technicien.telephone && (
                                                <a
                                                    href={`tel:${technicien.telephone}`}
                                                    className="flex items-center gap-1 text-[12px] text-black/40 hover:text-black/70 transition-colors"
                                                >
                                                    <Phone className="h-3 w-3" strokeWidth={2} />
                                                    {technicien.telephone}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-[14px] text-black/60">
                                    {technicien.poste || "-"}
                                </TableCell>
                                {showVehicles && (
                                    <TableCell>
                                        {technicien.camionnette ? (
                                            <div className="flex items-center gap-2 text-[14px] text-black/60">
                                                <Truck className="h-4 w-4 text-black/40" strokeWidth={2} />
                                                <span>{technicien.camionnette.nom}</span>
                                                <span className="text-black/40">
                                                    ({technicien.camionnette.immatriculation})
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[14px] text-black/40">-</span>
                                        )}
                                    </TableCell>
                                )}
                                <TableCell>
                                    <StatusBadge
                                        status={technicien.status}
                                        isPending={technicien.isPending}
                                    />
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="text-[14px] font-medium text-black">
                                        {technicien.interventionsEnCours || 0}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {isPending && onResendInvitation && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-8 border-black/10 hover:bg-black/5 text-[12px]"
                                                onClick={() => onResendInvitation(technicien)}
                                            >
                                                Renvoyer
                                            </Button>
                                        )}
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 border-black/10 hover:bg-black/5"
                                            onClick={() => onEdit?.(technicien)}
                                        >
                                            <Pencil
                                                className="h-3.5 w-3.5"
                                                strokeWidth={2}
                                            />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 border-black/10 hover:bg-black/5 text-black/60 hover:text-black"
                                            onClick={() => onDelete?.(technicien)}
                                        >
                                            <Trash2
                                                className="h-3.5 w-3.5"
                                                strokeWidth={2}
                                            />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
