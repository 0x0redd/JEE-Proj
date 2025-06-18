'use client';

import { ClientDemandForm } from '@/components/ClientDemandForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';

export default function NewDemandPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/demands">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Demands
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-2 rounded-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Add New Client Demand</h1>
                <p className="text-sm text-slate-600">Create a new client request</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ClientDemandForm redirectTo="/demands" />
      </div>
    </div>
  );
}