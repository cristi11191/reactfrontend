import { useEffect, useState } from 'react';

const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const mode = localStorage.getItem('mode');
        return mode === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
            localStorage.setItem('mode', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('mode', 'light');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return [isDarkMode, toggleDarkMode];
};

export default useDarkMode;
