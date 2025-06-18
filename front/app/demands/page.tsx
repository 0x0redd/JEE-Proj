"use client";

import { ClientDemandForm } from '@/components/ClientDemandForm';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function PublicDemandsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#111]">
      {/* Public Header */}
      <header className="bg-white/80 dark:bg-[#111111]/60 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-1">
            <div className="flex items-center space-x-3">
              <div>
                <Image src="/sakani.svg" alt="Yakeey Logo" width={100} height={100} />
                <p className="text-sm text-slate-600 dark:text-slate-400">Gestion Immobilière </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/offers">
                <Button variant="ghost" className="hidden sm:inline-flex text-slate-700 dark:text-slate-200">
                  Offres
                </Button>
              </Link>
              <Link href="/demands">
                <Button variant="ghost" className="hidden sm:inline-flex text-slate-700 dark:text-slate-200">
                  Demandes
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" className="hidden sm:inline-flex border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200">
                  Inscription
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white">
                  Tableau de bord
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Déposer une demande immobilière</h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">Remplissez le formulaire ci-dessous pour soumettre votre demande. Notre équipe vous contactera rapidement.</p>
        <ClientDemandForm />
      </div>
    </div>
  );
} 