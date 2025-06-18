'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Building2, Save, User, Phone, MapPin, Home, Banknote, Square } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PropertyOfferForm {
  ownerFirstName: string;
  ownerLastName: string;
  ownerPhone: string;
  address: string;
  surface: string;
  floor: string;
  propertyType: string;
  price: string;
  city: string;
  district: string;
  description: string;
  bedrooms: string;
}

export default function NewOfferPage() {
  const [formData, setFormData] = useState<PropertyOfferForm>({
    ownerFirstName: '',
    ownerLastName: '',
    ownerPhone: '',
    address: '',
    surface: '',
    floor: '',
    propertyType: '',
    price: '',
    city: '',
    district: '',
    description: '',
    bedrooms: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user selects
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Required fields
    if (!formData.ownerFirstName.trim()) {
      newErrors.ownerFirstName = 'Owner first name is required';
    }
    if (!formData.ownerLastName.trim()) {
      newErrors.ownerLastName = 'Owner last name is required';
    }
    if (!formData.ownerPhone.trim()) {
      newErrors.ownerPhone = 'Owner phone is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.surface.trim()) {
      newErrors.surface = 'Surface area is required';
    } else if (isNaN(Number(formData.surface)) || Number(formData.surface) <= 0) {
      newErrors.surface = 'Surface must be a positive number';
    }
    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.district.trim()) {
      newErrors.district = 'District is required';
    }

    // Optional numeric fields validation
    if (formData.floor && (isNaN(Number(formData.floor)) || Number(formData.floor) < 0)) {
      newErrors.floor = 'Floor must be a valid number';
    }
    if (formData.bedrooms && (isNaN(Number(formData.bedrooms)) || Number(formData.bedrooms) < 0)) {
      newErrors.bedrooms = 'Number of bedrooms must be a valid number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would save to a database
      const newOffer = {
        id: Date.now().toString(),
        ...formData,
        surface: Number(formData.surface),
        floor: formData.floor ? Number(formData.floor) : undefined,
        price: Number(formData.price),
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        status: 'Available',
        createdAt: new Date().toISOString()
      };

      // Success - redirect to offers list
      router.push('/offers');
    } catch (error) {
      setErrors({ general: 'An error occurred while saving the offer. Please try again.' });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/offers">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Offers
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Add New Property Offer</h1>
                <p className="text-sm text-slate-600">Create a new property listing</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          {/* General Error */}
          {errors.general && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Owner Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-slate-600" />
                <span>Owner Information</span>
              </CardTitle>
              <CardDescription>
                Enter the property owner's contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ownerFirstName" className="required">First Name</Label>
                  <Input
                    id="ownerFirstName"
                    name="ownerFirstName"
                    type="text"
                    placeholder="Jean"
                    value={formData.ownerFirstName}
                    onChange={handleInputChange}
                    className={errors.ownerFirstName ? 'border-red-500' : ''}
                  />
                  {errors.ownerFirstName && (
                    <p className="text-sm text-red-600">{errors.ownerFirstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerLastName" className="required">Last Name</Label>
                  <Input
                    id="ownerLastName"
                    name="ownerLastName"
                    type="text"
                    placeholder="Martin"
                    value={formData.ownerLastName}
                    onChange={handleInputChange}
                    className={errors.ownerLastName ? 'border-red-500' : ''}
                  />
                  {errors.ownerLastName && (
                    <p className="text-sm text-red-600">{errors.ownerLastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerPhone" className="required">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="ownerPhone"
                    name="ownerPhone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.ownerPhone}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.ownerPhone ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.ownerPhone && (
                  <p className="text-sm text-red-600">{errors.ownerPhone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Home className="h-5 w-5 text-slate-600" />
                <span>Property Details</span>
              </CardTitle>
              <CardDescription>
                Provide detailed information about the property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="required">Full Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="15 Rue de la Paix"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.address ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="required">City</Label>
                  <Input
                    id="city"
                    name="city"
                    type="text"
                    placeholder="Paris"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district" className="required">District</Label>
                  <Input
                    id="district"
                    name="district"
                    type="text"
                    placeholder="1er"
                    value={formData.district}
                    onChange={handleInputChange}
                    className={errors.district ? 'border-red-500' : ''}
                  />
                  {errors.district && (
                    <p className="text-sm text-red-600">{errors.district}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyType" className="required">Property Type</Label>
                  <Select 
                    value={formData.propertyType} 
                    onValueChange={(value) => handleSelectChange('propertyType', value)}
                  >
                    <SelectTrigger className={errors.propertyType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maison">Maison</SelectItem>
                      <SelectItem value="Immeuble">Immeuble</SelectItem>
                      <SelectItem value="Villa">Villa</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.propertyType && (
                    <p className="text-sm text-red-600">{errors.propertyType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surface" className="required">Surface (m²)</Label>
                  <div className="relative">
                    <Square className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="surface"
                      name="surface"
                      type="number"
                      placeholder="120"
                      value={formData.surface}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.surface ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.surface && (
                    <p className="text-sm text-red-600">{errors.surface}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor">Floor (optional)</Label>
                  <Input
                    id="floor"
                    name="floor"
                    type="number"
                    placeholder="2"
                    value={formData.floor}
                    onChange={handleInputChange}
                    className={errors.floor ? 'border-red-500' : ''}
                  />
                  {errors.floor && (
                    <p className="text-sm text-red-600">{errors.floor}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="required">Price (€)</Label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      placeholder="285000"
                      value={formData.price}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.price ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-sm text-red-600">{errors.price}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Number of Bedrooms (optional)</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    placeholder="3"
                    value={formData.bedrooms}
                    onChange={handleInputChange}
                    className={errors.bedrooms ? 'border-red-500' : ''}
                  />
                  {errors.bedrooms && (
                    <p className="text-sm text-red-600">{errors.bedrooms}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Beautiful apartment in the heart of Paris with modern amenities..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <Link href="/offers">
              <Button variant="outline" className="w-full sm:w-auto">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                'Saving...'
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Property Offer
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}