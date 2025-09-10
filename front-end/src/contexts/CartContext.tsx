import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Produto } from '../types';
import toast from 'react-hot-toast';

export interface CartItem {
    produto: Produto;
    quantidade: number;
    observacoes?: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (produto: Produto, quantidade: number, observacoes?: string) => void;
    removeItem: (produtoId: string) => void;
    updateQuantity: (produtoId: string, quantidade: number) => void;
    updateObservations: (produtoId: string, observacoes: string) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    getItemQuantity: (produtoId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart deve ser usado dentro de um CartProvider');
    }
    return context;
};

interface CartProviderProps {
    children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addItem = (produto: Produto, quantidade: number, observacoes?: string) => {
        setItems(prevItems => {
            const existingItem = prevItems.find(item => item.produto.id === produto.id);

            if (existingItem) {
                // Atualizar quantidade do item existente
                return prevItems.map(item =>
                    item.produto.id === produto.id
                        ? { ...item, quantidade: item.quantidade + quantidade }
                        : item
                );
            } else {
                // Adicionar novo item
                const newItem: CartItem = {
                    produto,
                    quantidade,
                    observacoes,
                };
                toast.success(`${produto.nome} adicionado ao carrinho!`);
                return [...prevItems, newItem];
            }
        });
    };

    const removeItem = (produtoId: string) => {
        setItems(prevItems => {
            const item = prevItems.find(item => item.produto.id === produtoId);
            if (item) {
                toast.success(`${item.produto.nome} removido do carrinho!`);
            }
            return prevItems.filter(item => item.produto.id !== produtoId);
        });
    };

    const updateQuantity = (produtoId: string, quantidade: number) => {
        if (quantidade <= 0) {
            removeItem(produtoId);
            return;
        }

        setItems(prevItems =>
            prevItems.map(item =>
                item.produto.id === produtoId
                    ? { ...item, quantidade }
                    : item
            )
        );
    };

    const updateObservations = (produtoId: string, observacoes: string) => {
        setItems(prevItems =>
            prevItems.map(item =>
                item.produto.id === produtoId
                    ? { ...item, observacoes }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
        toast.success('Carrinho limpo!');
    };

    const getTotalItems = () => {
        return items.reduce((total, item) => total + item.quantidade, 0);
    };

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + (item.produto.preco * item.quantidade), 0);
    };

    const getItemQuantity = (produtoId: string) => {
        const item = items.find(item => item.produto.id === produtoId);
        return item ? item.quantidade : 0;
    };

    const value: CartContextType = {
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateObservations,
        clearCart,
        getTotalItems,
        getTotalPrice,
        getItemQuantity,
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};