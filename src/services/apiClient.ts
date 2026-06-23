import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Необходимо для безопасной работы с куками (HttpOnly)
});

// Перехватчик запросов: добавление Access Token в заголовки
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 1. Проверка на разрыв соединения / отсутствие интернета
    if (error.code === 'ERR_NETWORK') {
      toast.error('Сбой сети. Проверьте интернет-соединение', { id: 'network-error' });
      return Promise.reject(error);
    }

    // 2. Проверка на превышение лимита времени ожидания (Timeout)
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      toast.error('Превышено время ожидания ответа от сервера', { id: 'timeout-error' });
      return Promise.reject(error);
    }

    // ... блок обработки 401 / рефреша токена ...
    // Перехватчик ответов: автоматический рефреш
    apiClient.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
    
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
    
          try {
            // Запрос на обновление токенов. 
            // Если рефреш-токен хранится в HttpOnly куке, сервер прочитает его сам.
            const response = await axios.post<{ accessToken: string }>(
              `${apiClient.defaults.baseURL}/auth/refresh`,
              {},
              { withCredentials: true }
            );
    
            const { accessToken } = response.data;
            localStorage.setItem('accessToken', accessToken);
    
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            }
    
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Если рефреш-токен тоже протух, сбрасываем сессию
            if (typeof window !== 'undefined') {
              localStorage.removeItem('accessToken');
              window.location.href = '/login?expired=true';
            }
            return Promise.reject(refreshError);
          }
        }
    
        return Promise.reject(error);
      }
    );
  }
);
