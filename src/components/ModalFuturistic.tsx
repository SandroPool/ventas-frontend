import { X } from "lucide-react";

interface PropsModal {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
    className?: string;
}

const ModalFuturistic = ({ isOpen, onClose, title, children, className = "" }: PropsModal) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] h-screen w-screen overflow-hidden bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="flex min-h-screen items-start justify-center p-4 md:items-center">
                <div
                    role="dialog"
                    aria-modal="true"
                    className={`relative z-[101] max-h-[calc(100dvh-2rem)] w-[92vw] max-w-3xl overflow-y-auto rounded-lg bg-slate-50 p-6 shadow-2xl transition-all duration-300 ease-out dark:bg-dark-base ${className}`}
                >
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-4 p-1 text-gray-400 hover:text-gray-700 dark:hover:text-dark-primary"
                        aria-label="Cerrar modal"
                        type="button"
                    >
                        <X size={24} />
                    </button>

                    {title && (
                        <h2 className="mb-5 text-center text-xl font-semibold text-gray-900 dark:text-dark-primary">
                            {title}
                        </h2>
                    )}

                    <div className="w-full">{children}</div>
                </div>
            </div>
        </div>
    );
};

export default ModalFuturistic;
