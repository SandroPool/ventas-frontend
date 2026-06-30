import { LucideIcon } from "lucide-react";

interface PropsTextarea extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    placeholder: string;
    rows?: number;
    icon?: LucideIcon;
}

const TextareaFuturistic = ({ label, placeholder, rows = 4, icon: Icon, ...props }: PropsTextarea) => (
    <div className="flex flex-col w-full relative">
        {label && <label className="mb-2 text-gray-900 dark:text-dark-primary font-semibold">{label}</label>}
        <div className="relative w-full">
            {Icon && <Icon className="absolute left-3 top-3 text-teal-400" size={20} />}
            <textarea
                rows={rows}
                placeholder={placeholder}
                className={`w-full px-4 py-2 text-lg border border-teal-500 rounded-lg shadow-md outline-none transition-all duration-300 ease-in-out bg-transparent text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder:text-teal-300 hover:border-teal-300 dark:text-dark-primary ${Icon ? 'pl-10' : ''}`}
                {...props}
            />
        </div>
    </div>
);

export default TextareaFuturistic;
