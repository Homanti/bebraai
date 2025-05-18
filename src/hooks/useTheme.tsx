export function useTheme() {
    const setTheme = (theme: 'light' | 'dark') => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    const toggleTheme = () => {
        const current = document.documentElement.getAttribute('data-theme');
        setTheme(current === 'dark' ? 'light' : 'dark');
    };

    return { setTheme, toggleTheme, currentTheme: document.documentElement.getAttribute('data-theme') };
}
