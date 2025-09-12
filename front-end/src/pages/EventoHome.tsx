import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import {
    ArrowLeft,
    ShoppingCart,
    Menu,
    Users,
    Star,
    Clock,
    MapPin,
    Plus,
    Minus,
    Filter,
    Search
} from 'lucide-react';
import toast from 'react-hot-toast';

const EventoHome: React.FC = () => {
    const { eventoId } = useParams<{ eventoId: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, usuario } = useAuth();
    const { addItem, getTotalItems } = useCart();
    const { tema } = useTheme();

    const [filtroCategoria, setFiltroCategoria] = useState<string>('todas');
    const [busca, setBusca] = useState('');

    const { data: evento, isLoading: eventoLoading } = useQuery({
        queryKey: ['evento', eventoId],
        queryFn: () => apiService.getEvento(eventoId!),
        enabled: !!eventoId
    });

    const { data: produtos, isLoading: produtosLoading } = useQuery({
        queryKey: ['produtos', eventoId],
        queryFn: () => apiService.getProdutos(eventoId!),
        enabled: !!eventoId
    });

    const { data: categorias } = useQuery({
        queryKey: ['categorias', eventoId],
        queryFn: () => apiService.getCategoriasByEvento(eventoId!),
        enabled: !!eventoId
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleAddToCart = (produto: any) => {
        addItem(produto, 1);
        toast.success(`${produto.nome} adicionado ao carrinho!`);
    };

    const produtosFiltrados = produtos?.filter(produto => {
        const matchCategoria = filtroCategoria === 'todas' || produto.categoriaId === filtroCategoria;
        const matchBusca = produto.nome.toLowerCase().includes(busca.toLowerCase()) ||
                          produto.descricao.toLowerCase().includes(busca.toLowerCase());
        return matchCategoria && matchBusca;
    });

    if (eventoLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!evento) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Evento não encontrado
                    </h1>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/')}
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    {evento.nome}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {evento.endereco}
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate(`/evento/${eventoId}/carrinho`)}
                                className="relative p-2 text-gray-600 hover:text-gray-900"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filtros */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Buscar produtos..."
                                    value={busca}
                                    onChange={(e) => setBusca(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        
                        <div className="sm:w-48">
                            <select
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="todas">Todas as categorias</option>
                                {categorias?.map((categoria: any) => (
                                    <option key={categoria.id} value={categoria.id}>
                                        {categoria.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Produtos */}
                {produtosLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {produtosFiltrados?.map((produto) => (
                            <div key={produto.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {produto.nome}
                                        </h3>
                                        <div className="flex items-center text-yellow-500">
                                            <Star className="w-4 h-4 fill-current" />
                                            <span className="ml-1 text-sm font-medium">4.5</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {produto.descricao}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-bold text-green-600">
                                            R$ {produto.preco.toFixed(2)}
                                        </span>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock className="w-4 h-4 mr-1" />
                                            <span>{produto.tempoPreparoMinutos} min</span>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={() => handleAddToCart(produto)}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Adicionar ao Carrinho
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {produtosFiltrados?.length === 0 && !produtosLoading && (
                    <div className="text-center py-12">
                        <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhum produto encontrado
                        </h3>
                        <p className="text-gray-500">
                            Tente ajustar os filtros ou buscar por outros termos.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventoHome;
