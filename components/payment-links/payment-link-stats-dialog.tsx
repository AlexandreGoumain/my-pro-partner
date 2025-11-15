import type { PaymentLink } from "@/lib/types/payment-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, ExternalLink } from "lucide-react";

export interface PaymentLinkStatsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    link: PaymentLink | null;
    onCopyLink: (link: PaymentLink) => void;
    getTauxConversion: (link: PaymentLink) => string;
}

export function PaymentLinkStatsDialog({
    open,
    onOpenChange,
    link,
    onCopyLink,
    getTauxConversion,
}: PaymentLinkStatsDialogProps) {
    if (!link) return null;

    const linkUrl = `${window.location.origin}/payment-link/${link.slug}`;

    const handleOpenPage = () => {
        window.open(`/payment-link/${link.slug}`, "_blank");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Statistiques</DialogTitle>
                    <DialogDescription>{link.titre}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-4 border-black/8">
                            <div className="text-[13px] text-black/60 mb-1">
                                Vues
                            </div>
                            <div className="text-[28px] font-semibold text-black">
                                {link.nombreVues}
                            </div>
                        </Card>
                        <Card className="p-4 border-black/8">
                            <div className="text-[13px] text-black/60 mb-1">
                                Paiements
                            </div>
                            <div className="text-[28px] font-semibold text-green-600">
                                {link.nombrePaiements}
                            </div>
                        </Card>
                        <Card className="p-4 border-black/8">
                            <div className="text-[13px] text-black/60 mb-1">
                                Taux de conversion
                            </div>
                            <div className="text-[28px] font-semibold text-black">
                                {getTauxConversion(link)}%
                            </div>
                        </Card>
                        <Card className="p-4 border-black/8">
                            <div className="text-[13px] text-black/60 mb-1">
                                CA total
                            </div>
                            <div className="text-[28px] font-semibold text-black">
                                {Number(link.montantCollecte).toFixed(2)}€
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-2">
                        <Label>Lien public</Label>
                        <div className="flex gap-2">
                            <Input
                                readOnly
                                value={linkUrl}
                                className="font-mono text-[12px]"
                            />
                            <Button
                                onClick={() => onCopyLink(link)}
                                variant="outline"
                                className="shrink-0"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="text-center">
                        <Button
                            onClick={handleOpenPage}
                            className="bg-black hover:bg-black/90"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Voir la page publique
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
