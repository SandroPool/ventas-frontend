import { useLogin } from "../hooks/useLogin";
import { InputFuturistic, ButtonFuturistic, TitleFuturistic, ThemeToggle } from "../components";
import { Eye, EyeOff, KeySquare, LoaderPinwheel } from "lucide-react";

const Login = () => {
    const { email, password, showPassword, setShowPassword, errors, loading, handleEmailChange, handlePasswordChange, handleLogin } = useLogin();

    return (
        <div className="flex justify-center items-center h-screen px-4">
            <form className="shadow-2xl w-full max-w-md p-6 rounded-lg border border-gray-200 dark:border-dark-border">
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
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-10 text-teal-400 hover:text-teal-600"
                        >
                            {showPassword ? <EyeOff size={25} /> : <Eye size={25} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                    <ButtonFuturistic
                        label={loading ? "" : "Iniciar sesión"}
                        onClick={handleLogin}
                        className="mt-4 w-full"
                        icon={loading ? LoaderPinwheel : KeySquare}
                        disabled={loading}
                    />
                </div>
            </form>
        </div>
    );
};

export default Login;
