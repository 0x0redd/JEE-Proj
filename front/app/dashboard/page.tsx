'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Home, 
  Banknote, 
  MapPin, 
  Square,
  Calendar,
  Plus,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  totalOffers: number;
  totalDemands: number;
  avgOfferedPrice: number;
  avgDemandedPrice: number;
  avgOfferedSurface: number;
  avgDemandedSurface: number;
  propertyTypes: {
    offers: { [key: string]: number };
    demands: { [key: string]: number };
  };
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalOffers: 0,
    totalDemands: 0,
    avgOfferedPrice: 0,
    avgDemandedPrice: 0,
    avgOfferedSurface: 0,
    avgDemandedSurface: 0,
    propertyTypes: {
      offers: { Maison: 0, Immeuble: 0, Villa: 0 },
      demands: { Maison: 0, Immeuble: 0, Villa: 0 }
    }
  });
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    // Get user data
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Load mock data for demo
    loadMockData();
  }, [router]);

  const loadMockData = () => {
    // Mock statistics for demonstration
    setStats({
      totalOffers: 47,
      totalDemands: 23,
      avgOfferedPrice: 285000,
      avgDemandedPrice: 195000,
      avgOfferedSurface: 125,
      avgDemandedSurface: 98,
      propertyTypes: {
        offers: { Maison: 22, Immeuble: 15, Villa: 10 },
        demands: { Maison: 12, Immeuble: 8, Villa: 3 }
      }
    });
  };

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminUser');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">PremiumEstate</h1>
                <p className="text-sm text-slate-600">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-600">{user.role}</p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-slate-600">
            Here's an overview of your real estate management system
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Offers</p>
                  <p className="text-3xl font-bold">{stats.totalOffers}</p>
                </div>
                <Building2 className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Client Demands</p>
                  <p className="text-3xl font-bold">{stats.totalDemands}</p>
                </div>
                <Users className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Avg. Offer Price</p>
                  <p className="text-2xl font-bold">€{stats.avgOfferedPrice.toLocaleString()}</p>
                </div>
                <Banknote className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Avg. Surface</p>
                  <p className="text-2xl font-bold">{stats.avgOfferedSurface}m²</p>
                </div>
                <Square className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Property Types Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>Property Offers by Type</span>
              </CardTitle>
              <CardDescription>
                Distribution of property offers by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.propertyTypes.offers).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span className="font-medium text-slate-900">{type}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(count / stats.totalOffers) * 100}%` }}
                        ></div>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-green-600" />
                <span>Client Demands by Type</span>
              </CardTitle>
              <CardDescription>
                Distribution of client demands by property type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.propertyTypes.demands).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-600 rounded"></div>
                      <span className="font-medium text-slate-900">{type}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${(count / stats.totalDemands) * 100}%` }}
                        ></div>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Property Offers Management</CardTitle>
              <CardDescription>
                Manage property listings and owner information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium">Property Offers</p>
                    <p className="text-sm text-slate-600">{stats.totalOffers} active listings</p>
                  </div>
                </div>
                <div className="space-x-2">
                  <Link href="/offers">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                  <Link href="/offers/new">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Client Demands Management</CardTitle>
              <CardDescription>
                Manage client requests and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium">Client Demands</p>
                    <p className="text-sm text-slate-600">{stats.totalDemands} active requests</p>
                  </div>
                </div>
                <div className="space-x-2">
                  <Link href="/demands">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                  <Link href="/demands/new">
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-slate-600" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest updates and activities in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'offer', action: 'New property offer added', details: 'Villa in Downtown - €320,000', time: '2 hours ago' },
                { type: 'demand', action: 'Client demand updated', details: 'John Doe - Looking for Apartment', time: '4 hours ago' },
                { type: 'offer', action: 'Property offer edited', details: 'House on Maple Street - Price updated', time: '1 day ago' },
                { type: 'demand', action: 'New client demand', details: 'Sarah Johnson - Villa under €250,000', time: '2 days ago' }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'offer' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {activity.type === 'offer' ? (
                      <Building2 className={`h-4 w-4 ${
                        activity.type === 'offer' ? 'text-blue-600' : 'text-green-600'
                      }`} />
                    ) : (
                      <Users className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900">{activity.action}</p>
                    <p className="text-sm text-slate-600">{activity.details}</p>
                  </div>
                  <div className="text-sm text-slate-500">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}