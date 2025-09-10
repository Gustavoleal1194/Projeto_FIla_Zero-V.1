import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useEvent } from '../contexts/EventContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { demoService } from '../services/demoService';
import {
    ShoppingCart,
    Menu,
    Clock,
    MapPin,
    Phone,
    Mail,
    ArrowLeft,
    Users,
    Star,
    Plus,
    Minus
} from 'lucide-react';

const EventoHome: React.FC = () => {
    const { eventoId } = useParams<{ eventoId: string }>();
    const navigate = useNavigate();
    const { eventoAtual, loading: eventoLoading, error: eventoError, carregarEvento } = useEvent();
    const { tema } = useTheme();
    const { isAuthenticated, usuario } = useAuth();
    const { addItem, items, updateQuantity, removeItem, getTotalPrice } = useCart();

    // Buscar produtos do evento
    const { data: produtos, isLoading: produtosLoading } = useQuery(
        ['produtos', eventoId],
        () => demoService.getProdutos(eventoId!),
        {
            enabled: !!eventoId
        }
    );

    // Buscar categorias do evento
    const { data: categorias, isLoading: categoriasLoading } = useQuery(
        ['categorias', eventoId],
        () => demoService.getCategorias(eventoId!),
        {
            enabled: !!eventoId
        }
    );

    useEffect(() => {
        if (eventoId && eventoAtual?.id !== eventoId) {
            carregarEvento(eventoId);
        }
    }, [eventoId, carregarEvento, eventoAtual?.id]);

    if (eventoLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto mb-4"
                        style={{ borderColor: tema.corPrimaria }}></div>
                    <p className="text-gray-600">Carregando evento...</p>
                </div>
            </div>
        );
    }

    if (eventoError || !eventoAtual) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Evento não encontrado</h1>
                    <p className="text-gray-600 mb-4">O evento que você está procurando não existe.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: tema.corPrimaria }}
                    >
                        Voltar ao início
                    </button>
                </div>
            </div>
        );
    }

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header do Evento */}
            <div className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/')}
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

                        {eventoAtual.telefone && (
                            <div className="flex items-center space-x-3">
                                <Phone className="h-5 w-5 text-gray-400" />
                                <div>
                                    <h3 className="font-medium text-gray-900">Telefone</h3>
                                    <p className="text-sm text-gray-600">{eventoAtual.telefone}</p>
                                </div>
                            </div>
                        )}

                        {eventoAtual.email && (
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                                <div>
                                    <h3 className="font-medium text-gray-900">Email</h3>
                                    <p className="text-sm text-gray-600">{eventoAtual.email}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cardápio */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Cardápio</h2>
                    <p className="text-gray-600">Escolha seus itens favoritos</p>
                </div>

                {categoriasLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                            style={{ borderColor: tema.corPrimaria }}></div>
                        <p className="text-gray-600">Carregando cardápio...</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {categorias?.map((categoria) => {
                            const produtosCategoria = getProdutosPorCategoria(categoria.id);

                            if (produtosCategoria.length === 0) return null;

                            return (
                                <div key={categoria.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                                    <div
                                        className="px-6 py-4 text-white"
                                        style={{ backgroundColor: categoria.cor }}
                                    >
                                        <h3 className="text-xl font-bold">{categoria.nome}</h3>
                                        <p className="text-sm opacity-90">{categoria.descricao}</p>
                                    </div>

                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {produtosCategoria.map((produto) => {
                                                const quantidadeNoCarrinho = getQuantidadeNoCarrinho(produto.id);

                                                return (
                                                    <div key={produto.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                                                        <div className="aspect-w-16 aspect-h-9">
                                                            <img
                                                                src={produto.imagemUrl}
                                                                alt={produto.nome}
                                                                className="w-full h-48 object-cover"
                                                            />
                                                        </div>

                                                        <div className="p-4">
                                                            <h4 className="font-semibold text-gray-900 mb-2">{produto.nome}</h4>
                                                            <p className="text-sm text-gray-600 mb-3">{produto.descricao}</p>

                                                            <div className="flex items-center justify-between mb-4">
                                                                <span className="text-lg font-bold" style={{ color: tema.corPrimaria }}>
                                                                    R$ {produto.preco.toFixed(2)}
                                                                </span>
                                                                <div className="flex items-center text-sm text-gray-500">
                                                                    <Clock className="h-4 w-4 mr-1" />
                                                                    {produto.tempoPreparoMinutos} min
                                                                </div>
                                                            </div>

                                                            {quantidadeNoCarrinho > 0 ? (
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center space-x-2">
                                                                        <button
                                                                            onClick={() => alterarQuantidade(produto.id, quantidadeNoCarrinho - 1)}
                                                                            className="p-1 rounded-full hover:bg-gray-100"
                                                                        >
                                                                            <Minus className="h-4 w-4" />
                                                                        </button>
                                                                        <span className="w-8 text-center font-medium">{quantidadeNoCarrinho}</span>
                                                                        <button
                                                                            onClick={() => alterarQuantidade(produto.id, quantidadeNoCarrinho + 1)}
                                                                            className="p-1 rounded-full hover:bg-gray-100"
                                                                        >
                                                                            <Plus className="h-4 w-4" />
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removerDoCarrinho(produto.id)}
                                                                        className="text-red-500 text-sm hover:text-red-700"
                                                                    >
                                                                        Remover
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => adicionarAoCarrinho(produto)}
                                                                    className="w-full py-2 px-4 rounded-lg text-white font-medium transition-colors"
                                                                    style={{ backgroundColor: tema.corPrimaria }}
                                                                >
                                                                    Adicionar ao Carrinho
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
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
        </div>
    );
};

export default EventoHome;
