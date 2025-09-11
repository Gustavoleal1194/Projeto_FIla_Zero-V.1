import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvent } from '../contexts/EventContext';
import { getBackendImageUrl } from '../utils/imageUtils';
import { useTheme } from '../contexts/ThemeContext';
import { apiService } from '../services/api';
import { Pedido } from '../types';
import {
    ArrowLeft,
    User,
    ShoppingBag,
    Clock,
    CheckCircle,
    XCircle,
    MapPin,
    Phone,
    Mail,
    Calendar,
    CreditCard,
    Menu
} from 'lucide-react';

const ConsumerProfile: React.FC = () => {
    const { eventoId } = useParams<{ eventoId: string }>();
    const navigate = useNavigate();
    const { usuario, logout } = useAuth();
    const { eventoAtual } = useEvent();
    const { tema } = useTheme();

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Carregar pedidos reais do usuário
    useEffect(() => {
        const loadPedidos = async () => {
            setIsLoading(true);
            try {
                const pedidosData = await apiService.getPedidosByUsuario();
                setPedidos(pedidosData);
            } catch (error) {
                console.error('Erro ao carregar pedidos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPedidos();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Entregue':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'EmPreparo':
            case 'Preparando':
                return <Clock className="w-5 h-5 text-orange-500" />;
            case 'AguardandoPagamento':
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case 'Confirmado':
                return <CheckCircle className="w-5 h-5 text-blue-500" />;
            case 'Pronto':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'Cancelado':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Entregue':
                return 'text-green-600 bg-green-100';
            case 'EmPreparo':
            case 'Preparando':
                return 'text-orange-600 bg-orange-100';
            case 'AguardandoPagamento':
                return 'text-yellow-600 bg-yellow-100';
            case 'Confirmado':
                return 'text-blue-600 bg-blue-100';
            case 'Pronto':
                return 'text-green-600 bg-green-100';
            case 'Cancelado':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleLogout = () => {
        logout();
        navigate(`/evento/${eventoId}/login`);
    };

    if (!usuario) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando perfil...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(`/evento/${eventoId}`)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            <h1 className="text-xl font-bold text-gray-900">Meu Perfil</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigate(`/evento/${eventoId}/menu`)}
                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
                            >
                                <Menu className="h-4 w-4" />
                                <span>Cardápio</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                Sair
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo principal */}
            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Informações do usuário */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex items-center space-x-4">
                            <div
                                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                                style={{ backgroundColor: tema.corPrimaria }}
                            >
                                {usuario.nome.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{usuario.nome}</h2>
                                <p className="text-gray-600">{usuario.email}</p>
                                <p className="text-sm text-gray-500">{usuario.telefone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Estatísticas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <ShoppingBag className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">{pedidos.length}</div>
                            <div className="text-sm text-gray-600">Pedidos Realizados</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">
                                {pedidos.filter(p => p.status === 'Entregue').length}
                            </div>
                            <div className="text-sm text-gray-600">Pedidos Entregues</div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <CreditCard className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <div className="text-2xl font-bold text-gray-900">
                                R$ {pedidos.reduce((total, pedido) => total + pedido.valorTotal, 0).toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-600">Total Gasto</div>
                        </div>
                    </div>

                    {/* Histórico de pedidos */}
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                <Clock className="w-5 h-5 mr-2" />
                                Histórico de Pedidos
                            </h3>
                        </div>

                        <div className="p-6">
                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                    <p className="text-gray-600">Carregando pedidos...</p>
                                </div>
                            ) : pedidos.length === 0 ? (
                                <div className="text-center py-8">
                                    <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">Nenhum pedido encontrado</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pedidos.map((pedido) => (
                                        <div key={pedido.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center space-x-3">
                                                    {getStatusIcon(pedido.status)}
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{pedido.numeroPedido}</h4>
                                                        <p className="text-sm text-gray-600">{formatDate(pedido.dataCriacao)}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-gray-900">
                                                        R$ {pedido.valorTotal.toFixed(2)}
                                                    </div>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                                                        {pedido.status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-100 pt-3">
                                                <h5 className="text-sm font-medium text-gray-900 mb-2">Itens:</h5>
                                                <div className="space-y-1">
                                                    {pedido.itens.map((item: any, index: number) => (
                                                        <div key={index} className="flex justify-between text-sm text-gray-600">
                                                            <span>{item.quantidade}x {item.produtoNome || item.produto?.nome || 'Produto'}</span>
                                                            <span>R$ {(item.precoUnitario * item.quantidade).toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Botão para ver todos os pedidos */}
                            {pedidos.length > 0 && (
                                <div className="mt-4 text-center">
                                    <button
                                        onClick={() => navigate(`/evento/${eventoId}/pedidos`)}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Ver Todos os Pedidos
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Informações do evento */}
                    {eventoAtual && (
                        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2" />
                                Evento Atual
                            </h3>
                            <div className="flex items-center space-x-4">
                                {eventoAtual.logoUrl && (
                                    <img
                                        src={getBackendImageUrl(eventoAtual.logoUrl)}
                                        alt={eventoAtual.nome}
                                        className="w-12 h-12 rounded-lg object-cover"
                                    />
                                )}
                                <div>
                                    <h4 className="font-medium text-gray-900">{eventoAtual.nome}</h4>
                                    <p className="text-sm text-gray-600">{eventoAtual.cidade}, {eventoAtual.estado}</p>
                                    <p className="text-sm text-gray-500">{eventoAtual.endereco}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ConsumerProfile;
