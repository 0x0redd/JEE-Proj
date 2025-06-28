#!/usr/bin/env python3
"""
Script to insert property offers from JSON data into MySQL database
"""

import json
import os
import mysql.connector
from mysql.connector import Error
from datetime import datetime
import re
from typing import List, Dict, Any

class PropertyDataInserter:
    def __init__(self, host='localhost', port=3306, database='immobilier_db', username='root', password=''):
        """Initialize database connection"""
        self.connection_params = {
            'host': host,
            'port': port,
            'database': database,
            'user': username,
            'password': password,
            'charset': 'utf8mb4',
            'collation': 'utf8mb4_unicode_ci'
        }
        
        
    def connect(self):
        """Establish database connection"""
        try:
            self.connection = mysql.connector.connect(**self.connection_params)
            self.cursor = self.connection.cursor()
            print("✅ Successfully connected to MySQL database")
            return True
        except Error as e:
            print(f"❌ Error connecting to MySQL: {e}")
            return False
    
    def disconnect(self):
        """Close database connection"""
        if hasattr(self, 'cursor') and self.cursor:
            self.cursor.close()
        if hasattr(self, 'connection') and self.connection:
            self.connection.close()
        print("🔌 Database connection closed")
    
    def extract_owner_name(self, title: str, description: str) -> tuple:
        """
        Extract owner name from title and description
        Returns tuple of (nom, prenom)
        """
        # Try to extract from title first
        title_lower = title.lower()
        
        # Common patterns in property titles
        patterns = [
            r'vend\s+([a-zA-ZÀ-ÿ\s]+?)\s+(?:appartement|maison|villa)',
            r'à\s+vendre\s+par\s+([a-zA-ZÀ-ÿ\s]+?)\s+à',
            r'propriétaire\s+([a-zA-ZÀ-ÿ\s]+?)\s+propose'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, title_lower)
            if match:
                name = match.group(1).strip()
                if name and len(name) > 2:
                    # Split into first and last name
                    name_parts = name.split()
                    if len(name_parts) >= 2:
                        return name_parts[0].title(), ' '.join(name_parts[1:]).title()
                    else:
                        return name.title(), ""
        
        # If no pattern found, use default values
        return "Propriétaire", "Anonyme"
    
    def map_property_type(self, property_type: str) -> str:
        """Map property type to database enum values"""
        type_mapping = {
            'appartement': 'APPARTEMENT',
            'maison': 'VILLA',
            'villa': 'VILLA',
            'bureau': 'BUREAUX',
            'bureaux': 'BUREAUX',
            'commerce': 'COMMERCE',
            'terrain': 'TERRAIN'
        }
        
        property_type_lower = property_type.lower().strip()
        return type_mapping.get(property_type_lower, 'APPARTEMENT')
    
    def map_status(self, status: str) -> str:
        """Map status to database enum values"""
        status_mapping = {
            'unknown': 'DISPONIBLE',
            'disponible': 'DISPONIBLE',
            'reserve': 'RESERVE',
            'vendu': 'VENDU'
        }
        
        status_lower = status.lower().strip()
        return status_mapping.get(status_lower, 'DISPONIBLE')
    
    def generate_phone_number(self) -> str:
        """Generate a Moroccan phone number format"""
        import random
        prefixes = ['06', '07']
        prefix = random.choice(prefixes)
        number = ''.join([str(random.randint(0, 9)) for _ in range(8)])
        return f"+212 {prefix} {number[:2]} {number[2:4]} {number[4:6]} {number[6:8]}"
    
    def insert_offer(self, property_data: Dict[str, Any]) -> bool:
        """Insert a single property offer into the database and its photos"""
        try:
            # Extract owner name from title and description
            nom, prenom = self.extract_owner_name(
                property_data.get('title', ''), 
                property_data.get('description', '')
            )
            phone = self.generate_phone_number()
            # Prepare the SQL insert statement for offres (without photos)
            sql = """
            INSERT INTO offres (
                nom_proprietaire, prenom_proprietaire, telephone_proprietaire,
                adresse_bien, surface, etage, type_bien, prix_propose,
                localisation_ville, localisation_quartier, description_bien,
                nb_chambres_offre, statut_offre, admin_id
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                nom,
                prenom,
                phone,
                property_data.get('title', '')[:255],
                property_data.get('surface'),
                None,
                self.map_property_type(property_data.get('propertyTypeName', 'Appartement')),
                property_data.get('price'),
                property_data.get('city', ''),
                property_data.get('quartier', ''),
                property_data.get('description', ''),
                property_data.get('bedrooms'),
                self.map_status(property_data.get('status', 'unknown')),
                None  # admin_id
            )
            self.cursor.execute(sql, values)
            offre_id = self.cursor.lastrowid

            # Insert each photo into offre_photos
            images = property_data.get('images', [])
            for url in images:
                self.cursor.execute(
                    "INSERT INTO offre_photos (offre_id, photo_url) VALUES (%s, %s)",
                    (offre_id, url)
                )
            self.connection.commit()
            print(f"✅ Inserted: {property_data.get('title', 'Unknown')[:50]}... (ID: {offre_id})")
            return True

        except Error as e:
            print(f"❌ Error inserting property: {e}")
            self.connection.rollback()
            return False
    
    def insert_from_json_file(self, json_file_path: str) -> int:
        """Insert all properties from a JSON file"""
        try:
            # Read JSON file
            with open(json_file_path, 'r', encoding='utf-8') as file:
                data = json.load(file)
            
            # Ensure data is a list
            if isinstance(data, dict):
                # If it's a single object, wrap it in a list
                properties = [data]
            elif isinstance(data, list):
                properties = data
            else:
                print("❌ Invalid JSON format. Expected object or array.")
                return 0
            
            print(f"📊 Found {len(properties)} properties to insert")
            
            # Insert each property
            successful_inserts = 0
            for i, property_data in enumerate(properties, 1):
                print(f"📝 Processing property {i}/{len(properties)}")
                if self.insert_offer(property_data):
                    successful_inserts += 1
            
            print(f"\n🎉 Successfully inserted {successful_inserts}/{len(properties)} properties")
            return successful_inserts
            
        except FileNotFoundError:
            print(f"❌ File not found: {json_file_path}")
            return 0
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON format: {e}")
            return 0
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            return 0
    
    def insert_from_json_string(self, json_string: str) -> int:
        """Insert properties from a JSON string"""
        try:
            data = json.loads(json_string)
            
            # Ensure data is a list
            if isinstance(data, dict):
                properties = [data]
            elif isinstance(data, list):
                properties = data
            else:
                print("❌ Invalid JSON format. Expected object or array.")
                return 0
            
            print(f"📊 Found {len(properties)} properties to insert")
            
            # Insert each property
            successful_inserts = 0
            for i, property_data in enumerate(properties, 1):
                print(f"📝 Processing property {i}/{len(properties)}")
                if self.insert_offer(property_data):
                    successful_inserts += 1
            
            print(f"\n🎉 Successfully inserted {successful_inserts}/{len(properties)} properties")
            return successful_inserts
            
        except json.JSONDecodeError as e:
            print(f"❌ Invalid JSON format: {e}")
            return 0
        except Exception as e:
            print(f"❌ Unexpected error: {e}")
            return 0

def main():
    """Main function to run the script"""
    print("🏠 Property Data Inserter")
    print("=" * 50)
    
    # Initialize the inserter
    inserter = PropertyDataInserter(
        host='localhost',
        port=3306,
        database='immobilier_db',
        username='root',
        password=''  # Update this if you have a password
    )
    
    # Connect to database
    if not inserter.connect():
        return
    
    try:
        # Example JSON data (you can replace this with your file path)
        json_file_path = "property_details.json"  # Update this path
        
        # Try to read from file first
        try:
            successful_inserts = inserter.insert_from_json_file(json_file_path)
        except FileNotFoundError:
            print(f"📄 File {json_file_path} not found. Using sample data...")
            
            # Sample JSON data (replace with your actual data)
            sample_json = '''
            [
                {
                    "link": "https://www.mubawab.ma/fr/a/8126263/bel-appartement-%C3%A0-vendre-%C3%A0-route-de-safi-2-chambres-conciergerie-%C3%A0-disposition-syst%C3%A8me-de-climatisation",
                    "id": "ea4d95d7a540de0d",
                    "createdAt": "2026-04-17T22:11:26.867902",
                    "updatedAt": "2026-04-17T22:11:26.867902",
                    "title": "Bel appartement à vendre à Route de Safi. 2 chambres. Conciergerie à disposition, système de climatisation",
                    "description": "Appartement idéal à la vente. Prix 520 000 DH. 2 chambres, 1 salle de bains, superficie 48 m². 3 pièces. Moins de 10 ans. Revêtement: Carrelage. Appréciez le confort de la climatisation. La résidence dispose également d'un service de concierge.Cet appartement est en vente à Route de Safi. Résidence sécurisée. Le bien dispose également d'un beau salon marocain traditionnel. Cuisine bien équipée.Programmez dès maintenant votre visite pour cet appartement d'exception à Marrakech.",
                    "price": 520000,
                    "surface": 48.0,
                    "status": "unknown",
                    "condition": "Bon état",
                    "country": "Maroc",
                    "quartier": "Route de Safi",
                    "city": "Marrakech",
                    "bedrooms": 2,
                    "bathrooms": 1,
                    "features": ["Concierge", "Salon Marocain", "Climatisation", "Sécurité", "Cuisine équipée"],
                    "images": [
                        "https://www.mubawab-media.com/ad/8/126/263F/h/photo_00_80110128.avif",
                        "https://www.mubawab-media.com/ad/8/126/263F/h/photo_01_80110129.avif",
                        "https://www.mubawab-media.com/ad/8/126/263F/h/photo_02_80110130.avif",
                        "https://www.mubawab-media.com/ad/8/126/263F/h/photo_03_80110131.avif"
                    ],
                    "site": "mubawab",
                    "modifiedAt": "2026-04-17T22:11:26.867902",
                    "sell": true,
                    "longTerm": false,
                    "propertyTypeName": "Appartement"
                }
            ]
            '''
            
            successful_inserts = inserter.insert_from_json_string(sample_json)
        
        print(f"\n📈 Summary: {successful_inserts} properties inserted successfully")
        
    except KeyboardInterrupt:
        print("\n⏹️ Operation cancelled by user")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
    finally:
        # Always disconnect
        inserter.disconnect()

if __name__ == "__main__":
    main() 