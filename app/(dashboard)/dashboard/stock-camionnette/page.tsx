"use client";

import { Button } from "@/components/ui/button";
import { RouteGuard } from "@/components/ui/route-guard";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { StatCard } from "@/components/ui/stat-card";
import { SearchBar } from "@/components/ui/search-bar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import {
    AlertCircle,
    Package,
    Plus,
    TrendingDown,
    Truck,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Camionnette {
    id: string;
    nom: string;
    immatriculation: string | null;
    marque: string | null;
    actif: boolean;
    plombierPrincipal: {
        name: string | null;
    } | null;
    _count: {
        stock: number;
    };
}

interface StockItem {
    id: string;
    designation: string;
    reference: string | null;
    categorie: string | null;
    quantite: number;
    seuilAlerte: number;
    prixUnitaire: number;
    diametre: string | null;
    materiau: string | null;
    camionnette: {
        nom: string;
    };
}

export default function StockCamionnettePage() {
    const [camionnettes, setCamionnettes] = useState<Camionnette[]>([]);
    const [selectedCamionnette, setSelectedCamionnette] = useState<string>("");
    const [stockItems, setStockItems] = useState<StockItem[]>([]);
    const [lowStockItems, setLowStockItems] = useState<StockItem[]>([]);
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

                {/* Camionnette Selector */}
                <div className="flex gap-3">
                    <Select
                        value={selectedCamionnette}
                        onValueChange={setSelectedCamionnette}
                    >
                        <SelectTrigger className="w-[280px] h-11 border-black/10 bg-white">
                            <div className="flex items-center gap-2">
                                <Truck
                                    className="w-4 h-4 text-black/60"
                                    strokeWidth={2}
                                />
                                <SelectValue placeholder="Sélectionner une camionnette" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {camionnettes.map((camionnette) => (
                                <SelectItem
                                    key={camionnette.id}
                                    value={camionnette.id}
                                >
                                    {camionnette.nom} -{" "}
                                    {camionnette.immatriculation || "N/A"}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        placeholder="Rechercher matériel..."
                        className="flex-1"
                    />

                    <Select
                        value={categorieFilter}
                        onValueChange={setCategorieFilter}
                    >
                        <SelectTrigger className="w-[180px] h-11 border-black/10 bg-white">
                            <SelectValue placeholder="Catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">
                                Toutes catégories
                            </SelectItem>
                            <SelectItem value="VANNE">Vannes</SelectItem>
                            <SelectItem value="TUYAU">Tuyaux</SelectItem>
                            <SelectItem value="JOINT">Joints</SelectItem>
                            <SelectItem value="RACCORD">Raccords</SelectItem>
                            <SelectItem value="SIPHON">Siphons</SelectItem>
                            <SelectItem value="FLEXIBLE">Flexibles</SelectItem>
                            <SelectItem value="AUTRE">Autres</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        onClick={handleSearch}
                        variant="outline"
                        className="h-11 px-6 border-black/10 hover:bg-black/5"
                    >
                        Rechercher
                    </Button>
                </div>

                {/* Camionnette Info */}
                {selectedCamionnetteData && (
                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center">
                                <Truck
                                    className="w-6 h-6 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[16px] font-semibold text-black">
                                    {selectedCamionnetteData.nom}
                                </h3>
                                <p className="text-[13px] text-black/60">
                                    {selectedCamionnetteData.marque || "N/A"} -{" "}
                                    {selectedCamionnetteData.immatriculation ||
                                        "N/A"}
                                </p>
                            </div>
                            {selectedCamionnetteData.plombierPrincipal && (
                                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/5">
                                    <span className="text-[14px]">👤</span>
                                    <span className="text-[13px] font-medium text-black">
                                        {
                                            selectedCamionnetteData
                                                .plombierPrincipal.name
                                        }
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50">
                                <Package
                                    className="w-4 h-4 text-blue-600"
                                    strokeWidth={2}
                                />
                                <span className="text-[14px] font-semibold text-blue-600">
                                    {selectedCamionnetteData._count.stock}{" "}
                                    articles
                                </span>
                            </div>
                        </div>
                    </div>
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
                            <>
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton
                                        key={i}
                                        className="h-[100px] rounded-xl"
                                    />
                                ))}
                            </>
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
                                <div
                                    key={item.id}
                                    className="p-5 rounded-xl bg-white border border-black/8 shadow-sm hover:border-black/20 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-[15px] font-semibold text-black">
                                                    {item.designation}
                                                </h3>
                                                {item.categorie && (
                                                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/5 text-black/60">
                                                        {item.categorie}
                                                    </span>
                                                )}
                                                {item.quantite <=
                                                    item.seuilAlerte && (
                                                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-red-100 text-red-800 border border-red-200">
                                                        Stock bas
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-4 text-[13px] text-black/50">
                                                {item.reference && (
                                                    <span>
                                                        Réf: {item.reference}
                                                    </span>
                                                )}
                                                {item.diametre && (
                                                    <span>
                                                        ⌀ {item.diametre}
                                                    </span>
                                                )}
                                                {item.materiau && (
                                                    <span>{item.materiau}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[24px] font-bold text-black">
                                                    {item.quantite}
                                                </span>
                                                <span className="text-[13px] text-black/40">
                                                    unités
                                                </span>
                                            </div>
                                            <p className="text-[13px] text-black/60">
                                                {Number(
                                                    item.prixUnitaire
                                                ).toFixed(2)}
                                                €/u
                                            </p>
                                        </div>
                                    </div>
                                </div>
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
                                <div
                                    key={item.id}
                                    className="p-5 rounded-xl bg-white border border-red-200 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                                <AlertCircle
                                                    className="w-5 h-5 text-red-600"
                                                    strokeWidth={2}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-[15px] font-semibold text-black mb-1">
                                                    {item.designation}
                                                </h3>
                                                <p className="text-[13px] text-black/60 mb-2">
                                                    {item.camionnette.nom}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[13px] text-black/50">
                                                        Stock:{" "}
                                                        <span className="font-semibold text-red-600">
                                                            {item.quantite}
                                                        </span>
                                                    </span>
                                                    <span className="text-[13px] text-black/30">
                                                        •
                                                    </span>
                                                    <span className="text-[13px] text-black/50">
                                                        Seuil:{" "}
                                                        {item.seuilAlerte}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            className="bg-black hover:bg-black/90 text-white"
                                        >
                                            Réapprovisionner
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </RouteGuard>
    );
}
