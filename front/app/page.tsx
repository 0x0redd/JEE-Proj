'use client';

import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Building2, Key, Users, TrendingUp, ArrowRight, Phone, Mail, MapPin, Home, Banknote, Square, Eye, Search, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Meteors } from "../components/meteors";

interface PropertyOffer {
  id: string;
  propertyType: 'Maison' | 'Immeuble' | 'Villa';
  address: string;
  city: string;
  district: string;
  price: number;
  surface: number;
  bedrooms?: number;
  description?: string;
  createdAt: string;
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [latestOffers, setLatestOffers] = useState<PropertyOffer[]>([]);

  useEffect(() => {
    setMounted(true);
    loadLatestOffers();
  }, []);

  const loadLatestOffers = () => {
    // Mock latest offers data
    const mockOffers: PropertyOffer[] = [
      {
        id: '1',
        propertyType: 'Villa',
        address: '15 Chemin des Oliviers',
        city: 'Nice',
        district: 'Cimiez',
        price: 850000,
        surface: 220,
        bedrooms: 5,
        description: 'Magnifique villa avec vue mer panoramique, piscine et jardin méditerranéen',
        createdAt: '2025-01-15T10:00:00Z'
      },
      {
        id: '2',
        propertyType: 'Immeuble',
        address: '42 Boulevard Haussmann',
        city: 'Paris',
        district: '9ème',
        price: 485000,
        surface: 95,
        bedrooms: 3,
        description: 'Appartement haussmannien rénové avec balcon et vue dégagée',
        createdAt: '2025-01-14T14:30:00Z'
      },
      {
        id: '3',
        propertyType: 'Maison',
        address: '8 Rue des Jardins',
        city: 'Lyon',
        district: 'Croix-Rousse',
        price: 320000,
        surface: 130,
        bedrooms: 4,
        description: 'Maison de caractère avec jardin et garage, proche commodités',
        createdAt: '2025-01-13T09:15:00Z'
      }
    ];
    setLatestOffers(mockOffers);
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'Villa':
        return <Home className="h-4 w-4" />;
      case 'Maison':
        return <Building2 className="h-4 w-4" />;
      case 'Immeuble':
        return <Building2 className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}

      <header className="bg-white/80 dark:bg-[#111111]/40 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center space-x-3">
              <div>
                {/* <Building2 className="h-8 w-8 text-white" /> */}
                <Image src="/sakani.svg" alt="Yakeey Logo" width={100} height={100} />
                <p className="text-sm text-slate-600 dark:text-slate-400">Gestion Immobilière </p>
              </div>  
            </div>
            <div className="flex items-center space-x-4">
            <Link href="/offers">
                <Button variant="ghost" className="hidden sm:inline-flex dark:text-slate-200 ">
                  Offres
                </Button>
              </Link>
              <Link href="/demands">
                <Button variant="ghost" className="hidden sm:inline-flex dark:text-slate-200 "> 
                  Demandes
                </Button>
              </Link>
            </div>  
            <div className="flex items-center space-x-4">
              
              <Link href="/auth/signup">
                <Button variant="outline" className="hidden sm:inline-flex dark:border-slate-700 dark:text-slate-200">
                  Inscription
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  Tableau de bord
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <Meteors number={120} />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center ">
            <Badge variant="secondary" className="mb-6 bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
              Plateforme de Gestion Immobilière Professionnelle
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Optimisez Vos
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 block">
                Opérations Immobilières
              </span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Plateforme administrative complète pour gérer les offres immobilières, les demandes clients, 
              et les transactions avec des outils d'analyse et de reporting puissants.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-3">
                  Accéder au Panel Admin
                  <Key className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 dark:border-slate-700 dark:text-slate-200">
                En Savoir Plus
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Offers Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Dernières Offres Immobilières
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
              Découvrez nos dernières propriétés premium disponibles à l'achat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/offers">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 dark:border-slate-700 dark:text-slate-200">
                  <Search className="mr-2 h-5 w-5" />
                  Explorer les Offres
                </Button>
              </Link>
              <Link href="/demands">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg px-8 py-3">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Faire une Demande
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestOffers.map((offer) => (
              <Card key={offer.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                <div className="h-48 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-white backdrop-blur-sm">
                      {offer.propertyType}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center space-x-2 text-sm font-medium">
                      <MapPin className="h-4 w-4" />
                      <span>{offer.city}, {offer.district}</span>
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
                      {offer.address}
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                      {getPropertyTypeIcon(offer.propertyType)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Square className="h-4 w-4" />
                      <span>{offer.surface}m²</span>
                    </div>
                    {offer.bedrooms && (
                      <div className="flex items-center space-x-1">
                        <Home className="h-4 w-4" />
                        <span>{offer.bedrooms} pièces</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Banknote className="h-5 w-5 text-green-600 dark:text-green-400" />
                      <span className="text-2xl font-bold text-slate-900 dark:text-white">
                        {offer.price.toLocaleString()} €
                      </span>
                    </div>
                  </div>

                  {offer.description && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                      {offer.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      Ajouté le {new Date(offer.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <Button variant="outline" size="sm" className="group-hover:bg-blue-50 dark:group-hover:bg-blue-900/50 group-hover:border-blue-200 dark:group-hover:border-blue-800 dark:border-slate-700 dark:text-slate-200">
                      <Eye className="h-4 w-4 mr-2" />
                      Voir les Détails
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/offers">
              <Button size="lg" variant="outline" className="text-lg px-12 py-3 dark:border-slate-700 dark:text-slate-200">
                Voir Toutes les Propriétés
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Vous Cherchez Quelque Chose de Spécifique ?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Vous ne trouvez pas ce que vous cherchez ? Soumettez une demande et nous vous aiderons à trouver la propriété parfaite qui correspond à vos critères.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/offers">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-blue-700 hover:bg-blue-50">
                <Search className="mr-2 h-5 w-5" />
                Parcourir les Offres
              </Button>
            </Link>
            <Link href="/demands">
              <Button size="lg" className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700 text-white border-0">
                <MessageSquare className="mr-2 h-5 w-5" />
                Soumettre une Demande
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Fonctionnalités Administratives Puissantes
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour gérer efficacement votre agence immobilière
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardHeader>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Gestion des Biens</CardTitle>
                <CardDescription>
                  Gestion complète des offres immobilières avec listes détaillées, prix et suivi de disponibilité.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardHeader>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Gestion des Clients</CardTitle>
                <CardDescription>
                  Suivi des demandes clients, préférences et exigences avec des capacités de filtrage et de correspondance avancées.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardHeader>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Analyses & Rapports</CardTitle>
                <CardDescription>
                  Statistiques détaillées, analyse du marché et métriques de performance pour prendre des décisions éclairées.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Performance de la Plateforme
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Approuvée par les professionnels de l'immobilier pour une gestion efficace
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '250+', label: 'Biens Gérés', icon: Building2 },
              { number: '150+', label: 'Clients Actifs', icon: Users },
              { number: '98%', label: 'Satisfaction Client', icon: TrendingUp },
              { number: '24/7', label: 'Disponibilité Système', icon: Key }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg mb-4 w-fit mx-auto">
                  <stat.icon className="h-8 w-8 text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-slate-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                  Prêt à Commencer ?
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  Accédez à votre tableau de bord administrateur pour gérer les propriétés, les clients et suivre les performances de votre entreprise.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>+33 1 23 45 67 89</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>admin@premiumestate.fr</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-400">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>123 Avenue des Affaires, 75008 Paris</span>
                  </div>
                </div>
              </div>
              <div className="text-center lg:text-right">
                <Link href="/auth/signin">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-12 py-4">
                    Accéder au Tableau de Bord
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                  Accès administrateur sécurisé requis
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
        <div className="flex flex-col items-center justify-center space-x-3 mb-6">
                {/* <Building2 className="h-8 w-8 text-white" /> */}
                <Image src="/sakani.svg" alt="Yakeey Logo" width={100} height={100} />
                <p className="text-sm text-slate-600 dark:text-slate-400">Gestion Immobilière </p>
          </div> 
          
          <p className="text-slate-500 text-sm">
            © 2025 Sakani. Tous droits réservés. 
          </p>
        </div>
      </footer>
    </div>
  );
}