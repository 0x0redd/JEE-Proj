const API_URL = 'http://localhost:8080/api';

export interface Admin {
    id: number;
    name: string;
    email: string;
    phone: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    address: string;
    age: string;
}

export interface AuthResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
    message?: string;
    success: boolean;
}

class AuthService {
    async login(data: LoginData): Promise<Admin> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        const result: AuthResponse = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Login failed');
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            phone: result.phone
        };
    }

    async register(data: RegisterData): Promise<Admin> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        const result: AuthResponse = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Registration failed');
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            phone: result.phone
        };
    }

    async getProfile(email: string): Promise<Admin> {
        const response = await fetch(`${API_URL}/auth/profile?email=${encodeURIComponent(email)}`, {
            credentials: 'include',
        });

        const result: AuthResponse = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to get profile');
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            phone: result.phone
        };
    }

    async updateProfile(email: string, data: Partial<Admin>): Promise<Admin> {
        const response = await fetch(`${API_URL}/auth/profile?email=${encodeURIComponent(email)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include',
        });

        const result: AuthResponse = await response.json();
        
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Failed to update profile');
        }

        return {
            id: result.id,
            name: result.name,
            email: result.email,
            phone: result.phone
        };
    }
}

export const authService = new AuthService(); 