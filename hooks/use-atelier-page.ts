import { useCallback, useState } from "react";

export interface UseAtelierPageReturn {
    // Dialog
    dialogOpen: boolean;
    setDialogOpen: (open: boolean) => void;
    handleDialogSuccess: () => void;

    // Tabs
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function useAtelierPage(): UseAtelierPageReturn {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("demontages");

    const handleDialogSuccess = useCallback(() => {
        setDialogOpen(false);
    }, []);

    return {
        dialogOpen,
        setDialogOpen,
        handleDialogSuccess,
        activeTab,
        setActiveTab,
    };
}
