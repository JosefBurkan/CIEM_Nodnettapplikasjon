import { Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

// Exists only to direct the user to the next page on login, and block
// them if they try to skip to the next page with URL
const ProtectedRoute = ({ children }) => {
    // If it is not null, it will render in the wrong state
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const authStatus = sessionStorage.getItem('isAuthenticated');
        console.log('IsAuthenticated: ', authStatus);

        // Update state based on sessionStorage value
        if (authStatus === 'true') {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    console.log('Protected route isAuthenticated:', isAuthenticated);

    return isAuthenticated ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
