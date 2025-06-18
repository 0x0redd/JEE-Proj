'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    age: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    // Mock registration - in real app, this would be an API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Store user data (in real app, this would be handled by backend)
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('adminUser', JSON.stringify({
        email: formData.email,
        name: `${formData.firstName} ${formData.lastName}`,
        role: 'Administrator',
        phone: formData.phone,
        address: formData.address,
        age: formData.age
      }));
      
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
           <div className="flex items-center space-x-3">
              <div>
                {/* <Building2 className="h-8 w-8 text-white" /> */}
                <Image src="/sakani.svg" alt="Yakeey Logo" width={100} height={100} />
                <p className="text-sm text-slate-600 dark:text-slate-400">Gestion Immobilière </p>
              </div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Créer un compte administrateur</h1>
          <p className="text-slate-600 dark:text-slate-400">Inscrivez-vous pour accéder au système de gestion</p>
        </div>

        <Card className="shadow-xl border-0 dark:bg-slate-800 dark:border-slate-700">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center dark:text-white">Inscription Administrateur</CardTitle>
            <CardDescription className="text-center dark:text-slate-400">
              Remplissez vos informations pour créer un compte administrateur
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Name fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="required dark:text-slate-200">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Jean"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="required dark:text-slate-200">Nom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Dupont"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="required dark:text-slate-200">Adresse Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@exemple.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="required dark:text-slate-200">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Entrez votre mot de passe"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent dark:text-slate-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="required dark:text-slate-200">Confirmer le mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirmez votre mot de passe"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent dark:text-slate-400"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Phone and Age */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="dark:text-slate-200">Numéro de téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+33 6 12 34 56 78"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="dark:text-slate-200">Âge</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    placeholder="30"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="18"
                    max="100"
                    className="dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="dark:text-slate-200">Adresse</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="123 Rue de Paris, Ville, Code Postal"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Création du compte...' : 'Créer un compte administrateur'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Vous avez déjà un compte ?{' '}
            <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
              Connectez-vous ici
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}