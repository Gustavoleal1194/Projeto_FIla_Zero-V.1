import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvent } from '../contexts/EventContext';
import { demoService } from '../services/demoService';
import { apiService } from '../services/api';
import { QrCode, User, CreditCard, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ConsumerLogin: React.FC = () => {
    const { eventoId } = useParams<{ eventoId: string }>();
    const navigate = useNavigate();
    const { login, loginCpf, isAuthenticated, eventoVinculado } = useAuth();
    const { carregarEvento, eventoAtual } = useEvent();

    const [loginMethod, setLoginMethod] = useState<'cpf' | 'codigo'>('cpf');
    const [cpf, setCpf] = useState('123.456.789-00'); // CPF de demonstração
    const [codigo, setCodigo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [evento, setEvento] = useState<any>(null);

    // Carregar dados do evento
    useEffect(() => {
        const loadEvento = async () => {
            if (eventoId) {
                try {
                    const eventoData = await apiService.getEventoById(eventoId);
                    setEvento(eventoData);
                } catch (error) {
                    console.error('Erro ao carregar evento:', error);
                    toast.error('Evento não encontrado');
                    navigate('/');
                }
            } else {
                // Se não tem eventoId, carregar o primeiro evento disponível
                try {
                    const eventos = await apiService.getEventos();
                    if (eventos && eventos.length > 0) {
                        setEvento(eventos[0]);
                    } else {
                        toast.error('Nenhum evento encontrado');
                    }
                } catch (error) {
                    console.error('Erro ao carregar eventos:', error);
                    toast.error('Erro ao carregar eventos');
                }
            }
        };

        loadEvento();
    }, [eventoId, navigate]);

    // Redirecionar se já estiver logado
    useEffect(() => {
        if (isAuthenticated && eventoVinculado) {
            // Só redirecionar se não estiver na página de login do evento correto
            if (eventoVinculado.id !== eventoId) {
                navigate(`/evento/${eventoVinculado.id}/menu`, { replace: true });
            }
        }
    }, [isAuthenticated, eventoVinculado, eventoId, navigate]);

    const formatCPF = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    };

    const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatCPF(e.target.value);
        setCpf(formatted);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsLoading(true);

        try {
            if (loginMethod === 'cpf') {
                if (!cpf || cpf.replace(/\D/g, '').length !== 11) {
                    toast.error('CPF inválido');
                    setIsLoading(false);
                    return;
                }

                // Usar login real com CPF
                const cpfLimpo = cpf.replace(/\D/g, '');
                const loginSuccess = await loginCpf(cpfLimpo);

                if (loginSuccess) {
                    // Redirecionar para o evento vinculado ao usuário
                    if (eventoVinculado) {
                        navigate(`/evento/${eventoVinculado.id}/menu`, { replace: true });
                    } else {
                        // Se não tem eventoId na URL, usar evento atual
                        const targetEventoId = eventoId || evento?.id;
                        if (targetEventoId) {
                            navigate(`/evento/${targetEventoId}/menu`, { replace: true });
                        } else {
                            toast.error('Evento não encontrado');
                        }
                    }
                }
            } else {
                if (!codigo.trim()) {
                    toast.error('Código inválido');
                    setIsLoading(false);
                    return;
                }

                // Para código da pulseira, ainda usar demo por enquanto
                const loginData = await demoService.login({
                    email: `consumidor_${codigo}@evento.com`,
                    senha: 'senha123'
                });

                const loginSuccess = await login({
                    email: loginData.usuario.email,
                    senha: '123456'
                });

                if (loginSuccess) {
                    if (loginData.usuario.eventoVinculado) {
                        navigate(`/evento/${loginData.usuario.eventoVinculado.id}/menu`, { replace: true });
                    } else {
                        const targetEventoId = eventoId || '1';
                        navigate(`/evento/${targetEventoId}/menu`, { replace: true });
                    }
                }
            }
        } catch (error) {
            console.error('Erro no login:', error);
            toast.error('Erro ao fazer login. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQRCodeScan = () => {
        // Simular escaneamento de QR Code
        toast('Funcionalidade de QR Code será implementada em breve', { icon: 'ℹ️' });
    };

    if (!evento) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando evento...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header com logo discreta */}
            <div className="bg-white shadow-sm">
                <div className="max-w-md mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Powered by <span className="font-semibold text-blue-600">FilaZero</span>
                        </div>
                        <button
                            onClick={handleQRCodeScan}
                            className="p-2 text-gray-400 hover:text-gray-600"
                            title="Escanear QR Code"
                        >
                            <QrCode className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Conteúdo principal */}
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {/* Logo do evento */}
                    <div className="text-center mb-8">
                        {evento.logoUrl && (
                            <img
                                src={evento.logoUrl}
                                alt={evento.nome}
                                className="h-20 w-20 mx-auto rounded-lg object-cover mb-4"
                            />
                        )}
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{evento.nome}</h1>
                        <p className="text-gray-600">{evento.cidade}, {evento.estado}</p>
                    </div>

                    {/* Card de login */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="text-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Acesse seu pedido
                            </h2>
                            <p className="text-sm text-gray-600">
                                Digite seu CPF ou código da pulseira
                            </p>
                        </div>

                        {/* Seleção do método */}
                        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                            <button
                                type="button"
                                onClick={() => setLoginMethod('cpf')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${loginMethod === 'cpf'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <User className="w-4 h-4 inline mr-2" />
                                CPF
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginMethod('codigo')}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${loginMethod === 'codigo'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <CreditCard className="w-4 h-4 inline mr-2" />
                                Código
                            </button>
                        </div>

                        {/* Formulário */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {loginMethod === 'cpf' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        CPF
                                    </label>
                                    <input
                                        type="text"
                                        value={cpf}
                                        onChange={handleCPFChange}
                                        placeholder="000.000.000-00"
                                        maxLength={14}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg"
                                        required
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Código da Pulseira
                                    </label>
                                    <input
                                        type="text"
                                        value={codigo}
                                        onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                                        placeholder="ABC123"
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
                                        required
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Entrando...
                                    </>
                                ) : (
                                    <>
                                        Entrar
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Informações adicionais */}
                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500 mb-2">
                                Não tem acesso? Procure a equipe do evento
                            </p>
                            <div className="flex items-center justify-center text-xs text-gray-400">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                Seus dados estão seguros e criptografados
                            </div>
                        </div>

                        {/* Informações de teste */}
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-800 font-medium mb-1">
                                🧪 Modo Teste
                            </p>
                            <p className="text-xs text-blue-700">
                                CPF: 367.535.718-09 (Gustavo) já preenchido para teste
                            </p>
                        </div>
                    </div>

                    {/* Instruções */}
                    <div className="mt-6 text-center">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                            Como funciona?
                        </h3>
                        <div className="text-xs text-gray-600 space-y-1">
                            <p>1. Digite seu CPF ou código da pulseira</p>
                            <p>2. Acesse o cardápio digital</p>
                            <p>3. Faça seus pedidos e pague</p>
                            <p>4. Receba notificação quando estiver pronto</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsumerLogin;
