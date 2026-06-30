import { create } from 'zustand';

interface ThemeStore {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

const applyTheme = (theme: 'light' | 'dark') => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
};

export const useThemeStore = create<ThemeStore>((set) => ({
    theme: (() => {
        const stored = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
        applyTheme(stored);
        return stored;
    })(),
    toggleTheme: () =>
        set((state) => {
            const newTheme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
            return { theme: newTheme };
        }),
    setTheme: (theme) => {
        localStorage.setItem('theme', theme);
        applyTheme(theme);
        set({ theme });
    },
}));
