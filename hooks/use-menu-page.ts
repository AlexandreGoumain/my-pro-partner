"use client";

import { useMemo, useState } from "react";
import {
    MENU_CATEGORIES,
    useMenu,
    useMenuStats,
    type MenuCategory,
    type MenuItem,
} from "./use-menu";

export function useMenuPage() {
    // State
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<MenuCategory | "all">(
        "all"
    );
    const [availabilityFilter, setAvailabilityFilter] = useState<
        "all" | "available" | "unavailable"
    >("all");
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

    // Queries
    const { data: menuData, isLoading } = useMenu();
    const { data: stats } = useMenuStats();

    // Filter menu items
    const filteredItems = useMemo(() => {
        if (!menuData?.data) return [];

        return menuData.data.filter((item) => {
            // Search filter
            const matchesSearch =
                !searchTerm ||
                item.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());

            // Category filter
            const matchesCategory =
                categoryFilter === "all" || item.categorie === categoryFilter;

            // Availability filter
            const matchesAvailability =
                availabilityFilter === "all" ||
                (availabilityFilter === "available" && item.disponible) ||
                (availabilityFilter === "unavailable" && !item.disponible);

            return matchesSearch && matchesCategory && matchesAvailability;
        });
    }, [menuData?.data, searchTerm, categoryFilter, availabilityFilter]);

    // Group items by category
    const groupedItems = useMemo(() => {
        const groups: Record<MenuCategory, MenuItem[]> = {} as Record<
            MenuCategory,
            MenuItem[]
        >;

        MENU_CATEGORIES.forEach((cat) => {
            groups[cat] = [];
        });

        filteredItems.forEach((item) => {
            if (groups[item.categorie]) {
                groups[item.categorie].push(item);
            }
        });

        // Filter out empty categories
        return Object.entries(groups).filter(
            ([, items]) => items.length > 0
        ) as [MenuCategory, MenuItem[]][];
    }, [filteredItems]);

    // Stats with defaults
    const menuStats = stats || {
        total: 0,
        disponibles: 0,
        indisponibles: 0,
        parCategorie: [],
        prixMoyen: 0,
    };

    // Handlers
    const handleCreate = () => {
        setSelectedItem(null);
        setCreateDialogOpen(true);
    };

    const handleEdit = (item: MenuItem) => {
        setSelectedItem(item);
        setEditDialogOpen(true);
    };

    const handleCreateSuccess = () => {
        setCreateDialogOpen(false);
    };

    const handleEditSuccess = () => {
        setEditDialogOpen(false);
        setSelectedItem(null);
    };

    return {
        // State
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        availabilityFilter,
        setAvailabilityFilter,
        createDialogOpen,
        setCreateDialogOpen,
        editDialogOpen,
        setEditDialogOpen,
        selectedItem,
        setSelectedItem,

        // Data
        menuItems: filteredItems,
        groupedItems,
        isLoading,
        stats: menuStats,
        categories: MENU_CATEGORIES,

        // Handlers
        handleCreate,
        handleEdit,
        handleCreateSuccess,
        handleEditSuccess,
    };
}
