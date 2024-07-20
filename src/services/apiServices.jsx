import axios from 'axios';
const baseURL = 'http://127.0.0.1:8000/api/';



const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Function to refresh token
const refreshToken = async () => {
    try {
        const response = await axiosInstance.post('refresh');
        localStorage.setItem('token', response.data.newToken);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.newToken}`;
        return response.data.newToken;
    } catch (error) {
        localStorage.removeItem('token');
        window.location.replace('/login');
        throw error;
    }
};

// Interceptor to check and refresh token before requests
// Network error handler
const handleNetworkError = () => {
    let errorMessage = 'Network Error: Something went wrong, please try again later.';


    return Promise.reject(new Error(errorMessage));
};



// 401 Unauthorized error handler
const errorsToBypassRefresh = [
    'Invalid credentials',
    'User not found',
    'Account locked',
    'Password expired',
    'Token revoked',
];
const handleUnauthorizedError = async (originalRequest, errorResponse) => {
    const errorMessage = errorResponse?.response?.data?.error;

    // Check if the error message is in the list of errors to bypass refresh
    if (errorsToBypassRefresh.includes(errorMessage)) {
        return Promise.reject(new Error(`Unauthorized: ${errorMessage}`));
    }

    // Proceed with token refresh only if it's not in the list of bypass errors
    if (!originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const newToken = await refreshToken();
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
        } catch (refreshError) {
            console.error('Refresh token failed:', refreshError);
            localStorage.removeItem('token');
            return Promise.reject(new Error('Unauthorized: Invalid credentials.'));
        }
    }

    return Promise.reject(new Error('Unauthorized: Invalid credentials.'));
};

// 403 Forbidden error handler
const handleForbiddenError = (error) => {
    console.error('Unauthorized access:', error);
    localStorage.removeItem('token');
    window.location.replace('/login');
    return Promise.reject({ message: 'Forbidden: Access is denied.', ...error });
};

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        console.log("Eroare primita in response " ,error);

        // Handle network errors (e.g., backend is offline)
        if (!error.response) {
            return handleNetworkError(error);
        }

        // Handle unauthorized errors
        if (error.response.status === 401) {
            return handleUnauthorizedError(originalRequest, error);
        }

        // Handle forbidden errors
        if (error.response.status === 403) {
            return handleForbiddenError(error);
        }

        // Handle server errors (5xx)
        if (error.response.status >= 500) {
            return Promise.reject({ message: 'Server Error: Please try again later.', ...error });
        }

        // Reject other errors
        return Promise.reject(error);
    }
);




// Add token to each request if exists
axiosInstance.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const login = async (email, password) => {
    // eslint-disable-next-line no-useless-catch
    try {

        const response = await axiosInstance.post('login', { email, password });
        // eslint-disable-next-line no-debugger
        const token = response.data.token;
        if(token && response.status === 200){
            localStorage.setItem('token', response.data.token);
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
            return response.data;
        }else {
            throw new Error('Token not received');
        }
    } catch (error) {
        throw error;
    }
};

// Fetch current user data
export const fetchCurrentUser = async () => {
    try {
        const response = await axiosInstance.get('current-user');
        const user = response.data.user;

        localStorage.setItem('role', user.role.name);
        localStorage.setItem('permissions', JSON.stringify(user.role.permissions));

        return user;
    } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
    }
};


export const fetchUsers = async () => {
    // eslint-disable-next-line no-useless-catch
    try {
        const response = await axiosInstance.get('users');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default axiosInstance;
