'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Key, Users, TrendingUp, ArrowRight, Phone, Mail, MapPin, Home, Banknote, Square, Eye, Search, MessageSquare } from 'lucide-react';
import Link from 'next/link';

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
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">PremiumEstate</h1>
                <p className="text-sm text-slate-600">Professional Real Estate Management</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/signin">
                <Button variant="outline" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                  Admin Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 bg-blue-50 text-blue-700 border-blue-200">
              Professional Real Estate Management Platform
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              Streamline Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-700 block">
                Real Estate Operations
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Comprehensive admin platform for managing property offers, client demands, 
              and real estate transactions with powerful analytics and reporting tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signin">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-3">
                  Access Admin Panel
                  <Key className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Offers Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Latest Property Offers
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Discover our newest premium properties available for purchase
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/offers">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  <Search className="mr-2 h-5 w-5" />
                  Explore All Offers
                </Button>
              </Link>
              <Link href="/demands/new">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg px-8 py-3">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Make a Demand
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestOffers.map((offer) => (
              <Card key={offer.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-blue-50 to-slate-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-slate-900 backdrop-blur-sm">
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
                    <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                      {offer.address}
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-blue-600">
                      {getPropertyTypeIcon(offer.propertyType)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Square className="h-4 w-4" />
                      <span>{offer.surface}m²</span>
                    </div>
                    {offer.bedrooms && (
                      <div className="flex items-center space-x-1">
                        <Home className="h-4 w-4" />
                        <span>{offer.bedrooms} ch.</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Banknote className="h-5 w-5 text-green-600" />
                      <span className="text-2xl font-bold text-slate-900">
                        €{offer.price.toLocaleString()}
                      </span>
                    </div>
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
                    <Button variant="outline" size="sm" className="group-hover:bg-blue-50 group-hover:border-blue-200">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/offers">
              <Button size="lg" variant="outline" className="text-lg px-12 py-3">
                View All Properties
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
            Looking for Something Specific?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10">
            Can't find what you're looking for? Submit a demand and we'll help you find the perfect property that matches your requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/offers">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4 bg-white text-blue-700 hover:bg-blue-50">
                <Search className="mr-2 h-5 w-5" />
                Browse All Offers
              </Button>
            </Link>
            <Link href="/demands/new">
              <Button size="lg" className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700 text-white border-0">
                <MessageSquare className="mr-2 h-5 w-5" />
                Submit Your Demand
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Powerful Admin Features
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to manage your real estate agency efficiently
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardHeader>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Property Management</CardTitle>
                <CardDescription>
                  Comprehensive property offer management with detailed listings, pricing, and availability tracking.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardHeader>
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Client Management</CardTitle>
                <CardDescription>
                  Track client demands, preferences, and requirements with advanced filtering and matching capabilities.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm">
              <CardHeader>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-lg w-fit mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Analytics & Reports</CardTitle>
                <CardDescription>
                  Detailed statistics, market analysis, and performance metrics to drive informed business decisions.
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
              Platform Performance
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Trusted by real estate professionals for efficient property management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: '250+', label: 'Properties Managed', icon: Building2 },
              { number: '150+', label: 'Active Clients', icon: Users },
              { number: '98%', label: 'Client Satisfaction', icon: TrendingUp },
              { number: '24/7', label: 'System Availability', icon: Key }
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Ready to Get Started?
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Access your admin dashboard to manage properties, clients, and track your business performance.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span>admin@premiumestate.com</span>
                  </div>
                  <div className="flex items-center space-x-3 text-slate-600">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <span>123 Business Ave, Suite 100</span>
                  </div>
                </div>
              </div>
              <div className="text-center lg:text-right">
                <Link href="/auth/signin">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-12 py-4">
                    Access Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <p className="text-sm text-slate-500 mt-4">
                  Secure admin access required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold">PremiumEstate</span>
          </div>
          <p className="text-slate-400 mb-4">
            Professional Real Estate Management Platform
          </p>
          <p className="text-slate-500 text-sm">
            © 2025 PremiumEstate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}