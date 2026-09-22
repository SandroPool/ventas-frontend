import { JSX } from 'react';
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
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-black/60 to-black/30">
            <div
                className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-dark-border dark:bg-dark-base"
                role="dialog"
                aria-modal="true"
                aria-labelledby="alert-title"
                aria-describedby="alert-message"
            >
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        {icon || <TriangleAlertIcon className="h-6 w-6 text-yellow-400" />}
                        <h2 id="alert-title" className="text-xl font-semibold text-gray-800 dark:text-dark-primary">
                            {title}
                        </h2>
                    </div>
                    <button onClick={onCancel} aria-label="Cerrar alerta">
                        <XIcon className="h-5 w-5 text-gray-500 hover:text-gray-700 dark:text-dark-muted dark:hover:text-dark-primary" />
                    </button>
                </div>
                <p id="alert-message" className="mb-6 text-sm text-gray-600 dark:text-dark-secondary">
                    {message}
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onCancel}
                        className="rounded-xl bg-gray-300 px-4 py-2 text-gray-800 hover:bg-gray-400 dark:bg-dark-elevated dark:text-dark-primary dark:hover:bg-dark-elevated"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="rounded-xl bg-teal-500 px-4 py-2 text-white hover:bg-teal-600 dark:bg-teal-500 dark:hover:bg-teal-600"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
