import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    _id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    apiFetch: (endpoint: string, options?: RequestInit) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getApiBaseUrl = () => {
    return "";
};

export const API_BASE_URL = getApiBaseUrl();

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setToken(null);
            }
        }
        setLoading(false);
    }, [token]);

    const login = async (email: string, password: string) => {
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Failed to log in");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
        setToken(data.token);
        setUser({ _id: data._id, name: data.name, email: data.email });
        navigate("/dashboard");
    };

    const register = async (name: string, email: string, password: string) => {
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Failed to register");
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
        setToken(data.token);
        setUser({ _id: data._id, name: data.name, email: data.email });
        navigate("/dashboard");
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        navigate("/");
    };

    const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
        const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
        const url = `${API_BASE_URL}${cleanEndpoint}`;

        // Add authorization header
        const headers = new Headers(options.headers || {});
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }

        // Default to JSON Content-Type if body is set and not FormData
        if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
            headers.set("Content-Type", "application/json");
        }

        const res = await fetch(url, {
            ...options,
            headers,
        });

        if (res.status === 401) {
            // Clear token and redirect if unauthorized
            logout();
            throw new Error("Unauthorized");
        }

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || "Request failed");
            }
            return data;
        }

        const text = await res.text();
        if (!res.ok) {
            throw new Error(text || "Request failed");
        }
        return text;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                apiFetch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
