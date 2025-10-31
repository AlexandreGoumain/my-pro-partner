# ================================
# Makefile - My Pro Partner ERP
# ================================
# Commandes simplifiées pour Docker

.PHONY: help build up down restart logs logs-app logs-nginx shell backup restore clean

# Couleurs
BLUE := \033[0;34m
GREEN := \033[0;32m
NC := \033[0m

help: ## Affiche cette aide
	@echo "$(BLUE)╔════════════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║        My Pro Partner - Commandes disponibles         ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

build: ## Construire les images Docker
	@echo "$(BLUE)Construction des images Docker...$(NC)"
	docker-compose build --no-cache

up: ## Démarrer les conteneurs
	@echo "$(BLUE)Démarrage des conteneurs...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Conteneurs démarrés !$(NC)"
	@make status

down: ## Arrêter les conteneurs
	@echo "$(BLUE)Arrêt des conteneurs...$(NC)"
	docker-compose down
	@echo "$(GREEN)✓ Conteneurs arrêtés !$(NC)"

restart: ## Redémarrer les conteneurs
	@echo "$(BLUE)Redémarrage des conteneurs...$(NC)"
	docker-compose restart
	@echo "$(GREEN)✓ Conteneurs redémarrés !$(NC)"

rebuild: ## Reconstruire et redémarrer
	@echo "$(BLUE)Reconstruction et redémarrage...$(NC)"
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
	@echo "$(GREEN)✓ Reconstruction terminée !$(NC)"

status: ## Afficher le statut des conteneurs
	@echo "$(BLUE)Statut des conteneurs:$(NC)"
	@docker-compose ps

logs: ## Afficher tous les logs
	docker-compose logs -f

logs-app: ## Afficher les logs de l'application
	docker-compose logs -f app

logs-nginx: ## Afficher les logs Nginx
	docker-compose logs -f nginx

shell: ## Ouvrir un shell dans le conteneur app
	@echo "$(BLUE)Ouverture du shell...$(NC)"
	docker exec -it my-pro-partner sh

shell-nginx: ## Ouvrir un shell dans le conteneur Nginx
	@echo "$(BLUE)Ouverture du shell Nginx...$(NC)"
	docker exec -it nginx-proxy sh

stats: ## Afficher les statistiques des conteneurs
	docker stats my-pro-partner nginx-proxy

backup: ## Créer un backup de la base de données
	@echo "$(BLUE)Création d'un backup...$(NC)"
	@chmod +x backup.sh
	./backup.sh

restore: ## Restaurer un backup (usage: make restore BACKUP=fichier.sql.gz)
	@echo "$(BLUE)Restauration d'un backup...$(NC)"
	@chmod +x restore.sh
	./restore.sh $(BACKUP)

deploy: ## Déploiement complet (production)
	@echo "$(BLUE)Déploiement en production...$(NC)"
	@chmod +x deploy.sh
	./deploy.sh prod

clean: ## Nettoyer Docker (images, volumes, etc.)
	@echo "$(BLUE)Nettoyage Docker...$(NC)"
	docker-compose down -v
	docker system prune -f
	@echo "$(GREEN)✓ Nettoyage terminé !$(NC)"

clean-all: ## Nettoyage complet (ATTENTION: supprime tout)
	@echo "$(BLUE)Nettoyage complet...$(NC)"
	docker-compose down -v --remove-orphans
	docker system prune -af --volumes
	@echo "$(GREEN)✓ Nettoyage complet terminé !$(NC)"

test: ## Tester l'application
	@echo "$(BLUE)Test de l'application...$(NC)"
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "$(GREEN)✓ App OK$(NC)" || echo "$(RED)✗ App KO$(NC)"
	@curl -f http://localhost > /dev/null 2>&1 && echo "$(GREEN)✓ Nginx OK$(NC)" || echo "$(RED)✗ Nginx KO$(NC)"

update: ## Mettre à jour le code et redéployer
	@echo "$(BLUE)Mise à jour...$(NC)"
	git pull origin main
	@make rebuild

.DEFAULT_GOAL := help
