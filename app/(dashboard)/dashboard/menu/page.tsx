"use client";

import { MenuCard, MenuDialog, MenuStatsGrid } from "@/components/menu";
import { CardSection } from "@/components/ui/card-section";
import { GridSkeleton } from "@/components/ui/grid-skeleton";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { SearchBar } from "@/components/ui/search-bar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SuspensePage } from "@/components/ui/suspense-page";
import { MENU_CATEGORIES, type MenuCategory } from "@/hooks/use-menu";
import { useMenuPage } from "@/hooks/use-menu-page";
import { ChefHat, Plus } from "lucide-react";

function MenuContent() {
    const {
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        availabilityFilter,
        setAvailabilityFilter,
        menuItems,
        groupedItems,
        isLoading,
        stats,
        handleCreate,
        handleEdit,
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        selectedItem,
        handleCreateSuccess,
        handleEditSuccess,
    } = useMenuPage();

    return (
        <div className="space-y-6">
            {/* Header */}
            <PageHeader
                title="Menu & Carte"
                description="Gérez vos plats, boissons et formules"
                actions={
                    <PrimaryActionButton icon={Plus} onClick={handleCreate}>
                        Nouveau plat
                    </PrimaryActionButton>
                }
            />

            {/* Statistics */}
            <MenuStatsGrid stats={stats} />

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Rechercher un plat..."
                    className="max-w-md"
                />
                <Select
                    value={categoryFilter}
                    onValueChange={(value) =>
                        setCategoryFilter(value as MenuCategory | "all")
                    }
                >
                    <SelectTrigger className="w-[200px] h-11 text-[14px] border-black/10">
                        <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            Toutes les catégories
                        </SelectItem>
                        {MENU_CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                                {cat}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                    value={availabilityFilter}
                    onValueChange={(value) =>
                        setAvailabilityFilter(
                            value as "all" | "available" | "unavailable"
                        )
                    }
                >
                    <SelectTrigger className="w-[200px] h-11 text-[14px] border-black/10">
                        <SelectValue placeholder="Disponibilité" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="available">Disponibles</SelectItem>
                        <SelectItem value="unavailable">
                            Indisponibles
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Menu Items Grid */}
            {isLoading ? (
                <GridSkeleton
                    itemCount={8}
                    gridColumns={{ md: 2, lg: 3 }}
                    gap={4}
                    itemHeight="h-[160px]"
                />
            ) : menuItems.length === 0 ? (
                <CardSection
                    title="Menu"
                    className="border-black/8 shadow-sm"
                    titleClassName="text-[20px] tracking-[-0.02em]"
                >
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-4">
                            <ChefHat className="w-6 h-6 text-black/40" />
                        </div>
                        <p className="text-[14px] text-black/40 mb-4">
                            Aucun plat dans le menu
                        </p>
                        <PrimaryActionButton icon={Plus} onClick={handleCreate}>
                            Ajouter un plat
                        </PrimaryActionButton>
                    </div>
                </CardSection>
            ) : categoryFilter === "all" ? (
                // Show grouped by category
                <div className="space-y-6">
                    {groupedItems.map(([category, items]) => (
                        <CardSection
                            key={category}
                            title={category}
                            className="border-black/8 shadow-sm"
                            titleClassName="text-[20px] tracking-[-0.02em]"
                        >
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {items.map((item) => (
                                    <MenuCard
                                        key={item.id}
                                        item={item}
                                        onEdit={handleEdit}
                                    />
                                ))}
                            </div>
                        </CardSection>
                    ))}
                </div>
            ) : (
                // Show flat list when filtered by category
                <CardSection
                    title={categoryFilter}
                    className="border-black/8 shadow-sm"
                    titleClassName="text-[20px] tracking-[-0.02em]"
                >
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {menuItems.map((item) => (
                            <MenuCard
                                key={item.id}
                                item={item}
                                onEdit={handleEdit}
                            />
                        ))}
                    </div>
                </CardSection>
            )}

            {/* Create Dialog */}
            <MenuDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onSuccess={handleCreateSuccess}
            />

            {/* Edit Dialog */}
            <MenuDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={handleEditSuccess}
                item={selectedItem}
            />
        </div>
    );
}

export default function MenuPage() {
    return (
        <RouteGuard capability="menu">
            <SuspensePage
                skeletonProps={{
                    layout: "stats-grid",
                    statsCount: 4,
                    gridColumns: 3,
                    itemCount: 6,
                    itemHeight: "h-[160px]",
                }}
            >
                <MenuContent />
            </SuspensePage>
        </RouteGuard>
    );
}
