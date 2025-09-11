import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { useSignalR } from '../hooks/useSignalR';
import { useAuth } from '../contexts/AuthContext';
import {
    ArrowLeft,
    RefreshCw,
    Clock,
    CheckCircle,
    Package,
    User,
    Calendar,
    AlertCircle,
    Play,
    Pause,
    Square
} from 'lucide-react';
import toast from 'react-hot-toast';

const KDS: React.FC = () => {
    const { eventoId } = useParams<{ eventoId: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState<string>('todos');

    // SignalR
    const {
        connection,
        isConnected,
        startConnection,
        stopConnection,
        joinKDSGroup,
        leaveKDSGroup
    } = useSignalR(token || undefined);

    // Buscar pedidos para KDS
    const { data: pedidos, isLoading: pedidosLoading, refetch: refetchPedidos } = useQuery(
        ['kds-pedidos', eventoId],
        () => apiService.getPedidosParaKDS(eventoId!),
        {
            enabled: !!eventoId,
            refetchInterval: autoRefresh ? 5000 : false, // Atualizar a cada 5 segundos
        }
    );

    // Buscar estatísticas do KDS
    const { data: estatisticas } = useQuery(
        ['kds-estatisticas', eventoId],
        () => apiService.getEstatisticasKDS(eventoId!),
        {
            enabled: !!eventoId,
        }
    );

    // Conectar SignalR
    useEffect(() => {
        if (token) {
            startConnection();
        }

        return () => {
            stopConnection();
        };
    }, [token, startConnection, stopConnection]);

    // Entrar no grupo do evento quando conectar
    useEffect(() => {
        if (isConnected && eventoId) {
            joinKDSGroup(eventoId);
        }

        return () => {
            if (eventoId) {
                leaveKDSGroup(eventoId);
            }
        };
    }, [isConnected, eventoId, joinKDSGroup, leaveKDSGroup]);

    // Configurar listeners do SignalR
    useEffect(() => {
        if (connection) {
            // Novo pedido
            connection.on('NovoPedido', (eventoId: string, pedidoId: string, numeroPedido: string) => {
                if (eventoId === eventoId) {
                    toast.success(`Novo pedido: #${numeroPedido}`);
                    refetchPedidos();
                }
            });

            // Atualização de pedido
            connection.on('AtualizacaoPedido', (eventoId: string, pedidoId: string, numeroPedido: string, status: string, consumidorId: string) => {
                if (eventoId === eventoId) {
                    toast(`Pedido #${numeroPedido} atualizado: ${status}`, { icon: 'ℹ️' });
                    refetchPedidos();
                }
            });

            // Status alterado
            connection.on('StatusPedidoAlterado', (pedidoId: string, novoStatus: string) => {
                toast(`Status do pedido alterado: ${novoStatus}`, { icon: 'ℹ️' });
                refetchPedidos();
            });
        }

        return () => {
            if (connection) {
                connection.off('NovoPedido');
                connection.off('AtualizacaoPedido');
                connection.off('StatusPedidoAlterado');
            }
        };
    }, [connection, eventoId, refetchPedidos]);

    const pedidosFiltrados = pedidos?.filter(pedido => {
        if (filtroStatus === 'todos') return true;
        return pedido.status.toString() === filtroStatus;
    }) || [];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'AguardandoPagamento':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'Pago':
                return <CheckCircle className="h-5 w-5 text-blue-500" />;
            case 'Confirmado':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'EmPreparo':
                return <Package className="h-5 w-5 text-orange-500" />;
            case 'Pronto':
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case 'Entregue':
                return <CheckCircle className="h-5 w-5 text-green-700" />;
            case 'Cancelado':
                return <AlertCircle className="h-5 w-5 text-red-500" />;
            default:
                return <Clock className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'AguardandoPagamento':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Pago':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Confirmado':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'EmPreparo':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Pronto':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Entregue':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'Cancelado':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'AguardandoPagamento':
                return 'Aguardando Pagamento';
            case 'Pago':
                return 'Pago';
            case 'Confirmado':
                return 'Confirmado';
            case 'EmPreparo':
                return 'Em Preparo';
            case 'Pronto':
                return 'Pronto';
            case 'Entregue':
                return 'Entregue';
            case 'Cancelado':
                return 'Cancelado';
            default:
                return status;
        }
    };

    const handleAtualizarStatus = async (pedidoId: string, novoStatus: string) => {
        try {
            await apiService.atualizarStatusPedido(pedidoId, novoStatus);
            toast.success('Status atualizado com sucesso!');
            refetchPedidos();
        } catch (error) {
            toast.error('Erro ao atualizar status do pedido');
        }
    };

    const handleMarcarPronto = async (pedidoId: string) => {
        try {
            await apiService.atualizarStatusPedido(pedidoId, 'Pronto');
            toast.success('Pedido marcado como pronto!');
            refetchPedidos();
        } catch (error) {
            toast.error('Erro ao marcar pedido como pronto');
        }
    };

    const handleMarcarEntregue = async (pedidoId: string) => {
        try {
            await apiService.atualizarStatusPedido(pedidoId, 'Entregue');
            toast.success('Pedido marcado como entregue!');
            refetchPedidos();
        } catch (error) {
            toast.error('Erro ao marcar pedido como entregue');
        }
    };

    if (!eventoId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Evento não encontrado</h2>
                    <p className="text-gray-600 mb-6">O evento especificado não existe ou foi removido.</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Voltar ao Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Kitchen Display System</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className={`flex items-center space-x-2 px-4 py-2 text-sm rounded-lg transition-colors ${autoRefresh
                                    ? 'bg-green-100 text-green-800 border border-green-200'
                                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                                    }`}
                            >
                                {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                <span>{autoRefresh ? 'Pausar' : 'Ativar'} Auto-refresh</span>
                            </button>

                            <button
                                onClick={() => refetchPedidos()}
                                className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <RefreshCw className="h-4 w-4" />
                                <span>Atualizar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Estatísticas */}
                {estatisticas && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Package className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                                    <p className="text-2xl font-bold text-gray-900">{estatisticas.totalPedidos}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Clock className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Em Preparo</p>
                                    <p className="text-2xl font-bold text-gray-900">{estatisticas.pedidosPreparando}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Prontos</p>
                                    <p className="text-2xl font-bold text-gray-900">{estatisticas.pedidosProntos}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Calendar className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                                    <p className="text-2xl font-bold text-gray-900">{estatisticas.tempoMedioPreparo.toFixed(0)} min</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filtros */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6">
                        <div className="flex items-center space-x-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={filtroStatus}
                                    onChange={(e) => setFiltroStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="todos">Todos os Status</option>
                                    <option value="AguardandoPagamento">Aguardando Pagamento</option>
                                    <option value="Pago">Pago</option>
                                    <option value="Confirmado">Confirmado</option>
                                    <option value="EmPreparo">Em Preparo</option>
                                    <option value="Pronto">Pronto</option>
                                    <option value="Entregue">Entregue</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Pedidos */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">
                            Pedidos ({pedidosFiltrados.length})
                        </h2>
                    </div>

                    <div className="p-6">
                        {pedidosLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Carregando pedidos...</p>
                            </div>
                        ) : pedidosFiltrados.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                                <p className="text-gray-600">
                                    {filtroStatus !== 'todos'
                                        ? 'Tente ajustar o filtro de status'
                                        : 'Ainda não há pedidos para este evento'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pedidosFiltrados.map((pedido) => (
                                    <div key={pedido.id} className={`border-2 rounded-lg p-6 hover:shadow-md transition-shadow ${getStatusColor(pedido.status.toString())}`}>
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-bold">
                                                        #{pedido.numeroPedido}
                                                    </h3>
                                                    <span className="flex items-center space-x-1">
                                                        {getStatusIcon(pedido.status.toString())}
                                                        <span className="text-sm font-medium">{getStatusText(pedido.status.toString())}</span>
                                                    </span>
                                                </div>

                                                <div className="space-y-1 text-sm">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="h-4 w-4" />
                                                        <span>{pedido.consumidorNome || 'Cliente não identificado'}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{new Date(pedido.dataCriacao).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{pedido.tempoEstimadoMinutos} min</span>
                                                    </div>
                                                </div>

                                                {pedido.observacoes && (
                                                    <div className="mt-2 text-sm">
                                                        <strong>Observações:</strong> {pedido.observacoes}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-right">
                                                <div className="text-lg font-bold">
                                                    R$ {pedido.valorTotal.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Itens do Pedido */}
                                        {pedido.itens && pedido.itens.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium mb-2">Itens:</h4>
                                                <div className="space-y-1">
                                                    {pedido.itens.map((item, index) => (
                                                        <div key={index} className="flex justify-between text-sm">
                                                            <span>{item.quantidade}x {item.produto?.nome || 'Produto'}</span>
                                                            <span>R$ {item.precoTotal.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Ações */}
                                        <div className="flex items-center space-x-2">
                                            {pedido.status.toString() === 'Confirmado' && (
                                                <button
                                                    onClick={() => handleAtualizarStatus(pedido.id, 'EmPreparo')}
                                                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                                                >
                                                    <Package className="h-4 w-4" />
                                                    <span>Iniciar Preparo</span>
                                                </button>
                                            )}

                                            {pedido.status.toString() === 'EmPreparo' && (
                                                <button
                                                    onClick={() => handleMarcarPronto(pedido.id)}
                                                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Marcar Pronto</span>
                                                </button>
                                            )}

                                            {pedido.status.toString() === 'Pronto' && (
                                                <button
                                                    onClick={() => handleMarcarEntregue(pedido.id)}
                                                    className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm bg-green-700 text-white rounded-lg hover:bg-green-800"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Marcar Entregue</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KDS;