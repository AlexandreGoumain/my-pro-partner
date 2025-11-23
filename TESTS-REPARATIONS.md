# Guide de Test - Système de Notifications Réparations

## ✅ Code vérifié
- **TypeScript** : Aucune erreur dans les nouveaux fichiers
- **Syntaxe** : Tous les fichiers sont valides
- **Imports** : Toutes les dépendances sont correctes

---

## 🧪 Tests à Effectuer

### **Prérequis**
1. Serveur de dev lancé : `npm run dev`
2. Base de données accessible
3. Compte avec business type "INFORMATIQUE"
4. Au moins un client avec email valide dans la DB

---

### **TEST 1 : Notification de Dépôt** 📥

#### Étapes :
1. Aller sur `/dashboard/reparations`
2. Cliquer sur "Nouvelle réparation"
3. Remplir le formulaire :
   - Sélectionner un client avec email
   - Type d'appareil : Smartphone
   - Marque : Apple
   - Modèle : iPhone 13
   - Problème : Écran cassé
4. Créer la réparation

#### ✅ Résultats attendus :
- ✉️ Email envoyé au client avec :
  - Numéro de réparation
  - Détails de l'appareil
  - Description du problème
- 🔔 Notification in-app créée pour le client
- 📝 Vérifier les logs console : `[Email Service] Email sent to...`

---

### **TEST 2 : Notification de Diagnostic** 🔍

#### Étapes :
1. Ouvrir une réparation en statut "DEPOSE"
2. Soumettre un diagnostic via l'API ou le formulaire
   - Diagnostic : "Remplacement écran nécessaire"
   - Devis estimé : 150€
   - Délai : 48h

#### ✅ Résultats attendus :
- ✉️ Email envoyé avec :
  - Diagnostic détaillé
  - Coût estimé : 150€
  - Délai : 48h
- 🔔 Notification in-app : "Diagnostic terminé"

---

### **TEST 3 : Changement de Statut avec Bouton** 🔄

#### Étapes :
1. Ouvrir une réparation
2. Cliquer sur **"Changer le statut"** (nouveau bouton en haut à droite)
3. Le dialog s'ouvre avec :
   - Liste des statuts possibles
   - Descriptions pour chaque statut
   - Champ notes (optionnel)
4. Changer vers "PRETE"
5. Valider

#### ✅ Résultats attendus :
- ✉️ Email "Votre appareil est prêt !"
- 🔔 Notification in-app
- 📊 Timeline mise à jour avec badge "Email envoyé"
- ⚡ Toast de confirmation
- 🔄 Statut mis à jour immédiatement

---

### **TEST 4 : Timeline Améliorée** 📅

#### Étapes :
1. Ouvrir une réparation qui a plusieurs changements de statut
2. Scroller jusqu'à la section "Historique"

#### ✅ Résultats attendus :
- 📍 Points de timeline noirs pour les changements de statut
- 📍 Points gris pour l'historique normal
- 🔔 Badge "Email envoyé" sur les statuts DEPOSE, PRETE, LIVREE
- 👤 Nom de l'utilisateur qui a fait le changement
- 📅 Dates formatées en français

---

### **TEST 5 : Notification de Livraison** ✅

#### Étapes :
1. Changer le statut d'une réparation vers "LIVREE"

#### ✅ Résultats attendus :
- ✉️ Email de remerciement avec :
  - Garantie de 30 jours
  - Lien vers feedback (optionnel)
- 🔔 Notification in-app
- 📊 Date de retour réelle enregistrée

---

### **TEST 6 : Validation des Transitions** 🚫

#### Étapes :
1. Ouvrir une réparation en statut "LIVREE"
2. Cliquer sur "Changer le statut"

#### ✅ Résultats attendus :
- ⚠️ Message : "Aucune transition possible depuis ce statut"
- 🔒 Bouton "Mettre à jour" désactivé

---

### **TEST 7 : Sans Email** ⚠️

#### Étapes :
1. Créer ou modifier un client SANS email
2. Créer une réparation pour ce client
3. Changer le statut

#### ✅ Résultats attendus :
- ⚠️ Log console : `Client has no email, skipping notification`
- 🔔 Notification in-app créée quand même
- ✅ Pas d'erreur, le processus continue

---

### **TEST 8 : Resend Non Configuré** 🔧

#### Étapes :
1. Retirer temporairement `RESEND_API_KEY` du `.env`
2. Redémarrer le serveur
3. Créer une réparation ou changer un statut

#### ✅ Résultats attendus :
- ⚠️ Log console : `Email will be logged to console only`
- 📝 Contenu de l'email affiché dans la console
- ✅ Pas d'erreur, le processus continue

---

## 🎨 Tests Visuels

### **Design Apple-Style** 🍎
- [ ] Timeline : ligne verticale subtile grise
- [ ] Badges : coins arrondis, couleurs sobres
- [ ] Bouton : outline avec hover gris clair
- [ ] Dialog : spacing généreux, typographie précise
- [ ] Email : design minimaliste noir/blanc/gris

### **Responsive** 📱
- [ ] Dialog s'affiche bien sur mobile
- [ ] Timeline lisible sur petit écran
- [ ] Bouton "Changer statut" accessible

---

## 🐛 Scénarios d'Erreur

### **Erreur Réseau**
1. Couper Resend temporairement
2. Vérifier que l'app ne crash pas
3. Vérifier logs d'erreur

### **Données Invalides**
1. Essayer de passer un statut invalide via API directement
2. Vérifier message d'erreur : "Transition de statut invalide"

---

## 📊 Checklist Complète

### Backend
- [ ] Email de dépôt envoyé (API POST /reparations)
- [ ] Email de diagnostic envoyé (API POST /reparations/:id/diagnostic)
- [ ] Email "prêt" envoyé (statut → PRETE)
- [ ] Email livraison envoyé (statut → LIVREE)
- [ ] Notifications in-app créées
- [ ] Logs historique créés

### Frontend
- [ ] Bouton "Changer statut" visible
- [ ] Dialog s'ouvre correctement
- [ ] Liste des statuts valides uniquement
- [ ] Notes optionnelles fonctionnent
- [ ] Timeline affiche status + historique
- [ ] Badge "Email envoyé" visible
- [ ] Toast de confirmation affiché
- [ ] Refresh automatique des données

### UX
- [ ] Design sobre et élégant
- [ ] Animations fluides (200-300ms)
- [ ] Aucun flash de contenu
- [ ] Messages d'erreur clairs
- [ ] Loading states visibles

---

## 🔍 Vérifications Base de Données

### Après chaque test, vérifier :

```sql
-- Vérifier les notifications créées
SELECT * FROM ClientNotification
WHERE clientId = 'xxx'
ORDER BY createdAt DESC;

-- Vérifier l'historique
SELECT * FROM ReparationHistorique
WHERE reparationId = 'xxx'
ORDER BY createdAt DESC;

-- Vérifier les status change logs
SELECT statutChangeLogs FROM Reparation WHERE id = 'xxx';
```

---

## 📧 Exemple d'Email à Recevoir

```
De : [RESEND_FROM_NAME] <[RESEND_FROM_EMAIL]>
À : client@example.com
Sujet : Réparation REP-001 - Dépôt confirmé

[Design Apple-style avec logo en haut]

Votre appareil est bien enregistré

Bonjour Jean Dupont,

Nous avons bien réceptionné votre Apple iPhone 13 et allons
procéder au diagnostic dans les plus brefs délais.

[Boîte d'infos avec fond gris clair]
Numéro de réparation : REP-001
Type d'appareil : Smartphone
Problème signalé : Écran cassé

Vous serez informé par email dès que le diagnostic sera terminé...
```

---

## ✅ Validation Finale

Une fois tous les tests passés :

1. ✅ Les emails sont bien formatés et élégants
2. ✅ Les clients sont notifiés à chaque étape importante
3. ✅ L'historique est complet et lisible
4. ✅ Le changement de statut est rapide (2 clics)
5. ✅ Aucune régression sur les fonctionnalités existantes
6. ✅ Le code suit les guidelines Apple-style
7. ✅ Les erreurs sont gérées gracieusement

---

## 🚀 Prêt pour la Production

Une fois validé :
- Configurer Resend avec un domaine vérifié
- Personnaliser les templates d'emails (logo, couleurs)
- Ajuster les durées de garantie
- Configurer les horaires du magasin
- Activer/désactiver les notifications par type

---

**Bon test ! 🎉**
