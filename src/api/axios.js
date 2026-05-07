import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Get refresh token from cookie
                const refreshToken = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('refreshToken='))
                    ?.split('=')[1];

                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Determine the role for the refresh endpoint
                const user = JSON.parse(localStorage.getItem('user'));
                const role = user?.role?.toLowerCase() === 'vendor' ? 'vendors' : 'clients';

                const response = await axios.post(`${import.meta.env.VITE_API_URL}/${role}/refresh`, {
                    refreshToken
                });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Update tokens
                localStorage.setItem('accessToken', accessToken);
                document.cookie = `refreshToken=${newRefreshToken}; path=/; secure; samesite=strict`;

                // Update headers and retry
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails, clear everything and redirect to login
                const user = JSON.parse(localStorage.getItem('user'));
                const type = user?.role?.toLowerCase() === 'vendor' ? 'vendor' : 'client';

                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                localStorage.removeItem('streamChatToken');
                document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

                window.location.href = `/${type}/login`;

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
