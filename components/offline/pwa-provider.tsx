"use client";

import { useEffect } from "react";
import { OnlineStatusIndicator } from "./online-status-indicator";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Enregistrer le service worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);

          // Vérifier les mises à jour du SW
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Nouvelle version disponible
                  console.log('New version available! Reload to update.');

                  // Option: Afficher une notification à l'utilisateur
                  if (confirm('Une nouvelle version est disponible. Recharger maintenant ?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Enregistrer le background sync si supporté
    if ('serviceWorker' in navigator && 'sync' in (self as any).registration) {
      navigator.serviceWorker.ready.then((registration) => {
        // Le background sync sera déclenché automatiquement par le SyncManager
        console.log('Background sync available');
      });
    }
  }, []);

  return (
    <>
      {children}
      <OnlineStatusIndicator />
    </>
  );
}
