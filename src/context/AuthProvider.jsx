import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        const storedToken = localStorage.getItem("accessToken");
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedToken) setAccessToken(storedToken);

        // check if token valid
        async function checkToken() {
            if (!storedToken) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/clients/verify`, {}, {
                    headers: {
                        Authorization: `Bearer ${storedToken}`
                    }
                });
                setIsAuthenticated(!!response.data);
            } catch (error) {
                console.error("Token validation failed:", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        }

        checkToken();

    }, []);

    if (isLoading) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ user, accessToken, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

