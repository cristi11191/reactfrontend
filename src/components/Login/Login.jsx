import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/styles.css';
import Button from '@mui/material/Button';
import useDarkMode from "../../hooks/useDarkMode.jsx";
import { useToasts } from "../../contexts/ToastContainer.jsx";
import { fetchCurrentUser, login } from "../../services/apiServices.jsx";

export default function Login() {
    const { addToast } = useToasts();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isDarkMode, toggleDarkMode] = useDarkMode();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Attempt to login
            await login(email, password);
            // Fetch current user data
            await fetchCurrentUser();
            // Show success toast message
            addToast('success', 'Successfully Logged In!', 4000);

            // Navigate to home page
            navigate('/');
        } catch (error) {
            const errorMessage = error.message || 'An unknown error occurred.';

            // Log error message to console
            console.error("Error during login:", errorMessage);

            // Show error toast message
            addToast('error', errorMessage, 4000);
        }
    };

    return (
        <div className="LoginBody">
            <div className="login-container">
                <div className="login-mode mode">
                    <div className="mode-toggle" onClick={toggleDarkMode}>
                        <span className="loginswitch"></span>
                    </div>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <Button className="logbtn" type="submit"><span className="logintext">Click</span></Button>
                </form>
            </div>
        </div>
    );
}
