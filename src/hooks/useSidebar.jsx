import { useEffect, useState } from 'react';

const useSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
        const status = localStorage.getItem('status');
        return status !== 'close';
    });

    useEffect(() => {
        const sidebar = document.querySelector('nav');

        if (!sidebar) {
            return;
        }

        if (isSidebarOpen) {
            sidebar.classList.remove('close');
            localStorage.setItem('status', 'open');
        } else {
            sidebar.classList.add('close');
            localStorage.setItem('status', 'close');
        }
    }, [isSidebarOpen]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return [isSidebarOpen, toggleSidebar];
};

export default useSidebar;
