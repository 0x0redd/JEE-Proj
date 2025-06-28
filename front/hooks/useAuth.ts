import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userData = localStorage.getItem('adminUser');

    if (isAuthenticated && userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: User) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('adminUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminUser');
    setUser(null);
    router.push('/auth/signin');
  };

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout
  };
} 