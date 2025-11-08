"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Ban, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface BankTransaction {
  id: string;
  date: Date;
  libelle: string;
  montant: number;
  reference: string | null;
  statut: "PENDING" | "MATCHED" | "MANUAL" | "IGNORED" | "ANOMALY";
  notes: string | null;
  document?: {
    id: string;
    numero: string;
    client: {
      nom: string;
    };
  } | null;
}

interface Stats {
  total: number;
  matched: number;
  pending: number;
  anomalies: number;
  matchRate: string;
}

interface Invoice {
  id: string;
  numero: string;
  total_ttc: number;
  client: {
    nom: string;
  };
}

export default function BankReconciliationPage() {
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending">("pending");

  // Match dialog
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<BankTransaction | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [matching, setMatching] = useState(false);

  // Anomaly dialog
  const [anomalyDialogOpen, setAnomalyDialogOpen] = useState(false);
  const [anomalyNotes, setAnomalyNotes] = useState("");
  const [markingAnomaly, setMarkingAnomaly] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);

      const [transactionsRes, statsRes] = await Promise.all([
        fetch(`/api/bank/transactions?status=${filter}`),
        fetch("/api/bank/stats"),
      ]);

      const transactionsData = await transactionsRes.json();
      const statsData = await statsRes.json();

      setTransactions(transactionsData.transactions || []);
      setStats(statsData.stats);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/bank/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success(`${data.imported} transactions importées sur ${data.total}`);
      loadData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors de l'import");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAutoMatch = async () => {
    try {
      const res = await fetch("/api/bank/auto-match", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Matching automatique effectué");
      loadData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors du matching");
    }
  };

  const openMatchDialog = async (transaction: BankTransaction) => {
    setSelectedTransaction(transaction);
    setMatchDialogOpen(true);

    try {
      const res = await fetch("/api/documents?type=FACTURE&statut=ENVOYE&limit=100");
      const data = await res.json();
      setInvoices(data.documents || []);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du chargement des factures");
    }
  };

  const handleManualMatch = async () => {
    if (!selectedTransaction || !selectedInvoice) {
      toast.error("Veuillez sélectionner une facture");
      return;
    }

    try {
      setMatching(true);

      const res = await fetch("/api/bank/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: selectedTransaction.id,
          documentId: selectedInvoice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Transaction rapprochée");
      setMatchDialogOpen(false);
      setSelectedInvoice("");
      loadData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur lors du rapprochement");
    } finally {
      setMatching(false);
    }
  };

  const handleIgnore = async (transactionId: string) => {
    try {
      const res = await fetch(`/api/bank/${transactionId}/ignore`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Transaction ignorée");
      loadData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur");
    }
  };

  const openAnomalyDialog = (transaction: BankTransaction) => {
    setSelectedTransaction(transaction);
    setAnomalyDialogOpen(true);
    setAnomalyNotes("");
  };

  const handleMarkAnomaly = async () => {
    if (!selectedTransaction || !anomalyNotes.trim()) {
      toast.error("Veuillez décrire l'anomalie");
      return;
    }

    try {
      setMarkingAnomaly(true);

      const res = await fetch(`/api/bank/${selectedTransaction.id}/anomaly`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: anomalyNotes }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Transaction marquée comme anomalie");
      setAnomalyDialogOpen(false);
      loadData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Erreur");
    } finally {
      setMarkingAnomaly(false);
    }
  };

  const getStatusBadge = (statut: BankTransaction["statut"]) => {
    const config = {
      PENDING: { icon: AlertCircle, className: "bg-orange-100 text-orange-800 border-orange-200", label: "En attente" },
      MATCHED: { icon: CheckCircle, className: "bg-green-100 text-green-800 border-green-200", label: "Rapproché (auto)" },
      MANUAL: { icon: CheckCircle, className: "bg-blue-100 text-blue-800 border-blue-200", label: "Rapproché (manuel)" },
      IGNORED: { icon: Ban, className: "bg-gray-100 text-gray-800 border-gray-200", label: "Ignoré" },
      ANOMALY: { icon: XCircle, className: "bg-red-100 text-red-800 border-red-200", label: "Anomalie" },
    };

    const { icon: Icon, className, label } = config[statut];

    return (
      <Badge className={className}>
        <Icon className="h-3 w-3 mr-1" />
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
            Rapprochement Bancaire
          </h1>
          <p className="text-[14px] text-black/60 mt-1">
            Importez vos relevés et rapprochez automatiquement vos transactions
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleAutoMatch}
            variant="outline"
            className="border-black/10 hover:bg-black/5"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Matching auto
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="bg-black hover:bg-black/90 text-white h-11 px-6"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Import en cours..." : "Importer CSV"}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5">
          <Card className="p-4 border-black/8">
            <div className="text-[13px] text-black/60 mb-1">Total</div>
            <div className="text-[24px] font-semibold text-black">{stats.total}</div>
          </Card>
          <Card className="p-4 border-black/8">
            <div className="text-[13px] text-black/60 mb-1">Rapprochés</div>
            <div className="text-[24px] font-semibold text-green-600">{stats.matched}</div>
          </Card>
          <Card className="p-4 border-black/8">
            <div className="text-[13px] text-black/60 mb-1">En attente</div>
            <div className="text-[24px] font-semibold text-orange-600">{stats.pending}</div>
          </Card>
          <Card className="p-4 border-black/8">
            <div className="text-[13px] text-black/60 mb-1">Anomalies</div>
            <div className="text-[24px] font-semibold text-red-600">{stats.anomalies}</div>
          </Card>
          <Card className="p-4 border-black/8">
            <div className="text-[13px] text-black/60 mb-1">Taux de matching</div>
            <div className="text-[24px] font-semibold text-black">{stats.matchRate}%</div>
          </Card>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2">
        <Button
          onClick={() => setFilter("pending")}
          variant={filter === "pending" ? "default" : "outline"}
          className={filter === "pending" ? "bg-black hover:bg-black/90" : "border-black/10"}
        >
          En attente
        </Button>
        <Button
          onClick={() => setFilter("all")}
          variant={filter === "all" ? "default" : "outline"}
          className={filter === "all" ? "bg-black hover:bg-black/90" : "border-black/10"}
        >
          Toutes les transactions
        </Button>
      </div>

      {/* Transactions list */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-[14px] text-black/40">Chargement...</p>
        </div>
      ) : transactions.length === 0 ? (
        <Card className="p-12 text-center border-black/8">
          <FileText className="h-12 w-12 text-black/20 mx-auto mb-3" />
          <h3 className="text-[18px] font-semibold text-black mb-2">
            Aucune transaction
          </h3>
          <p className="text-[14px] text-black/60 mb-4">
            Importez votre premier relevé bancaire pour commencer
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            className="bg-black hover:bg-black/90 text-white"
          >
            <Upload className="h-4 w-4 mr-2" />
            Importer CSV
          </Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="p-4 border-black/8 hover:border-black/12 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-[100px]">
                    <div className="text-[13px] font-medium text-black">
                      {format(new Date(transaction.date), "dd MMM yyyy", { locale: fr })}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-black truncate">
                      {transaction.libelle}
                    </div>
                    {transaction.reference && (
                      <div className="text-[12px] text-black/60 font-mono">
                        Réf: {transaction.reference}
                      </div>
                    )}
                    {transaction.document && (
                      <div className="text-[12px] text-black/60">
                        → {transaction.document.numero} ({transaction.document.client.nom})
                      </div>
                    )}
                    {transaction.notes && (
                      <div className="text-[12px] text-red-600 mt-1">
                        {transaction.notes}
                      </div>
                    )}
                  </div>

                  <div className="w-[120px] text-right">
                    <div className={`text-[16px] font-semibold ${
                      Number(transaction.montant) >= 0 ? "text-green-600" : "text-red-600"
                    }`}>
                      {Number(transaction.montant) >= 0 ? "+" : ""}
                      {Number(transaction.montant).toFixed(2)}€
                    </div>
                  </div>

                  <div className="w-[160px]">
                    {getStatusBadge(transaction.statut)}
                  </div>
                </div>

                {transaction.statut === "PENDING" && (
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => openMatchDialog(transaction)}
                      size="sm"
                      variant="outline"
                      className="border-black/10 hover:bg-green-50 hover:text-green-600 hover:border-green-200"
                    >
                      <CheckCircle className="h-3 w-3 mr-2" />
                      Rapprocher
                    </Button>
                    <Button
                      onClick={() => openAnomalyDialog(transaction)}
                      size="sm"
                      variant="outline"
                      className="border-black/10 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    >
                      <AlertCircle className="h-3 w-3 mr-2" />
                      Anomalie
                    </Button>
                    <Button
                      onClick={() => handleIgnore(transaction.id)}
                      size="sm"
                      variant="outline"
                      className="border-black/10 hover:bg-black/5"
                    >
                      <Ban className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Match Dialog */}
      <Dialog open={matchDialogOpen} onOpenChange={setMatchDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rapprocher la transaction</DialogTitle>
            <DialogDescription>
              Sélectionnez la facture correspondante
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4 pt-4">
              <Card className="p-3 bg-black/2 border-black/8">
                <div className="text-[13px] text-black/60 mb-1">Transaction</div>
                <div className="text-[14px] font-medium text-black">
                  {selectedTransaction.libelle}
                </div>
                <div className="text-[16px] font-semibold text-black mt-1">
                  {Number(selectedTransaction.montant).toFixed(2)}€
                </div>
              </Card>

              <div className="space-y-2">
                <Select value={selectedInvoice} onValueChange={setSelectedInvoice}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une facture" />
                  </SelectTrigger>
                  <SelectContent>
                    {invoices.length === 0 ? (
                      <div className="p-2 text-center text-[13px] text-black/40">
                        Aucune facture en attente
                      </div>
                    ) : (
                      invoices.map((invoice) => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.numero} - {invoice.client.nom} - {Number(invoice.total_ttc).toFixed(2)}€
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setMatchDialogOpen(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={matching}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleManualMatch}
                  className="flex-1 bg-black hover:bg-black/90"
                  disabled={matching}
                >
                  {matching ? "Rapprochement..." : "Rapprocher"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Anomaly Dialog */}
      <Dialog open={anomalyDialogOpen} onOpenChange={setAnomalyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marquer comme anomalie</DialogTitle>
            <DialogDescription>
              Décrivez l'anomalie détectée
            </DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-4 pt-4">
              <Card className="p-3 bg-black/2 border-black/8">
                <div className="text-[13px] text-black/60 mb-1">Transaction</div>
                <div className="text-[14px] font-medium text-black">
                  {selectedTransaction.libelle}
                </div>
                <div className="text-[16px] font-semibold text-black mt-1">
                  {Number(selectedTransaction.montant).toFixed(2)}€
                </div>
              </Card>

              <div className="space-y-2">
                <Textarea
                  value={anomalyNotes}
                  onChange={(e) => setAnomalyNotes(e.target.value)}
                  placeholder="Décrivez l'anomalie..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={() => setAnomalyDialogOpen(false)}
                  variant="outline"
                  className="flex-1"
                  disabled={markingAnomaly}
                >
                  Annuler
                </Button>
                <Button
                  onClick={handleMarkAnomaly}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  disabled={markingAnomaly}
                >
                  {markingAnomaly ? "Enregistrement..." : "Marquer"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
