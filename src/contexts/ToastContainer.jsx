// eslint-disable-next-line no-unused-vars
import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../CustomJS/Toast/Toast.jsx';
import '../CustomJS/Toast/Toast.css'
import { v4 as uuidv4 } from 'uuid';

const ToastContext = createContext();

export const useToasts = () => {
    return useContext(ToastContext);
};

// eslint-disable-next-line react/prop-types
const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message, duration = 4000) => {
        const id = uuidv4(); // Use uuid for unique key
        setToasts((prevToasts) => [...prevToasts, { id, type, message, duration }]);

        const timer = setTimeout(() => removeToast(id), duration + 500); // Add slight delay to remove after animation

        // Clear timer on component unmount or if duration changes
        return () => clearTimeout(timer);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                {toasts.map(({ id, type, message, duration }) => (
                    <Toast
                        key={id}
                        type={type}
                        message={message}
                        duration={duration}
                        onClose={() => removeToast(id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
