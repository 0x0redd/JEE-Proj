'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Badge } from '../../../components/ui/badge';
import { Alert, AlertDescription } from '../../../components/ui/alert';
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
  User,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ClientDemand {
  id: string;
  nomClient: string;
  prenomClient: string;
  telephoneClient: string;
  typeDemande: 'ACHAT' | 'LOCATION';
  typeBien: 'APPARTEMENT' | 'VILLA' | 'BUREAUX' | 'COMMERCE' | 'TERRAIN';
  surfaceDemandee?: number;
  nbChambres?: number;
  etageSouhaite?: number;
  prixSouhaite?: number;
  localisationSouhaitee?: string;
  notesSupplementaires?: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    loadDemands();
  }, [router]);

  useEffect(() => {
    // Apply filters and search
    let filtered = demands.filter(demand => {
      const matchesSearch = !searchTerm || 
        demand.nomClient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demand.prenomClient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demand.telephoneClient.includes(searchTerm) ||
        (demand.localisationSouhaitee && demand.localisationSouhaitee.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = filterType === 'all' || demand.typeBien === filterType;
      const matchesDemandType = filterDemandType === 'all' || demand.typeDemande === filterDemandType;
      
      const matchesBudget = (!budgetRange.min || (demand.prixSouhaite && demand.prixSouhaite >= parseInt(budgetRange.min))) &&
                           (!budgetRange.max || (demand.prixSouhaite && demand.prixSouhaite <= parseInt(budgetRange.max)));

      return matchesSearch && matchesType && matchesDemandType && matchesBudget;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'prixSouhaite':
          aValue = a.prixSouhaite;
          bValue = b.prixSouhaite;
          break;
        case 'surfaceDemandee':
          aValue = a.surfaceDemandee;
          bValue = b.surfaceDemandee;
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

  const loadDemands = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8080/demandes/all');
      if (!response.ok) {
        throw new Error(`Failed to fetch demands: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched demands:', data);
      
      setDemands(data);
    } catch (err) {
      console.error('Error loading demands:', err);
      setError(err instanceof Error ? err.message : 'Failed to load demands');
    } finally {
      setLoading(false);
    }
  };

  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:8080/demandes/all');
      const text = await response.text();
      console.log('Backend test response:', text);
      alert(`Backend connection test: ${response.ok ? 'Success' : 'Failed'} - ${response.status}`);
    } catch (err) {
      console.error('Backend connection test failed:', err);
      alert('Backend connection test failed: ' + err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this demand?')) {
      return;
    }

    try {
      setDeletingId(id);
      
      console.log('Attempting to delete demand with ID:', id);
      
      const response = await fetch(`http://localhost:8080/demandes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Delete response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Delete response error:', errorText);
        throw new Error(`Failed to delete demand: ${response.status} - ${errorText}`);
      }

      // Remove from local state
      setDemands(prevDemands => prevDemands.filter(demand => demand.id !== id));
      
      // Show success message
      console.log('Demand deleted successfully');
      alert('Demand deleted successfully!');
      
    } catch (err) {
      console.error('Error deleting demand:', err);
      alert(`Failed to delete demand: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'VILLA':
        return <Home className="h-4 w-4" />;
      case 'APPARTEMENT':
        return <Home className="h-4 w-4" />;
      case 'BUREAUX':
        return <Home className="h-4 w-4" />;
      case 'COMMERCE':
        return <Home className="h-4 w-4" />;
      case 'TERRAIN':
        return <Home className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  const getDemandTypeColor = (type: string) => {
    switch (type) {
      case 'ACHAT':
        return 'bg-purple-100 text-purple-800';
      case 'LOCATION':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-slate-600 dark:text-slate-400">Loading demands...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Users className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Error loading demands
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <Button onClick={loadDemands}>
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
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-2 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">Client Demands</h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Manage client requests</p>
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
              <Link href="/dashboard/demands/new">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Demand
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
                <CardDescription className="dark:text-slate-400">Find specific client demands</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 dark:border-slate-700 dark:text-slate-200"
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
                placeholder="Search by client name, phone, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400"
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
                    <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                      <SelectItem value="all" className="dark:text-slate-200">All Types</SelectItem>
                      <SelectItem value="APPARTEMENT" className="dark:text-slate-200">Appartement</SelectItem>
                      <SelectItem value="VILLA" className="dark:text-slate-200">Villa</SelectItem>
                      <SelectItem value="BUREAUX" className="dark:text-slate-200">Bureau</SelectItem>
                      <SelectItem value="COMMERCE" className="dark:text-slate-200">Commerce</SelectItem>
                      <SelectItem value="TERRAIN" className="dark:text-slate-200">Terrain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Demand Type
                  </label>
                  <Select value={filterDemandType} onValueChange={setFilterDemandType}>
                    <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200">
                      <SelectValue placeholder="All demand types" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                      <SelectItem value="all" className="dark:text-slate-200">All Demand Types</SelectItem>
                      <SelectItem value="ACHAT" className="dark:text-slate-200">Achat</SelectItem>
                      <SelectItem value="LOCATION" className="dark:text-slate-200">Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Min Budget (€)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={budgetRange.min}
                    onChange={(e) => setBudgetRange(prev => ({ ...prev, min: e.target.value }))}
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                    Max Budget (€)
                  </label>
                  <Input
                    type="number"
                    placeholder="1000000"
                    value={budgetRange.max}
                    onChange={(e) => setBudgetRange(prev => ({ ...prev, max: e.target.value }))}
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:placeholder:text-slate-400"
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
                  <SelectTrigger className="dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                    <SelectItem value="createdAt" className="dark:text-slate-200">Date Created</SelectItem>
                    <SelectItem value="prixSouhaite" className="dark:text-slate-200">Budget</SelectItem>
                    <SelectItem value="surfaceDemandee" className="dark:text-slate-200">Surface</SelectItem>
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
              Showing {filteredDemands.length} of {demands.length} client demands
            </AlertDescription>
          </Alert>
        </div>

        {/* Demands Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDemands.map((demand) => (
            <Card key={demand.id} className="hover:shadow-lg transition-shadow dark:bg-slate-800 dark:border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    <CardTitle className="text-lg dark:text-white">
                      {demand.nomClient} {demand.prenomClient}
                    </CardTitle>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getDemandTypeColor(demand.typeDemande)} variant="outline">
                    {demand.typeDemande}
                  </Badge>
                  <Badge variant="outline" className="flex items-center space-x-1 dark:border-slate-600 dark:text-slate-200">
                    {getPropertyTypeIcon(demand.typeBien)}
                    <span>{demand.typeBien}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <Phone className="h-4 w-4" />
                    <span>{demand.telephoneClient}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <Square className="h-4 w-4" />
                      <span>{demand.surfaceDemandee}m²</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Banknote className="h-4 w-4" />
                      <span>€{demand.prixSouhaite?.toLocaleString()}</span>
                    </div>
                  </div>
                  {demand.nbChambres && (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {demand.nbChambres} bedroom{demand.nbChambres !== 1 ? 's' : ''}
                    </div>
                  )}
                  {demand.localisationSouhaitee && (
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Preferred: {demand.localisationSouhaitee}
                    </div>
                  )}
                </div>

                {demand.notesSupplementaires && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                    {demand.notesSupplementaires}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Added {new Date(demand.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="dark:border-slate-700 dark:text-slate-200">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Link href={`/demands/${demand.id}/edit`}>
                      <Button variant="outline" size="sm" className="dark:border-slate-700 dark:text-slate-200">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(demand.id)}
                      disabled={deletingId === demand.id}
                      className="text-red-600 hover:text-red-700 dark:border-slate-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      {deletingId === demand.id ? (
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

        {filteredDemands.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-slate-400 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No demands found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
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