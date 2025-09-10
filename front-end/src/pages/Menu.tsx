import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../contexts/CartContext';
import { Produto, Categoria } from '../types';
import { apiService } from '../services/api';
import { Plus, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

const Menu: React.FC = () => {
    const { eventoId } = useParams<{ eventoId: string }>();
    const { addItem, getTotalItems } = useCart();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const { data: produtos, isLoading } = useQuery(
        ['produtos', eventoId],
        () => apiService.getProdutos(eventoId!),
        {
            enabled: !!eventoId,
        }
    );

    const categorias = produtos ?
        Array.from(new Set(produtos.map(p => p.categoriaId)))
            .map(id => produtos.find(p => p.categoriaId === id)?.categoria)
            .filter(Boolean) as Categoria[] : [];

    const produtosFiltrados = selectedCategory
        ? produtos?.filter(p => p.categoriaId === selectedCategory)
        : produtos;

    const handleAddToCart = (produto: Produto) => {
        addItem(produto, 1);
        toast.success(`${produto.nome} adicionado ao carrinho!`);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Cardápio</h1>
                <div className="flex items-center space-x-2 text-gray-600">
                    <ShoppingCart className="w-5 h-5" />
                    <span>{getTotalItems()} itens</span>
                </div>
            </div>

            {/* Categorias */}
            <div className="mb-8">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!selectedCategory
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Todos
                    </button>
                    {categorias.map((categoria) => (
                        <button
                            key={categoria.id}
                            onClick={() => setSelectedCategory(categoria.id)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === categoria.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {categoria.nome}
                        </button>
                    ))}
                </div>
            </div>

            {/* Produtos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {produtosFiltrados?.map((produto) => (
                    <div key={produto.id} className="card hover:shadow-md transition-shadow">
                        <div className="aspect-w-16 aspect-h-9 mb-4">
                            {produto.imagemUrl ? (
                                <img
                                    src={produto.imagemUrl}
                                    alt={produto.nome}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-400">Sem imagem</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {produto.nome}
                            </h3>

                            {produto.descricao && (
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                    {produto.descricao}
                                </p>
                            )}

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl font-bold text-blue-600">
                                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {produto.tempoPreparoMinutos} min
                                </span>
                            </div>

                            <button
                                onClick={() => handleAddToCart(produto)}
                                className="w-full btn-primary flex items-center justify-center space-x-2"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Adicionar</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {produtosFiltrados?.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500">Nenhum produto encontrado nesta categoria.</p>
                </div>
            )}
        </div>
    );
};

export default Menu;
