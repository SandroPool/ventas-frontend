import { useState } from "react";
import { motion } from "framer-motion";

const TruncatedText = ({ text, maxLength = 50 }: { text: string; maxLength?: number }) => {
    const [expanded, setExpanded] = useState(false);

    if (!text) return "N/A"; // Si es vacío o null, mostrar "N/A"

    const toggleExpand = () => setExpanded(!expanded);

    return (
        <div className="inline-block">
            <motion.span
                onClick={toggleExpand}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpand(); }}
                className="cursor-pointer font-medium text-teal-600 dark:text-teal-400 transition-all"
                whileHover={{ scale: 1.05 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                {expanded ? text : text.length > maxLength ? text.slice(0, maxLength) + "..." : text}
            </motion.span>
            {expanded && (
                <motion.span
                    onClick={toggleExpand}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleExpand(); }}
                    className="ml-2 cursor-pointer text-orange-500 dark:text-yellow-500 text-sm font-semibold"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                >
                    (Ocultar)
                </motion.span>
            )}
        </div>
    );
};

export default TruncatedText;
