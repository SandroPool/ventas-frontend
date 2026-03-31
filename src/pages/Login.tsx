import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { InputFuturistic, ButtonFuturistic, TitleFuturistic, ThemeToggle } from "../components";
import { Eye, EyeOff, KeySquare, LoaderPinwheel } from "lucide-react";
import toast from "react-hot-toast";
import { validateEmail } from "../utils/validateEmail";

const Login = () => {
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Ingresa correo y contraseña");
            return;
        }
        if (errors.email || errors.password) return;

        const success = await login(email, password);

        if (success) navigate("/profile");
    };

    return (
        <div className="flex justify-center items-center h-screen px-4">
            <form className="shadow-2xl w-full max-w-md p-6 rounded-lg">
                <div className="flex gap-x-20">
                    <TitleFuturistic>Iniciar sesión</TitleFuturistic>
                    <ThemeToggle />
                </div>
                <div className="flex flex-col gap-4">
                    <InputFuturistic
                        label="Correo"
                        placeholder="Correo"
                        name="email"
                        autoComplete="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        onBlur={() => setErrors((prev) => ({
                            ...prev,
                            email: validateEmail(email) ? "" : "Correo inválido",
                        }))}
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                    <div className="relative">
                        <InputFuturistic
                            label="Contraseña"
                            placeholder="Contraseña"
                            name="password"
                            autoComplete="current-password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={() => setErrors((prev) => ({
                                ...prev,
                                password: validatePassword(password) ? "" : "La contraseña debe tener al menos 6 caracteres",
                            }))}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-10 text-purple-400 hover:text-purple-600"
                        >
                            {showPassword ? <EyeOff size={25} /> : <Eye size={25} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                    <ButtonFuturistic
                        label={loading ? "" : "Iniciar sesión"} // Oculta el texto cuando está cargando
                        onClick={handleLogin}
                        className="mt-4 w-full"
                        icon={loading ? LoaderPinwheel : KeySquare} // Muestra el Loader correctamente
                        disabled={loading} // Deshabilitar el botón durante la carga
                    />
                </div>
            </form>
        </div>
    );
};

export default Login;
