'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import Image from 'next/image';
import { Button } from '../../components/ui/button';
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
import { useAuth } from '../../hooks/useAuth';

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
  recentActivity: Array<{
    type: 'offer' | 'demand';
    action: string;
    details: string;
    time: string;
  }>;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOffers: 0,
    totalDemands: 0,
    avgOfferedPrice: 0,
    avgDemandedPrice: 0,
    avgOfferedSurface: 0,
    avgDemandedSurface: 0,
    propertyTypes: {
      offers: {},
      demands: {}
    },
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      loadDashboardData();
    }
  }, [isLoading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch offers data
      const offersResponse = await fetch('http://localhost:8080/offres/all');
      if (!offersResponse.ok) {
        throw new Error(`Failed to fetch offers: ${offersResponse.status}`);
      }
      const offersData = await offersResponse.json();

      // Fetch demands data
      const demandsResponse = await fetch('http://localhost:8080/demandes');
      if (!demandsResponse.ok) {
        throw new Error(`Failed to fetch demands: ${demandsResponse.status}`);
      }
      const demandsData = await demandsResponse.json();

      // Calculate statistics
      const totalOffers = offersData.length;
      const totalDemands = demandsData.content ? demandsData.content.length : demandsData.length;

      // Calculate average prices
      const avgOfferedPrice = totalOffers > 0 
        ? offersData.reduce((sum: number, offer: any) => sum + (offer.prixPropose || 0), 0) / totalOffers 
        : 0;
      
      const avgDemandedPrice = totalDemands > 0 
        ? (demandsData.content || demandsData).reduce((sum: number, demand: any) => sum + (demand.prixSouhaite || 0), 0) / totalDemands 
        : 0;

      // Calculate average surfaces
      const avgOfferedSurface = totalOffers > 0 
        ? offersData.reduce((sum: number, offer: any) => sum + (offer.surface || 0), 0) / totalOffers 
        : 0;
      
      const avgDemandedSurface = totalDemands > 0 
        ? (demandsData.content || demandsData).reduce((sum: number, demand: any) => sum + (demand.surfaceDemandee || 0), 0) / totalDemands 
        : 0;

      // Calculate property type distribution for offers
      const offersByType: { [key: string]: number } = {};
      offersData.forEach((offer: any) => {
        const type = offer.typeBien || 'Unknown';
        offersByType[type] = (offersByType[type] || 0) + 1;
      });

      // Calculate property type distribution for demands
      const demandsByType: { [key: string]: number } = {};
      (demandsData.content || demandsData).forEach((demand: any) => {
        const type = demand.typeBien || 'Unknown';
        demandsByType[type] = (demandsByType[type] || 0) + 1;
      });

      // Generate recent activity
      const recentActivity = generateRecentActivity(offersData, demandsData.content || demandsData);

      setStats({
        totalOffers,
        totalDemands,
        avgOfferedPrice: Math.round(avgOfferedPrice),
        avgDemandedPrice: Math.round(avgDemandedPrice),
        avgOfferedSurface: Math.round(avgOfferedSurface),
        avgDemandedSurface: Math.round(avgDemandedSurface),
        propertyTypes: {
          offers: offersByType,
          demands: demandsByType
        },
        recentActivity
      });

    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = (offers: any[], demands: any[]) => {
    const activities: Array<{
      type: 'offer' | 'demand';
      action: string;
      details: string;
      time: string;
    }> = [];

    // Add recent offers
    offers.slice(0, 3).forEach((offer: any) => {
      activities.push({
        type: 'offer',
        action: 'New property offer added',
        details: `${offer.typeBien || 'Property'} - €${offer.prixPropose?.toLocaleString() || 'N/A'}`,
        time: formatTimeAgo(offer.createdAt)
      });
    });

    // Add recent demands
    demands.slice(0, 3).forEach((demand: any) => {
      activities.push({
        type: 'demand',
        action: 'New client demand',
        details: `${demand.prenomClient} ${demand.nomClient} - ${demand.typeBien || 'Property'}`,
        time: formatTimeAgo(demand.createdAt)
      });
    });

    // Sort by creation time (most recent first)
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 6);
  };

  const formatTimeAgo = (dateString: string) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">
            Error loading dashboard
          </h3>
          <p className="text-slate-600 mb-4">{error}</p>
          <Button onClick={loadDashboardData}>
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
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Image src="/sakani.svg" alt="Yakeey Logo" width={100} height={100} />
                <p className="text-sm text-slate-600 dark:text-slate-400">Gestion Immobilière</p>
              </Link>  
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">{user.role || 'Administrator'}</p>
              </div>
              <Button variant="outline" onClick={logout} className="dark:border-slate-700 dark:text-slate-200">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {user.name.split(' ')[0]}!
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
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
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>Property Offers by Type</span>
              </CardTitle>
              <CardDescription className="dark:text-slate-400">
                Distribution of property offers by type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.propertyTypes.offers).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      <span className="font-medium text-slate-900 dark:text-white">{type}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${stats.totalOffers > 0 ? (count / stats.totalOffers) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <Badge variant="secondary" className="dark:bg-slate-700 dark:text-slate-200">{count}</Badge>
                    </div>
                  </div>
                ))}
                {Object.keys(stats.propertyTypes.offers).length === 0 && (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-4">No offers data available</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
                <Users className="h-5 w-5 text-green-600" />
                <span>Client Demands by Type</span>
              </CardTitle>
              <CardDescription className="dark:text-slate-400">
                Distribution of client demands by property type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(stats.propertyTypes.demands).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-600 rounded"></div>
                      <span className="font-medium text-slate-900 dark:text-white">{type}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${stats.totalDemands > 0 ? (count / stats.totalDemands) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <Badge variant="secondary" className="dark:bg-slate-700 dark:text-slate-200">{count}</Badge>
                    </div>
                  </div>
                ))}
                {Object.keys(stats.propertyTypes.demands).length === 0 && (
                  <p className="text-slate-500 dark:text-slate-400 text-center py-4">No demands data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Property Offers Management</CardTitle>
              <CardDescription className="dark:text-slate-400">
                Manage property listings and owner information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Property Offers</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stats.totalOffers} active listings</p>
                  </div>
                </div>
                <div className="space-x-2">
                  <Link href="/dashboard/offers">
                    <Button variant="outline" size="sm" className="dark:border-slate-700 dark:text-slate-200">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                  <Link href="/dashboard/offers/new">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Client Demands Management</CardTitle>
              <CardDescription className="dark:text-slate-400">
                Manage client requests and requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Client Demands</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{stats.totalDemands} active requests</p>
                  </div>
                </div>
                <div className="space-x-2">
                  <Link href="/dashboard/demands">
                    <Button variant="outline" size="sm" className="dark:border-slate-700 dark:text-slate-200">
                      <Eye className="h-4 w-4 mr-2" />
                      View All
                    </Button>
                  </Link>
                  <Link href="/dashboard/demands/new">
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
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
              <Calendar className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription className="dark:text-slate-400">
              Latest updates and activities in your system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'offer' ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-green-100 dark:bg-green-900/50'
                    }`}>
                      {activity.type === 'offer' ? (
                        <Building2 className={`h-4 w-4 ${
                          activity.type === 'offer' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'
                        }`} />
                      ) : (
                        <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 dark:text-white">{activity.action}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{activity.details}</p>
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {activity.time}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}