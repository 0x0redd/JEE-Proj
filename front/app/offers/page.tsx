'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  SortDesc
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PropertyOffer {
  id: string;
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  address: string;
  surface: number;
  floor?: number;
  propertyType: 'Maison' | 'Immeuble' | 'Villa';
  price: number;
  city: string;
  district: string;
  description?: string;
  bedrooms?: number;
  status: 'Available' | 'Pending' | 'Sold';
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
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    // Load mock data
    loadMockOffers();
  }, [router]);

  useEffect(() => {
    // Apply filters and search
    let filtered = offers.filter(offer => {
      const matchesSearch = !searchTerm || 
        offer.ownerFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.ownerLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.district.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = filterType === 'all' || offer.propertyType === filterType;
      const matchesCity = filterCity === 'all' || offer.city === filterCity;
      
      const matchesPrice = (!priceRange.min || offer.price >= parseInt(priceRange.min)) &&
                          (!priceRange.max || offer.price <= parseInt(priceRange.max));

      return matchesSearch && matchesType && matchesCity && matchesPrice;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
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
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOffers(filtered);
  }, [offers, searchTerm, filterType, filterCity, priceRange, sortBy, sortOrder]);

  const loadMockOffers = () => {
    // Mock data for demonstration
    const mockOffers: PropertyOffer[] = [
      {
        id: '1',
        ownerFirstName: 'Jean',
        ownerLastName: 'Martin',
        ownerPhone: '+33 6 12 34 56 78',
        address: '15 Rue de la Paix',
        surface: 120,
        floor: 2,
        propertyType: 'Immeuble',
        price: 285000,
        city: 'Paris',
        district: '1er',
        description: 'Beautiful apartment in the heart of Paris',
        bedrooms: 3,
        status: 'Available',
        createdAt: '2025-01-15T10:00:00Z'
      },
      {
        id: '2',
        ownerFirstName: 'Marie',
        ownerLastName: 'Dubois',
        ownerPhone: '+33 6 98 76 54 32',
        address: '42 Avenue des Champs',
        surface: 95,
        propertyType: 'Maison',
        price: 195000,
        city: 'Lyon',
        district: 'Centre',
        description: 'Charming house with garden',
        bedrooms: 2,
        status: 'Available',
        createdAt: '2025-01-14T14:30:00Z'
      },
      {
        id: '3',
        ownerFirstName: 'Pierre',
        ownerLastName: 'Moreau',
        ownerPhone: '+33 6 11 22 33 44',
        address: '8 Chemin du Soleil',
        surface: 180,
        propertyType: 'Villa',
        price: 450000,
        city: 'Nice',
        district: 'Collines',
        description: 'Luxury villa with sea view',
        bedrooms: 4,
        status: 'Pending',
        createdAt: '2025-01-13T09:15:00Z'
      },
      {
        id: '4',
        ownerFirstName: 'Sophie',
        ownerLastName: 'Bernard',
        ownerPhone: '+33 6 55 66 77 88',
        address: '23 Boulevard Haussmann',
        surface: 75,
        floor: 5,
        propertyType: 'Immeuble',
        price: 320000,
        city: 'Paris',
        district: '9ème',
        description: 'Modern apartment, recently renovated',
        bedrooms: 2,
        status: 'Available',
        createdAt: '2025-01-12T16:45:00Z'
      }
    ];

    setOffers(mockOffers);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      setOffers(offers.filter(offer => offer.id !== id));
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Sold':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const cities = [...new Set(offers.map(offer => offer.city))];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Property Offers</h1>
                  <p className="text-sm text-slate-600">Manage property listings</p>
                </div>
              </div>
            </div>
            <Link href="/offers/new">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Offer
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <CardTitle>Search & Filter</CardTitle>
                <CardDescription>Find specific property offers</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by owner name, address, city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Property Type
                  </label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Maison">Maison</SelectItem>
                      <SelectItem value="Immeuble">Immeuble</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    City
                  </label>
                  <Select value={filterCity} onValueChange={setFilterCity}>
                    <SelectTrigger>
                      <SelectValue placeholder="All cities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Cities</SelectItem>
                      {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Min Price (€)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Max Price (€)
                  </label>
                  <Input
                    type="number"
                    placeholder="1000000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Sort Options */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
              <div className="flex-1">
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Sort By
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="createdAt">Date Created</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                    <SelectItem value="surface">Surface</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center space-x-2"
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
          <Alert>
            <AlertDescription>
              Showing {filteredOffers.length} of {offers.length} property offers
            </AlertDescription>
          </Alert>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOffers.map((offer) => (
            <Card key={offer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    {getPropertyTypeIcon(offer.propertyType)}
                    <CardTitle className="text-lg">{offer.propertyType}</CardTitle>
                  </div>
                  <Badge className={getStatusColor(offer.status)}>
                    {offer.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm">
                  {offer.ownerFirstName} {offer.ownerLastName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4" />
                    <span>{offer.address}, {offer.city}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Square className="h-4 w-4" />
                      <span>{offer.surface}m²</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Banknote className="h-4 w-4" />
                      <span>€{offer.price.toLocaleString()}</span>
                    </div>
                  </div>
                  {offer.bedrooms && (
                    <div className="text-sm text-slate-600">
                      {offer.bedrooms} bedroom{offer.bedrooms !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {offer.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {offer.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-slate-500">
                    Added {new Date(offer.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Link href={`/offers/${offer.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(offer.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOffers.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No offers found
            </h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Link href="/offers/new">
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