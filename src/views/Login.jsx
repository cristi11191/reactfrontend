// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import { useNavigate} from 'react-router-dom';
import '../styles/styles.css'
import Button from '@mui/material/Button';
import useDarkMode from "../hooks/useDarkMode.jsx";
import {useToasts} from "../contexts/ToastContainer.jsx";
import {fetchCurrentUser, login} from "../services/apiServices.jsx";


export default function Login() {
    const { addToast } = useToasts();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [isDarkMode, toggleDarkMode] = useDarkMode();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // eslint-disable-next-line no-debugger
            const response = await login(email, password);
            const user = await fetchCurrentUser();
            addToast('success', 'Successful Logged In!', 4000);
            navigate('/');
        } catch (error) {
            const errorMessage = error.message || 'An unknown error occurred.';
            addToast('error',error.message, 4000);
        }
    };

    return(
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
                    <Button className="logbtn" type="submit" ><span className="logintext">Click</span></Button>
                </form>
            </div>
        </div>
    )
}