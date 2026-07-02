import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
import { validateEmail } from "../utils/validateEmail";

export const useLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [capsLock, setCapsLock] = useState(false);
    const [touched, setTouched] = useState({ email: false, password: false });
    const { login, loading } = useAuthStore();
    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement>(null);

    const emailError = !email && touched.email
        ? "El correo es obligatorio"
        : email && !validateEmail(email) && touched.email
            ? "Formato de correo inválido"
            : "";

    const passwordError = !password && touched.password
        ? "La contraseña es obligatoria"
        : password && password.length < 6 && touched.password
            ? "Mínimo 6 caracteres"
            : "";

    const errors = { email: emailError, password: passwordError };
    const hasErrors = !!emailError || !!passwordError;

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleBlur = (field: "email" | "password") => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        setCapsLock(e.getModifierState("CapsLock"));
    };

    const handleLogin = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ email: true, password: true });

        if (!email) {
            toast.error("Ingresa tu correo electrónico");
            emailRef.current?.focus();
            return;
        }
        if (!validateEmail(email)) {
            toast.error("El formato del correo no es válido");
            emailRef.current?.focus();
            return;
        }
        if (!password) {
            toast.error("Ingresa tu contraseña");
            return;
        }
        if (password.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        const success = await login(email, password);
        if (success) navigate("/dashboard");
    }, [email, password, login, navigate]);

    return {
        email, setEmail,
        password, setPassword,
        showPassword, setShowPassword,
        capsLock,
        errors,
        touched,
        hasErrors,
        loading,
        emailRef,
        handleEmailChange,
        handlePasswordChange,
        handleBlur,
        handleKeyUp,
        handleLogin,
    };
};
