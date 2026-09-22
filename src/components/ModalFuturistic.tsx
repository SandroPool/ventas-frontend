import { X } from "lucide-react";

interface PropsModal {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
    className?: string;
}

const ModalFuturistic = ({ isOpen, onClose, title, children, className = "" }: PropsModal) => {
    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm transition-opacity duration-300 md:items-center ${
                isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
            }`}
            aria-hidden={!isOpen}
        >
            <div
                className={`relative max-h-[calc(100dvh-2rem)] w-[92vw] max-w-3xl overflow-y-auto rounded-lg bg-slate-50 p-6 shadow-2xl transition-all duration-300 ease-out dark:bg-dark-base ${
                    isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
                } ${className}`}
            >
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-700 dark:hover:text-dark-primary"
                    aria-label="Cerrar modal"
                >
                    <X size={24} />
                </button>

                {title && (
                    <h2 className="mb-5 text-center text-xl font-semibold text-gray-900 dark:text-dark-primary">
                        {title}
                    </h2>
                )}

                <div className="w-full space-y-4">{children}</div>
            </div>
        </div>
    );
};

export default ModalFuturistic;
