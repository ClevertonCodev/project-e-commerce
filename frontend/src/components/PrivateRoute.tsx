import React from 'react';
import { Route, Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    element: JSX.Element;
    path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, path }) => {
    const isAuthenticated = localStorage.getItem('authToken');
    return (
        <Route
            path={path}
            element={isAuthenticated ? element : <Navigate to="/login" />}
        />
    );
};

export default PrivateRoute;
