import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);


    useEffect(() => {
        const user = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");
        if (user) setUser(JSON.parse(user));
        if (accessToken) setAccessToken(accessToken);
    }, []);

    return (
        <AuthContext.Provider value={{ user, accessToken, isAuthenticated: !!user && !!accessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

