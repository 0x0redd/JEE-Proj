const API_URL = 'http://localhost:8080/api';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export interface AuthResponse {
    token: string;
    message?: string;
}

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        return response.json();
    },

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        return response.json();
    },

    getToken(): string | null {
        return localStorage.getItem('token');
    },

    setToken(token: string): void {
        localStorage.setItem('token', token);
    },

    removeToken(): void {
        localStorage.removeItem('token');
    },

    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}; 