-- ============================================
-- ERP ARTISAN - SCHEMA BASE DE DONNÉES - MyProPartner
-- ============================================
-- Version: 1.0
-- Date: 2025-10-27
-- Description: Schéma complet pour ERP destiné aux artisans
-- ============================================

-- Suppression des tables si elles existent (ordre inversé des dépendances)
DROP TABLE IF EXISTS paiements;
DROP TABLE IF EXISTS lignes_document;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS articles;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS parametres_entreprise;

-- ============================================
-- TABLE: clients
-- Description: Gestion des clients de l'entreprise
-- ============================================
CREATE TABLE clients (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    telephone VARCHAR(20),
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    pays VARCHAR(100) DEFAULT 'France',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_nom (nom),
    INDEX idx_email (email),
    INDEX idx_ville (ville)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: categories
-- Description: Catégories pour organiser les articles/services
-- ============================================
CREATE TABLE categories (
    id VARCHAR(36) PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id VARCHAR(36),
    ordre INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,

    INDEX idx_nom (nom),
    INDEX idx_parent (parent_id),
    INDEX idx_ordre (ordre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: articles
-- Description: Catalogue des articles et services vendus
-- ============================================
CREATE TABLE articles (
    id VARCHAR(36) PRIMARY KEY,
    reference VARCHAR(50) UNIQUE,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    categorie_id VARCHAR(36),
    prix_ht DECIMAL(10,2) NOT NULL,
    tva_taux DECIMAL(5,2) DEFAULT 20.00,
    unite VARCHAR(50) DEFAULT 'unité',
    stock_actuel INT DEFAULT 0,
    stock_min INT DEFAULT 0,
    gestion_stock BOOLEAN DEFAULT FALSE,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE SET NULL,

    INDEX idx_reference (reference),
    INDEX idx_nom (nom),
    INDEX idx_categorie (categorie_id),
    INDEX idx_actif (actif)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: documents
-- Description: Documents commerciaux (devis, factures, avoirs)
-- ============================================
CREATE TABLE documents (
    id VARCHAR(36) PRIMARY KEY,
    numero VARCHAR(50) UNIQUE NOT NULL,
    type ENUM('devis', 'facture', 'avoir') NOT NULL,
    client_id VARCHAR(36) NOT NULL,
    date_emission DATE NOT NULL,
    date_echeance DATE,
    statut ENUM('brouillon', 'envoye', 'accepte', 'refuse', 'paye', 'annule') DEFAULT 'brouillon',

    -- Montants
    total_ht DECIMAL(10,2) DEFAULT 0,
    total_tva DECIMAL(10,2) DEFAULT 0,
    total_ttc DECIMAL(10,2) DEFAULT 0,

    -- Acomptes/Paiements
    acompte_montant DECIMAL(10,2) DEFAULT 0,
    reste_a_payer DECIMAL(10,2) DEFAULT 0,

    -- Informations complémentaires
    notes TEXT,
    conditions_paiement TEXT,
    validite_jours INT DEFAULT 30,

    -- Conversion devis → facture
    devis_id VARCHAR(36),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE RESTRICT,
    FOREIGN KEY (devis_id) REFERENCES documents(id) ON DELETE SET NULL,

    INDEX idx_numero (numero),
    INDEX idx_type (type),
    INDEX idx_client (client_id),
    INDEX idx_statut (statut),
    INDEX idx_date_emission (date_emission),
    INDEX idx_date_echeance (date_echeance)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: lignes_document
-- Description: Lignes de détail des documents (articles/services)
-- ============================================
CREATE TABLE lignes_document (
    id VARCHAR(36) PRIMARY KEY,
    document_id VARCHAR(36) NOT NULL,
    article_id VARCHAR(36),

    -- Données de la ligne
    ordre INT DEFAULT 0,
    designation VARCHAR(255) NOT NULL,
    description TEXT,
    quantite DECIMAL(10,2) NOT NULL DEFAULT 1,
    prix_unitaire_ht DECIMAL(10,2) NOT NULL,
    tva_taux DECIMAL(5,2) NOT NULL,
    remise_pourcent DECIMAL(5,2) DEFAULT 0,

    -- Calculs
    montant_ht DECIMAL(10,2) NOT NULL,
    montant_tva DECIMAL(10,2) NOT NULL,
    montant_ttc DECIMAL(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE SET NULL,

    INDEX idx_document (document_id),
    INDEX idx_article (article_id),
    INDEX idx_ordre (ordre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: paiements
-- Description: Historique des paiements reçus
-- ============================================
CREATE TABLE paiements (
    id VARCHAR(36) PRIMARY KEY,
    document_id VARCHAR(36) NOT NULL,
    date_paiement DATE NOT NULL,
    montant DECIMAL(10,2) NOT NULL,
    moyen_paiement ENUM('especes', 'cheque', 'virement', 'carte', 'prelevement') NOT NULL,
    reference VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE RESTRICT,

    INDEX idx_document (document_id),
    INDEX idx_date_paiement (date_paiement),
    INDEX idx_moyen_paiement (moyen_paiement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLE: parametres_entreprise
-- Description: Paramètres et configuration de l'entreprise
-- ============================================
CREATE TABLE parametres_entreprise (
    id INT PRIMARY KEY DEFAULT 1,
    nom_entreprise VARCHAR(255) NOT NULL,
    siret VARCHAR(14),
    tva_intra VARCHAR(20),
    adresse TEXT,
    code_postal VARCHAR(10),
    ville VARCHAR(100),
    telephone VARCHAR(20),
    email VARCHAR(255),
    site_web VARCHAR(255),
    logo_url VARCHAR(500),

    -- Numérotation automatique
    prefixe_devis VARCHAR(10) DEFAULT 'DEV',
    prefixe_facture VARCHAR(10) DEFAULT 'FACT',
    prochain_numero_devis INT DEFAULT 1,
    prochain_numero_facture INT DEFAULT 1,

    -- Conditions par défaut
    conditions_paiement_defaut TEXT,
    mentions_legales TEXT,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CHECK (id = 1)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DONNÉES D'INITIALISATION
-- ============================================

-- Insertion des paramètres par défaut
INSERT INTO parametres_entreprise (id, nom_entreprise, conditions_paiement_defaut, mentions_legales)
VALUES (
    1,
    'Mon Entreprise Artisan',
    'Paiement à 30 jours fin de mois',
    'TVA non applicable, art. 293 B du CGI'
);

-- Catégories d'exemple
INSERT INTO categories (id, nom, description, ordre) VALUES
    (UUID(), 'Main d''œuvre', 'Services et prestations', 1),
    (UUID(), 'Matériaux', 'Fournitures et matériaux', 2),
    (UUID(), 'Déplacements', 'Frais de déplacement', 3);

-- ============================================
-- VUES UTILES
-- ============================================

-- Vue: documents avec informations client
CREATE OR REPLACE VIEW v_documents_complets AS
SELECT
    d.*,
    c.nom AS client_nom,
    c.prenom AS client_prenom,
    c.email AS client_email,
    c.telephone AS client_telephone,
    c.adresse AS client_adresse,
    c.code_postal AS client_code_postal,
    c.ville AS client_ville,
    (SELECT COUNT(*) FROM lignes_document WHERE document_id = d.id) AS nombre_lignes,
    (SELECT SUM(montant) FROM paiements WHERE document_id = d.id) AS total_paye
FROM documents d
JOIN clients c ON d.client_id = c.id;

-- Vue: statistiques articles
CREATE OR REPLACE VIEW v_statistiques_articles AS
SELECT
    a.id,
    a.reference,
    a.nom,
    a.prix_ht,
    c.nom AS categorie_nom,
    COUNT(ld.id) AS nb_utilisations,
    SUM(ld.quantite) AS quantite_totale_vendue,
    SUM(ld.montant_ttc) AS chiffre_affaires_ttc
FROM articles a
LEFT JOIN categories c ON a.categorie_id = c.id
LEFT JOIN lignes_document ld ON a.id = ld.article_id
LEFT JOIN documents d ON ld.document_id = d.id AND d.type = 'facture' AND d.statut = 'paye'
GROUP BY a.id, a.reference, a.nom, a.prix_ht, c.nom;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger: Mise à jour automatique du reste à payer
DELIMITER //

CREATE TRIGGER after_paiement_insert
AFTER INSERT ON paiements
FOR EACH ROW
BEGIN
    UPDATE documents
    SET reste_a_payer = total_ttc - (
        SELECT COALESCE(SUM(montant), 0)
        FROM paiements
        WHERE document_id = NEW.document_id
    )
    WHERE id = NEW.document_id;

    -- Si totalement payé, changer le statut
    UPDATE documents
    SET statut = 'paye'
    WHERE id = NEW.document_id
    AND reste_a_payer <= 0
    AND statut != 'paye';
END//

DELIMITER ;

-- ============================================
-- FIN DU SCHEMA
-- ============================================
