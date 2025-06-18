'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Building2, 
  Home,
  MapPin,
  Square,
  Banknote,
  Eye,
  Filter,
  SortAsc,
  SortDesc,
  Search
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PropertyOffer {
  id: string;
  propertyType: string;
  address: string;
  city: string;
  district: string;
  price: number;
  surface: number;
  bedrooms?: number;
  description?: string;
  createdAt: string;
  status: string;
}

const getPropertyTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'appartement':
      return <Home className="h-5 w-5" />;
    case 'maison':
      return <Building2 className="h-5 w-5" />;
    default:
      return <Building2 className="h-5 w-5" />;
  }
};

export default function OffersPage() {
  const [offers, setOffers] = useState<PropertyOffer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<PropertyOffer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterCity, setFilterCity] = useState<string>('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Load mock data
    loadMockOffers();
  }, []);

  const loadMockOffers = () => {
    const mockOffers: PropertyOffer[] = [
      {
        id: '1',
        propertyType: 'Appartement',
        address: '123 Rue de Paris',
        city: 'Paris',
        district: 'Le Marais',
        price: 450000,
        surface: 75,
        bedrooms: 3,
        description: 'Bel appartement lumineux avec vue dégagée',
        createdAt: '2024-03-15',
        status: 'Disponible'
      },
      {
        id: '2',
        propertyType: 'Maison',
        address: '45 Avenue des Champs-Élysées',
        city: 'Paris',
        district: '8ème arrondissement',
        price: 1200000,
        surface: 200,
        bedrooms: 5,
        description: 'Magnifique maison avec jardin',
        createdAt: '2024-03-14',
        status: 'Disponible'
      },
      // Add more mock offers as needed
    ];

    setOffers(mockOffers);
    setFilteredOffers(mockOffers);
  };

  useEffect(() => {
    let result = [...offers];

    // Apply search
    if (searchTerm) {
      result = result.filter(offer =>
        offer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      result = result.filter(offer => offer.propertyType === filterType);
    }

    // Apply city filter
    if (filterCity !== 'all') {
      result = result.filter(offer => offer.city === filterCity);
    }

    // Apply price range
    if (priceRange.min) {
      result = result.filter(offer => offer.price >= Number(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter(offer => offer.price <= Number(priceRange.max));
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'surface':
          comparison = a.surface - b.surface;
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredOffers(result);
  }, [offers, searchTerm, filterType, filterCity, priceRange, sortBy, sortOrder]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] bg-[linear-gradient(to_right,#2461e91f_1px,transparent_1px),linear-gradient(to_bottom,#2461e91f_1px,transparent_1px)] bg-[size:14px_24px]">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <Link href="/">
                {/* <Building2 className="h-8 w-8 text-white" /> */}
                <Image src="/sakani.svg" alt="Yakeey Logo" width={100} height={100} />
                <p className="text-sm text-slate-600 dark:text-slate-400">Gestion Immobilière </p>
              </Link>
            </div>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        {/* Search and Filters */}
        <Card className="mb-8 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="dark:text-white">Recherche & Filtres</CardTitle>
                <CardDescription className="dark:text-slate-400">Trouvez le bien qui vous correspond</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 dark:border-slate-700 dark:text-slate-200"
              >
                <Filter className="h-4 w-4" />
                <span>{showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  placeholder="Rechercher par adresse, ville ou quartier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                />
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t dark:border-slate-700">
                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                      Type de bien
                    </label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                        <SelectValue placeholder="Tous les types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        <SelectItem value="Appartement">Appartement</SelectItem>
                        <SelectItem value="Maison">Maison</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                      Ville
                    </label>
                    <Select value={filterCity} onValueChange={setFilterCity}>
                      <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                        <SelectValue placeholder="Toutes les villes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les villes</SelectItem>
                        <SelectItem value="Paris">Paris</SelectItem>
                        <SelectItem value="Lyon">Lyon</SelectItem>
                        <SelectItem value="Marseille">Marseille</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                      Prix
                    </label>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Sort */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t dark:border-slate-700">
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Trier par
                  </label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="createdAt">Date d'ajout</SelectItem>
                      <SelectItem value="price">Prix</SelectItem>
                      <SelectItem value="surface">Surface</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center space-x-2 dark:border-slate-700 dark:text-slate-200"
                  >
                    {sortOrder === 'asc' ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                    <span>{sortOrder === 'asc' ? 'Croissant' : 'Décroissant'}</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Affichage de {filteredOffers.length} biens sur {offers.length} disponibles
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOffers.map((offer) => (
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
      </main>
    </div>
  );
} 