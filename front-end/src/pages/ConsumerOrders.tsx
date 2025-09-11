import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEvent } from '../contexts/EventContext';
import { useTheme } from '../contexts/ThemeContext';
import { demoService } from '../services/demoService';
import { apiService } from '../services/api';
import {
    ArrowLeft,
    Clock,
    CheckCircle,
    XCircle,
    Package,
    Utensils,
    ShoppingBag,
    Filter,
    Search,
    Calendar,
    User,
    CreditCard,
    MapPin,
    Menu
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Pedido {
    id: string;
    numero: string;
    status: 'pendente' | 'confirmado' | 'preparando' | 'pronto' | 'entregue' | 'cancelado';
    data: string;
    total: number;
    itens: Array<{
        id: string;
        nome: string;
        quantidade: number;
        preco: number;
        observacoes?: string;
    }>;
    pagamento: {
        metodo: 'pix' | 'cartao' | 'dinheiro';
        status: 'pendente' | 'aprovado' | 'rejeitado';
    };
    observacoes?: string;
    tempoEstimado?: number;
}

// Funções de mapeamento para converter dados da API
const mapearStatusPedido = (status: string): 'pendente' | 'confirmado' | 'preparando' | 'pronto' | 'entregue' | 'cancelado' => {
    const statusMap: Record<string, 'pendente' | 'confirmado' | 'preparando' | 'pronto' | 'entregue' | 'cancelado'> = {
        'Pendente': 'pendente',
        'Confirmado': 'confirmado',
        'Preparando': 'preparando',
        'Pronto': 'pronto',
        'Entregue': 'entregue',
        'Cancelado': 'cancelado'
    };
    return statusMap[status] || 'pendente';
};

const mapearMetodoPagamento = (metodo: string): 'pix' | 'cartao' | 'dinheiro' => {
    const metodoMap: Record<string, 'pix' | 'cartao' | 'dinheiro'> = {
        'PIX': 'pix',
        'CartaoCredito': 'cartao',
        'CartaoDebito': 'cartao',
        'Dinheiro': 'dinheiro'
    };
    return metodoMap[metodo] || 'pix';
};

const mapearStatusPagamento = (status: string): 'pendente' | 'aprovado' | 'rejeitado' => {
    const statusMap: Record<string, 'pendente' | 'aprovado' | 'rejeitado'> = {
        'Pendente': 'pendente',
        'Aprovado': 'aprovado',
        'Rejeitado': 'rejeitado'
    };
    return statusMap[status] || 'pendente';
};

const ConsumerOrders: React.FC = () => {
    const { eventoId } = useParams<{ eventoId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, usuario } = useAuth();
    const { eventoAtual } = useEvent();
    const { tema } = useTheme();

    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState<string>('todos');
    const [busca, setBusca] = useState('');

    // Dados mockados para demonstração
    const pedidosMock: Pedido[] = [
        {
            id: '1',
            numero: '001',
            status: 'pronto',
            data: '2024-01-15T14:30:00Z',
            total: 45.50,
            itens: [
                { id: '1', nome: 'Hambúrguer Clássico', quantidade: 1, preco: 25.00 },
                { id: '2', nome: 'Batata Frita', quantidade: 1, preco: 12.00 },
                { id: '3', nome: 'Coca-Cola 350ml', quantidade: 1, preco: 8.50 }
            ],
            pagamento: { metodo: 'pix', status: 'aprovado' },
            observacoes: 'Sem cebola no hambúrguer',
            tempoEstimado: 15
        },
        {
            id: '2',
            numero: '002',
            status: 'preparando',
            data: '2024-01-15T15:45:00Z',
            total: 32.00,
            itens: [
                { id: '4', nome: 'Pizza Margherita', quantidade: 1, preco: 28.00 },
                { id: '5', nome: 'Refrigerante Lata', quantidade: 1, preco: 4.00 }
            ],
            pagamento: { metodo: 'cartao', status: 'aprovado' },
            tempoEstimado: 20
        },
        {
            id: '3',
            numero: '003',
            status: 'pendente',
            data: '2024-01-15T16:20:00Z',
            total: 18.50,
            itens: [
                { id: '6', nome: 'Açaí 500ml', quantidade: 1, preco: 15.00 },
                { id: '7', nome: 'Granola', quantidade: 1, preco: 3.50 }
            ],
            pagamento: { metodo: 'dinheiro', status: 'pendente' }
        },
        {
            id: '4',
            numero: '004',
            status: 'entregue',
            data: '2024-01-15T13:15:00Z',
            total: 67.00,
            itens: [
                { id: '8', nome: 'Combo Executivo', quantidade: 1, preco: 45.00 },
                { id: '9', nome: 'Sobremesa do Dia', quantidade: 1, preco: 12.00 },
                { id: '10', nome: 'Suco Natural', quantidade: 1, preco: 10.00 }
            ],
            pagamento: { metodo: 'pix', status: 'aprovado' }
        }
    ];

    useEffect(() => {
        if (!isAuthenticated) {
            navigate(`/evento/${eventoId}/login`);
            return;
        }

        // Carregar pedidos reais da API
        const loadPedidos = async () => {
            setIsLoading(true);
            try {
                // Buscar pedidos do usuário atual
                const pedidos = await apiService.getPedidosByUsuario();

                if (pedidos && pedidos.length > 0) {
                    // Converter pedidos da API para o formato esperado
                    const pedidosConvertidos = pedidos.map((pedido: any) => ({
                        id: pedido.id,
                        numero: pedido.numeroPedido || pedido.id.substring(0, 8),
                        status: mapearStatusPedido(pedido.status),
                        data: pedido.dataCriacao,
                        total: pedido.valorTotal,
                        itens: pedido.itens?.map((item: any) => ({
                            id: item.id,
                            nome: item.produto?.nome || 'Produto',
                            quantidade: item.quantidade,
                            preco: item.precoUnitario,
                            observacoes: item.observacoes
                        })) || [],
                        pagamento: {
                            metodo: mapearMetodoPagamento(pedido.pagamento?.metodo),
                            status: mapearStatusPagamento(pedido.pagamento?.status)
                        },
                        observacoes: pedido.observacoes,
                        tempoEstimado: pedido.tempoEstimado
                    }));

                    setPedidos(pedidosConvertidos);
                } else {
                    // Fallback para dados mockados se a API falhar
                    setPedidos(pedidosMock);
                }
            } catch (error) {
                console.error('Erro ao carregar pedidos:', error);
                // Fallback para dados mockados em caso de erro
                setPedidos(pedidosMock);
                toast.error('Erro ao carregar pedidos - mostrando dados de exemplo');
            } finally {
                setIsLoading(false);
            }
        };

        loadPedidos();
    }, [isAuthenticated, eventoId, navigate, usuario?.id]);

    const getStatusInfo = (status: string) => {
        const statusMap = {
            pendente: {
                label: 'Pendente',
                color: 'text-yellow-600 bg-yellow-100',
                icon: Clock
            },
            confirmado: {
                label: 'Confirmado',
                color: 'text-blue-600 bg-blue-100',
                icon: CheckCircle
            },
            preparando: {
                label: 'Preparando',
                color: 'text-orange-600 bg-orange-100',
                icon: Utensils
            },
            pronto: {
                label: 'Pronto',
                color: 'text-green-600 bg-green-100',
                icon: Package
            },
            entregue: {
                label: 'Entregue',
                color: 'text-gray-600 bg-gray-100',
                icon: CheckCircle
            },
            cancelado: {
                label: 'Cancelado',
                color: 'text-red-600 bg-red-100',
                icon: XCircle
            }
        };
        return statusMap[status as keyof typeof statusMap] || statusMap.pendente;
    };

    const getPagamentoInfo = (metodo: string) => {
        const metodoMap = {
            pix: { label: 'PIX', color: 'text-green-600' },
            cartao: { label: 'Cartão', color: 'text-blue-600' },
            dinheiro: { label: 'Dinheiro', color: 'text-gray-600' }
        };
        return metodoMap[metodo as keyof typeof metodoMap] || metodoMap.pix;
    };

    const formatarData = (data: string) => {
        return new Date(data).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const pedidosFiltrados = pedidos.filter(pedido => {
        const matchStatus = filtroStatus === 'todos' || pedido.status === filtroStatus;
        const matchBusca = busca === '' ||
            pedido.numero.toLowerCase().includes(busca.toLowerCase()) ||
            pedido.itens.some(item => item.nome.toLowerCase().includes(busca.toLowerCase()));
        return matchStatus && matchBusca;
    });

    const handleVoltar = () => {
        navigate(`/evento/${eventoId}/menu`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando pedidos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleVoltar}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">Meus Pedidos</h1>
                                <p className="text-sm text-gray-600">
                                    {eventoAtual?.nome} • {pedidos.length} pedidos
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(`/evento/${eventoId}/menu`)}
                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center space-x-2"
                            >
                                <Menu className="h-4 w-4" />
                                <span>Cardápio</span>
                            </button>
                            <div className="text-sm text-gray-500">
                                Powered by <span className="font-semibold text-blue-600">FilaZero</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="bg-white border-b">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Busca */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por número ou item..."
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Filtro de Status */}
                        <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={filtroStatus}
                                onChange={(e) => setFiltroStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="todos">Todos os Status</option>
                                <option value="pendente">Pendente</option>
                                <option value="confirmado">Confirmado</option>
                                <option value="preparando">Preparando</option>
                                <option value="pronto">Pronto</option>
                                <option value="entregue">Entregue</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Pedidos */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                {pedidosFiltrados.length === 0 ? (
                    <div className="text-center py-12">
                        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhum pedido encontrado
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {busca ? 'Tente ajustar os filtros de busca' : 'Você ainda não fez nenhum pedido'}
                        </p>
                        <button
                            onClick={handleVoltar}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Ver Cardápio
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pedidosFiltrados.map((pedido) => {
                            const statusInfo = getStatusInfo(pedido.status);
                            const StatusIcon = statusInfo.icon;
                            const pagamentoInfo = getPagamentoInfo(pedido.pagamento.metodo);

                            return (
                                <div
                                    key={pedido.id}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {/* Header do Pedido */}
                                    <div className="px-6 py-4 border-b border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="text-2xl font-bold text-gray-900">
                                                    #{pedido.numero}
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${statusInfo.color}`}>
                                                    <StatusIcon className="w-4 h-4" />
                                                    <span>{statusInfo.label}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-semibold text-gray-900">
                                                    R$ {pedido.total.toFixed(2).replace('.', ',')}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {formatarData(pedido.data)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Itens do Pedido */}
                                    <div className="px-6 py-4">
                                        <div className="space-y-3">
                                            {pedido.itens.map((item) => (
                                                <div key={item.id} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                                                            {item.quantidade}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {item.nome}
                                                            </div>
                                                            {item.observacoes && (
                                                                <div className="text-sm text-gray-500">
                                                                    Obs: {item.observacoes}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer do Pedido */}
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-2">
                                                    <CreditCard className="w-4 h-4 text-gray-400" />
                                                    <span className={`text-sm font-medium ${pagamentoInfo.color}`}>
                                                        {pagamentoInfo.label}
                                                    </span>
                                                </div>
                                                {pedido.tempoEstimado && (
                                                    <div className="flex items-center space-x-2">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-600">
                                                            {pedido.tempoEstimado} min
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                            {pedido.status === 'pronto' && (
                                                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                                                    Pedido Pronto!
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Estatísticas */}
            {pedidos.length > 0 && (
                <div className="bg-white border-t">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Resumo dos Pedidos
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {pedidos.length}
                                </div>
                                <div className="text-sm text-gray-600">Total de Pedidos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {pedidos.filter(p => p.status === 'entregue').length}
                                </div>
                                <div className="text-sm text-gray-600">Entregues</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {pedidos.filter(p => p.status === 'preparando').length}
                                </div>
                                <div className="text-sm text-gray-600">Preparando</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-600">
                                    R$ {pedidos.reduce((acc, p) => acc + p.total, 0).toFixed(2).replace('.', ',')}
                                </div>
                                <div className="text-sm text-gray-600">Total Gasto</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsumerOrders;
