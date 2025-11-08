"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus, RefreshCw, Trash2, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Terminal {
  id: string;
  stripeTerminalId: string;
  label: string;
  location: string | null;
  status: "ONLINE" | "OFFLINE" | "BUSY" | "ERROR";
  device_type: string | null;
  serial_number: string | null;
  ip_address: string | null;
  lastSyncAt: Date;
  lastUsedAt: Date | null;
}

interface StripeReader {
  id: string;
  label: string;
  device_type: string;
  status: string;
  ip_address?: string;
  serial_number?: string;
}

export default function TerminalsPage() {
  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [stripeReaders, setStripeReaders] = useState<StripeReader[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReaders, setLoadingReaders] = useState(false);
  const [registerDialogOpen, setRegisterDialogOpen] = useState(false);

  // Form state
  const [selectedReader, setSelectedReader] = useState("");
  const [terminalLabel, setTerminalLabel] = useState("");
  const [terminalLocation, setTerminalLocation] = useState("");
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    loadTerminals();
  }, []);

  const loadTerminals = async () => {
    try {
      const res = await fetch("/api/terminal");
      const data = await res.json();
      setTerminals(data.terminals || []);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des terminaux");
    } finally {
      setLoading(false);
    }
  };

  const loadStripeReaders = async () => {
    try {
      setLoadingReaders(true);
      const res = await fetch("/api/terminal/list-stripe");
      const data = await res.json();
      setStripeReaders(data.terminals || []);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des terminaux Stripe");
    } finally {
      setLoadingReaders(false);
    }
  };

  const handleRegisterTerminal = async () => {
    if (!selectedReader || !terminalLabel) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setRegistering(true);

      const res = await fetch("/api/terminal/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stripeTerminalId: selectedReader,
          label: terminalLabel,
          location: terminalLocation || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Terminal enregistré avec succès");
      setRegisterDialogOpen(false);
      setSelectedReader("");
      setTerminalLabel("");
      setTerminalLocation("");
      loadTerminals();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setRegistering(false);
    }
  };

  const handleSyncTerminal = async (terminalId: string) => {
    try {
      const res = await fetch(`/api/terminal/${terminalId}/sync`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Terminal synchronisé");
      loadTerminals();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors de la synchronisation");
    }
  };

  const handleDeleteTerminal = async (terminalId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce terminal ?")) {
      return;
    }

    try {
      const res = await fetch(`/api/terminal/${terminalId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Terminal supprimé");
      loadTerminals();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const getStatusBadge = (status: Terminal["status"]) => {
    const config = {
      ONLINE: { icon: Wifi, variant: "default" as const, label: "En ligne" },
      OFFLINE: { icon: WifiOff, variant: "secondary" as const, label: "Hors ligne" },
      BUSY: { icon: RefreshCw, variant: "default" as const, label: "Occupé" },
      ERROR: { icon: AlertCircle, variant: "destructive" as const, label: "Erreur" },
    };

    const { icon: Icon, variant, label } = config[status];

    return (
      <Badge variant={variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
            Terminaux de Paiement
          </h1>
          <p className="text-[14px] text-black/60 mt-1">
            Gérez vos terminaux physiques Stripe Terminal
          </p>
        </div>

        <Dialog open={registerDialogOpen} onOpenChange={setRegisterDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setRegisterDialogOpen(true);
                loadStripeReaders();
              }}
              className="bg-black hover:bg-black/90 text-white h-11 px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Enregistrer un terminal
            </Button>
          </DialogTrigger>
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
                <Select value={selectedReader} onValueChange={setSelectedReader}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un terminal" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingReaders ? (
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
                  onChange={(e) => setTerminalLabel(e.target.value)}
                  placeholder="Ex: Caisse principale"
                />
              </div>

              <div className="space-y-2">
                <Label>Emplacement (optionnel)</Label>
                <Input
                  value={terminalLocation}
                  onChange={(e) => setTerminalLocation(e.target.value)}
                  placeholder="Ex: Boutique Paris 1"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setRegisterDialogOpen(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={registering}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleRegisterTerminal}
                  className="flex-1 bg-black hover:bg-black/90"
                  disabled={registering}
                >
                  {registering ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Terminals list */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-[14px] text-black/40">Chargement...</p>
        </div>
      ) : terminals.length === 0 ? (
        <Card className="p-12 text-center border-black/8">
          <WifiOff className="h-12 w-12 text-black/20 mx-auto mb-3" />
          <h3 className="text-[18px] font-semibold text-black mb-2">
            Aucun terminal enregistré
          </h3>
          <p className="text-[14px] text-black/60 mb-4">
            Enregistrez votre premier terminal Stripe pour commencer
          </p>
          <Button
            onClick={() => {
              setRegisterDialogOpen(true);
              loadStripeReaders();
            }}
            className="bg-black hover:bg-black/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Enregistrer un terminal
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {terminals.map((terminal) => (
            <Card key={terminal.id} className="p-6 border-black/8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-[16px] font-semibold text-black mb-1">
                    {terminal.label}
                  </h3>
                  {terminal.location && (
                    <p className="text-[13px] text-black/60">
                      {terminal.location}
                    </p>
                  )}
                </div>
                {getStatusBadge(terminal.status)}
              </div>

              <div className="space-y-2 mb-4">
                {terminal.device_type && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-black/60">Type</span>
                    <span className="text-black font-medium">
                      {terminal.device_type}
                    </span>
                  </div>
                )}
                {terminal.serial_number && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-black/60">Série</span>
                    <span className="text-black font-medium font-mono text-[12px]">
                      {terminal.serial_number}
                    </span>
                  </div>
                )}
                {terminal.ip_address && (
                  <div className="flex justify-between text-[13px]">
                    <span className="text-black/60">IP</span>
                    <span className="text-black font-medium font-mono text-[12px]">
                      {terminal.ip_address}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleSyncTerminal(terminal.id)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-black/10 hover:bg-black/5"
                >
                  <RefreshCw className="h-3 w-3 mr-2" />
                  Sync
                </Button>
                <Button
                  onClick={() => handleDeleteTerminal(terminal.id)}
                  variant="outline"
                  size="sm"
                  className="border-black/10 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
