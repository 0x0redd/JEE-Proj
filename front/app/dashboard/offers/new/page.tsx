'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Textarea } from '../../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { Alert, AlertDescription } from '../../../../components/ui/alert';
import { ArrowLeft, Building2, Save, User, Phone, MapPin, Home, Banknote, Square, Loader2, Upload, X, Image } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PropertyOfferForm {
  nomProprietaire: string;
  prenomProprietaire: string;
  telephoneProprietaire: string;
  adresseBien: string;
  surface: string;
  etage: string;
  typeBien: string;
  prixPropose: string;
  localisationVille: string;
  localisationQuartier: string;
  descriptionBien: string;
  nbChambresOffre: string;
}

interface UploadedImage {
  file: File;
  preview: string;
  uploaded: boolean;
  url?: string;
}

export default function NewOfferPage() {
  const [formData, setFormData] = useState<PropertyOfferForm>({
    nomProprietaire: '',
    prenomProprietaire: '',
    telephoneProprietaire: '',
    adresseBien: '',
    surface: '',
    etage: '',
    typeBien: '',
    prixPropose: '',
    localisationVille: '',
    localisationQuartier: '',
    descriptionBien: '',
    nbChambresOffre: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    const newImages: UploadedImage[] = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploaded: false
    }));

    setUploadedImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const uploadImages = async (): Promise<string[]> => {
    if (uploadedImages.length === 0) return [];

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < uploadedImages.length; i++) {
        const image = uploadedImages[i];
        if (image.uploaded && image.url) {
          uploadedUrls.push(image.url);
          continue;
        }

        const formData = new FormData();
        formData.append('image', image.file);

        const response = await fetch('http://localhost:8080/offres/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload image ${image.file.name}: ${response.statusText}`);
        }

        const result = await response.json();
        uploadedUrls.push(result.imageUrl);

        // Update the image status
        setUploadedImages(prev => prev.map((img, idx) => 
          idx === i ? { ...img, uploaded: true, url: result.imageUrl } : img
        ));
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    } finally {
      setUploadingImages(false);
    }

    return uploadedUrls;
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Required fields
    if (!formData.nomProprietaire.trim()) {
      newErrors.nomProprietaire = 'Owner last name is required';
    }
    if (!formData.prenomProprietaire.trim()) {
      newErrors.prenomProprietaire = 'Owner first name is required';
    }
    if (!formData.telephoneProprietaire.trim()) {
      newErrors.telephoneProprietaire = 'Owner phone is required';
    }
    if (!formData.adresseBien.trim()) {
      newErrors.adresseBien = 'Address is required';
    }
    if (!formData.surface.trim()) {
      newErrors.surface = 'Surface area is required';
    } else if (isNaN(Number(formData.surface)) || Number(formData.surface) <= 0) {
      newErrors.surface = 'Surface must be a positive number';
    }
    if (!formData.typeBien) {
      newErrors.typeBien = 'Property type is required';
    }
    if (!formData.prixPropose.trim()) {
      newErrors.prixPropose = 'Price is required';
    } else if (isNaN(Number(formData.prixPropose)) || Number(formData.prixPropose) <= 0) {
      newErrors.prixPropose = 'Price must be a positive number';
    }
    if (!formData.localisationVille.trim()) {
      newErrors.localisationVille = 'City is required';
    }
    if (!formData.localisationQuartier.trim()) {
      newErrors.localisationQuartier = 'District is required';
    }

    // Optional numeric fields validation
    if (formData.etage && (isNaN(Number(formData.etage)) || Number(formData.etage) < 0)) {
      newErrors.etage = 'Floor must be a valid number';
    }
    if (formData.nbChambresOffre && (isNaN(Number(formData.nbChambresOffre)) || Number(formData.nbChambresOffre) < 0)) {
      newErrors.nbChambresOffre = 'Number of bedrooms must be a valid number';
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
    setErrors({});

    try {
      // Upload images first
      const imageUrls = await uploadImages();

      // Prepare data for backend
      const offerData = {
        nomProprietaire: formData.nomProprietaire.trim(),
        prenomProprietaire: formData.prenomProprietaire.trim(),
        telephoneProprietaire: formData.telephoneProprietaire.trim(),
        adresseBien: formData.adresseBien.trim(),
        surface: Number(formData.surface),
        etage: formData.etage ? Number(formData.etage) : null,
        typeBien: formData.typeBien,
        prixPropose: Number(formData.prixPropose),
        localisationVille: formData.localisationVille.trim(),
        localisationQuartier: formData.localisationQuartier.trim(),
        descriptionBien: formData.descriptionBien.trim() || null,
        nbChambresOffre: formData.nbChambresOffre ? Number(formData.nbChambresOffre) : null,
        statutOffre: 'DISPONIBLE',
        photos: imageUrls
      };

      console.log('Submitting offer data:', offerData);

      const response = await fetch('http://localhost:8080/offres', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offerData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Server error:', errorData);
        throw new Error(`Failed to create offer: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('Offer created successfully:', result);
      
      setSuccess(true);
      
      // Redirect to offers list after a short delay
      setTimeout(() => {
        router.push('/dashboard/offers');
      }, 1500);
      
    } catch (error) {
      console.error('Error creating offer:', error);
      setErrors({ 
        general: error instanceof Error ? error.message : 'An error occurred while saving the offer. Please try again.' 
      });
    }

    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Save className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
            Offer Created Successfully!
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Redirecting to offers list...
          </p>
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/dashboard/offers">
              <Button variant="ghost" size="sm" className="mr-4 dark:text-slate-200 dark:hover:bg-slate-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Offers
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Add New Property Offer</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">Create a new property listing</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          {/* General Error */}
          {errors.general && (
            <Alert variant="destructive" className="mb-6 dark:bg-red-900/50 dark:border-red-800">
              <AlertDescription className="dark:text-red-200">{errors.general}</AlertDescription>
            </Alert>
          )}

          {/* Owner Information */}
          <Card className="mb-6 dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-white">
                <User className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span>Owner Information</span>
              </CardTitle>
              <CardDescription className="dark:text-slate-400">
                Enter the property owner's contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prenomProprietaire" className="required dark:text-slate-200">First Name</Label>
                  <Input
                    id="prenomProprietaire"
                    name="prenomProprietaire"
                    type="text"
                    placeholder="Jean"
                    value={formData.prenomProprietaire}
                    onChange={handleInputChange}
                    className={`${errors.prenomProprietaire ? 'border-red-500' : ''} dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400`}
                  />
                  {errors.prenomProprietaire && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.prenomProprietaire}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nomProprietaire" className="required dark:text-slate-200">Last Name</Label>
                  <Input
                    id="nomProprietaire"
                    name="nomProprietaire"
                    type="text"
                    placeholder="Martin"
                    value={formData.nomProprietaire}
                    onChange={handleInputChange}
                    className={`${errors.nomProprietaire ? 'border-red-500' : ''} dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400`}
                  />
                  {errors.nomProprietaire && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.nomProprietaire}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telephoneProprietaire" className="required dark:text-slate-200">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <Input
                    id="telephoneProprietaire"
                    name="telephoneProprietaire"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.telephoneProprietaire}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.telephoneProprietaire ? 'border-red-500' : ''} dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400`}
                  />
                </div>
                {errors.telephoneProprietaire && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.telephoneProprietaire}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card className="mb-6 dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-white">
                <Home className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span>Property Details</span>
              </CardTitle>
              <CardDescription className="dark:text-slate-400">
                Provide detailed information about the property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adresseBien" className="required dark:text-slate-200">Full Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <Input
                    id="adresseBien"
                    name="adresseBien"
                    type="text"
                    placeholder="15 Rue de la Paix"
                    value={formData.adresseBien}
                    onChange={handleInputChange}
                    className={`pl-10 ${errors.adresseBien ? 'border-red-500' : ''} dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400`}
                  />
                </div>
                {errors.adresseBien && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.adresseBien}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="localisationVille" className="required dark:text-slate-200">City</Label>
                  <Input
                    id="localisationVille"
                    name="localisationVille"
                    type="text"
                    placeholder="Paris"
                    value={formData.localisationVille}
                    onChange={handleInputChange}
                    className={`${errors.localisationVille ? 'border-red-500' : ''} dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400`}
                  />
                  {errors.localisationVille && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.localisationVille}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localisationQuartier" className="required dark:text-slate-200">District</Label>
                  <Input
                    id="localisationQuartier"
                    name="localisationQuartier"
                    type="text"
                    placeholder="1er"
                    value={formData.localisationQuartier}
                    onChange={handleInputChange}
                    className={`${errors.localisationQuartier ? 'border-red-500' : ''} dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400`}
                  />
                  {errors.localisationQuartier && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.localisationQuartier}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="typeBien" className="required dark:text-slate-200">Property Type</Label>
                  <Select 
                    value={formData.typeBien} 
                    onValueChange={(value) => handleSelectChange('typeBien', value)}
                  >
                    <SelectTrigger className={`${errors.typeBien ? 'border-red-500' : ''} dark:bg-slate-700 dark:border-slate-600 dark:text-white`}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-slate-800 dark:border-slate-700">
                      <SelectItem value="APPARTEMENT" className="dark:text-white dark:hover:bg-slate-700">Appartement</SelectItem>
                      <SelectItem value="VILLA" className="dark:text-white dark:hover:bg-slate-700">Villa</SelectItem>
                      <SelectItem value="BUREAUX" className="dark:text-white dark:hover:bg-slate-700">Bureaux</SelectItem>
                      <SelectItem value="COMMERCE" className="dark:text-white dark:hover:bg-slate-700">Commerce</SelectItem>
                      <SelectItem value="TERRAIN" className="dark:text-white dark:hover:bg-slate-700">Terrain</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.typeBien && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.typeBien}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="surface" className="required dark:text-slate-200">Surface (m²)</Label>
                  <div className="relative">
                    <Square className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="surface"
                      name="surface"
                      type="number"
                      placeholder="120"
                      value={formData.surface}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.surface ? 'border-red-500' : ''} dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400`}
                    />
                  </div>
                  {errors.surface && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.surface}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="etage" className="dark:text-slate-200">Floor (optional)</Label>
                  <Input
                    id="etage"
                    name="etage"
                    type="number"
                    placeholder="2"
                    value={formData.etage}
                    onChange={handleInputChange}
                    className={`${errors.etage ? 'border-red-500' : ''} dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400`}
                  />
                  {errors.etage && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.etage}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prixPropose" className="required dark:text-slate-200">Price (€)</Label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="prixPropose"
                      name="prixPropose"
                      type="number"
                      placeholder="285000"
                      value={formData.prixPropose}
                      onChange={handleInputChange}
                      className={`pl-10 ${errors.prixPropose ? 'border-red-500' : ''} dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400`}
                    />
                  </div>
                  {errors.prixPropose && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.prixPropose}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nbChambresOffre" className="dark:text-slate-200">Number of Bedrooms (optional)</Label>
                  <Input
                    id="nbChambresOffre"
                    name="nbChambresOffre"
                    type="number"
                    placeholder="3"
                    value={formData.nbChambresOffre}
                    onChange={handleInputChange}
                    className={`${errors.nbChambresOffre ? 'border-red-500' : ''} dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400`}
                  />
                  {errors.nbChambresOffre && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.nbChambresOffre}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descriptionBien" className="dark:text-slate-200">Description (optional)</Label>
                <Textarea
                  id="descriptionBien"
                  name="descriptionBien"
                  placeholder="Beautiful apartment in the heart of Paris with modern amenities..."
                  value={formData.descriptionBien}
                  onChange={handleInputChange}
                  rows={4}
                  className="dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Property Images */}
          <Card className="mb-6 dark:bg-slate-800 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 dark:text-white">
                <Image className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                <span>Property Images</span>
              </CardTitle>
              <CardDescription className="dark:text-slate-400">
                Upload photos of the property (optional, max 5MB per image)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="images" className="dark:text-slate-200">Upload Images</Label>
                <div className="relative">
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="images"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Click to upload images or drag and drop
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                        PNG, JPG, JPEG up to 5MB each
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Image Preview */}
              {uploadedImages.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Selected Images ({uploadedImages.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600">
                          <img
                            src={image.preview}
                            alt={`Property image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        {image.uploaded && (
                          <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Uploaded
                          </div>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                          {image.file.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Progress */}
              {uploadingImages && (
                <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Uploading images...</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard/offers">
              <Button variant="outline" className="w-full sm:w-auto dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isLoading || uploadingImages}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {isLoading || uploadingImages ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {uploadingImages ? 'Uploading...' : 'Saving...'}
                </>
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