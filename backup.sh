#!/bin/bash

# ================================
# Script de backup - My Pro Partner ERP
# ================================
# Sauvegarde la base de données PostgreSQL

set -e

# Configuration
BACKUP_DIR="$HOME/backups/my-pro-partner"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Créer le dossier de backup
mkdir -p "$BACKUP_DIR"

log_info "Démarrage du backup..."

# Lire les variables d'environnement depuis .env.production
if [ -f .env.production ]; then
    export $(cat .env.production | grep -v '^#' | xargs)
else
    log_error "Fichier .env.production introuvable !"
    exit 1
fi

# Extraire les informations de connexion de DATABASE_URL
# Format: postgresql://user:password@host:port/database
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')

log_info "Base de données: $DB_NAME@$DB_HOST:$DB_PORT"

# Backup de la base de données
BACKUP_FILE="$BACKUP_DIR/db_${DATE}.sql"

log_info "Sauvegarde de la base de données..."

PGPASSWORD=$DB_PASS pg_dump \
    -h $DB_HOST \
    -p $DB_PORT \
    -U $DB_USER \
    -d $DB_NAME \
    -F p \
    -f "$BACKUP_FILE"

# Compresser le backup
log_info "Compression du backup..."
gzip "$BACKUP_FILE"
BACKUP_FILE="${BACKUP_FILE}.gz"

log_info "Backup créé: $BACKUP_FILE"

# Calculer la taille
SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
log_info "Taille du backup: $SIZE"

# Nettoyer les anciens backups
log_info "Nettoyage des backups de plus de $RETENTION_DAYS jours..."
find "$BACKUP_DIR" -name "db_*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete

REMAINING=$(find "$BACKUP_DIR" -name "db_*.sql.gz" -type f | wc -l)
log_info "Backups restants: $REMAINING"

log_info "Backup terminé avec succès !"

# Optionnel: Envoyer le backup vers un stockage distant
# Exemples:
# - AWS S3: aws s3 cp "$BACKUP_FILE" s3://my-bucket/backups/
# - SCP: scp "$BACKUP_FILE" user@backup-server:/backups/
# - Rclone: rclone copy "$BACKUP_FILE" remote:backups/

exit 0
