"use client";

import { Button } from "@/components/ui/button";
import { PrimaryActionButton } from "@/components/ui/primary-action-button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useCompareSegments, useSegments } from "@/hooks/use-segments";
import { Circle, GitCompare, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SegmentComparisonDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface ComparisonSegmentData {
    id: string;
    nom: string;
    total: number;
    uniqueClients: number;
}

interface ComparisonData {
    segments: [ComparisonSegmentData, ComparisonSegmentData];
    totalOverlap: number;
}

export function SegmentComparisonDialog({
    open,
    onOpenChange,
}: SegmentComparisonDialogProps) {
    const [segmentA, setSegmentA] = useState<string>("");
    const [segmentB, setSegmentB] = useState<string>("");
    const [comparisonData, setComparisonData] = useState<ComparisonData | null>(
        null
    );

    const { data: segmentsData } = useSegments({ actif: true });
    const segments = segmentsData?.data || [];

    const compareSegments = useCompareSegments();

    const handleCompare = async () => {
        if (!segmentA || !segmentB) {
            toast.error("Veuillez sélectionner deux segments");
            return;
        }

        if (segmentA === segmentB) {
            toast.error("Veuillez sélectionner deux segments différents");
            return;
        }

        try {
            const result = await compareSegments.mutateAsync([
                segmentA,
                segmentB,
            ]);
            setComparisonData(result);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Erreur lors de la comparaison";
            toast.error(message);
        }
    };

    const selectedSegmentA = segments.find((s) => s.id === segmentA);
    const selectedSegmentB = segments.find((s) => s.id === segmentB);

    const availableSegmentsB = segments.filter((s) => s.id !== segmentA);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-[20px] font-semibold tracking-[-0.01em]">
                        Comparer des segments
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Segment Selection */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium text-black/80">
                                Premier segment
                            </Label>
                            <Select
                                value={segmentA}
                                onValueChange={setSegmentA}
                            >
                                <SelectTrigger className="h-11 border-black/10 text-[14px]">
                                    <SelectValue placeholder="Sélectionner un segment" />
                                </SelectTrigger>
                                <SelectContent>
                                    {segments.map((segment) => (
                                        <SelectItem
                                            key={segment.id}
                                            value={segment.id}
                                        >
                                            {segment.nom} (
                                            {segment.nombreClients || 0})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium text-black/80">
                                Second segment
                            </Label>
                            <Select
                                value={segmentB}
                                onValueChange={setSegmentB}
                                disabled={!segmentA}
                            >
                                <SelectTrigger className="h-11 border-black/10 text-[14px]">
                                    <SelectValue placeholder="Sélectionner un segment" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableSegmentsB.map((segment) => (
                                        <SelectItem
                                            key={segment.id}
                                            value={segment.id}
                                        >
                                            {segment.nom} (
                                            {segment.nombreClients || 0})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <Button
                        onClick={handleCompare}
                        disabled={
                            !segmentA || !segmentB || compareSegments.isPending
                        }
                        className="w-full bg-slate-700 hover:bg-slate-700/90 text-white h-11 px-6 text-[14px] font-medium rounded-md shadow-sm"
                    >
                        <GitCompare className="h-4 w-4 mr-2" strokeWidth={2} />
                        Comparer
                    </Button>

                    {/* Comparison Results */}
                    {comparisonData && selectedSegmentA && selectedSegmentB && (
                        <div className="space-y-6 pt-4 border-t border-black/10">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                <Card className="border-black/10 shadow-sm">
                                    <CardContent className="p-6 text-center">
                                        <div className="h-12 w-12 rounded-full bg-blue-500/10 mx-auto mb-3 flex items-center justify-center">
                                            <Users
                                                className="h-6 w-6 text-blue-600"
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <p className="text-[13px] text-black/60 mb-1">
                                            Uniquement {selectedSegmentA.nom}
                                        </p>
                                        <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                            {
                                                comparisonData.segments[0]
                                                    .uniqueClients
                                            }
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-black/10 shadow-sm">
                                    <CardContent className="p-6 text-center">
                                        <div className="h-12 w-12 rounded-full bg-purple-500/10 mx-auto mb-3 flex items-center justify-center">
                                            <Circle
                                                className="h-6 w-6 text-purple-600"
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <p className="text-[13px] text-black/60 mb-1">
                                            Chevauchement
                                        </p>
                                        <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                            {comparisonData.totalOverlap}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-black/10 shadow-sm">
                                    <CardContent className="p-6 text-center">
                                        <div className="h-12 w-12 rounded-full bg-green-500/10 mx-auto mb-3 flex items-center justify-center">
                                            <Users
                                                className="h-6 w-6 text-green-600"
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <p className="text-[13px] text-black/60 mb-1">
                                            Uniquement {selectedSegmentB.nom}
                                        </p>
                                        <p className="text-[24px] font-semibold tracking-[-0.02em]">
                                            {
                                                comparisonData.segments[1]
                                                    .uniqueClients
                                            }
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Venn Diagram */}
                            <Card className="border-black/10 shadow-sm">
                                <CardContent className="p-8">
                                    <h3 className="text-[15px] font-medium text-black mb-6 text-center">
                                        Diagramme de Venn
                                    </h3>

                                    <div className="relative h-[300px] flex items-center justify-center">
                                        {/* Left Circle (Segment A) */}
                                        <div className="absolute left-[20%] top-1/2 -translate-y-1/2">
                                            <div className="relative">
                                                <div
                                                    className="w-48 h-48 rounded-full border-4 border-blue-500 bg-blue-500/10"
                                                    style={{ opacity: 0.8 }}
                                                />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <p className="text-[13px] font-medium text-blue-900 mb-1 text-center px-2">
                                                        {selectedSegmentA.nom}
                                                    </p>
                                                    <p className="text-[20px] font-semibold text-blue-900">
                                                        {
                                                            comparisonData
                                                                .segments[0]
                                                                .uniqueClients
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Circle (Segment B) */}
                                        <div className="absolute right-[20%] top-1/2 -translate-y-1/2">
                                            <div className="relative">
                                                <div
                                                    className="w-48 h-48 rounded-full border-4 border-green-500 bg-green-500/10"
                                                    style={{ opacity: 0.8 }}
                                                />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <p className="text-[13px] font-medium text-green-900 mb-1 text-center px-2">
                                                        {selectedSegmentB.nom}
                                                    </p>
                                                    <p className="text-[20px] font-semibold text-green-900">
                                                        {
                                                            comparisonData
                                                                .segments[1]
                                                                .uniqueClients
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Overlap Label (Center) */}
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                            <div className="bg-white border-2 border-purple-500 rounded-lg px-4 py-3 shadow-md">
                                                <p className="text-[11px] text-purple-900 font-medium mb-1 text-center">
                                                    Commun
                                                </p>
                                                <p className="text-[24px] font-semibold text-purple-900 text-center">
                                                    {
                                                        comparisonData.totalOverlap
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Legend */}
                                    <div className="mt-8 flex justify-center gap-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-blue-500" />
                                            <span className="text-[13px] text-black/80">
                                                {selectedSegmentA.nom}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-purple-500" />
                                            <span className="text-[13px] text-black/80">
                                                Chevauchement
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 rounded-full bg-green-500" />
                                            <span className="text-[13px] text-black/80">
                                                {selectedSegmentB.nom}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Detailed Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="border-black/10 shadow-sm">
                                    <CardContent className="p-6">
                                        <h4 className="text-[14px] font-medium text-black mb-4">
                                            {selectedSegmentA.nom}
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[13px] text-black/60">
                                                    Total clients
                                                </span>
                                                <span className="text-[14px] font-medium">
                                                    {
                                                        comparisonData
                                                            .segments[0].total
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[13px] text-black/60">
                                                    Clients uniques
                                                </span>
                                                <span className="text-[14px] font-medium text-blue-600">
                                                    {
                                                        comparisonData
                                                            .segments[0]
                                                            .uniqueClients
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[13px] text-black/60">
                                                    Taux de chevauchement
                                                </span>
                                                <span className="text-[14px] font-medium">
                                                    {comparisonData.segments[0]
                                                        .total > 0
                                                        ? (
                                                              (comparisonData.totalOverlap /
                                                                  comparisonData
                                                                      .segments[0]
                                                                      .total) *
                                                              100
                                                          ).toFixed(1)
                                                        : 0}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-black/10 shadow-sm">
                                    <CardContent className="p-6">
                                        <h4 className="text-[14px] font-medium text-black mb-4">
                                            {selectedSegmentB.nom}
                                        </h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[13px] text-black/60">
                                                    Total clients
                                                </span>
                                                <span className="text-[14px] font-medium">
                                                    {
                                                        comparisonData
                                                            .segments[1].total
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[13px] text-black/60">
                                                    Clients uniques
                                                </span>
                                                <span className="text-[14px] font-medium text-green-600">
                                                    {
                                                        comparisonData
                                                            .segments[1]
                                                            .uniqueClients
                                                    }
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-[13px] text-black/60">
                                                    Taux de chevauchement
                                                </span>
                                                <span className="text-[14px] font-medium">
                                                    {comparisonData.segments[1]
                                                        .total > 0
                                                        ? (
                                                              (comparisonData.totalOverlap /
                                                                  comparisonData
                                                                      .segments[1]
                                                                      .total) *
                                                              100
                                                          ).toFixed(1)
                                                        : 0}
                                                    %
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Insights */}
                            <Card className="border-black/10 shadow-sm bg-black/2">
                                <CardContent className="p-6">
                                    <h4 className="text-[14px] font-medium text-black mb-3">
                                        Insights
                                    </h4>
                                    <div className="space-y-2 text-[13px] text-black/80">
                                        <p>
                                            •{" "}
                                            <strong>
                                                {comparisonData.totalOverlap}
                                            </strong>{" "}
                                            clients sont présents dans les deux
                                            segments
                                        </p>
                                        <p>
                                            •{" "}
                                            <strong>
                                                {
                                                    comparisonData.segments[0]
                                                        .uniqueClients
                                                }
                                            </strong>{" "}
                                            clients sont uniquement dans "
                                            {selectedSegmentA.nom}"
                                        </p>
                                        <p>
                                            •{" "}
                                            <strong>
                                                {
                                                    comparisonData.segments[1]
                                                        .uniqueClients
                                                }
                                            </strong>{" "}
                                            clients sont uniquement dans "
                                            {selectedSegmentB.nom}"
                                        </p>
                                        <p>
                                            •{" "}
                                            <strong>
                                                {comparisonData.segments[0]
                                                    .total +
                                                    comparisonData.segments[1]
                                                        .total -
                                                    comparisonData.totalOverlap}
                                            </strong>{" "}
                                            clients au total dans l&apos;union
                                            des deux segments
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end pt-4 border-t border-black/10">
                    <PrimaryActionButton onClick={() => onOpenChange(false)}>
                        Fermer
                    </PrimaryActionButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}
