"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RouteGuard } from "@/components/ui/route-guard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertCircle,
    Package,
    Plus,
    Search,
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
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                            Stock Camionnettes
                        </h1>
                        <p className="text-[14px] text-black/40 mt-1">
                            Gestion du stock mobile par véhicule
                        </p>
                    </div>
                    <Button className="bg-black hover:bg-black/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm">
                        <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                        Ajouter matériel
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                Camionnettes
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-black/5 flex items-center justify-center">
                                <Truck
                                    className="w-4 h-4 text-black/60"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {camionnettes.filter((c) => c.actif).length}
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            véhicules actifs
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                Articles total
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <Package
                                    className="w-4 h-4 text-blue-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {stockItems.length}
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            références en stock
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                Alertes stock bas
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                <AlertCircle
                                    className="w-4 h-4 text-red-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {lowStockItems.length}
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            nécessitent réassort
                        </p>
                    </div>

                    <div className="p-5 rounded-xl bg-white border border-black/8 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[12px] font-medium text-black/40 uppercase tracking-wide">
                                Valeur totale
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <TrendingDown
                                    className="w-4 h-4 text-green-600"
                                    strokeWidth={2}
                                />
                            </div>
                        </div>
                        <p className="text-[32px] font-bold text-black tracking-tight">
                            {stockItems
                                .reduce(
                                    (sum, item) =>
                                        sum +
                                        item.quantite *
                                            Number(item.prixUnitaire),
                                    0
                                )
                                .toFixed(0)}
                            €
                        </p>
                        <p className="text-[12px] text-black/40 mt-1">
                            valeur stock mobile
                        </p>
                    </div>
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

                    <div className="relative flex-1">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40"
                            strokeWidth={2}
                        />
                        <Input
                            placeholder="Rechercher matériel..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSearch()
                            }
                            className="pl-9 h-11 border-black/10 bg-white"
                        />
                    </div>

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
                            <div className="text-center py-12">
                                <p className="text-[14px] text-black/40">
                                    Aucun matériel dans cette camionnette
                                </p>
                            </div>
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
                            <div className="text-center py-12">
                                <p className="text-[14px] text-black/40">
                                    Aucune alerte stock bas
                                </p>
                            </div>
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
