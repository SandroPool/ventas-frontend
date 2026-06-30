import React from "react";
import { LoaderPinwheel, LucideIcon } from "lucide-react";

interface PropsButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: React.ReactNode;
    gradient?: string;
    icon?: LucideIcon;
}

const ButtonFuturistic = ({ label, gradient, icon: Icon, className = "", disabled, ...props }: PropsButton) => {
    const defaultGradient = "bg-teal-500";
    const appliedGradient = gradient || defaultGradient;

    return (
        <button
            className={`relative flex items-center justify-center gap-2 px-6 py-3 m-1 font-semibold text-white rounded-lg shadow-lg transition-all duration-300 ease-in-out transform
                ${disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-105 hover:shadow-2xl"}
                ${appliedGradient} before:absolute before:inset-0 before:bg-white/10 before:rounded-lg before:blur-md ${className}`}
            disabled={disabled}
            {...props}
        >
            {Icon && (
                <span className={Icon === LoaderPinwheel ? "animate-spin" : ""}>
                    <Icon size={label ? 20 : 24} className="relative" />
                </span>
            )}
            {label && <span className="relative">{label}</span>}
        </button>
    );
};

export default ButtonFuturistic;