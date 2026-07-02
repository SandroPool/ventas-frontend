import { useEffect } from "react";
import { useLogin } from "../hooks/useLogin";
import { InputFuturistic, ButtonFuturistic, TitleFuturistic, ThemeToggle } from "../components";
import { Eye, EyeOff, Mail, Lock, AlertTriangle, LoaderPinwheel, LogIn } from "lucide-react";

const Login = () => {
    const {
        email, password, showPassword, setShowPassword,
        capsLock, errors, loading,
        emailRef, handleEmailChange, handlePasswordChange,
        handleBlur, handleKeyUp, handleLogin,
    } = useLogin();

    useEffect(() => {
        emailRef.current?.focus();
    }, []);

    return (
        <div className="flex justify-center items-center h-screen px-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-base dark:to-[#0a0a12]">
            <form
                onSubmit={handleLogin}
                className="animate-fadeIn w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-200/80 dark:border-dark-border bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm"
            >
                <div className="flex items-center justify-between mb-8">
                    <TitleFuturistic as="h1" className="!text-2xl !font-bold">Iniciar sesión</TitleFuturistic>
                    <ThemeToggle />
                </div>

                <div className="flex flex-col gap-5">
                    <div>
                        <InputFuturistic
                            ref={emailRef}
                            label="Correo electrónico"
                            placeholder="ejemplo@correo.com"
                            name="email"
                            autoComplete="email"
                            type="email"
                            icon={Mail}
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={() => handleBlur("email")}
                            disabled={loading}
                        />
                        {errors.email && (
                            <p className="flex items-center gap-1.5 mt-1.5 text-red-500 text-sm animate-fadeIn">
                                <AlertTriangle size={14} />
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="relative">
                            <InputFuturistic
                                label="Contraseña"
                                placeholder="••••••••"
                                name="password"
                                autoComplete="current-password"
                                type={showPassword ? "text" : "password"}
                                icon={Lock}
                                value={password}
                                onChange={handlePasswordChange}
                                onBlur={() => handleBlur("password")}
                                onKeyUp={handleKeyUp}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex={-1}
                                className="absolute right-3 top-[42px] text-gray-400 hover:text-teal-500 transition-colors"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {capsLock && (
                            <p className="flex items-center gap-1.5 mt-1.5 text-amber-500 text-sm animate-fadeIn">
                                <AlertTriangle size={14} />
                                Bloq Mayús activado
                            </p>
                        )}
                        {errors.password && !capsLock && (
                            <p className="flex items-center gap-1.5 mt-1.5 text-red-500 text-sm animate-fadeIn">
                                <AlertTriangle size={14} />
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <ButtonFuturistic
                        label={loading ? "Iniciando sesión..." : "Iniciar sesión"}
                        type="submit"
                        className="mt-2 w-full py-3.5"
                        icon={loading ? LoaderPinwheel : LogIn}
                        disabled={loading}
                    />
                </div>

                <p className="mt-6 text-center text-sm text-gray-400 dark:text-dark-muted">
                    Ingresa con tus credenciales para acceder al sistema
                </p>
            </form>
        </div>
    );
};

export default Login;
