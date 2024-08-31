// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Toast.css'; // Assuming you have the CSS from the original Toasty.js

const Toast = ({
                   type,
                   message,
                   duration = 4000, // Default value for duration
                   onClose
               }) => {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    return (
        <div className={`toast toast--${type}`}>
            {message}
        </div>
    );
};

Toast.propTypes = {
    type: PropTypes.oneOf(['info', 'success', 'warning', 'error']).isRequired,
    message: PropTypes.string.isRequired,
    duration: PropTypes.number,
    onClose: PropTypes.func.isRequired,
};

// Removed Toast.defaultProps since we're using default parameters now

export default Toast;
