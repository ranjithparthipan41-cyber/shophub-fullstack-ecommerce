import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function getUserFromToken(token) {
    if (!token) {
        return null;
    }

    try {
        const payload = JSON.parse(
            atob(token.split(".")[1])
        );

        return payload;
    } catch (error) {
        console.error(
            "Invalid token",
            error
        );

        return null;
    }
}

export function AuthProvider({ children }) {

    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [user, setUser] = useState(
        getUserFromToken(
            localStorage.getItem("token")
        )
    );

    const login = (newToken) => {

        localStorage.setItem(
            "token",
            newToken
        );

        setToken(newToken);

        setUser(
            getUserFromToken(newToken)
        );
    };

    const logout = () => {

        localStorage.removeItem("token");

        setToken(null);

        setUser(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                isAuthenticated
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}