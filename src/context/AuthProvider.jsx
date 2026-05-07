import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const login = (userData, token, refreshToken, streamToken) => {
        setUser(userData);
        setAccessToken(token);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("accessToken", token);
        localStorage.setItem("streamChatToken", streamToken);
        document.cookie = `refreshToken=${refreshToken}; path=/; secure; samesite=strict`;
    };

    const logout = () => {
        const type = user?.role?.toLowerCase() === 'vendor' ? 'vendor' : 'client';
        setUser(null);
        setAccessToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("streamChatToken");
        document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        window.location.href = `/${type}/login`;
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("accessToken");
        
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedToken) setAccessToken(storedToken);

        async function checkToken() {
            if (!storedToken) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                // Since verify endpoint might be role specific or generic
                // We'll try the generic one if it exists or just use the client one for now
                // as the backend seems to share the secret
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/clients/verify`, {}, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                });
                
                if (response.data) {
                    setIsAuthenticated(true);
                    setUser(response.data);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Token validation failed:", error);
                // If it's a 401, it might be expired, but the axios interceptor 
                // isn't used here yet. For now, we'll just set as unauthenticated
                // and let the first actual API call handle the refresh if needed.
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        }

        checkToken();
    }, []);

    return (
        <AuthContext.Provider value={{ user, accessToken, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

