// src/services/apiClient.ts
import axios from 'axios';
import { API_BASE_URL } from '../config/appConfig';
import { AuthService } from './authService'; // Assuming authService.ts is in the same directory

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AuthService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor for error handling / token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Example: Check for 401 Unauthorized and try to refresh token
    // This is a simplified example. Robust token refresh needs more logic.
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to silently sign in to refresh tokens
        // This depends on oidc-client-ts's silent renew capabilities
        // or a dedicated refreshToken method in AuthService.
        // For oidc-client-ts, automaticSilentRenew in UserManager settings is preferred.
        // If silent renew is automatic, this explicit refresh might not be needed here,
        // or it might be a manual trigger if silent renew fails.
        console.log('APIClient: Token expired, relying on automaticSilentRenew or manual re-login.');
        // const user = await AuthService.userManager.signinSilent(); // This might trigger UI if not truly silent
        // if (user && user.access_token) {
        //   apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + user.access_token; // Update default for future or just originalRequest
        //   originalRequest.headers.Authorization = `Bearer ${user.access_token}`;
        //   return apiClient(originalRequest);
        // }
        // If silent renew is not an option here, or fails, redirect to login or handle error
        // For now, we rely on automaticSilentRenew or manual re-login.
        // The user might be logged out by AuthContext event handlers if silent renew fails.
      } catch (refreshError) {
        console.error('APIClient: Silent refresh failed or not attempted here', refreshError);
        // AuthService.logout(); // Or redirect to login page / trigger logout in AuthContext
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
