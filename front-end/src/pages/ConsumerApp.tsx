import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../contexts/EventContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import {
    ShoppingCart,
    Menu,
    Clock,
    MapPin,
    Phone,
    Mail,
    ArrowLeft,
    Plus,
    Minus,
    QrCode,
    LogOut,
    AlertCircle,
    User,
    Package
} from 'lucide-react';
import { QRCodeGenerator } from '../components/QRCode/QRCodeGenerator';

const ConsumerApp: React.FC = () => {
    const { eventoId } = useParams<{ eventoId: string }>();
    const navigate = useNavigate();
    const { eventoAtual, loading: eventoLoading, error: eventoError, carregarEvento } = useEvent();
    const { tema } = useTheme();
    const { isAuthenticated, logout, usuario } = useAuth();
    const { addItem, items, updateQuantity, removeItem, getTotalPrice } = useCart();

    // Buscar produtos do evento
    const { data: produtos, isLoading: produtosLoading } = useQuery(
        ['produtos', eventoId],
        () => apiService.getProdutosByEvento(eventoId!),
        {
            enabled: !!eventoId
        }
    );

    // Buscar categorias do evento
    const { data: categorias, isLoading: categoriasLoading } = useQuery(
        ['categorias', eventoId],
        () => apiService.getCategoriasByEvento(eventoId!),
        {
            enabled: !!eventoId
        }
    );

    useEffect(() => {
        if (eventoId && eventoAtual?.id !== eventoId) {
            carregarEvento(eventoId);
        }
    }, [eventoId, eventoAtual, carregarEvento]);

    // Redirecionar se não estiver logado
    useEffect(() => {
        if (!isAuthenticated) {
            navigate(`/evento/${eventoId}/login`, { replace: true });
            return;
        }

        // Se o usuário tem evento vinculado e não é o evento atual, redirecionar
        if (usuario?.eventoVinculado && usuario.eventoVinculado.id !== eventoId) {
            navigate(`/evento/${usuario.eventoVinculado.id}/menu`, { replace: true });
        }
    }, [isAuthenticated, eventoId, navigate, usuario]);

    const handleLogout = () => {
        logout();
        navigate(`/evento/${eventoId}/login`);
    };

    const getProdutosPorCategoria = (categoriaId: string) => {
        return produtos?.filter(produto => produto.categoriaId === categoriaId) || [];
    };

    const getQuantidadeNoCarrinho = (produtoId: string) => {
        const item = items.find(item => item.produto.id === produtoId);
        return item ? item.quantidade : 0;
    };

    const adicionarAoCarrinho = (produto: any) => {
        addItem(produto, 1);
    };

    const removerDoCarrinho = (produtoId: string) => {
        removeItem(produtoId);
    };

    const alterarQuantidade = (produtoId: string, quantidade: number) => {
        if (quantidade <= 0) {
            removerDoCarrinho(produtoId);
        } else {
            updateQuantity(produtoId, quantidade);
        }
    };

    if (eventoLoading || produtosLoading || categoriasLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando cardápio...</p>
                </div>
            </div>
        );
    }

    if (eventoError || !eventoAtual) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-red-500 mb-4">
                        <AlertCircle className="w-16 h-16 mx-auto" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Evento não encontrado
                    </h2>
                    <p className="text-gray-600 mb-6">
                        O evento que você está tentando acessar não existe ou foi removido.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        Voltar ao início
                    </button>
                </div>
            </div>
        );
    }

    if (!eventoAtual) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando evento...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header do Evento */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(`/evento/${eventoId}/login`)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </button>

                            {eventoAtual.logoUrl && (
                                <img
                                    src={eventoAtual.logoUrl}
                                    alt={eventoAtual.nome}
                                    className="h-10 w-10 rounded-lg object-cover"
                                />
                            )}

                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{eventoAtual.nome}</h1>
                                <p className="text-sm text-gray-500">{eventoAtual.cidade}, {eventoAtual.estado}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Perfil do usuário */}
                            <button
                                onClick={() => navigate(`/evento/${eventoId}/perfil`)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Meu Perfil"
                            >
                                <User className="h-6 w-6 text-gray-600" />
                            </button>

                            {/* Pedidos */}
                            <button
                                onClick={() => navigate(`/evento/${eventoId}/pedidos`)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Meus Pedidos"
                            >
                                <Package className="h-6 w-6 text-gray-600" />
                            </button>

                            {/* QR Code */}
                            <button
                                onClick={() => {
                                    const modal = document.getElementById('qr-code-modal');
                                    if (modal) {
                                        modal.classList.remove('hidden');
                                    }
                                }}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Gerar QR Code"
                            >
                                <QrCode className="h-6 w-6 text-gray-600" />
                            </button>

                            {/* Carrinho */}
                            <button
                                onClick={() => navigate(`/evento/${eventoId}/carrinho`)}
                                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <ShoppingCart className="h-6 w-6 text-gray-600" />
                                {items.length > 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                                    >
                                        {items.reduce((total, item) => total + item.quantidade, 0)}
                                    </span>
                                )}
                            </button>

                            {/* Total do carrinho */}
                            {items.length > 0 && (
                                <div className="text-sm font-medium text-gray-900">
                                    R$ {getTotalPrice().toFixed(2)}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Section do Evento */}
            <div
                className="h-64 bg-cover bg-center relative"
                style={{
                    backgroundImage: `url(${eventoAtual.logoUrl})`,
                    backgroundColor: eventoAtual.corPrimaria
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="relative h-full flex items-center justify-center">
                    <div className="text-center text-white">
                        <h2 className="text-4xl font-bold mb-2">{eventoAtual.nome}</h2>
                        <p className="text-xl text-gray-200">{eventoAtual.descricao}</p>
                    </div>
                </div>
            </div>

            {/* Informações do Evento */}
            <div className="bg-white py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <div>
                                <h3 className="font-medium text-gray-900">Endereço</h3>
                                <p className="text-sm text-gray-600">{eventoAtual.endereco}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Clock className="h-5 w-5 text-gray-400" />
                            <div>
                                <h3 className="font-medium text-gray-900">Horário</h3>
                                <p className="text-sm text-gray-600">{eventoAtual.dataInicio} - {eventoAtual.dataFim}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Phone className="h-5 w-5 text-gray-400" />
                            <div>
                                <h3 className="font-medium text-gray-900">Contato</h3>
                                <p className="text-sm text-gray-600">{eventoAtual.telefone}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cardápio */}
            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Cardápio</h2>

                    {categoriasLoading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Carregando categorias...</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {categorias?.map((categoria) => {
                                const produtosCategoria = getProdutosPorCategoria(categoria.id);

                                if (produtosCategoria.length === 0) return null;

                                return (
                                    <div key={categoria.id} className="bg-white rounded-lg shadow-sm p-6">
                                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                            <span
                                                className="w-4 h-4 rounded-full mr-3"
                                                style={{ backgroundColor: categoria.cor }}
                                            ></span>
                                            {categoria.nome}
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {produtosCategoria.map((produto) => {
                                                const quantidadeNoCarrinho = getQuantidadeNoCarrinho(produto.id);

                                                return (
                                                    <div key={produto.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-medium text-gray-900">{produto.nome}</h4>
                                                            <span className="text-lg font-bold text-blue-600">
                                                                R$ {produto.preco.toFixed(2)}
                                                            </span>
                                                        </div>

                                                        <p className="text-sm text-gray-600 mb-3">{produto.descricao}</p>

                                                        <div className="flex items-center justify-between">
                                                            {quantidadeNoCarrinho > 0 ? (
                                                                <div className="flex items-center space-x-2">
                                                                    <button
                                                                        onClick={() => alterarQuantidade(produto.id, quantidadeNoCarrinho - 1)}
                                                                        className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                                                                    >
                                                                        <Minus className="w-4 h-4" />
                                                                    </button>
                                                                    <span className="w-8 text-center font-medium">{quantidadeNoCarrinho}</span>
                                                                    <button
                                                                        onClick={() => alterarQuantidade(produto.id, quantidadeNoCarrinho + 1)}
                                                                        className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200"
                                                                    >
                                                                        <Plus className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => adicionarAoCarrinho(produto)}
                                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                                                >
                                                                    Adicionar
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Botão Flutuante do Carrinho */}
            {items.length > 0 && (
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        onClick={() => navigate(`/evento/${eventoId}/carrinho`)}
                        className="flex items-center space-x-3 px-6 py-4 rounded-full text-white font-medium shadow-lg hover:shadow-xl transition-all"
                        style={{ backgroundColor: tema.corPrimaria }}
                    >
                        <ShoppingCart className="h-6 w-6" />
                        <div className="text-left">
                            <div className="text-sm opacity-90">
                                {items.reduce((total, item) => total + item.quantidade, 0)} itens
                            </div>
                            <div className="font-bold">
                                R$ {getTotalPrice().toFixed(2)}
                            </div>
                        </div>
                    </button>
                </div>
            )}

            {/* Modal QR Code */}
            <div
                id="qr-code-modal"
                className="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        e.currentTarget.classList.add('hidden');
                    }
                }}
            >
                <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <QRCodeGenerator
                        className="border-0 shadow-none"
                        showControls={true}
                        autoGenerate={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default ConsumerApp;
