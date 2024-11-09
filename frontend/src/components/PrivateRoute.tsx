import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { authGuard } from "../services/api/auth/Authorization";
import Loader from "./loader/Loader";

function PrivateRoute() {
    const [isLogged, setIsLogged] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthenticated = await authGuard();
            setIsLogged(isAuthenticated);
        };
        checkAuth();
    }, []);
    if (isLogged === null) {
        return <Loader />
    }
    return isLogged ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
