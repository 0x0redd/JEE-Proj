'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { ArrowRight, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
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
import OfferCard from '../../components/OfferCard';

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
  ownerName?: string;
  ownerPhone?: string;
  floor?: number;
  photos?: string[];
}

interface PaginatedResponse {
  content: PropertyOffer[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
}

const getPropertyTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'appartement':
      return <Home className="h-5 w-5" />;
    case 'villa':
      return <Building2 className="h-5 w-5" />;
    case 'bureaux':
      return <Building2 className="h-5 w-5" />;
    case 'commerce':
      return <Building2 className="h-5 w-5" />;
    case 'terrain':
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(30);

  // Fetch offers with pagination and filters
  const fetchOffers = async (page: number = 0) => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        size: pageSize.toString(),
        sortBy: sortBy,
        sortDir: sortOrder
      });

      // Add filters
      if (searchTerm) params.append('searchKeyword', searchTerm);
      if (filterType !== 'all') params.append('typeBien', filterType);
      if (filterCity !== 'all') params.append('ville', filterCity);
      if (priceRange.min) params.append('prixMin', priceRange.min);
      if (priceRange.max) params.append('prixMax', priceRange.max);

      const res = await fetch(`http://localhost:8080/offres/paginated?${params}`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data: PaginatedResponse = await res.json();
      console.log('Fetched paginated data:', data);
      
      // Map backend fields to PropertyOffer interface
      const mappedOffers = data.content.map((item: any) => ({
        id: item.id?.toString() ?? Math.random().toString(),
        propertyType: item.typeBien ?? 'APPARTEMENT',
        address: item.adresseBien ?? '',
        city: item.localisationVille ?? '',
        district: item.localisationQuartier ?? '',
        price: item.prixPropose ?? 0,
        surface: item.surface ?? 0,
        bedrooms: item.nbChambresOffre ?? 0,
        description: item.descriptionBien ?? '',
        createdAt: item.createdAt ?? new Date().toISOString(),
        status: item.statutOffre ?? 'DISPONIBLE',
        ownerName: [item.nomProprietaire, item.prenomProprietaire].filter(Boolean).join(' '),
        ownerPhone: item.telephoneProprietaire ?? '',
        floor: item.etage ?? undefined,
        photos: item.photos ?? [],
      }));
      
      setOffers(mappedOffers);
      setFilteredOffers(mappedOffers);
      setCurrentPage(data.number);
      setTotalPages(data.totalPages);
      setTotalElements(data.totalElements);
    } catch (err) {
      console.error('Failed to fetch offers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchOffers(0);
  }, []);

  // Refetch when filters change
  useEffect(() => {
    fetchOffers(0);
  }, [searchTerm, filterType, filterCity, priceRange, sortBy, sortOrder]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchOffers(page);
  };

  // Get unique cities and types from all data (you might want to fetch these separately)
  const uniqueCities = Array.from(new Set(offers.map(offer => offer.city)));
  const uniqueTypes = Array.from(new Set(offers.map(offer => offer.propertyType)));

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (loading && offers.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#111] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Chargement des offres...</p>
        </div>
      </div>
    );
  }

  if (error && offers.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#111] flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Erreur lors du chargement
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <Button onClick={() => fetchOffers(0)}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#111]">
      {/* Header */}
      <header className="bg-white/80 dark:bg-[#111111]/40 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Image src="/sakani.svg" alt="Yakeey Logo" width={100} height={100} />
                <p className="text-sm text-slate-600 dark:text-slate-400">Gestion Immobilière </p>
              </Link>  
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
                  placeholder="Rechercher par adresse, ville, quartier, description ou propriétaire..."
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
                        {uniqueTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
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
                        {uniqueCities.map(city => (
                          <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
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
                      <SelectItem value="prixPropose">Prix</SelectItem>
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
            Affichage de {offers.length} biens sur {totalElements} disponibles (Page {currentPage + 1} sur {totalPages})
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>

        {/* Loading state for pagination */}
        {loading && offers.length > 0 && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* No Results */}
        {offers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              Aucun bien trouvé
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              Essayez de modifier vos critères de recherche ou vos filtres.
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(0)}
              disabled={currentPage === 0 || loading}
              className="dark:border-slate-700 dark:text-slate-200"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0 || loading}
              className="dark:border-slate-700 dark:text-slate-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                disabled={loading}
                className="dark:border-slate-700 dark:text-slate-200"
              >
                {page + 1}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1 || loading}
              className="dark:border-slate-700 dark:text-slate-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={currentPage === totalPages - 1 || loading}
              className="dark:border-slate-700 dark:text-slate-200"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
} 