import { createContext, useState, useEffect } from "react";
import axios from "axios";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    useEffect(() => {
        const user = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");
        if (user) setUser(JSON.parse(user));
        if (accessToken) setAccessToken(accessToken);

        // check if token valid
        async function isTokenValid() {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_URL}/clients/verify`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                return response.data;
            } catch (error) {
                console.error("Token validation failed:", error);
                return false;
            }
        }

        setIsAuthenticated(isTokenValid());

    }, []);

    return (
        <AuthContext.Provider value={{ user, accessToken, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

