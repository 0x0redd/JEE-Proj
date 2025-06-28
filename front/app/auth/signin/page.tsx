'use client';

import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authService } from '../../../services/auth';
import { useAuth } from '../../../hooks/useAuth';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const admin = await authService.login({ email, password });
            
            // Use the auth hook to handle login
            login(admin);
            
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center space-x-3 mb-6">
                        <div className="flex items-center space-x-3">
                            <div>
                                <Image src="/sakani.svg" alt="Yakeey Logo" width={100} height={100} className=''/>
                                <p className="text-sm text-slate-600 dark:text-slate-400 justify-center">Gestion Immobilière </p>
                            </div>
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Bienvenue</h1>
                    <p className="text-slate-600 dark:text-slate-400">Connectez-vous pour accéder à votre tableau de bord</p>
                </div>

                <Card className="shadow-xl border-0 dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-xl text-center dark:text-white">Connexion Administrateur</CardTitle>
                        <CardDescription className="text-center dark:text-slate-400">
                            Entrez vos identifiants pour accéder au système de gestion
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="dark:text-slate-200">Adresse Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@exemple.com"
                                        value={email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                        className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="dark:text-slate-200">Mot de passe</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400 dark:text-slate-500" />
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Entrez votre mot de passe"
                                        value={password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                            </Button>

                            <div className="text-center">
                                <Link
                                    href="/auth/forgot-password"
                                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center mt-6">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                        Besoin d'un accès administrateur ?{' '}
                        <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300">
                            Inscrivez-vous ici
                        </Link>
                    </p>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                            <strong>Test Credentials:</strong><br/>
                            Email: admin@example.com<br/>
                            Password: admin
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}