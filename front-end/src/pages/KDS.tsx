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
    AlertCircle,
    Eye,
    EyeOff,
    ChefHat,
    Users,
    Timer
} from 'lucide-react';
import toast from 'react-hot-toast';

// Dados de demonstração para a tela KDS
const dadosDemonstracao = {
    pedidos: [
        {
            id: 'PED001',
            numero: '001',
            cliente: 'João Silva',
            mesa: 'Mesa 5',
            status: 'preparando',
            dataHora: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
            total: 45.90,
            itens: [
                {
                    id: 'ITEM001',
                    nome: 'Hambúrguer Clássico',
                    quantidade: 2,
                    observacoes: 'Sem cebola',
                    status: 'preparando',
                    tempoPreparo: 15,
                    categoria: 'Lanches'
                },
                {
                    id: 'ITEM002',
                    nome: 'Batata Frita',
                    quantidade: 1,
                    observacoes: 'Bem crocante',
                    status: 'aguardando',
                    tempoPreparo: 8,
                    categoria: 'Acompanhamentos'
                }
            ]
        },
        {
            id: 'PED002',
            numero: '002',
            cliente: 'Maria Santos',
            mesa: 'Mesa 12',
            status: 'aguardando',
            dataHora: new Date(Date.now() - 2 * 60 * 1000), // 2 minutos atrás
            total: 32.50,
            itens: [
                {
                    id: 'ITEM003',
                    nome: 'Pizza Margherita',
                    quantidade: 1,
                    observacoes: 'Borda recheada',
                    status: 'aguardando',
                    tempoPreparo: 20,
                    categoria: 'Pizzas'
                }
            ]
        },
        {
            id: 'PED003',
            numero: '003',
            cliente: 'Carlos Oliveira',
            mesa: 'Mesa 8',
            status: 'pronto',
            dataHora: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
            total: 28.90,
            itens: [
                {
                    id: 'ITEM004',
                    nome: 'Salada Caesar',
                    quantidade: 1,
                    observacoes: 'Sem croutons',
                    status: 'pronto',
                    tempoPreparo: 10,
                    categoria: 'Saladas'
                },
                {
                    id: 'ITEM005',
                    nome: 'Refrigerante',
                    quantidade: 2,
                    observacoes: '',
                    status: 'pronto',
                    tempoPreparo: 2,
                    categoria: 'Bebidas'
                }
            ]
        }
    ],
    estatisticas: {
        pedidosHoje: 24,
        pedidosPreparando: 3,
        pedidosProntos: 2,
        tempoMedioPreparo: 12,
        itensMaisVendidos: [
            { nome: 'Hambúrguer Clássico', quantidade: 15 },
            { nome: 'Pizza Margherita', quantidade: 12 },
            { nome: 'Batata Frita', quantidade: 20 }
        ]
    }
};

const KDS: React.FC = () => {
    const { eventoId } = useParams<{ eventoId: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [autoRefresh, setAutoRefresh] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState<string>('todos');
    const [mostrarDetalhes, setMostrarDetalhes] = useState<Record<string, boolean>>({});
    const [modoDemonstracao] = useState(!eventoId);

    // SignalR (apenas se não for modo demonstração)
    const {
        connection,
        isConnected,
        startConnection,
        stopConnection,
        joinKDSGroup,
        leaveKDSGroup
    } = useSignalR(token || undefined);

    // Buscar pedidos para KDS (apenas se não for modo demonstração)
    const { data: pedidos, isLoading: pedidosLoading, refetch: refetchPedidos } = useQuery(
        ['kds-pedidos', eventoId],
        () => apiService.getPedidosParaKDS(eventoId!),
        {
            enabled: !!eventoId && !modoDemonstracao,
            refetchInterval: autoRefresh ? 5000 : false,
        }
    );

    // Buscar estatísticas (apenas se não for modo demonstração)
    const { data: estatisticas, refetch: refetchEstatisticas } = useQuery(
        ['kds-estatisticas', eventoId],
        () => apiService.getEstatisticasKDS(eventoId!),
        {
            enabled: !!eventoId && !modoDemonstracao,
            refetchInterval: autoRefresh ? 30000 : false,
        }
    );

    // Usar dados de demonstração se não houver eventoId
    const pedidosExibidos = modoDemonstracao ? dadosDemonstracao.pedidos : (pedidos as any)?.data || [];
    const estatisticasExibidas = modoDemonstracao ? dadosDemonstracao.estatisticas : (estatisticas as any)?.data;

    // Filtrar pedidos por status
    const pedidosFiltrados = pedidosExibidos.filter((pedido: any) => {
        if (filtroStatus === 'todos') return true;
        return pedido.status === filtroStatus;
    });

    // Configurar SignalR (apenas se não for modo demonstração)
    useEffect(() => {
        if (!modoDemonstracao && eventoId && token) {
            startConnection();
        }
        return () => {
            if (!modoDemonstracao) {
                stopConnection();
            }
        };
    }, [eventoId, token, modoDemonstracao, startConnection, stopConnection]);

    // Configurar listeners do SignalR
    useEffect(() => {
        if (!modoDemonstracao && connection && isConnected && eventoId) {
            joinKDSGroup(eventoId);

            // Listener para novos pedidos
            connection.on('NovoPedido', (pedido: any) => {
                if (pedido.eventoId === eventoId) {
                    toast.success(`Novo pedido #${pedido.numero} recebido!`);
                    refetchPedidos();
                }
            });

            // Listener para atualizações de pedidos
            connection.on('AtualizacaoPedido', (pedido: any) => {
                if (pedido.eventoId === eventoId) {
                    toast(`Pedido #${pedido.numero} atualizado!`);
                    refetchPedidos();
                }
            });

            // Listener para mudanças de status
            connection.on('StatusPedidoAlterado', (data: any) => {
                if (data.eventoId === eventoId) {
                    toast.success(`Status do pedido #${data.numeroPedido} alterado para ${data.novoStatus}!`);
                    refetchPedidos();
                }
            });

            return () => {
                connection.off('NovoPedido');
                connection.off('AtualizacaoPedido');
                connection.off('StatusPedidoAlterado');
                leaveKDSGroup(eventoId);
            };
        }
    }, [connection, isConnected, eventoId, modoDemonstracao, joinKDSGroup, leaveKDSGroup, refetchPedidos]);

    const toggleDetalhes = (pedidoId: string) => {
        setMostrarDetalhes(prev => ({
            ...prev,
            [pedidoId]: !prev[pedidoId]
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aguardando':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'preparando':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'pronto':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'entregue':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'aguardando':
                return <Clock className="w-4 h-4" />;
            case 'preparando':
                return <Package className="w-4 h-4" />;
            case 'pronto':
                return <CheckCircle className="w-4 h-4" />;
            case 'entregue':
                return <CheckCircle className="w-4 h-4" />;
            default:
                return <AlertCircle className="w-4 h-4" />;
        }
    };

    const formatarTempo = (dataHora: Date) => {
        const agora = new Date();
        const diffMs = agora.getTime() - dataHora.getTime();
        const diffMin = Math.floor(diffMs / 60000);

        if (diffMin < 1) return 'Agora';
        if (diffMin < 60) return `${diffMin}min`;

        const diffHoras = Math.floor(diffMin / 60);
        return `${diffHoras}h ${diffMin % 60}min`;
    };

    if (pedidosLoading && !modoDemonstracao) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Carregando pedidos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-4">
                            {!modoDemonstracao && (
                                <button
                                    onClick={() => navigate(-1)}
                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                            )}
                            <div className="flex items-center space-x-2">
                                <ChefHat className="w-8 h-8 text-blue-600" />
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {modoDemonstracao ? 'KDS - Demonstração' : 'Kitchen Display System'}
                                    </h1>
                                    {modoDemonstracao && (
                                        <p className="text-sm text-gray-500">
                                            Interface de demonstração da tela de serviço da cozinha
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Status da conexão */}
                            {!modoDemonstracao && (
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                                    <span className="text-sm text-gray-600">
                                        {isConnected ? 'Conectado' : 'Desconectado'}
                                    </span>
                                </div>
                            )}

                            {/* Auto refresh toggle */}
                            <button
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${autoRefresh
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                                <span className="text-sm font-medium">Auto Refresh</span>
                            </button>

                            {/* Botão de atualizar */}
                            <button
                                onClick={() => {
                                    refetchPedidos();
                                    refetchEstatisticas();
                                    toast.success('Dados atualizados!');
                                }}
                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <RefreshCw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Estatísticas */}
                {estatisticasExibidas && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Pedidos Hoje</p>
                                    <p className="text-2xl font-bold text-gray-900">{estatisticasExibidas.pedidosHoje}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Package className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Preparando</p>
                                    <p className="text-2xl font-bold text-gray-900">{estatisticasExibidas.pedidosPreparando}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Prontos</p>
                                    <p className="text-2xl font-bold text-gray-900">{estatisticasExibidas.pedidosProntos}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Timer className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                                    <p className="text-2xl font-bold text-gray-900">{estatisticasExibidas.tempoMedioPreparo}min</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filtros */}
                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="p-6">
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => setFiltroStatus('todos')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtroStatus === 'todos'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Todos ({pedidosExibidos.length})
                            </button>
                            <button
                                onClick={() => setFiltroStatus('aguardando')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtroStatus === 'aguardando'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Aguardando ({pedidosExibidos.filter((p: any) => p.status === 'aguardando').length})
                            </button>
                            <button
                                onClick={() => setFiltroStatus('preparando')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtroStatus === 'preparando'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Preparando ({pedidosExibidos.filter((p: any) => p.status === 'preparando').length})
                            </button>
                            <button
                                onClick={() => setFiltroStatus('pronto')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtroStatus === 'pronto'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Prontos ({pedidosExibidos.filter((p: any) => p.status === 'pronto').length})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de Pedidos */}
                <div className="space-y-4">
                    {pedidosFiltrados.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                            <p className="text-gray-500">
                                {filtroStatus === 'todos'
                                    ? 'Não há pedidos no momento.'
                                    : `Não há pedidos com status "${filtroStatus}".`
                                }
                            </p>
                        </div>
                    ) : (
                        pedidosFiltrados.map((pedido: any) => (
                            <div key={pedido.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-2xl font-bold text-gray-900">
                                                #{pedido.numero}
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(pedido.status)}`}>
                                                <div className="flex items-center space-x-1">
                                                    {getStatusIcon(pedido.status)}
                                                    <span className="capitalize">{pedido.status}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Cliente</p>
                                                <p className="font-medium text-gray-900">{pedido.cliente}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Mesa</p>
                                                <p className="font-medium text-gray-900">{pedido.mesa}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Tempo</p>
                                                <p className="font-medium text-gray-900">{formatarTempo(pedido.dataHora)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-600">Total</p>
                                                <p className="font-medium text-gray-900">R$ {pedido.total.toFixed(2)}</p>
                                            </div>
                                            <button
                                                onClick={() => toggleDetalhes(pedido.id)}
                                                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {mostrarDetalhes[pedido.id] ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Detalhes dos itens */}
                                    {mostrarDetalhes[pedido.id] && (
                                        <div className="border-t pt-4">
                                            <h4 className="font-medium text-gray-900 mb-3">Itens do Pedido</h4>
                                            <div className="space-y-3">
                                                {pedido.itens.map((item: any) => (
                                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex-1">
                                                            <div className="flex items-center space-x-3">
                                                                <span className="font-medium text-gray-900">{item.nome}</span>
                                                                <span className="text-sm text-gray-500">x{item.quantidade}</span>
                                                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                                                                    {item.categoria}
                                                                </span>
                                                            </div>
                                                            {item.observacoes && (
                                                                <p className="text-sm text-gray-600 mt-1">
                                                                    <strong>Obs:</strong> {item.observacoes}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="text-right">
                                                                <p className="text-sm text-gray-600">Tempo</p>
                                                                <p className="font-medium text-gray-900">{item.tempoPreparo}min</p>
                                                            </div>
                                                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(item.status)}`}>
                                                                <div className="flex items-center space-x-1">
                                                                    {getStatusIcon(item.status)}
                                                                    <span className="capitalize">{item.status}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default KDS;