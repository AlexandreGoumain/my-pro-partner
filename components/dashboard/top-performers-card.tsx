"use client";

import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TopPerformers } from "@/lib/types/dashboard";
import { Package, User } from "lucide-react";

// ============================================================================
// Types
// ============================================================================

export interface TopPerformersCardProps {
    topPerformers: TopPerformers;
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

export function TopPerformersCard({
    topPerformers,
    className,
}: TopPerformersCardProps) {
    const { clients, products } = topPerformers;

    return (
        <Card
            className={`group relative p-6 overflow-hidden border-black/[0.08] bg-white hover:shadow-lg hover:shadow-black/5 transition-all duration-500 ${className || ""}`}
        >
            {/* Subtle hover effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-1 h-4 bg-gradient-to-b from-black to-black/40 rounded-full" />
                        <h3 className="text-[15px] font-semibold tracking-[-0.02em] text-black">
                            Top Performers
                        </h3>
                    </div>
                    <p className="text-[13px] text-black/40 ml-3">
                        Meilleurs clients et produits
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="clients" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-black/5 p-1 rounded-md h-auto">
                        <TabsTrigger
                            value="clients"
                            className="text-[13px] data-[state=active]:bg-white data-[state=active]:text-black text-black/60 py-2"
                        >
                            <User
                                className="w-3.5 h-3.5 mr-1.5"
                                strokeWidth={2}
                            />
                            Clients
                        </TabsTrigger>
                        <TabsTrigger
                            value="products"
                            className="text-[13px] data-[state=active]:bg-white data-[state=active]:text-black text-black/60 py-2"
                        >
                            <Package
                                className="w-3.5 h-3.5 mr-1.5"
                                strokeWidth={2}
                            />
                            Produits
                        </TabsTrigger>
                    </TabsList>

                    {/* Clients Tab */}
                    <TabsContent value="clients" className="mt-0 space-y-3">
                        {clients.length === 0 ? (
                            <EmptyState title="Aucun client" variant="inline" />
                        ) : (
                            clients.map((client, index) => (
                                <div
                                    key={client.id}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/3 transition-colors duration-200"
                                >
                                    {/* Rank */}
                                    <div
                                        className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-medium ${
                                            index === 0
                                                ? "bg-black text-white"
                                                : index === 1
                                                  ? "bg-black/70 text-white"
                                                  : index === 2
                                                    ? "bg-black/50 text-white"
                                                    : "bg-black/10 text-black/60"
                                        }`}
                                    >
                                        {index + 1}
                                    </div>

                                    {/* Client info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13px] font-medium text-black truncate">
                                            {client.nom}
                                        </div>
                                        <div className="text-[11px] text-black/40">
                                            {client.invoiceCount} facture
                                            {client.invoiceCount > 1 ? "s" : ""}
                                        </div>
                                    </div>

                                    {/* Revenue */}
                                    <div className="text-right">
                                        <div className="text-[14px] font-medium text-black">
                                            {formatCurrency(client.revenue)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </TabsContent>

                    {/* Products Tab */}
                    <TabsContent value="products" className="mt-0 space-y-3">
                        {products.length === 0 ? (
                            <EmptyState
                                title="Aucun produit"
                                variant="inline"
                            />
                        ) : (
                            products.map((product, index) => (
                                <div
                                    key={product.id}
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/3 transition-colors duration-200"
                                >
                                    {/* Rank */}
                                    <div
                                        className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-medium ${
                                            index === 0
                                                ? "bg-black text-white"
                                                : index === 1
                                                  ? "bg-black/70 text-white"
                                                  : index === 2
                                                    ? "bg-black/50 text-white"
                                                    : "bg-black/10 text-black/60"
                                        }`}
                                    >
                                        {index + 1}
                                    </div>

                                    {/* Product info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-[13px] font-medium text-black truncate">
                                            {product.nom}
                                        </div>
                                        <div className="text-[11px] text-black/40">
                                            {product.quantitySold} vendu
                                            {product.quantitySold > 1
                                                ? "s"
                                                : ""}
                                        </div>
                                    </div>

                                    {/* Revenue */}
                                    <div className="text-right">
                                        <div className="text-[14px] font-medium text-black">
                                            {formatCurrency(product.revenue)}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </Card>
    );
}
