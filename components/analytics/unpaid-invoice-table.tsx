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
import { formatCurrency, formatDate } from "@/lib/utils/format";
import type { UnpaidInvoice, UnpaidInvoiceClient } from "@/lib/types/analytics";
import { Mail, ExternalLink } from "lucide-react";
import Link from "next/link";

export interface UnpaidInvoiceTableProps {
    invoices: UnpaidInvoice[];
    onSendReminder?: (invoiceId: string) => void;
}

/**
 * Get formatted client name (prenom + nom or just nom)
 */
function getClientName(client: UnpaidInvoiceClient): string {
    if (client.prenom) {
        return `${client.prenom} ${client.nom}`;
    }
    return client.nom;
}

export function UnpaidInvoiceTable({
    invoices,
    onSendReminder,
}: UnpaidInvoiceTableProps) {

    if (invoices.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 border border-black/8 rounded-lg bg-black/2">
                <div className="text-center">
                    <div className="text-[16px] font-medium text-black/70 mb-2">
                        ✓ Aucune facture impayée
                    </div>
                    <p className="text-[14px] text-black/40">
                        Toutes vos factures sont payées ou annulées
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-black/8 rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-black/2 hover:bg-black/2">
                        <TableHead className="text-[13px] font-medium text-black/60">
                            N° Facture
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/60">
                            Client
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/60">
                            Date émission
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/60">
                            Date échéance
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/60">
                            Jours de retard
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/60 text-right">
                            Reste à payer
                        </TableHead>
                        <TableHead className="text-[13px] font-medium text-black/60 text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {invoices.map((invoice) => (
                        <TableRow
                            key={invoice.id}
                            className="hover:bg-black/2 transition-colors"
                        >
                            <TableCell className="text-[14px] font-medium text-black">
                                <Link
                                    href={`/dashboard/documents/${invoice.id}`}
                                    className="hover:underline"
                                >
                                    {invoice.numero}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-[14px] text-black">
                                        {getClientName(invoice.client)}
                                    </span>
                                    {invoice.client.ville && (
                                        <span className="text-[12px] text-black/40">
                                            {invoice.client.ville}
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-[14px] text-black/60">
                                {formatDate(invoice.dateEmission)}
                            </TableCell>
                            <TableCell className="text-[14px] text-black/60">
                                {formatDate(invoice.dateEcheance)}
                            </TableCell>
                            <TableCell>
                                {invoice.isOverdue ? (
                                    <span className="inline-flex items-center px-2 py-1 rounded text-[12px] font-medium bg-black text-white">
                                        {invoice.daysOverdue} jour{invoice.daysOverdue > 1 ? "s" : ""}
                                    </span>
                                ) : (
                                    <span className="text-[13px] text-black/40">
                                        -
                                    </span>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <span className="text-[14px] font-semibold text-black">
                                    {formatCurrency(invoice.resteAPayer)}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 border-black/10 hover:bg-black/5 text-[13px]"
                                        onClick={() =>
                                            onSendReminder?.(invoice.id)
                                        }
                                        disabled={!invoice.client.email}
                                    >
                                        <Mail
                                            className="h-3.5 w-3.5 mr-1.5"
                                            strokeWidth={2}
                                        />
                                        Relancer
                                    </Button>
                                    <Link
                                        href={`/dashboard/documents/${invoice.id}`}
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-8 border-black/10 hover:bg-black/5"
                                        >
                                            <ExternalLink
                                                className="h-3.5 w-3.5"
                                                strokeWidth={2}
                                            />
                                        </Button>
                                    </Link>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
