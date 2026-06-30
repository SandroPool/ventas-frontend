import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PropsModal {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
    className?: string;
}

const ModalFuturistic = ({ isOpen, onClose, title, children, className = "" }: PropsModal) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[60] p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className={`dark:bg-dark-base bg-slate-50 text-white p-6 rounded-lg shadow-2xl relative w-11/12 max-w-lg ${className}`}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Botón de Cierre */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-dark-primary p-1"
                        >
                            <X size={24} />
                        </button>

                        {/* Título */}
                        {title && (
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-primary mb-5 text-center">
                                {title}
                            </h2>
                        )}

                        {/* Contenido */}
                        <div className="space-y-4">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ModalFuturistic;
