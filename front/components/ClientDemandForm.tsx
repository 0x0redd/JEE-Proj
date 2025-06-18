"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Save, User, Phone, Home, Banknote, Square, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface ClientDemandFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

interface ClientDemandFormState {
  clientFirstName: string;
  clientLastName: string;
  clientPhone: string;
  demandType: string;
  propertyType: string;
  desiredSurface: string;
  bedrooms: string;
  floor: string;
  budget: string;
  preferredLocation: string;
  notes: string;
}

export function ClientDemandForm({ onSuccess, redirectTo }: ClientDemandFormProps) {
  const [formData, setFormData] = useState<ClientDemandFormState>({
    clientFirstName: '',
    clientLastName: '',
    clientPhone: '',
    demandType: '',
    propertyType: '',
    desiredSurface: '',
    bedrooms: '',
    floor: '',
    budget: '',
    preferredLocation: '',
    notes: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.clientFirstName.trim()) {
      newErrors.clientFirstName = 'Client first name is required';
    }
    if (!formData.clientLastName.trim()) {
      newErrors.clientLastName = 'Client last name is required';
    }
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'Client phone is required';
    }
    if (!formData.demandType) {
      newErrors.demandType = 'Demand type is required';
    }
    if (!formData.propertyType) {
      newErrors.propertyType = 'Property type is required';
    }
    if (!formData.desiredSurface.trim()) {
      newErrors.desiredSurface = 'Desired surface area is required';
    } else if (isNaN(Number(formData.desiredSurface)) || Number(formData.desiredSurface) <= 0) {
      newErrors.desiredSurface = 'Surface must be a positive number';
    }
    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    } else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      newErrors.budget = 'Budget must be a positive number';
    }
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
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (onSuccess) onSuccess();
      if (redirectTo) router.push(redirectTo);
    } catch (error) {
      setErrors({ general: 'An error occurred while saving the demand. Please try again.' });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}
      <Card className="mb-6 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800">
        <CardHeader className="dark:bg-[#18181b]">
          <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
            <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            <span>Client Information</span>
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">Enter the client's contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 dark:bg-[#18181b]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientFirstName" className="required text-slate-900 dark:text-slate-200">First Name</Label>
              <Input
                id="clientFirstName"
                name="clientFirstName"
                type="text"
                placeholder="Sarah"
                value={formData.clientFirstName}
                onChange={handleInputChange}
                className={errors.clientFirstName ? 'border-red-500' : ''}
              />
              {errors.clientFirstName && (
                <p className="text-sm text-red-600">{errors.clientFirstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientLastName" className="required text-slate-900 dark:text-slate-200">Last Name</Label>
              <Input
                id="clientLastName"
                name="clientLastName"
                type="text"
                placeholder="Johnson"
                value={formData.clientLastName}
                onChange={handleInputChange}
                className={errors.clientLastName ? 'border-red-500' : ''}
              />
              {errors.clientLastName && (
                <p className="text-sm text-red-600">{errors.clientLastName}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientPhone" className="required text-slate-900 dark:text-slate-200">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input
                id="clientPhone"
                name="clientPhone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={formData.clientPhone}
                onChange={handleInputChange}
                className={`pl-10 ${errors.clientPhone ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.clientPhone && (
              <p className="text-sm text-red-600">{errors.clientPhone}</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="mb-6 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800">
        <CardHeader className="dark:bg-[#18181b]">
          <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
            <Home className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            <span>Demand Details</span>
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">Specify the client's property requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 dark:bg-[#18181b]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="demandType" className="required text-slate-900 dark:text-slate-200">Demand Type</Label>
              <Select 
                value={formData.demandType} 
                onValueChange={(value) => handleSelectChange('demandType', value)}
              >
                <SelectTrigger className={errors.demandType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select demand type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Achat">Achat (Purchase)</SelectItem>
                  <SelectItem value="Loyer">Loyer (Rental)</SelectItem>
                  <SelectItem value="Hypothèque">Hypothèque (Mortgage)</SelectItem>
                </SelectContent>
              </Select>
              {errors.demandType && (
                <p className="text-sm text-red-600">{errors.demandType}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyType" className="required text-slate-900 dark:text-slate-200">Property Type</Label>
              <Select 
                value={formData.propertyType} 
                onValueChange={(value) => handleSelectChange('propertyType', value)}
              >
                <SelectTrigger className={errors.propertyType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select property type" />
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="desiredSurface" className="required text-slate-900 dark:text-slate-200">Desired Surface (m²)</Label>
              <div className="relative">
                <Square className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="desiredSurface"
                  name="desiredSurface"
                  type="number"
                  placeholder="150"
                  value={formData.desiredSurface}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.desiredSurface ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.desiredSurface && (
                <p className="text-sm text-red-600">{errors.desiredSurface}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms" className="text-slate-900 dark:text-slate-200">Number of Bedrooms (optional)</Label>
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
            <div className="space-y-2">
              <Label htmlFor="floor" className="text-slate-900 dark:text-slate-200">Preferred Floor (optional)</Label>
              <Input
                id="floor"
                name="floor"
                type="number"
                placeholder="3"
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
              <Label htmlFor="budget" className="required text-slate-900 dark:text-slate-200">Budget (€)</Label>
              <div className="relative">
                <Banknote className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="350000"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className={`pl-10 ${errors.budget ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.budget && (
                <p className="text-sm text-red-600">{errors.budget}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferredLocation" className="text-slate-900 dark:text-slate-200">Preferred Location (optional)</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                  id="preferredLocation"
                  name="preferredLocation"
                  type="text"
                  placeholder="Paris, Centre"
                  value={formData.preferredLocation}
                  onChange={handleInputChange}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-slate-900 dark:text-slate-200">Additional Notes (optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Any specific requirements, preferences, or additional information about the client's needs..."
              value={formData.notes}
              onChange={handleInputChange}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            'Saving...'
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Client Demand
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 