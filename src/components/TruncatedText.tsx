import { useState } from "react";

const TruncatedText = ({ text, maxLength = 50 }: { text: string; maxLength?: number }) => {
    const [expanded, setExpanded] = useState(false);

    if (!text) return "N/A"; // Si es vacío o null, mostrar "N/A"

    const toggleExpand = () => setExpanded(!expanded);

    return (
        <div className="inline-block">
            <span
                onClick={toggleExpand}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpand(); }}
                className="cursor-pointer font-medium text-teal-600 transition-all hover:scale-[1.02] dark:text-teal-400"
            >
                {expanded ? text : text.length > maxLength ? text.slice(0, maxLength) + "..." : text}
            </span>
            {expanded && (
                <span
                    onClick={toggleExpand}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpand(); }}
                    className="ml-2 cursor-pointer text-sm font-semibold text-orange-500 dark:text-yellow-500"
                >
                    (Ocultar)
                </span>
            )}
        </div>
    );
};

export default TruncatedText;
