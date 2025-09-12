import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, LoginRequest, RegisterRequest, Evento } from '../types';
import { apiService } from '../services/api';
import toast from 'react-hot-toast';

interface AuthContextType {
    usuario: Usuario | null;
    token: string | null;
    eventoVinculado: Evento | null;
    login: (credentials: LoginRequest) => Promise<boolean>;
    loginCpf: (cpf: string, eventoId?: string) => Promise<boolean>;
    register: (data: RegisterRequest) => Promise<boolean>;
    loginManager: (userData: any) => void; // Login do gestor
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
                    const usuarioData = JSON.parse(storedUsuario);
                    setUsuario(usuarioData);

                    // Se for token demo, não validar com API
                    if (storedToken === 'demo_token_123') {
                        // Carregar evento vinculado do localStorage se existir
                        const storedEvento = localStorage.getItem('eventoVinculado');
                        if (storedEvento) {
                            setEventoVinculado(JSON.parse(storedEvento));
                        }
                    } else {
                        // Verificar se o token ainda é válido para tokens reais
                        await apiService.getUsuarioAtual();
                    }
                } catch (error) {
                    // Token inválido, limpar storage
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuario');
                    localStorage.removeItem('eventoVinculado');
                    setToken(null);
                    setUsuario(null);
                    setEventoVinculado(null);
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

    const loginCpf = async (cpf: string, eventoId?: string): Promise<boolean> => {
        try {
            setLoading(true);

            // CPF de demonstração - aceitar para todos os eventos
            if (cpf === '123.456.789-00') {
                // Mapear eventoId para dados específicos do evento
                const eventosDemo = {
                    '11111111-1111-1111-1111-111111111111': {
                        id: '11111111-1111-1111-1111-111111111111',
                        nome: '🎸 Festival Rock Underground',
                        descricao: 'Demo público - Festival de Rock',
                        endereco: 'Arena Rock',
                        cidade: 'São Paulo',
                        estado: 'SP',
                        cep: '01234-567',
                        telefone: '(11) 99999-9999',
                        email: 'rock@filazero.com',
                        logoUrl: '',
                        corPrimaria: '#FF6B35',
                        corSecundaria: '#E55A2B',
                        dataInicio: '2024-12-31',
                        dataFim: '2025-01-01',
                        ativo: true,
                        gestorId: 'demo-gestor-rock'
                    },
                    '22222222-2222-2222-2222-222222222222': {
                        id: '22222222-2222-2222-2222-222222222222',
                        nome: '🍷 Feira Gourmet Premium',
                        descricao: 'Demo público - Feira Gourmet',
                        endereco: 'Centro Gourmet',
                        cidade: 'São Paulo',
                        estado: 'SP',
                        cep: '01234-567',
                        telefone: '(11) 99999-9999',
                        email: 'gourmet@filazero.com',
                        logoUrl: '',
                        corPrimaria: '#8B4513',
                        corSecundaria: '#6B3410',
                        dataInicio: '2024-12-31',
                        dataFim: '2025-01-01',
                        ativo: true,
                        gestorId: 'demo-gestor-gourmet'
                    },
                    '33333333-3333-3333-3333-333333333333': {
                        id: '33333333-3333-3333-3333-333333333333',
                        nome: '🎪 Festa Junina Tradicional',
                        descricao: 'Demo público - Festa Junina',
                        endereco: 'Quadra da Escola',
                        cidade: 'São Paulo',
                        estado: 'SP',
                        cep: '01234-567',
                        telefone: '(11) 99999-9999',
                        email: 'junina@filazero.com',
                        logoUrl: '',
                        corPrimaria: '#FFD700',
                        corSecundaria: '#FFA500',
                        dataInicio: '2024-12-31',
                        dataFim: '2025-01-01',
                        ativo: true,
                        gestorId: 'demo-gestor-junina'
                    },
                    '44444444-4444-4444-4444-444444444444': {
                        id: '44444444-4444-4444-4444-444444444444',
                        nome: '🎨 Festival de Arte & Cultura',
                        descricao: 'Demo público - Festival de Arte',
                        endereco: 'Centro Cultural',
                        cidade: 'São Paulo',
                        estado: 'SP',
                        cep: '01234-567',
                        telefone: '(11) 99999-9999',
                        email: 'arte@filazero.com',
                        logoUrl: '',
                        corPrimaria: '#9B59B6',
                        corSecundaria: '#8E44AD',
                        dataInicio: '2024-12-31',
                        dataFim: '2025-01-01',
                        ativo: true,
                        gestorId: 'demo-gestor-arte'
                    }
                };

                // Usar evento específico se fornecido, senão usar evento padrão
                const eventoVinculado = eventoId && eventosDemo[eventoId as keyof typeof eventosDemo]
                    ? eventosDemo[eventoId as keyof typeof eventosDemo]
                    : {
                        id: 'demo-evento-123',
                        nome: 'Evento de Demonstração',
                        descricao: 'Evento para demonstração do sistema',
                        endereco: 'Local de Demonstração',
                        cidade: 'São Paulo',
                        estado: 'SP',
                        cep: '01234-567',
                        telefone: '(11) 99999-9999',
                        email: 'demo@filazero.com',
                        logoUrl: '',
                        corPrimaria: '#3B82F6',
                        corSecundaria: '#1E40AF',
                        dataInicio: '2024-12-31',
                        dataFim: '2025-01-01',
                        ativo: true,
                        gestorId: 'demo-gestor-123'
                    };

                const usuarioDemo = {
                    id: 'demo-user-123',
                    nome: 'Usuário Demo',
                    email: 'demo@filazero.com',
                    telefone: '(11) 99999-9999',
                    tipo: 'Consumidor' as const,
                    emailConfirmado: true,
                    ultimoLogin: new Date().toISOString(),
                    eventoVinculado
                };

                setToken('demo_token_123');
                setUsuario(usuarioDemo);
                setEventoVinculado(usuarioDemo.eventoVinculado);

                localStorage.setItem('token', 'demo_token_123');
                localStorage.setItem('usuario', JSON.stringify(usuarioDemo));
                localStorage.setItem('eventoVinculado', JSON.stringify(usuarioDemo.eventoVinculado));

                toast.success('Login de demonstração realizado com sucesso!');
                return true;
            }

            // Usar API real para outros CPFs
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

    const loginManager = (userData: any) => {
        setToken('manager_token_demo');
        setUsuario(userData);
        setEventoVinculado(userData.evento || null);

        localStorage.setItem('token', 'manager_token_demo');
        localStorage.setItem('usuario', JSON.stringify(userData));
        if (userData.evento) {
            localStorage.setItem('eventoVinculado', JSON.stringify(userData.evento));
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
        loginManager,
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