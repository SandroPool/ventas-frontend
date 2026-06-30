import { JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, TriangleAlertIcon } from 'lucide-react';

interface AlertModalProps {
    open: boolean;
    title: string;
    message: string;
    icon?: JSX.Element;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modal = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300 } },
};

const AlertModal = ({
    open,
    title,
    message,
    icon,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
}: AlertModalProps) => {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-black/60 to-black/30"
                    variants={backdrop}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    <motion.div
                        className="bg-white dark:bg-dark-base rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-dark-border"
                        variants={modal}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="alert-title"
                        aria-describedby="alert-message"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center space-x-2">
                                {icon || <TriangleAlertIcon className="w-6 h-6 text-yellow-400" />}
                                <h2 id="alert-title" className="text-xl font-semibold text-gray-800 dark:text-dark-primary">
                                    {title}
                                </h2>
                            </div>
                            <button onClick={onCancel} aria-label="Cerrar alerta">
                                <XIcon className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-dark-muted dark:hover:text-dark-primary" />
                            </button>
                        </div>
                        <p id="alert-message" className="text-sm text-gray-600 dark:text-dark-secondary mb-6">
                            {message}
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 rounded-xl bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-dark-elevated dark:text-dark-primary dark:hover:bg-dark-elevated"
                            >
                                {cancelText}
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 rounded-xl bg-teal-500 text-white hover:bg-teal-600 dark:bg-teal-500 dark:hover:bg-teal-600"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AlertModal;
