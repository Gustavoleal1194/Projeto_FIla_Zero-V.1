import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, LoginRequest, RegisterRequest, Evento } from '../types';
import { apiService } from '../services/api';
import { demoService } from '../services/demoService';
import toast from 'react-hot-toast';

interface AuthContextType {
    usuario: Usuario | null;
    token: string | null;
    eventoVinculado: Evento | null;
    login: (credentials: LoginRequest) => Promise<boolean>;
    loginCpf: (cpf: string) => Promise<boolean>;
    register: (data: RegisterRequest) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [eventoVinculado, setEventoVinculado] = useState<Evento | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            const storedUsuario = localStorage.getItem('usuario');

            if (storedToken && storedUsuario) {
                try {
                    setToken(storedToken);
                    setUsuario(JSON.parse(storedUsuario));

                    // Verificar se o token ainda é válido
                    await apiService.getUsuarioAtual();
                } catch (error) {
                    // Token inválido, limpar storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuario');
                    setToken(null);
                    setUsuario(null);
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginRequest): Promise<boolean> => {
        try {
            setLoading(true);

            // Usar API real para login
            const response = await apiService.login(credentials);

            setToken(response.token);
            setUsuario(response.usuario);
            setEventoVinculado(response.usuario.eventoVinculado || null);

            localStorage.setItem('token', response.token);
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
            if (response.usuario.eventoVinculado) {
                localStorage.setItem('eventoVinculado', JSON.stringify(response.usuario.eventoVinculado));
            }

            toast.success('Login realizado com sucesso!');

            // Não redirecionar automaticamente aqui - deixar para o componente decidir

            return true;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Erro ao fazer login';
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const loginCpf = async (cpf: string): Promise<boolean> => {
        try {
            setLoading(true);

            // Usar API real para login com CPF
            const response = await apiService.loginCpf(cpf);

            setToken(response.token);
            setUsuario(response.usuario);
            setEventoVinculado(response.usuario.eventoVinculado || null);

            localStorage.setItem('token', response.token);
            localStorage.setItem('usuario', JSON.stringify(response.usuario));
            if (response.usuario.eventoVinculado) {
                localStorage.setItem('eventoVinculado', JSON.stringify(response.usuario.eventoVinculado));
            }

            toast.success('Login realizado com sucesso!');

            return true;
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || 'Erro ao fazer login';
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterRequest): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await apiService.register(data);

            setToken(response.token);
            setUsuario(response.usuario);

            localStorage.setItem('token', response.token);
            localStorage.setItem('usuario', JSON.stringify(response.usuario));

            toast.success('Conta criada com sucesso!');
            return true;
        } catch (error: any) {
            const message = error.response?.data?.message || 'Erro ao criar conta';
            toast.error(message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setToken(null);
        setUsuario(null);
        setEventoVinculado(null);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('eventoVinculado');
        apiService.logout();
        toast.success('Logout realizado com sucesso!');
    };

    const value: AuthContextType = {
        usuario,
        token,
        eventoVinculado,
        login,
        loginCpf,
        register,
        logout,
        loading,
        isAuthenticated: !!token && !!usuario,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};