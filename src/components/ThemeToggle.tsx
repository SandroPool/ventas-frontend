import { useThemeStore } from "../store/useThemeStore";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useThemeStore();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 bg-white/20 text-white rounded-full transition-all hover:bg-white/30"
        >
            {theme === "dark" ? (
                <Sun className="h-6 w-6 text-yellow-400" />
            ) : (
                <Moon className="h-6 w-6 text-gray-500" />
            )}
        </button>
    );
};

export default ThemeToggle;
