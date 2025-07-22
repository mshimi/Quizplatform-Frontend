// service/authService.ts
import api from './api';
import type {
    AuthenticationRequest,
    RegisterRequest,
    AuthenticationResponse,
    User
} from '../types';

export const login = async (credentials: AuthenticationRequest): Promise<AuthenticationResponse> => {
    const { data } = await api.post<AuthenticationResponse>('/auth/authenticate', credentials);
    return data;
};

export const register = async (userData: RegisterRequest): Promise<AuthenticationResponse> => {
    const { data } = await api.post<AuthenticationResponse>('/auth/register', userData);
    return data;
};

export const logout = async (): Promise<string> => {
    const { data } = await api.post<string>('/auth/logout');
    return data;
};

export const getCurrentUser = async (): Promise<User> => {
    const { data } = await api.get<User>('/auth/me');
    return data;
};