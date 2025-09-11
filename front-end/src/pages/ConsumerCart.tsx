import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useEvent } from '../contexts/EventContext';
import { useTheme } from '../contexts/ThemeContext';
import { usePayment } from '../contexts/PaymentContext';
import { PaymentModal } from '../components/Payment/PaymentModal';
import {
    Plus,
    Minus,
    Trash2,
    ArrowLeft,
    ShoppingBag,
    CreditCard,
    Smartphone,
    Banknote,
    CheckCircle,
    AlertCircle,
    Menu
} from 'lucide-react';
import toast from 'react-hot-toast';

const ConsumerCart: React.FC = () => {
    const { eventoId } = useParams<{ eventoId: string }>();
    const navigate = useNavigate();
    const {
        items,
        updateQuantity,
        removeItem,
        updateObservations,
        clearCart,
        getTotalPrice
    } = useCart();
    const { isAuthenticated, usuario } = useAuth();
    const { eventoAtual } = useEvent();
    const { tema } = useTheme();
    const { initializePayment } = usePayment();

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [observations, setObservations] = useState<{ [key: string]: string }>({});
    const [compraFinalizada, setCompraFinalizada] = useState(false);

    // Carregar observações salvas
    useEffect(() => {
        const savedObservations = localStorage.getItem(`cart_observations_${eventoId}`);
        if (savedObservations) {
            setObservations(JSON.parse(savedObservations));
        }
    }, [eventoId]);

    // Salvar observações no localStorage
    const handleObservationChange = (produtoId: string, observacao: string) => {
        const newObservations = { ...observations, [produtoId]: observacao };
        setObservations(newObservations);
        updateObservations(produtoId, observacao);
        localStorage.setItem(`cart_observations_${eventoId}`, JSON.stringify(newObservations));
    };

    const handleQuantityChange = (produtoId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(produtoId);
            const newObservations = { ...observations };
            delete newObservations[produtoId];
            setObservations(newObservations);
            localStorage.setItem(`cart_observations_${eventoId}`, JSON.stringify(newObservations));
        } else {
            updateQuantity(produtoId, newQuantity);
        }
    };

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            toast.error('Você precisa estar logado para finalizar o pedido');
            navigate(`/evento/${eventoId}/login`);
            return;
        }

        if (items.length === 0) {
            toast.error('Seu carrinho está vazio');
            return;
        }

        // Inicializar sistema de pagamento
        await initializePayment();

        // Abrir modal de pagamento
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = (transactionId: string) => {
        toast.success('Pagamento realizado com sucesso!');
        clearCart();
        localStorage.removeItem(`cart_observations_${eventoId}`);
        setShowPaymentModal(false);
        setCompraFinalizada(true);
    };

    // Tela de compra finalizada
    if (compraFinalizada) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white shadow-sm border-b sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-4">
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Compra Finalizada</h1>
                                    <p className="text-sm text-gray-600">
                                        {eventoAtual?.nome} • Pedido realizado com sucesso
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500">
                                Powered by <span className="font-semibold text-blue-600">FilaZero</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conteúdo de sucesso */}
                <div className="flex-1 flex items-center justify-center py-12">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Pedido Realizado!
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Seu pedido foi confirmado e está sendo preparado.
                            Você receberá uma notificação quando estiver pronto para retirada.
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => navigate(`/evento/${eventoId}/pedidos`)}
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Ver Meus Pedidos
                            </button>

                            <button
                                onClick={() => {
                                    setCompraFinalizada(false);
                                    navigate(`/evento/${eventoId}/menu`);
                                }}
                                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
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
                                <h1 className="text-xl font-bold text-gray-900">Carrinho</h1>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conteúdo vazio */}
                <div className="flex-1 flex items-center justify-center py-12">
                    <div className="text-center">
                        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Carrinho vazio</h2>
                        <p className="text-gray-600 mb-6">
                            Adicione itens do cardápio para continuar
                        </p>
                        <button
                            onClick={() => navigate(`/evento/${eventoId}`)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Ver Cardápio
                        </button>
                    </div>
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
                            <h1 className="text-xl font-bold text-gray-900">Carrinho</h1>
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
                                {items.reduce((total, item) => total + item.quantidade, 0)} itens
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo do carrinho */}
            <div className="py-6">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Seus itens
                            </h2>

                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.produto.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">
                                                {item.produto.nome}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {item.produto.descricao}
                                            </p>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    placeholder="Observações (opcional)"
                                                    value={observations[item.produto.id] || ''}
                                                    onChange={(e) => handleObservationChange(item.produto.id, e.target.value)}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleQuantityChange(item.produto.id, item.quantidade - 1)}
                                                    className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium">
                                                    {item.quantidade}
                                                </span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.produto.id, item.quantidade + 1)}
                                                    className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <div className="font-semibold text-gray-900">
                                                    R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    R$ {item.produto.preco.toFixed(2)} cada
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleQuantityChange(item.produto.id, 0)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Resumo do pedido */}
                    <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Resumo do pedido
                        </h3>

                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="text-gray-900">R$ {getTotalPrice().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Taxa de serviço</span>
                                <span className="text-gray-900">R$ 0,00</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Taxa de entrega</span>
                                <span className="text-gray-900">R$ 0,00</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total</span>
                                    <span>R$ {getTotalPrice().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                            >
                                <CreditCard className="w-5 h-5 mr-2" />
                                Finalizar Pedido
                            </button>

                            <button
                                onClick={() => navigate(`/evento/${eventoId}`)}
                                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                                Continuar Comprando
                            </button>
                        </div>
                    </div>

                    {/* Informações adicionais */}
                    <div className="mt-6 bg-blue-50 rounded-lg p-4">
                        <div className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                            <div className="text-sm text-blue-800">
                                <p className="font-medium mb-1">Seu pedido será processado em breve</p>
                                <p>Você receberá uma notificação quando estiver pronto para retirada.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Pagamento */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={handlePaymentSuccess}
                pedidoId={`PEDIDO_${eventoId}_${Date.now()}`}
                eventoId={eventoId!}
            />
        </div>
    );
};

export default ConsumerCart;
