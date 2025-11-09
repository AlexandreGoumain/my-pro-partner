"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { syncManager } from "@/lib/offline/sync-manager";

export function OnlineStatusIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Initialiser le statut
    setIsOnline(navigator.onLine);

    // Écouter les changements de statut
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync quand on revient online
      handleSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifier le nombre d'éléments en attente
    checkPendingCount();
    const interval = setInterval(checkPendingCount, 5000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const checkPendingCount = async () => {
    try {
      const counts = await syncManager.getPendingCount();
      setPendingCount(counts.total);
    } catch (error) {
      console.error('Error checking pending count:', error);
    }
  };

  const handleSync = async () => {
    if (!isOnline || syncing) return;

    setSyncing(true);
    try {
      await syncManager.syncAll();
      await checkPendingCount();
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (isOnline && pendingCount === 0) {
    return null; // Ne rien afficher si tout est OK
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-white border rounded-lg shadow-lg p-3">
        {isOnline ? (
          <>
            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
              <Wifi className="h-3 w-3 mr-1" />
              En ligne
            </Badge>

            {pendingCount > 0 && (
              <>
                <span className="text-sm text-muted-foreground">
                  {pendingCount} en attente
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleSync}
                  disabled={syncing}
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Sync...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Synchroniser
                    </>
                  )}
                </Button>
              </>
            )}
          </>
        ) : (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
            <WifiOff className="h-3 w-3 mr-1" />
            Hors ligne
          </Badge>
        )}
      </div>
    </div>
  );
}
