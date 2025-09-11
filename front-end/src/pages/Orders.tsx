import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { StatusPedido } from '../types';
import {
    ArrowLeft,
    Search,
    Filter,
    Eye,
    CheckCircle,
    Clock,
    XCircle,
    Package,
    RefreshCw,
    Calendar,
    User,
    Phone,
    MapPin
} from 'lucide-react';
import toast from 'react-hot-toast';

const Orders: React.FC = () => {
    const navigate = useNavigate();
    const { usuario, isAuthenticated } = useAuth();
    const [filtroStatus, setFiltroStatus] = useState<string>('todos');
    const [busca, setBusca] = useState('');

    // Redirecionar se não estiver logado
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/client-login');
            return;
        }
    }, [isAuthenticated, navigate]);

    // Buscar pedidos
    const { data: pedidos, isLoading: pedidosLoading, refetch: refetchPedidos } = useQuery(
        ['pedidos-gestor'],
        () => apiService.getPedidosByUsuario(),
        {
            enabled: isAuthenticated
        }
    );

    const pedidosFiltrados = pedidos?.filter(pedido => {
        const matchStatus = filtroStatus === 'todos' || pedido.status.toString() === filtroStatus;
        const matchBusca = busca === '' ||
            pedido.numeroPedido.toLowerCase().includes(busca.toLowerCase()) ||
            pedido.consumidorNome?.toLowerCase().includes(busca.toLowerCase());
        return matchStatus && matchBusca;
    }) || [];

    const getStatusIcon = (status: StatusPedido) => {
        switch (status) {
            case 'AguardandoPagamento':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'Pago':
                return <CheckCircle className="h-4 w-4 text-blue-500" />;
            case 'Confirmado':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'EmPreparo':
                return <Package className="h-4 w-4 text-orange-500" />;
            case 'Preparando':
                return <Package className="h-4 w-4 text-orange-500" />;
            case 'Pronto':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'Entregue':
                return <CheckCircle className="h-4 w-4 text-green-700" />;
            case 'Cancelado':
                return <XCircle className="h-4 w-4 text-red-500" />;
            default:
                return <Clock className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status: StatusPedido) => {
        switch (status) {
            case 'AguardandoPagamento':
                return 'bg-yellow-100 text-yellow-800';
            case 'Pago':
                return 'bg-blue-100 text-blue-800';
            case 'Confirmado':
                return 'bg-green-100 text-green-800';
            case 'EmPreparo':
                return 'bg-orange-100 text-orange-800';
            case 'Preparando':
                return 'bg-orange-100 text-orange-800';
            case 'Pronto':
                return 'bg-green-100 text-green-800';
            case 'Entregue':
                return 'bg-green-100 text-green-800';
            case 'Cancelado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: StatusPedido) => {
        switch (status) {
            case 'AguardandoPagamento':
                return 'Aguardando Pagamento';
            case 'Pago':
                return 'Pago';
            case 'Confirmado':
                return 'Confirmado';
            case 'EmPreparo':
                return 'Em Preparo';
            case 'Preparando':
                return 'Preparando';
            case 'Pronto':
                return 'Pronto';
            case 'Entregue':
                return 'Entregue';
            case 'Cancelado':
                return 'Cancelado';
            default:
                return 'Desconhecido';
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

    if (!isAuthenticated) {
        return null;
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
                            <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
                        </div>

                        <div className="flex items-center space-x-4">
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
                {/* Filtros */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Buscar
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Número do pedido ou nome do cliente"
                                        value={busca}
                                        onChange={(e) => setBusca(e.target.value)}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <select
                                    value={filtroStatus}
                                    onChange={(e) => setFiltroStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                                    {busca || filtroStatus !== 'todos'
                                        ? 'Tente ajustar os filtros de busca'
                                        : 'Ainda não há pedidos para este evento'
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pedidosFiltrados.map((pedido) => (
                                    <div key={pedido.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        #{pedido.numeroPedido}
                                                    </h3>
                                                    <span className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getStatusColor(pedido.status)}`}>
                                                        {getStatusIcon(pedido.status)}
                                                        <span>{getStatusText(pedido.status)}</span>
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center space-x-2">
                                                        <User className="h-4 w-4" />
                                                        <span>{pedido.consumidorNome || 'Cliente não identificado'}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>{new Date(pedido.dataCriacao).toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <Package className="h-4 w-4" />
                                                        <span>{pedido.itens?.length || 0} itens</span>
                                                    </div>
                                                </div>

                                                {pedido.observacoes && (
                                                    <div className="mt-2 text-sm text-gray-600">
                                                        <strong>Observações:</strong> {pedido.observacoes}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-right">
                                                <div className="text-lg font-bold text-gray-900">
                                                    R$ {pedido.valorTotal.toFixed(2)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {pedido.tempoEstimadoMinutos} min
                                                </div>
                                            </div>
                                        </div>

                                        {/* Itens do Pedido */}
                                        {pedido.itens && pedido.itens.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">Itens:</h4>
                                                <div className="space-y-1">
                                                    {pedido.itens.map((item, index) => (
                                                        <div key={index} className="flex justify-between text-sm text-gray-600">
                                                            <span>{item.quantidade}x {item.produtoNome}</span>
                                                            <span>R$ {item.precoTotal.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Ações */}
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => navigate(`/pedidos/${pedido.id}`)}
                                                className="flex items-center space-x-2 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span>Ver Detalhes</span>
                                            </button>

                                            {pedido.status === 'AguardandoPagamento' && (
                                                <button
                                                    onClick={() => handleAtualizarStatus(pedido.id, 'Confirmado')}
                                                    className="flex items-center space-x-2 px-3 py-2 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Confirmar</span>
                                                </button>
                                            )}

                                            {pedido.status === 'Confirmado' && (
                                                <button
                                                    onClick={() => handleAtualizarStatus(pedido.id, 'EmPreparo')}
                                                    className="flex items-center space-x-2 px-3 py-2 text-sm text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50"
                                                >
                                                    <Package className="h-4 w-4" />
                                                    <span>Iniciar Preparo</span>
                                                </button>
                                            )}

                                            {pedido.status === 'EmPreparo' && (
                                                <button
                                                    onClick={() => handleAtualizarStatus(pedido.id, 'Pronto')}
                                                    className="flex items-center space-x-2 px-3 py-2 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Marcar Pronto</span>
                                                </button>
                                            )}

                                            {pedido.status === 'Pronto' && (
                                                <button
                                                    onClick={() => handleAtualizarStatus(pedido.id, 'Entregue')}
                                                    className="flex items-center space-x-2 px-3 py-2 text-sm text-green-700 border border-green-700 rounded-lg hover:bg-green-50"
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

export default Orders;