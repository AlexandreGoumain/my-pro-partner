"use client";

import { DemontageDialog } from "@/components/atelier/demontage-dialog";
import { DemontageList } from "@/components/atelier/demontage-list";
import { PiecesStock } from "@/components/atelier/pieces-stock";
import { PageHeader } from "@/components/ui/page-header";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { RouteGuard } from "@/components/ui/route-guard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtelierPage } from "@/hooks/use-atelier-page";
import { Package, Plus, Wrench } from "lucide-react";

export default function AtelierPage() {
    const {
        dialogOpen,
        setDialogOpen,
        handleDialogSuccess,
        activeTab,
        setActiveTab,
    } = useAtelierPage();

    return (
        <RouteGuard capability="atelier">
            <div className="space-y-6 p-8">
                <PageHeader
                    title="Atelier"
                    description="Démontage d'articles et gestion des pièces détachées"
                    actions={
                        <PrimaryActionButton
                            onClick={() => setDialogOpen(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                            Nouveau démontage
                        </PrimaryActionButton>
                    }
                />

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="space-y-6"
                >
                    <TabsList className="bg-black/5 p-1">
                        <TabsTrigger
                            value="demontages"
                            className="data-[state=active]:bg-white data-[state=active]:text-black"
                        >
                            <Wrench className="h-4 w-4 mr-2" strokeWidth={2} />
                            Démontages
                        </TabsTrigger>
                        <TabsTrigger
                            value="pieces"
                            className="data-[state=active]:bg-white data-[state=active]:text-black"
                        >
                            <Package className="h-4 w-4 mr-2" strokeWidth={2} />
                            Stock pièces
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="demontages">
                        <DemontageList />
                    </TabsContent>

                    <TabsContent value="pieces">
                        <PiecesStock />
                    </TabsContent>
                </Tabs>

                <DemontageDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSuccess={handleDialogSuccess}
                />
            </div>
        </RouteGuard>
    );
}
