import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { StripeReader } from "@/lib/types/pos";

interface RegisterTerminalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    stripeReaders: StripeReader[];
    isLoadingReaders: boolean;
    selectedReader: string;
    onReaderChange: (id: string) => void;
    terminalLabel: string;
    onLabelChange: (label: string) => void;
    terminalLocation: string;
    onLocationChange: (location: string) => void;
    onRegister: () => void;
    registering: boolean;
}

export function RegisterTerminalDialog({
    open,
    onOpenChange,
    stripeReaders,
    isLoadingReaders,
    selectedReader,
    onReaderChange,
    terminalLabel,
    onLabelChange,
    terminalLocation,
    onLocationChange,
    onRegister,
    registering,
}: RegisterTerminalDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Enregistrer un nouveau terminal</DialogTitle>
                    <DialogDescription>
                        Sélectionnez un terminal Stripe et donnez-lui un nom
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label>Terminal Stripe</Label>
                        <Select value={selectedReader} onValueChange={onReaderChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un terminal" />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoadingReaders ? (
                                    <div className="p-2 text-center text-[13px] text-black/40">
                                        Chargement...
                                    </div>
                                ) : stripeReaders.length === 0 ? (
                                    <div className="p-2 text-center text-[13px] text-black/40">
                                        Aucun terminal disponible
                                    </div>
                                ) : (
                                    stripeReaders.map((reader) => (
                                        <SelectItem key={reader.id} value={reader.id}>
                                            {reader.label} ({reader.device_type})
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Nom du terminal</Label>
                        <Input
                            value={terminalLabel}
                            onChange={(e) => onLabelChange(e.target.value)}
                            placeholder="Ex: Caisse principale"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Emplacement (optionnel)</Label>
                        <Input
                            value={terminalLocation}
                            onChange={(e) => onLocationChange(e.target.value)}
                            placeholder="Ex: Boutique Paris 1"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="outline"
                            className="flex-1"
                            disabled={registering}
                        >
                            Annuler
                        </Button>
                        <Button
                            onClick={onRegister}
                            className="flex-1 bg-black hover:bg-black/90"
                            disabled={registering}
                        >
                            {registering ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
