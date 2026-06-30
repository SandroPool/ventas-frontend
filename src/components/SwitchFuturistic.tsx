interface SwitchFuturisticProps {
    label?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

const SwitchFuturistic = ({ label, checked, onChange }: SwitchFuturisticProps) => {
    return (
        <div className="p-4 mb-2 mt-2 border border-teal-500 rounded-lg flex items-center gap-3 cursor-pointer">
            <label className="flex items-center gap-2  font-semibold cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="hidden"
                />
                <div
                    className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 duration-300 ${checked ? "bg-green-500" : "bg-gray-400"}`}
                >
                    <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${checked ? "translate-x-5" : ""}`}
                    />
                </div>
                {label && <span>{label}</span>}
            </label>
        </div>
    );
};

export default SwitchFuturistic;
