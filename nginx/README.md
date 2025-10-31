# Configuration Nginx

Ce dossier contient la configuration Nginx pour le reverse proxy.

## Structure

```
nginx/
├── nginx.conf              # Configuration principale de Nginx
├── conf.d/
│   └── default.conf       # Configuration du site My Pro Partner
├── ssl/                   # Certificats SSL (à créer manuellement)
│   ├── fullchain.pem     # (créé après Let's Encrypt)
│   └── privkey.pem       # (créé après Let's Encrypt)
└── README.md             # Ce fichier
```

## Configuration

### nginx.conf
Contient les paramètres globaux:
- Workers
- Gzip compression
- Security headers
- Rate limiting

### conf.d/default.conf
Contient la configuration spécifique au projet:
- Upstream vers l'application Next.js
- Configuration HTTP (port 80)
- Configuration HTTPS (port 443, à décommenter après SSL)
- Proxy headers
- Cache static files

## SSL/HTTPS

Pour activer HTTPS:

1. Obtenir un certificat Let's Encrypt (voir DEPLOIEMENT.md)
2. Créer le dossier `ssl/` si nécessaire
3. Copier les certificats dans `ssl/`
4. Décommenter la section HTTPS dans `conf.d/default.conf`
5. Redémarrer Nginx: `docker-compose restart nginx`

## Logs

Les logs Nginx sont stockés dans un volume Docker:
- Access log: `/var/log/nginx/access.log`
- Error log: `/var/log/nginx/error.log`
- App access: `/var/log/nginx/app-access.log`
- App error: `/var/log/nginx/app-error.log`

Pour voir les logs:
```bash
docker-compose logs -f nginx
```

## Rate Limiting

Deux zones de rate limiting sont configurées:
- `api_limit`: 10 requêtes/seconde pour les routes `/api/*`
- `general_limit`: 30 requêtes/seconde pour les autres routes
