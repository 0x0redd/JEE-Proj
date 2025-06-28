"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
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
  const [successMessage, setSuccessMessage] = useState<string>('');
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
      newErrors.clientFirstName = 'Le prénom est requis';
    }
    if (!formData.clientLastName.trim()) {
      newErrors.clientLastName = 'Le nom est requis';
    }
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = 'Le numéro de téléphone est requis';
    }
    if (!formData.demandType) {
      newErrors.demandType = 'Le type de demande est requis';
    }
    if (!formData.propertyType) {
      newErrors.propertyType = 'Le type de bien est requis';
    }
    if (!formData.desiredSurface.trim()) {
      newErrors.desiredSurface = 'La surface désirée est requise';
    } else if (isNaN(Number(formData.desiredSurface)) || Number(formData.desiredSurface) <= 0) {
      newErrors.desiredSurface = 'La surface doit être un nombre positif';
    }
    if (!formData.budget.trim()) {
      newErrors.budget = 'Le budget est requis';
    } else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      newErrors.budget = 'Le budget doit être un nombre positif';
    }
    if (formData.floor && (isNaN(Number(formData.floor)) || Number(formData.floor) < 0)) {
      newErrors.floor = 'L\'étage doit être un nombre valide';
    }
    if (formData.bedrooms && (isNaN(Number(formData.bedrooms)) || Number(formData.bedrooms) < 0)) {
      newErrors.bedrooms = 'Le nombre de chambres doit être un nombre valide';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const mapDemandTypeToBackend = (frontendType: string): string => {
    switch (frontendType) {
      case 'Achat':
        return 'ACHAT';
      case 'Loyer':
        return 'LOCATION';
      default:
        return 'ACHAT';
    }
  };

  const mapPropertyTypeToBackend = (frontendType: string): string => {
    switch (frontendType) {
      case 'Maison':
        return 'VILLA';
      case 'Immeuble':
        return 'APPARTEMENT';
      case 'Villa':
        return 'VILLA';
      default:
        return 'APPARTEMENT';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const demandeData = {
        nomClient: formData.clientLastName,
        prenomClient: formData.clientFirstName,
        telephoneClient: formData.clientPhone,
        typeDemande: mapDemandTypeToBackend(formData.demandType),
        typeBien: mapPropertyTypeToBackend(formData.propertyType),
        surfaceDemandee: formData.desiredSurface ? Number(formData.desiredSurface) : null,
        nbChambres: formData.bedrooms ? Number(formData.bedrooms) : null,
        etageSouhaite: formData.floor ? Number(formData.floor) : null,
        prixSouhaite: formData.budget ? Number(formData.budget) : null,
        localisationSouhaitee: formData.preferredLocation || null,
        notesSupplementaires: formData.notes || null
      };

      console.log('Sending demande data:', demandeData);

      const response = await fetch('http://localhost:8080/demandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(demandeData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`Erreur HTTP: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Demande créée avec succès:', result);
      
      setSuccessMessage('Votre demande a été soumise avec succès ! Nous vous contacterons bientôt.');
      
      // Reset form
      setFormData({
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

      if (onSuccess) onSuccess();
      
      // Redirect after a short delay
      setTimeout(() => {
        if (redirectTo) {
          router.push(redirectTo);
        }
      }, 2000);

    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setErrors({ 
        general: `Une erreur est survenue lors de la soumission de votre demande: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.general && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{errors.general}</AlertDescription>
        </Alert>
      )}
      
      {successMessage && (
        <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <AlertDescription className="text-green-800 dark:text-green-200">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-6 bg-white dark:bg-[#18181b] border border-slate-200 dark:border-slate-800">
        <CardHeader className="dark:bg-[#18181b]">
          <CardTitle className="flex items-center space-x-2 text-slate-900 dark:text-white">
            <User className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            <span>Informations du client</span>
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">Saisissez les coordonnées du client</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 dark:bg-[#18181b]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientFirstName" className="required text-slate-900 dark:text-slate-200">Prénom</Label>
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
              <Label htmlFor="clientLastName" className="required text-slate-900 dark:text-slate-200">Nom</Label>
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
            <Label htmlFor="clientPhone" className="required text-slate-900 dark:text-slate-200">Numéro de téléphone</Label>
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
            <span>Détails de la demande</span>
          </CardTitle>
          <CardDescription className="text-slate-600 dark:text-slate-400">Spécifiez les exigences immobilières du client</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 dark:bg-[#18181b]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="demandType" className="required text-slate-900 dark:text-slate-200">Type de demande</Label>
              <Select 
                value={formData.demandType} 
                onValueChange={(value: string) => handleSelectChange('demandType', value)}
              >
                <SelectTrigger className={errors.demandType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionnez le type de demande" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Achat">Achat</SelectItem>
                  <SelectItem value="Loyer">Location</SelectItem>
                </SelectContent>
              </Select>
              {errors.demandType && (
                <p className="text-sm text-red-600">{errors.demandType}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyType" className="required text-slate-900 dark:text-slate-200">Type de bien</Label>
              <Select 
                value={formData.propertyType} 
                onValueChange={(value: string) => handleSelectChange('propertyType', value)}
              >
                <SelectTrigger className={errors.propertyType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionnez le type de bien" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maison">Maison</SelectItem>
                  <SelectItem value="Immeuble">Appartement</SelectItem>
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
              <Label htmlFor="desiredSurface" className="required text-slate-900 dark:text-slate-200">Surface désirée (m²)</Label>
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
              <Label htmlFor="bedrooms" className="text-slate-900 dark:text-slate-200">Nombre de chambres (optionnel)</Label>
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
              <Label htmlFor="floor" className="text-slate-900 dark:text-slate-200">Étage souhaité (optionnel)</Label>
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
              <Label htmlFor="preferredLocation" className="text-slate-900 dark:text-slate-200">Localisation souhaitée (optionnel)</Label>
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
            <Label htmlFor="notes" className="text-slate-900 dark:text-slate-200">Notes supplémentaires (optionnel)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Toute exigence spécifique, préférence ou information supplémentaire sur les besoins du client..."
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
            'Envoi en cours...'
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Soumettre la demande
            </>
          )}
        </Button>
      </div>
    </form>
  );
} 