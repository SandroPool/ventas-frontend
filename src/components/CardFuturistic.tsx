import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface CardProps {
    title?: string;
    Data?: Record<string, string>;
    icon?: LucideIcon;
    children?: ReactNode;
}

const CardFuturistic = ({ title, Data, icon: Icon, children }: CardProps) => {
    return (
        <div className="relative p-8 rounded-xl shadow-2xl dark:bg-dark-card dark:text-dark-primary bg-gradient-to-r from-gray-100 to-white text-black w-full max-w-md">
            {/* Efecto de brillo */}
            <div className="absolute inset-0 bg-white/10 dark:bg-dark-elevated/50 blur-lg rounded-xl" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-4"> {/* Añadido para espaciado vertical uniforme */}
                {Icon && <Icon size={50} className="mb-4 text-gray-800 dark:text-dark-secondary" />}
                <h2 className="text-3xl font-bold mb-4 text-gray-700 dark:text-dark-secondary">{title}</h2>

                <div className="w-full">
                    {Data && Object.entries(Data).map(([key, value]) => (
                        <div key={key} className="flex justify-between py-2 px-4 bg-gray-100 dark:bg-dark-elevated/50 rounded-md mb-2">
                            <span className="text-gray-700 dark:text-dark-secondary font-semibold">{key}:</span>
                            <span className="text-black dark:text-dark-primary">{value}</span>
                        </div>
                    ))}
                </div>

                {/* Aquí se renderizan los children, como el ButtonFuturistic */}
                <div className="mt-4 w-full flex flex-col items-center space-y-4"> {/* Añadido para espaciado vertical uniforme */}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CardFuturistic;