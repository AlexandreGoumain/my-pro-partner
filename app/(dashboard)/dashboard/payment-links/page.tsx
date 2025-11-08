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
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Link2,
  Eye,
  TrendingUp,
  Copy,
  Edit,
  Trash2,
  BarChart3,
  ExternalLink,
  QrCode,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface PaymentLink {
  id: string;
  slug: string;
  titre: string;
  description: string | null;
  montant: number;
  quantiteMax: number | null;
  dateExpiration: Date | null;
  nombreVues: number;
  nombrePaiements: number;
  montantCollecte: number;
  actif: boolean;
  createdAt: Date;
}

export default function PaymentLinksPage() {
  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState<PaymentLink | null>(null);

  // Form state
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [montant, setMontant] = useState("");
  const [quantiteMax, setQuantiteMax] = useState("");
  const [dateExpiration, setDateExpiration] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadPaymentLinks();
  }, []);

  const loadPaymentLinks = async () => {
    try {
      const res = await fetch("/api/payment-link");
      const data = await res.json();
      setPaymentLinks(data.paymentLinks || []);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des liens");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!titre || !montant) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setCreating(true);

      const res = await fetch("/api/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre,
          description: description || undefined,
          montant: parseFloat(montant),
          quantiteMax: quantiteMax ? parseInt(quantiteMax) : undefined,
          dateExpiration: dateExpiration || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Lien créé avec succès !");
      setCreateDialogOpen(false);
      resetForm();
      loadPaymentLinks();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors de la création");
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (link: PaymentLink) => {
    try {
      const res = await fetch(`/api/payment-link/${link.id}/toggle-active`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success(data.actif ? "Lien activé" : "Lien désactivé");
      loadPaymentLinks();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur");
    }
  };

  const handleDelete = async (link: PaymentLink) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${link.titre}" ?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/payment-link/${link.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Lien supprimé");
      loadPaymentLinks();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur");
    }
  };

  const handleCopyLink = (link: PaymentLink) => {
    const url = `${window.location.origin}/payment-link/${link.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Lien copié !");
  };

  const handleViewStats = async (link: PaymentLink) => {
    setSelectedLink(link);
    setStatsDialogOpen(true);
  };

  const resetForm = () => {
    setTitre("");
    setDescription("");
    setMontant("");
    setQuantiteMax("");
    setDateExpiration("");
  };

  const getTauxConversion = (link: PaymentLink) => {
    if (link.nombreVues === 0) return 0;
    return ((link.nombrePaiements / link.nombreVues) * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-black">
            Liens de Paiement
          </h1>
          <p className="text-[14px] text-black/60 mt-1">
            Créez et partagez des liens de paiement avec vos clients
          </p>
        </div>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-black hover:bg-black/90 text-white h-11 px-6"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau lien
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Créer un lien de paiement</DialogTitle>
              <DialogDescription>
                Créez un lien partageable pour recevoir des paiements
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Titre *</Label>
                <Input
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Ex: Formation React"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description du produit ou service"
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Montant (€) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={montant}
                    onChange={(e) => setMontant(e.target.value)}
                    placeholder="49.99"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quantité max (optionnel)</Label>
                  <Input
                    type="number"
                    value={quantiteMax}
                    onChange={(e) => setQuantiteMax(e.target.value)}
                    placeholder="Ex: 50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Date d'expiration (optionnel)</Label>
                <Input
                  type="datetime-local"
                  value={dateExpiration}
                  onChange={(e) => setDateExpiration(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => {
                    setCreateDialogOpen(false);
                    resetForm();
                  }}
                  variant="outline"
                  className="flex-1"
                  disabled={creating}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleCreate}
                  className="flex-1 bg-black hover:bg-black/90"
                  disabled={creating}
                >
                  {creating ? "Création..." : "Créer le lien"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 border-black/8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-black/5 flex items-center justify-center">
              <Link2 className="h-5 w-5 text-black" />
            </div>
            <div>
              <div className="text-[13px] text-black/60">Total liens</div>
              <div className="text-[24px] font-semibold text-black">
                {paymentLinks.length}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-black/8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-[13px] text-black/60">Vues totales</div>
              <div className="text-[24px] font-semibold text-black">
                {paymentLinks.reduce((sum, link) => sum + link.nombreVues, 0)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-black/8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-[13px] text-black/60">Paiements</div>
              <div className="text-[24px] font-semibold text-black">
                {paymentLinks.reduce((sum, link) => sum + link.nombrePaiements, 0)}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-black/8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-[13px] text-black/60">CA total</div>
              <div className="text-[24px] font-semibold text-black">
                {paymentLinks
                  .reduce((sum, link) => sum + Number(link.montantCollecte), 0)
                  .toFixed(0)}€
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment links list */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-[14px] text-black/40">Chargement...</p>
        </div>
      ) : paymentLinks.length === 0 ? (
        <Card className="p-12 text-center border-black/8">
          <Link2 className="h-12 w-12 text-black/20 mx-auto mb-3" />
          <h3 className="text-[18px] font-semibold text-black mb-2">
            Aucun lien de paiement
          </h3>
          <p className="text-[14px] text-black/60 mb-4">
            Créez votre premier lien pour commencer à accepter des paiements
          </p>
          <Button
            onClick={() => setCreateDialogOpen(true)}
            className="bg-black hover:bg-black/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Créer un lien
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {paymentLinks.map((link) => (
            <Card key={link.id} className="p-4 border-black/8 hover:border-black/12 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[16px] font-semibold text-black truncate">
                      {link.titre}
                    </h3>
                    <Badge
                      variant={link.actif ? "default" : "secondary"}
                      className="shrink-0"
                    >
                      {link.actif ? "Actif" : "Inactif"}
                    </Badge>
                  </div>

                  {link.description && (
                    <p className="text-[13px] text-black/60 mb-3 line-clamp-2">
                      {link.description}
                    </p>
                  )}

                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-[12px] text-black/40">Montant</div>
                      <div className="text-[15px] font-semibold text-black">
                        {Number(link.montant).toFixed(2)}€
                      </div>
                    </div>
                    <div>
                      <div className="text-[12px] text-black/40">Vues</div>
                      <div className="text-[15px] font-semibold text-black">
                        {link.nombreVues}
                      </div>
                    </div>
                    <div>
                      <div className="text-[12px] text-black/40">Paiements</div>
                      <div className="text-[15px] font-semibold text-green-600">
                        {link.nombrePaiements}
                      </div>
                    </div>
                    <div>
                      <div className="text-[12px] text-black/40">Conversion</div>
                      <div className="text-[15px] font-semibold text-black">
                        {getTauxConversion(link)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-[12px] text-black/40">CA</div>
                      <div className="text-[15px] font-semibold text-black">
                        {Number(link.montantCollecte).toFixed(0)}€
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Button
                    onClick={() => handleCopyLink(link)}
                    variant="outline"
                    size="sm"
                    className="border-black/10 hover:bg-black/5"
                    title="Copier le lien"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() =>
                      window.open(`/payment-link/${link.slug}`, "_blank")
                    }
                    variant="outline"
                    size="sm"
                    className="border-black/10 hover:bg-black/5"
                    title="Voir la page"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => handleViewStats(link)}
                    variant="outline"
                    size="sm"
                    className="border-black/10 hover:bg-black/5"
                    title="Statistiques"
                  >
                    <BarChart3 className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => handleToggleActive(link)}
                    variant="outline"
                    size="sm"
                    className="border-black/10 hover:bg-black/5"
                    title={link.actif ? "Désactiver" : "Activer"}
                  >
                    {link.actif ? (
                      <ToggleRight className="h-3 w-3" />
                    ) : (
                      <ToggleLeft className="h-3 w-3" />
                    )}
                  </Button>
                  <Button
                    onClick={() => handleDelete(link)}
                    variant="outline"
                    size="sm"
                    className="border-black/10 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    title="Supprimer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Stats Dialog */}
      <Dialog open={statsDialogOpen} onOpenChange={setStatsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Statistiques</DialogTitle>
            <DialogDescription>
              {selectedLink?.titre}
            </DialogDescription>
          </DialogHeader>

          {selectedLink && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border-black/8">
                  <div className="text-[13px] text-black/60 mb-1">Vues</div>
                  <div className="text-[28px] font-semibold text-black">
                    {selectedLink.nombreVues}
                  </div>
                </Card>
                <Card className="p-4 border-black/8">
                  <div className="text-[13px] text-black/60 mb-1">Paiements</div>
                  <div className="text-[28px] font-semibold text-green-600">
                    {selectedLink.nombrePaiements}
                  </div>
                </Card>
                <Card className="p-4 border-black/8">
                  <div className="text-[13px] text-black/60 mb-1">Taux de conversion</div>
                  <div className="text-[28px] font-semibold text-black">
                    {getTauxConversion(selectedLink)}%
                  </div>
                </Card>
                <Card className="p-4 border-black/8">
                  <div className="text-[13px] text-black/60 mb-1">CA total</div>
                  <div className="text-[28px] font-semibold text-black">
                    {Number(selectedLink.montantCollecte).toFixed(2)}€
                  </div>
                </Card>
              </div>

              <div className="space-y-2">
                <Label>Lien public</Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/payment-link/${selectedLink.slug}`}
                    className="font-mono text-[12px]"
                  />
                  <Button
                    onClick={() => handleCopyLink(selectedLink)}
                    variant="outline"
                    className="shrink-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <Button
                  onClick={() =>
                    window.open(`/payment-link/${selectedLink.slug}`, "_blank")
                  }
                  className="bg-black hover:bg-black/90"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Voir la page publique
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
