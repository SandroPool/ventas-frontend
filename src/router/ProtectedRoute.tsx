import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { ReactNode } from 'react';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { token } = useAuthStore();
    return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;