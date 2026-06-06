import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

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
                // Use the intercepted api instance so expired tokens are
                // automatically refreshed via the response interceptor in axios.js.
                // Also pick the correct endpoint based on the stored user role.
                const storedUser = JSON.parse(localStorage.getItem("user"));
                const role = storedUser?.role?.toLowerCase() === 'vendor' ? 'vendors' : 'clients';

                const response = await api.post(`/${role}/verify`, {}, {
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
                // The interceptor already attempted a refresh. If we still get
                // an error here, the refresh token is also invalid/expired.
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

