-- Migration to create the demandes table
CREATE TABLE IF NOT EXISTS demandes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nom_client VARCHAR(255) NOT NULL,
    prenom_client VARCHAR(255) NOT NULL,
    telephone_client VARCHAR(20) NOT NULL,
    type_demande ENUM('ACHAT', 'LOCATION') NOT NULL,
    type_bien ENUM('APPARTEMENT', 'VILLA', 'BUREAUX', 'COMMERCE', 'TERRAIN') NOT NULL,
    surface_demandee DOUBLE,
    nb_chambres INT,
    etage_souhaite INT,
    prix_souhaite DOUBLE,
    localisation_souhaitee VARCHAR(255),
    notes_supplementaires TEXT,
    admin_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
);

-- Insert some sample data
INSERT INTO demandes (
    nom_client, 
    prenom_client, 
    telephone_client, 
    type_demande, 
    type_bien, 
    surface_demandee, 
    nb_chambres, 
    etage_souhaite, 
    prix_souhaite, 
    localisation_souhaitee, 
    notes_supplementaires
) VALUES 
('Dupont', 'Marie', '0123456789', 'ACHAT', 'APPARTEMENT', 85.0, 3, 3, 280000.0, 'Paris, Le Marais', 'Recherche un appartement lumineux avec balcon'),
('Martin', 'Pierre', '0987654321', 'LOCATION', 'VILLA', 120.0, 4, 1, 2500.0, 'Lyon, Vieux Lyon', 'Villa avec jardin pour famille de 4 personnes'),
('Bernard', 'Sophie', '0555666777', 'ACHAT', 'APPARTEMENT', 65.0, 2, 5, 180000.0, 'Marseille, Vieux Port', 'Appartement moderne avec vue mer'),
('Dubois', 'Jean', '0444333222', 'LOCATION', 'APPARTEMENT', 45.0, 1, 2, 1200.0, 'Toulouse, Capitole', 'Studio pour étudiant, proche université'),
('Leroy', 'Claire', '0333444555', 'ACHAT', 'VILLA', 200.0, 5, 1, 450000.0, 'Nantes, Centre-ville', 'Grande villa pour famille nombreuse'); 