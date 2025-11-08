# 🎯 Prochaines Étapes - Guide Post-Installation

Votre système de paiement complet est maintenant installé ! Voici les étapes pour le mettre en production.

---

## ✅ Étape 1 : Installation des Dépendances

```bash
# Installer les dépendances npm manquantes
npm install qrcode csv-parse date-fns
npm install -D @types/qrcode

# Vérifier l'installation
node check-installation.js
```

---

## ⚙️ Étape 2 : Configuration Stripe

### A. Créer les produits sur Stripe

1. **Connectez-vous** sur https://dashboard.stripe.com/test/products
2. **Créez 3 produits** :

#### Produit STARTER
- Nom : "Plan Starter"
- Prix mensuel : 29€/mois (récurrent)
  - → Copier le Price ID dans `STRIPE_PRICE_STARTER_MONTHLY`
- Prix annuel : 290€/an (récurrent, 12 mois)
  - → Copier le Price ID dans `STRIPE_PRICE_STARTER_ANNUAL`

#### Produit PRO
- Nom : "Plan Pro"
- Prix mensuel : 79€/mois (récurrent)
  - → Copier le Price ID dans `STRIPE_PRICE_PRO_MONTHLY`
- Prix annuel : 790€/an (récurrent, 12 mois)
  - → Copier le Price ID dans `STRIPE_PRICE_PRO_ANNUAL`

#### Produit ENTERPRISE
- Nom : "Plan Enterprise"
- Prix mensuel : 299€/mois (récurrent)
  - → Copier le Price ID dans `STRIPE_PRICE_ENTERPRISE_MONTHLY`
- Prix annuel : 2990€/an (récurrent, 12 mois)
  - → Copier le Price ID dans `STRIPE_PRICE_ENTERPRISE_ANNUAL`

### B. Configurer le Webhook

1. Allez sur https://dashboard.stripe.com/test/webhooks
2. Cliquez sur "Ajouter un endpoint"
3. URL : `https://votre-domaine.com/api/webhooks/stripe`
4. Sélectionnez les événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `payment_intent.succeeded`
5. Copiez le "Signing secret" → `STRIPE_WEBHOOK_SECRET`

### C. Configuration locale (développement)

Pour tester les webhooks en local :

```bash
# Installer Stripe CLI
# Mac: brew install stripe/stripe-cli/stripe
# Windows: scoop install stripe

# Se connecter
stripe login

# Rediriger les webhooks vers localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 🗄️ Étape 3 : Base de Données

```bash
# Appliquer le schéma Prisma
npx prisma db push

# Générer le client Prisma
npx prisma generate

# (Optionnel) Ouvrir Prisma Studio pour explorer la BDD
npx prisma studio
```

---

## 🚀 Étape 4 : Démarrer l'Application

```bash
# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur http://localhost:3000

---

## 🧪 Étape 5 : Tests de Validation

### Test 1 : Abonnement ✅

1. Ouvrez http://localhost:3000/pricing
2. Cliquez sur "Commencer l'essai" (plan STARTER)
3. Remplissez le formulaire avec :
   - Email : test@example.com
   - Carte : `4242 4242 4242 4242`
   - Date : n'importe quelle date future
   - CVC : 123
4. Validez et vérifiez la redirection vers `/pricing/success`
5. Vérifiez dans Prisma Studio que l'abonnement est créé

### Test 2 : Point of Sale (POS) ✅

1. Ouvrez http://localhost:3000/dashboard/pos
2. Recherchez un article
3. Ajoutez-le au panier (cliquez dessus)
4. Ajustez la quantité avec +/-
5. Cliquez sur "Payer par carte"
6. Vérifiez que :
   - La facture est créée
   - Le ticket s'ouvre automatiquement
   - Les stocks sont mis à jour

### Test 3 : Rapprochement Bancaire ✅

1. Créez un fichier `test-bank.csv` :
   ```csv
   Date;Libellé;Montant;Référence
   15/01/2025;Virement client ABC;1250.50;REF123
   16/01/2025;Paiement fournisseur;-450.00;
   17/01/2025;Vente boutique;89.90;FACT-2025-00001
   ```

2. Ouvrez http://localhost:3000/dashboard/bank-reconciliation
3. Cliquez sur "Importer CSV"
4. Sélectionnez le fichier
5. Vérifiez l'import des 3 transactions
6. Cliquez sur "Matching auto"
7. Testez le rapprochement manuel

### Test 4 : Liens de Paiement ✅

1. Créez une facture depuis `/dashboard/documents`
2. Testez l'API pour créer un lien de paiement :
   ```bash
   curl -X POST http://localhost:3000/api/payment-link \
     -H "Content-Type: application/json" \
     -d '{
       "titre": "Formation React",
       "montant": 499.00,
       "description": "Formation complète React.js"
     }'
   ```
3. Récupérez le `slug` dans la réponse
4. Ouvrez `http://localhost:3000/payment-link/[slug]`
5. Testez le paiement

### Test 5 : Terminaux (optionnel) ⚠️

**Nécessite un terminal Stripe physique**

1. Ouvrez http://localhost:3000/dashboard/terminals
2. Cliquez sur "Enregistrer un terminal"
3. Si vous avez un terminal configuré sur Stripe, il apparaîtra
4. Enregistrez-le et testez la synchronisation

---

## 📊 Étape 6 : Vérifier les Statistiques

Visitez ces pages pour vérifier que tout fonctionne :

- `/pricing` - Page de tarification
- `/dashboard/pos` - Interface POS
- `/dashboard/terminals` - Terminaux
- `/dashboard/bank-reconciliation` - Rapprochement bancaire

---

## 🔄 Étape 7 : Webhooks en Production

Quand vous déployez en production :

1. **Créer un nouveau webhook** sur Stripe avec l'URL de production
2. **Remplacer** `STRIPE_WEBHOOK_SECRET` dans les variables d'environnement de production
3. **Tester** avec une vraie transaction

---

## 🌐 Étape 8 : Déploiement

### Option A : Vercel (recommandé)

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement sur Vercel Dashboard
# Project Settings > Environment Variables
```

### Option B : Railway, Render, ou autre

1. Connectez votre repo GitHub
2. Configurez les variables d'environnement
3. Déployez

**Important :** N'oubliez pas de :
- Configurer `DATABASE_URL` pour la production
- Remplacer les clés Stripe test par les clés live
- Reconfigurer le webhook avec l'URL de production

---

## 📈 Étape 9 : Monitoring

### Stripe Dashboard

Surveillez :
- Les abonnements actifs
- Les paiements réussis/échoués
- Les webhooks (vérifier qu'ils sont bien reçus)

### Prisma Studio

```bash
npx prisma studio
```

Surveillez :
- Les subscriptions
- Les transactions bancaires
- Les mouvements de stock

### Logs

Surveillez les logs serveur pour :
- Erreurs de webhook
- Erreurs de paiement
- Erreurs d'import CSV

---

## 🎯 Étape 10 : Fonctionnalités Avancées (Optionnel)

### A. Configurer les Notifications Email

Utilisez Resend, SendGrid ou votre service préféré pour envoyer :
- Confirmation d'abonnement
- Alerte avant fin d'essai
- Notification de paiement échoué
- Récapitulatif des ventes

### B. Analytics Avancés

Ajoutez des graphiques pour :
- Évolution du CA
- Taux de conversion des liens de paiement
- Statistiques d'utilisation des terminaux

### C. Export Comptable

Implémentez l'export :
- Format FEC (Fichier des Écritures Comptables)
- CSV pour Excel
- JSON pour intégrations tierces

---

## 🐛 Problèmes Courants

### Les webhooks ne fonctionnent pas

**Solution :**
```bash
# Vérifiez que Stripe CLI est actif
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Vérifiez les logs
stripe logs tail
```

### Erreur "Module not found"

**Solution :**
```bash
npm install qrcode csv-parse date-fns
npm install -D @types/qrcode
```

### Erreur Prisma

**Solution :**
```bash
# Régénérer le client
npx prisma generate

# En cas de problème, reset (DEV uniquement)
npx prisma db push --force-reset
```

---

## 📚 Documentation Complète

Consultez ces fichiers pour plus d'informations :

| Fichier | Description |
|---------|-------------|
| `INSTALLATION.md` | Guide d'installation rapide |
| `docs/IMPLEMENTATION_COMPLETE.md` | Documentation complète (50+ pages) |
| `docs/API_REFERENCE.md` | Référence API complète |
| `docs/STRIPE_SUBSCRIPTIONS_SETUP.md` | Configuration Stripe détaillée |
| `CHANGELOG.md` | Historique des modifications |

---

## 🎉 Félicitations !

Vous disposez maintenant d'un **système de paiement professionnel** qui surpasse SumUp !

### Récapitulatif des Fonctionnalités

✅ Abonnements SaaS (4 plans + essai gratuit)
✅ Point of Sale (POS) tactile
✅ Paiements QR Code
✅ Liens de paiement partageables
✅ Support Apple Pay, Google Pay, PayPal
✅ Terminaux physiques Stripe Terminal
✅ Rapprochement bancaire automatique
✅ Gestion de stock automatique
✅ Tickets de caisse imprimables
✅ API REST complète

### Support

En cas de question :
1. Consultez la documentation dans `/docs`
2. Vérifiez les logs d'erreur
3. Utilisez `node check-installation.js` pour diagnostiquer

---

**🚀 Votre système est prêt à décoller !**

*N'oubliez pas de tester en environnement de test avant de passer en production.*
