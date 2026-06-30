import { LucideIcon } from "lucide-react";

interface PropsSelect extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { label: string; value: string }[];
    icon?: LucideIcon;
}

const SelectFuturistic = ({ label, options, icon: Icon, ...props }: PropsSelect) => (
    <div className="flex flex-col w-full relative">
        {label && <label className="mb-2 text-gray-900 dark:text-dark-primary font-semibold">{label}</label>}
        <div className="relative w-full">
            {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400" size={20} />}
            <select
                className={`text-gray-900 dark:text-dark-primary font-bold w-full px-4 py-2 text-lg border border-teal-500 rounded-lg shadow-md outline-none transition-all duration-300 ease-in-out bg-transparent focus:ring-2 focus:ring-teal-500 focus:border-teal-500 hover:border-teal-300 ${Icon ? 'pl-10' : ''}`}
                {...props}
            >
                {options.map((option, index) => (
                    <option
                        key={index}
                        value={option.value}
                        className="text-gray-900 font-bold dark:bg-dark-card dark:text-dark-primary"
                    >
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    </div>
);

export default SelectFuturistic;
