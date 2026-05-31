import { useTheme as useThemeContext } from '../context/ThemeContext';

export const useTheme = () => {
    const { theme, toggleTheme } = useThemeContext();
    
    // Helper function to get theme-based classes
    const getThemeClass = (lightClass, darkClass) => {
        return theme === 'light' ? lightClass : darkClass;
    };
    
    return { theme, toggleTheme, getThemeClass };
};