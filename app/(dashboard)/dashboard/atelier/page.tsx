"use client";

import { DemontageDialog } from "@/components/atelier/demontage-dialog";
import { DemontageList } from "@/components/atelier/demontage-list";
import { PiecesStock } from "@/components/atelier/pieces-stock";
import { Button } from "@/components/ui/button";
import { RouteGuard } from "@/components/ui/route-guard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Plus, Wrench } from "lucide-react";
import { useState } from "react";

export default function AtelierPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("demontages");

    return (
        <RouteGuard capability="atelier">
            <div className="space-y-6 p-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
                            Atelier
                        </h1>
                        <p className="text-[14px] text-black/60 mt-1">
                            Démontage d&apos;articles et gestion des pièces
                            détachées
                        </p>
                    </div>
                    <Button
                        onClick={() => setDialogOpen(true)}
                        className="bg-black hover:bg-black/90 text-white h-11"
                    >
                        <Plus className="h-4 w-4 mr-2" strokeWidth={2} />
                        Nouveau démontage
                    </Button>
                </div>

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
                    onSuccess={() => {
                        setDialogOpen(false);
                        // Refresh list
                    }}
                />
            </div>
        </RouteGuard>
    );
}
