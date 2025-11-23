"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { DocumentPipeline } from "@/lib/types/dashboard";
import { FileText, Receipt } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface DocumentPipelineCardProps {
    pipeline: DocumentPipeline;
    className?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

function formatCurrency(value: number): string {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M€`;
    }
    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k€`;
    }
    return `${value.toFixed(0)}€`;
}

// ============================================================================
// Component
// ============================================================================

export function DocumentPipelineCard({ pipeline, className }: DocumentPipelineCardProps) {
    const { quotes, invoices } = pipeline;

    return (
        <Card className={`group relative p-6 overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500 ${className || ""}`}>
            {/* Subtle hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            Pipeline Documents
                        </h3>
                    </div>
                    <p className="text-[13px] text-black/40 ml-3">
                        État des devis et factures
                    </p>
                </div>

            {/* Tabs */}
            <Tabs defaultValue="quotes" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-black/5 p-1 rounded-md h-auto">
                    <TabsTrigger
                        value="quotes"
                        className="text-[13px] data-[state=active]:bg-white data-[state=active]:text-black text-black/60 py-2"
                    >
                        <FileText className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
                        Devis
                    </TabsTrigger>
                    <TabsTrigger
                        value="invoices"
                        className="text-[13px] data-[state=active]:bg-white data-[state=active]:text-black text-black/60 py-2"
                    >
                        <Receipt className="w-3.5 h-3.5 mr-1.5" strokeWidth={2} />
                        Factures
                    </TabsTrigger>
                </TabsList>

                {/* Quotes Tab */}
                <TabsContent value="quotes" className="mt-0">
                    <div className="space-y-3">
                        {/* Total */}
                        <div className="p-4 bg-black/3 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] font-medium text-black">
                                    Total des devis
                                </span>
                                <div className="text-right">
                                    <div className="text-[16px] font-semibold text-black">
                                        {quotes.total}
                                    </div>
                                    <div className="text-[11px] text-black/40">
                                        {formatCurrency(quotes.totalAmount)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status breakdown */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="p-3 bg-black/3 rounded-lg">
                                <div className="text-[11px] text-black/40 mb-1">Brouillon</div>
                                <div className="text-[18px] font-semibold text-black">
                                    {quotes.draft}
                                </div>
                            </div>

                            <div className="p-3 bg-black/3 rounded-lg">
                                <div className="text-[11px] text-black/40 mb-1">Envoyé</div>
                                <div className="text-[18px] font-semibold text-black">
                                    {quotes.sent}
                                </div>
                            </div>

                            <div className="p-3 bg-black/5 rounded-lg">
                                <div className="text-[11px] text-black/40 mb-1">Accepté</div>
                                <div className="text-[18px] font-semibold text-black">
                                    {quotes.accepted}
                                </div>
                            </div>

                            <div className="p-3 bg-black/3 rounded-lg">
                                <div className="text-[11px] text-black/40 mb-1">Refusé</div>
                                <div className="text-[18px] font-semibold text-black/60">
                                    {quotes.rejected}
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>

                {/* Invoices Tab */}
                <TabsContent value="invoices" className="mt-0">
                    <div className="space-y-3">
                        {/* Total */}
                        <div className="p-4 bg-black/3 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-[13px] font-medium text-black">
                                    Total des factures
                                </span>
                                <div className="text-right">
                                    <div className="text-[16px] font-semibold text-black">
                                        {invoices.total}
                                    </div>
                                    <div className="text-[11px] text-black/40">
                                        {formatCurrency(invoices.totalAmount)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status breakdown */}
                        <div className="grid grid-cols-2 gap-2.5">
                            <div className="p-3 bg-black/3 rounded-lg">
                                <div className="text-[11px] text-black/40 mb-1">Brouillon</div>
                                <div className="text-[18px] font-semibold text-black">
                                    {invoices.draft}
                                </div>
                            </div>

                            <div className="p-3 bg-black/3 rounded-lg">
                                <div className="text-[11px] text-black/40 mb-1">Envoyé</div>
                                <div className="text-[18px] font-semibold text-black">
                                    {invoices.sent}
                                </div>
                            </div>

                            <div className="p-3 bg-black/5 rounded-lg">
                                <div className="text-[11px] text-black/40 mb-1">Payé</div>
                                <div className="text-[18px] font-semibold text-black">
                                    {invoices.paid}
                                </div>
                            </div>

                            <div className="p-3 bg-black/3 rounded-lg">
                                <div className="text-[11px] text-black/40 mb-1">En retard</div>
                                <div className="text-[18px] font-semibold text-black/60">
                                    {invoices.overdue}
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
            </div>
        </Card>
    );
}
