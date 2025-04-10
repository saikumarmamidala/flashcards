import React, { createContext, useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';

// Create the Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [username, setUsername] = useState(null);

    const login = (username) => {
        setUsername(username);
    };

    const logout = () => {
        setUsername(null);
    };

    const isAuthenticated = !!username; // Check if the user is authenticated

    return (
        <AuthContext.Provider value={{ username, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use Auth Context
export const useAuth = () => {
    return useContext(AuthContext);
};

// PrivateRoute Component
export const PrivateRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? element : <Navigate to="/auth" />;
};