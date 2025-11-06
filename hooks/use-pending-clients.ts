import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface PendingClient {
  id: string;
  nom: string;
  prenom: string | null;
  email: string | null;
  telephone: string | null;
  adresse: string | null;
  codePostal: string | null;
  ville: string | null;
  createdAt: string;
}

interface UsePendingClientsReturn {
  clients: PendingClient[];
  count: number;
  isLoading: boolean;
  refetch: () => Promise<void>;
  approve: (clientId: string) => Promise<boolean>;
  reject: (clientId: string) => Promise<boolean>;
}

export function usePendingClients(): UsePendingClientsReturn {
  const [clients, setClients] = useState<PendingClient[]>([]);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/clients/pending");

      if (!res.ok) {
        throw new Error("Failed to fetch pending clients");
      }

      const data = await res.json();
      setClients(data.clients || []);
      setCount(data.count || 0);
    } catch (error) {
      console.error("[usePendingClients] Error:", error);
      toast.error("Erreur lors du chargement des clients en attente");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingClients();
  }, [fetchPendingClients]);

  const approve = useCallback(
    async (clientId: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/admin/clients/${clientId}/approve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ approve: true }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Erreur lors de l'approbation");
          return false;
        }

        toast.success(data.message);

        // Refetch pending clients
        await fetchPendingClients();

        return true;
      } catch (error) {
        console.error("[usePendingClients] Approve error:", error);
        toast.error("Erreur lors de l'approbation");
        return false;
      }
    },
    [fetchPendingClients]
  );

  const reject = useCallback(
    async (clientId: string): Promise<boolean> => {
      if (!confirm("Êtes-vous sûr de vouloir rejeter cette demande ?")) {
        return false;
      }

      try {
        const res = await fetch(`/api/admin/clients/${clientId}/approve`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ approve: false }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Erreur lors du rejet");
          return false;
        }

        toast.success(data.message);

        // Refetch pending clients
        await fetchPendingClients();

        return true;
      } catch (error) {
        console.error("[usePendingClients] Reject error:", error);
        toast.error("Erreur lors du rejet");
        return false;
      }
    },
    [fetchPendingClients]
  );

  return {
    clients,
    count,
    isLoading,
    refetch: fetchPendingClients,
    approve,
    reject,
  };
}
