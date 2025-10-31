#!/bin/bash

# ================================
# Script de restauration - My Pro Partner ERP
# ================================
# Restaure une sauvegarde de la base de données PostgreSQL

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier qu'un fichier de backup est fourni
if [ -z "$1" ]; then
    log_error "Usage: ./restore.sh <fichier_backup.sql.gz>"
    log_info "Exemple: ./restore.sh ~/backups/my-pro-partner/db_20250131_120000.sql.gz"
    echo ""
    log_info "Backups disponibles:"
    find ~/backups/my-pro-partner -name "db_*.sql.gz" -type f 2>/dev/null | sort -r | head -10 || echo "Aucun backup trouvé"
    exit 1
fi

BACKUP_FILE="$1"

# Vérifier que le fichier existe
if [ ! -f "$BACKUP_FILE" ]; then
    log_error "Fichier de backup introuvable: $BACKUP_FILE"
    exit 1
fi

log_info "Fichier de backup: $BACKUP_FILE"

# Lire les variables d'environnement depuis .env.production
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
else
    log_error "Fichier .env.production introuvable !"
    exit 1
fi

# Extraire les informations de connexion
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

log_info "Base de données: $DB_NAME@$DB_HOST:$DB_PORT"

# AVERTISSEMENT
echo ""
log_warning "╔════════════════════════════════════════════════════════╗"
log_warning "║              ATTENTION - RESTAURATION                  ║"
log_warning "╚════════════════════════════════════════════════════════╝"
log_warning "Cette opération va:"
log_warning "  1. Supprimer TOUTES les données actuelles"
log_warning "  2. Restaurer les données du backup"
log_warning "  3. Redémarrer l'application"
echo ""
log_warning "Base de données: $DB_NAME"
log_warning "Backup: $(basename $BACKUP_FILE)"
echo ""

read -p "$(echo -e ${RED}Êtes-vous SÛR de vouloir continuer ? [yes/NO]:${NC} )" CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    log_info "Restauration annulée"
    exit 0
fi

# Arrêter l'application
log_info "Arrêt de l'application..."
docker-compose down

# Décompresser le backup si nécessaire
if [[ "$BACKUP_FILE" == *.gz ]]; then
    log_info "Décompression du backup..."
    TEMP_FILE="/tmp/restore_$(date +%s).sql"
    gunzip -c "$BACKUP_FILE" > "$TEMP_FILE"
    BACKUP_FILE="$TEMP_FILE"
fi

# Créer un backup de sécurité avant restauration
log_info "Création d'un backup de sécurité..."
SAFETY_BACKUP="/tmp/safety_backup_$(date +%s).sql"
PGPASSWORD=$DB_PASS pg_dump \
    -h $DB_HOST \
    -p $DB_PORT \
    -U $DB_USER \
    -d $DB_NAME \
    -F p \
    -f "$SAFETY_BACKUP" 2>/dev/null || log_warning "Impossible de créer un backup de sécurité"

if [ -f "$SAFETY_BACKUP" ]; then
    log_success "Backup de sécurité créé: $SAFETY_BACKUP"
fi

# Restaurer le backup
log_info "Restauration de la base de données..."

# Supprimer toutes les tables existantes
log_info "Suppression des tables existantes..."
PGPASSWORD=$DB_PASS psql \
    -h $DB_HOST \
    -p $DB_PORT \
    -U $DB_USER \
    -d $DB_NAME \
    -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" 2>/dev/null || true

# Restaurer depuis le backup
log_info "Importation du backup..."
PGPASSWORD=$DB_PASS psql \
    -h $DB_HOST \
    -p $DB_PORT \
    -U $DB_USER \
    -d $DB_NAME \
    -f "$BACKUP_FILE"

# Nettoyer le fichier temporaire
if [[ "$TEMP_FILE" != "" ]] && [ -f "$TEMP_FILE" ]; then
    rm "$TEMP_FILE"
fi

log_success "Base de données restaurée !"

# Redémarrer l'application
log_info "Redémarrage de l'application..."
docker-compose up -d

log_success "╔════════════════════════════════════════════════════════╗"
log_success "║           Restauration terminée avec succès !          ║"
log_success "╚════════════════════════════════════════════════════════╝"

if [ -f "$SAFETY_BACKUP" ]; then
    echo ""
    log_info "En cas de problème, vous pouvez restaurer le backup de sécurité:"
    log_info "  ./restore.sh $SAFETY_BACKUP"
fi

exit 0
