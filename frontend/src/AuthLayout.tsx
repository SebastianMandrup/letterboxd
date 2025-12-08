import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

export default function AuthLayout() {
    const { isAuthenticated, restoring } = useAuth();

    if (restoring) {
        return (
            <div className="divCentered">
                <div className="spinner"></div>
                <h1>Restoring user session...</h1>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
