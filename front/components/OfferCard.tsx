'use client';

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Building2, Home, MapPin, Square, Banknote, Eye, Phone, Calendar, User } from 'lucide-react';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogContainer,
  MorphingDialogImage,
} from './core/morphing-dialog';
import { ScrollArea } from './website/scroll-area';
import { ImageService } from '../services/imageService';

import Image from 'next/image';

interface PropertyOffer {
  id: string;
  propertyType: string;
  address: string;
  city: string;
  district: string;
  price: number;
  surface: number;
  bedrooms?: number;
  description?: string;
  createdAt: string;
  status: string;
  ownerName?: string;
  ownerPhone?: string;
  floor?: number;
  photos?: string[];
}

const getPropertyTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'appartement':
      return <Home className="h-5 w-5" />;
    case 'maison':
      return <Building2 className="h-5 w-5" />;
    case 'villa':
      return <Building2 className="h-5 w-5" />;
    default:
      return <Building2 className="h-5 w-5" />;
  }
};

const getPropertyTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case 'appartement':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'maison':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'villa':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
};

// Function to get status display for client view
const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'DISPONIBLE':
      return {
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        text: 'Disponible',
        icon: '🟢'
      };
    case 'RESERVE':
      return {
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        text: 'Réservé',
        icon: '🟡'
      };
    case 'VENDU':
      return {
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        text: 'Vendu',
        icon: '🔵'
      };
    case 'INDISPONIBLE':
      return {
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        text: 'Indisponible',
        icon: '🔴'
      };
    default:
      return {
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        text: 'Inconnu',
        icon: '⚪'
      };
  }
};

interface OfferCardProps {
  offer: PropertyOffer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  // Default placeholder image - you can replace this with your own placeholder
  const defaultImage = '/placeholder-property.svg';

  // Helper function to get the correct image URL using ImageService
  const getImageUrl = (photoUrl: string) => {
    if (!photoUrl || photoUrl.trim() === '') return defaultImage;
    
    // Use ImageService to get the proper URL
    return ImageService.getImageUrl(photoUrl);
  };

  // Get the main image for display
  const mainImage = offer.photos && offer.photos.length > 0 
    ? getImageUrl(offer.photos[0]) 
    : defaultImage;

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <MorphingDialog
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              type: 'tween',
              duration: 0.2,
              ease: 'easeInOut',
            }
      }
    >
      <MorphingDialogTrigger
        style={{
          borderRadius: '8px',
        }}
        className="border-0 shadow-lg overflow-hidden dark:bg-slate-900 dark:border-slate-800 group hover:shadow-xl transition-all duration-300"
      >
        <Card className="border-0 shadow-lg overflow-hidden dark:bg-slate-900 dark:border-slate-800 group hover:shadow-xl transition-all duration-300">
          <div className="h-48 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute top-4 left-4">
              <Badge className={`${getPropertyTypeColor(offer.propertyType)} backdrop-blur-sm`}>
                {offer.propertyType}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className={`${getStatusDisplay(offer.status).color} backdrop-blur-sm`}>
                <span className="mr-1">{getStatusDisplay(offer.status).icon}</span>
                {getStatusDisplay(offer.status).text}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center space-x-2 text-sm font-medium">
                <MapPin className="h-4 w-4" />
                <span>
                  {offer.city}, {offer.district}
                </span>
              </div>
            </div>
            <img
              src={mainImage}
              alt={offer.address}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to default image if the main image fails to load
                const target = e.target as HTMLImageElement;
                target.src = defaultImage;
              }}
            />
          </div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors dark:text-white">
                {offer.address}
              </CardTitle>
              <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                {getPropertyTypeIcon(offer.propertyType)}
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-1">
                <Square className="h-4 w-4" />
                <span>{offer.surface}m²</span>
              </div>
              {offer.bedrooms && (
                <div className="flex items-center space-x-1">
                  <Home className="h-4 w-4" />
                  <span>{offer.bedrooms} pièces</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Banknote className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  {offer.price.toLocaleString()} €
                </span>
              </div>
            </div>

            {offer.description && (
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {offer.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t dark:border-slate-800">
              <span className="text-xs text-slate-500 dark:text-slate-500">
                Ajouté le {new Date(offer.createdAt).toLocaleDateString('fr-FR')}
              </span>
              <div className="inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 rounded-md group-hover:bg-blue-50 dark:group-hover:bg-blue-900/50 group-hover:border-blue-200 dark:group-hover:border-blue-800 dark:border-slate-700 dark:text-slate-200">
                <Eye className="h-4 w-4 mr-2" />
                Voir les Détails
              </div>
            </div>
          </CardContent>
        </Card>
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{
            borderRadius: '12px',
          }}
          className="relative h-auto w-[90vw] max-w-[600px] border border-gray-100 bg-white dark:bg-slate-900 dark:border-slate-700"
        >
          <ScrollArea className="h-[90vh]" type="scroll">
            <div className="relative p-6">
              <div className="flex justify-center py-6">
                <img
                  src={mainImage}
                  alt={offer.address}
                  className="h-auto w-full max-w-[400px] rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultImage;
                  }}
                />
              </div>
              <div className="space-y-6">
                <div>
                  <MorphingDialogTitle className="text-2xl font-bold text-black dark:text-white">
                    {offer.address}
                  </MorphingDialogTitle>
                  <MorphingDialogSubtitle className="font-light text-gray-400 dark:text-gray-500">
                    {offer.city}, {offer.district}
                  </MorphingDialogSubtitle>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Badge className={getPropertyTypeColor(offer.propertyType)}>
                      {offer.propertyType}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusDisplay(offer.status).color}>
                      <span className="mr-1">{getStatusDisplay(offer.status).icon}</span>
                      {getStatusDisplay(offer.status).text}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Square className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{offer.surface}m²</span>
                  </div>
                  {offer.bedrooms && (
                    <div className="flex items-center space-x-2">
                      <Home className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{offer.bedrooms} pièces</span>
                    </div>
                  )}
                  {offer.floor && (
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Étage {offer.floor}</span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Banknote className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {offer.price.toLocaleString()} €
                    </span>
                  </div>
                </div>

                {/* Owner Information */}
                {(offer.ownerName || offer.ownerPhone) && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Informations du propriétaire
                    </h3>
                    <div className="space-y-2">
                      {offer.ownerName && (
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{offer.ownerName}</span>
                        </div>
                      )}
                      {offer.ownerPhone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{offer.ownerPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                {offer.description && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {offer.description}
                    </p>
                  </div>
                )}

                {/* Additional Photos */}
                {offer.photos && offer.photos.length > 1 && (
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Photos supplémentaires</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {offer.photos.slice(1, 5).map((photo, index) => (
                        <img
                          key={index}
                          src={getImageUrl(photo)}
                          alt={`${offer.address} - Photo ${index + 2}`}
                          className="w-full h-24 object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = defaultImage;
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Date Added */}
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Ajouté le {new Date(offer.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
          <MorphingDialogClose className="text-zinc-500 dark:text-zinc-400" />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
