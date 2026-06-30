import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { validateEmail } from "../utils/validateEmail";

export const useLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });
    const { login, loading } = useAuthStore();
    const navigate = useNavigate();

    const validatePassword = (password: string) => password.length >= 6;

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setErrors((prev) => ({
            ...prev,
            email: validateEmail(e.target.value) ? "" : "Correo inválido",
        }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setErrors((prev) => ({
            ...prev,
            password: validatePassword(e.target.value) ? "" : "La contraseña debe tener al menos 6 caracteres",
        }));
    };

    const validateLogin = () => {
        const emailError = validateEmail(email) ? "" : "Correo inválido";
        const passwordError = validatePassword(password) ? "" : "La contraseña debe tener al menos 6 caracteres";
        setErrors({ email: emailError, password: passwordError });
        return !emailError && !passwordError;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Ingresa correo y contraseña");
            return;
        }
        if (!validateLogin()) return;

        const success = await login(email, password);
        if (success) navigate("/dashboard");
    };

    return {
        email, setEmail,
        password, setPassword,
        showPassword, setShowPassword,
        errors, setErrors,
        loading,
        handleEmailChange,
        handlePasswordChange,
        handleLogin,
    };
};
