import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { JSX, useEffect, useState } from "react";
import { LoaderPinwheel } from "lucide-react";

interface Props {
    children: JSX.Element;
    allowedRoles: string[];
}

const ProtectedRouteByRole = ({ children, allowedRoles }: Props) => {
    const { user, fetchProfile, token } = useAuthStore();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!token) {
            setIsReady(true);
            return;
        }
        if (user) {
            setIsReady(true);
        } else {
            fetchProfile().finally(() => setIsReady(true));
        }
    }, [fetchProfile, user, token]);

    if (!isReady) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoaderPinwheel className="animate-spin text-teal-500" size={48} />
            </div>
        );
    }

    if (!user || !allowedRoles.includes(user.role)) return <Navigate to={"/"} />;

    return children;
};

export default ProtectedRouteByRole;
