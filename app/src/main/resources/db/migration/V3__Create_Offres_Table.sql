-- Migration to create the offres table
CREATE TABLE IF NOT EXISTS offres (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom_proprietaire VARCHAR(255) NOT NULL,
    prenom_proprietaire VARCHAR(255) NOT NULL,
    telephone_proprietaire VARCHAR(20) NOT NULL,
    adresse_bien VARCHAR(500) NOT NULL,
    surface DOUBLE,
    etage INT,
    type_bien ENUM('APPARTEMENT', 'VILLA', 'BUREAUX', 'COMMERCE', 'TERRAIN') NOT NULL,
    prix_propose DOUBLE NOT NULL,
    localisation_ville VARCHAR(255) NOT NULL,
    localisation_quartier VARCHAR(255) NOT NULL,
    description_bien TEXT,
    nb_chambres_offre INT,
    statut_offre ENUM('DISPONIBLE', 'RESERVE', 'VENDU') NOT NULL DEFAULT 'DISPONIBLE',
    admin_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
);

-- Create table for photos
CREATE TABLE IF NOT EXISTS offre_photos (
    offre_id BIGINT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (offre_id) REFERENCES offres(id) ON DELETE CASCADE
);

-- Insert some sample data
INSERT INTO offres (
    nom_proprietaire, 
    prenom_proprietaire, 
    telephone_proprietaire, 
    adresse_bien, 
    surface, 
    etage, 
    type_bien, 
    prix_propose, 
    localisation_ville, 
    localisation_quartier, 
    description_bien, 
    nb_chambres_offre, 
    statut_offre
) VALUES 
('Dupont', 'Jean', '0123456789', '123 Rue de la Paix', 85.5, 3, 'APPARTEMENT', 250000.0, 'Paris', 'Le Marais', 'Bel appartement lumineux avec vue dégagée', 3, 'DISPONIBLE'),
('Martin', 'Marie', '0987654321', '456 Avenue des Champs', 120.0, 2, 'VILLA', 450000.0, 'Lyon', 'Vieux Lyon', 'Magnifique villa avec jardin privé', 4, 'DISPONIBLE'),
('Bernard', 'Pierre', '0555666777', '789 Boulevard Central', 65.0, 5, 'APPARTEMENT', 180000.0, 'Marseille', 'Vieux Port', 'Appartement moderne au cœur de la ville', 2, 'DISPONIBLE'),
('Dubois', 'Sophie', '0444333222', '321 Rue du Commerce', 200.0, 1, 'VILLA', 380000.0, 'Toulouse', 'Capitole', 'Villa spacieuse avec terrasse', 5, 'DISPONIBLE'),
('Leroy', 'Michel', '0333444555', '654 Place de la République', 45.0, 4, 'APPARTEMENT', 150000.0, 'Nantes', 'Centre-ville', 'Studio rénové avec balcon', 1, 'DISPONIBLE'); 