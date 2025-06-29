'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { 
  Building2,
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  MapPin, 
  Banknote, 
  Square,
  Home,
  ArrowLeft,
  SortAsc,
  SortDesc,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PropertyOffer {
  id: string;
  nomProprietaire: string;
  prenomProprietaire: string;
  telephoneProprietaire: string;
  adresseBien: string;
  surface: number;
  etage?: number;
  typeBien: string;
  prixPropose: number;
  localisationVille: string;
  localisationQuartier: string;
  descriptionBien?: string;
  nbChambresOffre?: number;
  statutOffre: string;
  photos?: string[];
  createdAt: string;
}

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [offersPerPage] = useState(50);
  const [totalOffers, setTotalOffers] = useState(0);
  const [currentOffers, setCurrentOffers] = useState<PropertyOffer[]>([]);
  
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    loadOffers();
  }, [router]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8080/offres/all');
      if (!response.ok) {
        throw new Error(`Failed to fetch offers: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched offers:', data);
      
      // Map photo URLs to include the correct base URL
      const mappedData = data.map((offer: PropertyOffer) => ({
        ...offer,
        photos: offer.photos ? offer.photos.map((photo: string) => 
          photo.startsWith('http') ? photo : `http://localhost:3000/offers/${photo}`
        ) : []
      }));
      
      setOffers(mappedData);
      setTotalOffers(mappedData.length);
      setFilteredOffers(mappedData);
    } catch (err) {
      console.error('Error loading offers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters and search
    let filtered = offers.filter(offer => {
      const matchesSearch = !searchTerm || 
        offer.nomProprietaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.prenomProprietaire.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.adresseBien.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.localisationVille.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.localisationQuartier.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.descriptionBien?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || offer.typeBien === filterType;
      const matchesCity = filterCity === 'all' || offer.localisationVille === filterCity;
      
      const matchesPrice = (!priceRange.min || offer.prixPropose >= parseInt(priceRange.min)) &&
                          (!priceRange.max || offer.prixPropose <= parseInt(priceRange.max));

      return matchesSearch && matchesType && matchesCity && matchesPrice;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'prixPropose':
          aValue = a.prixPropose;
          bValue = b.prixPropose;
          break;
        case 'surface':
          aValue = a.surface;
          bValue = b.surface;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOffers(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [offers, searchTerm, filterType, filterCity, priceRange, sortBy, sortOrder]);

  // Calculate pagination
  useEffect(() => {
    const indexOfLastOffer = currentPage * offersPerPage;
    const indexOfFirstOffer = indexOfLastOffer - offersPerPage;
    const currentOffersData = filteredOffers.slice(indexOfFirstOffer, indexOfLastOffer);
    setCurrentOffers(currentOffersData);
  }, [filteredOffers, currentPage, offersPerPage]);

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8080/offres/test');
      const text = await response.text();
      console.log('Backend test response:', text);
      alert(`Backend connection test: ${text}`);
    } catch (err) {
      console.error('Backend connection test failed:', err);
      alert('Backend connection test failed: ' + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) {
      return;
    }

    try {
      setDeletingId(id);
      
      console.log('Attempting to delete offer with ID:', id);
      
      const response = await fetch(`http://localhost:8080/offres/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete response error:', errorText);
        throw new Error(`Failed to delete offer: ${response.status} - ${errorText}`);
      }

      // Remove from local state
      setOffers(prevOffers => prevOffers.filter(offer => offer.id !== id));
      
      // Show success message
      console.log('Offer deleted successfully');
      alert('Offer deleted successfully!');
      
    } catch (err) {
      console.error('Error deleting offer:', err);
      alert(`Failed to delete offer: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'VILLA':
        return <Home className="h-4 w-4" />;
      case 'APPARTEMENT':
        return <Building2 className="h-4 w-4" />;
      case 'BUREAUX':
        return <Building2 className="h-4 w-4" />;
      case 'COMMERCE':
        return <Building2 className="h-4 w-4" />;
      case 'TERRAIN':
        return <Building2 className="h-4 w-4" />;
      default:
        return <Building2 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'RESERVE':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'VENDU':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatPropertyType = (type: string) => {
    switch (type) {
      case 'APPARTEMENT':
        return 'Appartement';
      case 'VILLA':
        return 'Villa';
      case 'BUREAUX':
        return 'Bureaux';
      case 'COMMERCE':
        return 'Commerce';
      case 'TERRAIN':
        return 'Terrain';
      default:
        return type;
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredOffers.length / offersPerPage);
  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  const cities = Array.from(new Set(offers.map(offer => offer.localisationVille)));
  const propertyTypes = Array.from(new Set(offers.map(offer => offer.typeBien)));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-slate-600 dark:text-slate-400">Loading offers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Error loading offers
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <Button onClick={loadOffers}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="dark:text-slate-200 dark:hover:bg-slate-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">Property Offers</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Manage property listings</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={testBackendConnection}
                className="dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                Test Backend
              </Button>
              <Link href="/dashboard/offers/new">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Offer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="dark:text-white">Search & Filter</CardTitle>
                <CardDescription className="dark:text-slate-400">Find specific property offers</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Filter className="h-4 w-4" />
                <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input
                type="text"
                placeholder="Search by owner name, address, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t dark:border-slate-700">
                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Property Type
                  </label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                      <SelectItem value="all" className="dark:text-white dark:hover:bg-slate-700">All Types</SelectItem>
                      {propertyTypes.map(type => (
                        <SelectItem key={type} value={type} className="dark:text-white dark:hover:bg-slate-700">
                          {formatPropertyType(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    City
                  </label>
                  <Select value={filterCity} onValueChange={setFilterCity}>
                    <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                      <SelectValue placeholder="All cities" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                      <SelectItem value="all" className="dark:text-white dark:hover:bg-slate-700">All Cities</SelectItem>
                      {cities.map(city => (
                        <SelectItem key={city} value={city} className="dark:text-white dark:hover:bg-slate-700">{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Min Price (€)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Max Price (€)
                  </label>
                  <Input
                    type="number"
                    placeholder="1000000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {/* Sort Options */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t dark:border-slate-700">
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                    <SelectItem value="createdAt" className="dark:text-white dark:hover:bg-slate-700">Date Created</SelectItem>
                    <SelectItem value="prixPropose" className="dark:text-white dark:hover:bg-slate-700">Price</SelectItem>
                    <SelectItem value="surface" className="dark:text-white dark:hover:bg-slate-700">Surface</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center space-x-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  {sortOrder === 'asc' ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                  <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <Alert className="dark:bg-slate-800 dark:border-slate-700">
            <AlertDescription className="dark:text-slate-400">
              Showing {currentOffers.length} of {filteredOffers.length} filtered offers (Total: {totalOffers} offers)
              {filteredOffers.length !== totalOffers && (
                <span className="ml-2 text-blue-600 dark:text-blue-400">
                  (Filtered from {totalOffers} total offers)
                </span>
              )}
            </AlertDescription>
          </Alert>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {currentOffers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-slate-700">
              {/* Image Section */}
              <div className="h-48 relative overflow-hidden">
                {offer.photos && offer.photos.length > 0 ? (
                  <img
                    src={offer.photos[0]}
                    alt={offer.adresseBien}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                    <Building2 className="h-12 w-12 text-slate-400 dark:text-slate-600" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusColor(offer.statutOffre)}>
                    {offer.statutOffre}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    {getPropertyTypeIcon(offer.typeBien)}
                    <CardTitle className="text-lg dark:text-white">{formatPropertyType(offer.typeBien)}</CardTitle>
                  </div>
                </div>
                <CardDescription className="text-sm dark:text-slate-400">
                  {offer.prenomProprietaire} {offer.nomProprietaire}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="h-4 w-4" />
                    <span>{offer.adresseBien}, {offer.localisationVille}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Square className="h-4 w-4" />
                      <span>{offer.surface}m²</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Banknote className="h-4 w-4" />
                      <span>€{offer.prixPropose.toLocaleString()}</span>
                    </div>
                  </div>
                  {offer.nbChambresOffre && (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {offer.nbChambresOffre} bedroom{offer.nbChambresOffre !== 1 ? 's' : ''}
                    </div>
                  )}
                  {offer.etage && (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Floor: {offer.etage}
                    </div>
                  )}
                </div>

                {offer.descriptionBien && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {offer.descriptionBien}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Added {new Date(offer.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <Link href={`/dashboard/offers/${offer.id}`}>
                      <Button variant="outline" size="sm" className="dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/dashboard/offers/${offer.id}/edit`}>
                      <Button variant="outline" size="sm" className="dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(offer.id)}
                      disabled={deletingId === offer.id}
                      className="text-red-600 hover:text-red-700 dark:border-slate-600 dark:hover:bg-slate-700"
                    >
                      {deletingId === offer.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <span>
                Showing {((currentPage - 1) * offersPerPage) + 1} to {Math.min(currentPage * offersPerPage, filteredOffers.length)} of {filteredOffers.length} results
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* First Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              
              {/* Previous Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Page Numbers */}
              {startPage > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    className="dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    1
                  </Button>
                  {startPage > 2 && (
                    <span className="px-2 text-slate-500 dark:text-slate-400">...</span>
                  )}
                </>
              )}
              
              {pageNumbers.map(number => (
                <Button
                  key={number}
                  variant={currentPage === number ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(number)}
                  className={currentPage === number ? "bg-blue-600 hover:bg-blue-700" : "dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"}
                >
                  {number}
                </Button>
              ))}
              
              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <span className="px-2 text-slate-500 dark:text-slate-400">...</span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    className="dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
              
              {/* Next Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              {/* Last Page */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No offers found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Link href="/dashboard/offers/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Offer
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}