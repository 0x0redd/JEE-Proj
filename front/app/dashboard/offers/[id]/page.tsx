"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { ArrowLeft, Building2, Home, MapPin, Banknote, Square, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ViewOfferPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params?.id as string;
  const [offer, setOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!offerId) return;
    setLoading(true);
    fetch(`http://localhost:8080/offres/${offerId}`)
      .then((res) => res.json())
      .then((data) => setOffer(data))
      .finally(() => setLoading(false));
  }, [offerId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!offer) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Property Offer Details</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">View all details of this property</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="dark:text-white">{offer.typeBien}</CardTitle>
            <CardDescription className="dark:text-slate-400">{offer.prenomProprietaire} {offer.nomProprietaire}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="h-4 w-4" />
              <span>{offer.adresseBien}, {offer.localisationVille}</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-1">
                <Square className="h-4 w-4" />
                <span>{offer.surface}m²</span>
              </div>
              <div className="flex items-center space-x-1">
                <Banknote className="h-4 w-4" />
                <span>€{offer.prixPropose?.toLocaleString()}</span>
              </div>
            </div>
            {offer.nbChambresOffre && (
              <div className="text-sm text-slate-600 dark:text-slate-400">
                {offer.nbChambresOffre} bedroom{offer.nbChambresOffre !== 1 ? 's' : ''}
              </div>
            )}
            {offer.etage && (
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Floor: {offer.etage}
              </div>
            )}
            {offer.descriptionBien && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {offer.descriptionBien}
              </p>
            )}
            <div className="flex flex-wrap gap-4 mt-4">
              {offer.photos && offer.photos.length > 0 && offer.photos.map((url: string, idx: number) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Property photo ${idx + 1}`}
                  className="w-40 h-40 object-cover rounded border border-slate-200 dark:border-slate-600"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 