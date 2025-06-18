'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Phone, 
  Banknote, 
  Square,
  Home,
  ArrowLeft,
  SortAsc,
  SortDesc,
  User
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ClientDemand {
  id: string;
  clientFirstName: string;
  clientLastName: string;
  clientPhone: string;
  demandType: 'Achat' | 'Loyer' | 'Hypothèque';
  propertyType: 'Maison' | 'Immeuble' | 'Villa';
  desiredSurface: number;
  bedrooms?: number;
  floor?: number;
  budget: number;
  preferredLocation?: string;
  notes?: string;
  status: 'Active' | 'Matched' | 'Closed';
  createdAt: string;
}

export default function DemandsPage() {
  const [demands, setDemands] = useState<ClientDemand[]>([]);
  const [filteredDemands, setFilteredDemands] = useState<ClientDemand[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDemandType, setFilterDemandType] = useState<string>('all');
  const [budgetRange, setBudgetRange] = useState({ min: '', max: '' });
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
    loadMockDemands();
  }, [router]);

  useEffect(() => {
    // Apply filters and search
    let filtered = demands.filter(demand => {
      const matchesSearch = !searchTerm || 
        demand.clientFirstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demand.clientLastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demand.clientPhone.includes(searchTerm) ||
        (demand.preferredLocation && demand.preferredLocation.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = filterType === 'all' || demand.propertyType === filterType;
      const matchesDemandType = filterDemandType === 'all' || demand.demandType === filterDemandType;
      
      const matchesBudget = (!budgetRange.min || demand.budget >= parseInt(budgetRange.min)) &&
                           (!budgetRange.max || demand.budget <= parseInt(budgetRange.max));

      return matchesSearch && matchesType && matchesDemandType && matchesBudget;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'budget':
          aValue = a.budget;
          bValue = b.budget;
          break;
        case 'surface':
          aValue = a.desiredSurface;
          bValue = b.desiredSurface;
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

    setFilteredDemands(filtered);
  }, [demands, searchTerm, filterType, filterDemandType, budgetRange, sortBy, sortOrder]);

  const loadMockDemands = () => {
    // Mock data for demonstration
    const mockDemands: ClientDemand[] = [
      {
        id: '1',
        clientFirstName: 'Sarah',
        clientLastName: 'Johnson',
        clientPhone: '+33 6 87 65 43 21',
        demandType: 'Achat',
        propertyType: 'Villa',
        desiredSurface: 150,
        bedrooms: 4,
        budget: 350000,
        preferredLocation: 'Nice, Côte d\'Azur',
        notes: 'Looking for a villa with garden and sea view',
        status: 'Active',
        createdAt: '2025-01-15T08:30:00Z'
      },
      {
        id: '2',
        clientFirstName: 'Paul',
        clientLastName: 'Michel',
        clientPhone: '+33 6 12 34 56 78',
        demandType: 'Loyer',
        propertyType: 'Immeuble',
        desiredSurface: 80,
        bedrooms: 2,
        floor: 3,
        budget: 1200,
        preferredLocation: 'Paris, Centre',
        notes: 'Monthly rental, close to metro station',
        status: 'Active',
        createdAt: '2025-01-14T10:15:00Z'
      },
      {
        id: '3',
        clientFirstName: 'Emma',
        clientLastName: 'Dubois',
        clientPhone: '+33 6 99 88 77 66',
        demandType: 'Achat',
        propertyType: 'Maison',
        desiredSurface: 120,
        bedrooms: 3,
        budget: 250000,
        preferredLocation: 'Lyon, Banlieue',
        notes: 'First-time buyer, looking for family home',
        status: 'Matched',
        createdAt: '2025-01-13T14:45:00Z'
      },
      {
        id: '4',
        clientFirstName: 'Thomas',
        clientLastName: 'Martin',
        clientPhone: '+33 6 55 44 33 22',
        demandType: 'Hypothèque',
        propertyType: 'Villa',
        desiredSurface: 200,
        bedrooms: 5,
        budget: 500000,
        preferredLocation: 'Cannes, Premium location',
        notes: 'Investment property, luxury segment',
        status: 'Active',
        createdAt: '2025-01-12T16:20:00Z'
      }
    ];

    setDemands(mockDemands);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this demand?')) {
      setDemands(demands.filter(demand => demand.id !== id));
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'Villa':
        return <Home className="h-4 w-4" />;
      case 'Maison':
        return <Home className="h-4 w-4" />;
      case 'Immeuble':
        return <Home className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Matched':
        return 'bg-blue-100 text-blue-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDemandTypeColor = (type: string) => {
    switch (type) {
      case 'Achat':
        return 'bg-purple-100 text-purple-800';
      case 'Loyer':
        return 'bg-orange-100 text-orange-800';
      case 'Hypothèque':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Client Demands</h1>
                  <p className="text-sm text-slate-600">Manage client requests</p>
                </div>
              </div>
            </div>
            <Link href="/demands/new">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Demand
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
                <CardDescription>Find specific client demands</CardDescription>
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
                placeholder="Search by client name, phone, location..."
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
                    Demand Type
                  </label>
                  <Select value={filterDemandType} onValueChange={setFilterDemandType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All demand types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Demand Types</SelectItem>
                      <SelectItem value="Achat">Achat</SelectItem>
                      <SelectItem value="Loyer">Loyer</SelectItem>
                      <SelectItem value="Hypothèque">Hypothèque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Min Budget (€)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={budgetRange.min}
                    onChange={(e) => setBudgetRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Max Budget (€)
                  </label>
                  <Input
                    type="number"
                    placeholder="1000000"
                    value={budgetRange.max}
                    onChange={(e) => setBudgetRange(prev => ({ ...prev, max: e.target.value }))}
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
                    <SelectItem value="budget">Budget</SelectItem>
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
              Showing {filteredDemands.length} of {demands.length} client demands
            </AlertDescription>
          </Alert>
        </div>

        {/* Demands Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDemands.map((demand) => (
            <Card key={demand.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-slate-600" />
                    <CardTitle className="text-lg">
                      {demand.clientFirstName} {demand.clientLastName}
                    </CardTitle>
                  </div>
                  <Badge className={getStatusColor(demand.status)}>
                    {demand.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getDemandTypeColor(demand.demandType)} variant="outline">
                    {demand.demandType}
                  </Badge>
                  <Badge variant="outline" className="flex items-center space-x-1">
                    {getPropertyTypeIcon(demand.propertyType)}
                    <span>{demand.propertyType}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{demand.clientPhone}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Square className="h-4 w-4" />
                      <span>{demand.desiredSurface}m²</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Banknote className="h-4 w-4" />
                      <span>€{demand.budget.toLocaleString()}</span>
                    </div>
                  </div>
                  {demand.bedrooms && (
                    <div className="text-sm text-slate-600">
                      {demand.bedrooms} bedroom{demand.bedrooms !== 1 ? 's' : ''}
                    </div>
                  )}
                  {demand.preferredLocation && (
                    <div className="text-sm text-slate-600">
                      Preferred: {demand.preferredLocation}
                    </div>
                  )}
                </div>

                {demand.notes && (
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {demand.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-slate-500">
                    Added {new Date(demand.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Link href={`/demands/${demand.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(demand.id)}
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

        {filteredDemands.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No demands found
            </h3>
            <p className="text-slate-600 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <Link href="/demands/new">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Demand
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}