#!/bin/bash

# ================================
# Script de déploiement - My Pro Partner ERP
# ================================
# Usage: ./deploy.sh [dev|prod]

set -e  # Arrêter le script en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher des messages colorés
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Banner
echo -e "${BLUE}"
echo "╔════════════════════════════════════════════╗"
echo "║   My Pro Partner - Déploiement Docker     ║"
echo "╚════════════════════════════════════════════╝"
echo -e "${NC}"

# Déterminer l'environnement
ENV=${1:-prod}

if [ "$ENV" != "dev" ] && [ "$ENV" != "prod" ]; then
    log_error "Environnement invalide. Utiliser: ./deploy.sh [dev|prod]"
    exit 1
fi

log_info "Environnement: $ENV"
echo ""

# Vérifier que Docker est installé
log_info "Vérification de Docker..."
if ! command -v docker &> /dev/null; then
    log_error "Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi
log_success "Docker est installé"

# Vérifier que Docker Compose est installé
log_info "Vérification de Docker Compose..."
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    log_error "Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi
log_success "Docker Compose est installé"

# Vérifier que le fichier .env.production existe
if [ "$ENV" = "prod" ] && [ ! -f .env.production ]; then
    log_error "Fichier .env.production manquant !"
    log_warning "Copiez .env.production.example vers .env.production et configurez-le."
    exit 1
fi

# Afficher les conteneurs en cours d'exécution
log_info "Conteneurs Docker actuels:"
docker ps -a | grep -E "my-pro-partner|nginx-proxy" || echo "Aucun conteneur trouvé"
echo ""

# Demander confirmation avant de continuer
read -p "$(echo -e ${YELLOW}⚠${NC} Voulez-vous continuer le déploiement ? [y/N]: )" -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_warning "Déploiement annulé"
    exit 0
fi

# Arrêter les conteneurs existants
log_info "Arrêt des conteneurs existants..."
docker-compose down --remove-orphans || true
log_success "Conteneurs arrêtés"

# Nettoyer les images non utilisées (optionnel)
read -p "$(echo -e ${YELLOW}?${NC} Voulez-vous nettoyer les images Docker non utilisées ? [y/N]: )" -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "Nettoyage des images Docker..."
    docker system prune -f
    log_success "Nettoyage terminé"
fi

# Construire et démarrer les conteneurs
log_info "Construction et démarrage des conteneurs..."
docker-compose build --no-cache
docker-compose up -d

log_success "Conteneurs démarrés !"
echo ""

# Attendre que les conteneurs soient prêts
log_info "Attente du démarrage des services (30s)..."
sleep 30

# Vérifier le statut des conteneurs
log_info "Statut des conteneurs:"
docker-compose ps

# Vérifier les logs
echo ""
log_info "Derniers logs de l'application:"
docker-compose logs --tail=50 app

# Vérifier la santé de l'application
echo ""
log_info "Vérification de la santé de l'application..."
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    log_success "Application accessible sur http://localhost:3000"
else
    log_warning "L'application ne répond pas encore. Vérifiez les logs avec: docker-compose logs -f app"
fi

# Vérifier Nginx
log_info "Vérification de Nginx..."
if curl -f http://localhost > /dev/null 2>&1; then
    log_success "Nginx accessible sur http://localhost"
else
    log_warning "Nginx ne répond pas encore. Vérifiez les logs avec: docker-compose logs -f nginx"
fi

# Informations finales
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║        Déploiement terminé !               ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
log_info "Commandes utiles:"
echo "  • Voir les logs:        docker-compose logs -f"
echo "  • Voir les logs app:    docker-compose logs -f app"
echo "  • Voir les logs nginx:  docker-compose logs -f nginx"
echo "  • Arrêter:              docker-compose down"
echo "  • Redémarrer:           docker-compose restart"
echo "  • Reconstruire:         docker-compose up -d --build"
echo ""
log_info "Application disponible sur:"
echo "  • Directement:          http://localhost:3000"
echo "  • Via Nginx:            http://localhost"
if [ "$ENV" = "prod" ]; then
    echo "  • IP publique:          http://VOTRE_IP_VPS"
fi
