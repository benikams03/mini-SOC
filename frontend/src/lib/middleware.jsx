import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export function ProtectedRoute({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('access_token');
            
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }
            
            setIsAuthenticated(true);
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}