"use client";

import {
    CamionnetteInfoCard,
    LowStockAlertCard,
    StockItemCard,
    type Camionnette,
    type LowStockItem,
    type StockItem,
} from "@/components/stock-camionnette";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterBar } from "@/components/ui/filter-bar";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { StatCard } from "@/components/ui/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Package, Plus, TrendingDown, Truck } from "lucide-react";
import { useEffect, useState } from "react";

export default function StockCamionnettePage() {
    const [camionnettes, setCamionnettes] = useState<Camionnette[]>([]);
    const [selectedCamionnette, setSelectedCamionnette] = useState<string>("");
    const [stockItems, setStockItems] = useState<StockItem[]>([]);
    const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categorieFilter, setCategorieFilter] = useState<string>("ALL");

    useEffect(() => {
        loadCamionnettes();
    }, []);

    useEffect(() => {
        if (selectedCamionnette) {
            loadStock(selectedCamionnette);
        }
    }, [selectedCamionnette, categorieFilter]);

    useEffect(() => {
        loadLowStockAlerts();
    }, []);

    const loadCamionnettes = async () => {
        try {
            const response = await fetch("/api/camionnettes");
            if (!response.ok) throw new Error("Failed to load camionnettes");

            const data = await response.json();
            setCamionnettes(data.camionnettes || []);

            if (data.camionnettes.length > 0 && !selectedCamionnette) {
                setSelectedCamionnette(data.camionnettes[0].id);
            }
        } catch (error) {
            console.error("Error loading camionnettes:", error);
        }
    };

    const loadStock = async (camionnetteId: string) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ camionnetteId });
            if (categorieFilter !== "ALL")
                params.append("categorie", categorieFilter);
            if (searchQuery) params.append("search", searchQuery);

            const response = await fetch(
                `/api/stock-camionnette?${params.toString()}`
            );
            if (!response.ok) throw new Error("Failed to load stock");

            const data = await response.json();
            setStockItems(data.stockItems || []);
        } catch (error) {
            console.error("Error loading stock:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadLowStockAlerts = async () => {
        try {
            const response = await fetch("/api/stock-camionnette/low-stock");
            if (!response.ok) throw new Error("Failed to load alerts");

            const data = await response.json();
            setLowStockItems(data.lowStockItems || []);
        } catch (error) {
            console.error("Error loading low stock alerts:", error);
        }
    };

    const handleSearch = () => {
        if (selectedCamionnette) {
            loadStock(selectedCamionnette);
        }
    };

    const selectedCamionnetteData = camionnettes.find(
        (c) => c.id === selectedCamionnette
    );

    return (
        <RouteGuard capability="stock_camionnette">
            <div className="flex-1 space-y-6 p-6">
                <PageHeader
                    title="Stock Camionnettes"
                    description="Gestion du stock mobile par véhicule"
                    actions={
                        <PrimaryActionButton>
                            <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                            Ajouter matériel
                        </PrimaryActionButton>
                    }
                />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={Truck}
                        label="Camionnettes"
                        value={camionnettes.filter((c) => c.actif).length}
                        description="véhicules actifs"
                    />
                    <StatCard
                        icon={Package}
                        label="Articles total"
                        value={stockItems.length}
                        description="références en stock"
                    />
                    <StatCard
                        icon={AlertCircle}
                        label="Alertes stock bas"
                        value={lowStockItems.length}
                        description="nécessitent réassort"
                    />
                    <StatCard
                        icon={TrendingDown}
                        label="Valeur totale"
                        value={`${stockItems.reduce((sum, item) => sum + item.quantite * Number(item.prixUnitaire), 0).toFixed(0)}€`}
                        description="valeur stock mobile"
                    />
                </div>

                {/* Filters */}
                <FilterBar
                    filters={[
                        {
                            type: "select",
                            value: selectedCamionnette,
                            onChange: setSelectedCamionnette,
                            placeholder: "Sélectionner une camionnette",
                            icon: Truck,
                            options: camionnettes.map((c) => ({
                                value: c.id,
                                label: `${c.nom} - ${c.immatriculation || "N/A"}`,
                            })),
                            className: "w-[280px]",
                        },
                        {
                            type: "search",
                            value: searchQuery,
                            onChange: (value) => {
                                setSearchQuery(value);
                                if (selectedCamionnette) {
                                    // Trigger search after a small delay
                                    setTimeout(() => handleSearch(), 300);
                                }
                            },
                            placeholder: "Rechercher matériel...",
                            className: "flex-1",
                        },
                        {
                            type: "select",
                            value: categorieFilter,
                            onChange: setCategorieFilter,
                            placeholder: "Catégorie",
                            options: [
                                { value: "ALL", label: "Toutes catégories" },
                                { value: "VANNE", label: "Vannes" },
                                { value: "TUYAU", label: "Tuyaux" },
                                { value: "JOINT", label: "Joints" },
                                { value: "RACCORD", label: "Raccords" },
                                { value: "SIPHON", label: "Siphons" },
                                { value: "FLEXIBLE", label: "Flexibles" },
                                { value: "AUTRE", label: "Autres" },
                            ],
                            className: "w-[180px]",
                        },
                        {
                            type: "action",
                            label: "Rechercher",
                            onClick: handleSearch,
                        },
                    ]}
                />

                {/* Camionnette Info */}
                {selectedCamionnetteData && (
                    <CamionnetteInfoCard camionnette={selectedCamionnetteData} />
                )}

                {/* Tabs */}
                <Tabs defaultValue="stock" className="space-y-4">
                    <TabsList className="bg-white border border-black/8 p-1">
                        <TabsTrigger
                            value="stock"
                            className="data-[state=active]:bg-black data-[state=active]:text-white"
                        >
                            Stock ({stockItems.length})
                        </TabsTrigger>
                        <TabsTrigger
                            value="alertes"
                            className="data-[state=active]:bg-black data-[state=active]:text-white"
                        >
                            Alertes ({lowStockItems.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="stock" className="space-y-3">
                        {loading ? (
                            <GridSkeleton
                                itemCount={5}
                                gridColumns={{ default: 1 }}
                                gap={3}
                                itemHeight="h-[100px]"
                            />
                        ) : stockItems.length === 0 ? (
                            <EmptyState
                                icon={Package}
                                title="Aucun matériel"
                                description="Aucun matériel dans cette camionnette"
                                variant="minimal"
                                iconSize="sm"
                                textSize="sm"
                            />
                        ) : (
                            stockItems.map((item) => (
                                <StockItemCard key={item.id} item={item} />
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="alertes" className="space-y-3">
                        {lowStockItems.length === 0 ? (
                            <EmptyState
                                icon={AlertCircle}
                                title="Aucune alerte"
                                description="Aucune alerte stock bas"
                                variant="minimal"
                                iconSize="sm"
                                textSize="sm"
                            />
                        ) : (
                            lowStockItems.map((item) => (
                                <LowStockAlertCard
                                    key={item.id}
                                    item={item}
                                    onReapprovisionner={() => {
                                        // TODO: Implement restock action
                                    }}
                                />
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </RouteGuard>
    );
}
