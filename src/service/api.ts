// service/api.ts
import axios from 'axios';

const api = axios.create({
    // Use the relative path that will be caught by the Vite proxy
    baseURL: '/api/v1',
    // This is still needed to ensure cookies are sent to the proxy,
    // which then forwards them to the backend.
    withCredentials: true,
});

// Request interceptor to add the access token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle automatic token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                console.log('Refreshing token...');
                // The endpoint is now relative to the baseURL
                const { data } = await api.post('/auth/refresh-token');
                localStorage.setItem('accessToken', data.access_token);

                // Update the default header for subsequent requests
                api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

                // Update the header for the original request and retry it
                originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
                return api(originalRequest);

            } catch (refreshError) {
                console.error('Token refresh failed. Logging out.', refreshError);
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
