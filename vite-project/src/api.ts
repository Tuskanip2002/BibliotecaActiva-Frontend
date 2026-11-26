import axios from 'axios';
import type { ApiError } from './type';
export const api = axios.create({
 baseURL: (import.meta as ImportMeta & { env: { VITE_API_URL: string } }).env.VITE_API_URL
});
api.interceptors.request.use(config => {
 const token = localStorage.getItem('token');
 if (token && !config.url?.startsWith('/auth/'))
 config.headers.Authorization = `Bearer ${token}`;
 return config;
});
api.interceptors.response.use(r => r, error => {
 if (error.response?.status === 401 &&
 !error.config?.url?.startsWith('/auth/')) {
 localStorage.removeItem('token');
 localStorage.removeItem('user');
 window.location.href = '/login';
 }
 return Promise.reject(error);
});
export function message(e: unknown) {
 return axios.isAxiosError<ApiError>(e)
 ? e.response?.data?.message || e.message : 'UNAUTHORIZED';
}
export function conflict(e: unknown, code: string) {
 return axios.isAxiosError<ApiError>(e) &&
 e.response?.status === 409 && e.response.data?.code === code;
}