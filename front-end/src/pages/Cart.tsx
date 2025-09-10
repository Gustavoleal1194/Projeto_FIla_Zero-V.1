import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
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
    CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const Cart: React.FC = () => {
    const {
        items,
        updateQuantity,
        removeItem,
        updateObservations,
        clearCart,
        getTotalPrice
    } = useCart();
    const { isAuthenticated } = useAuth();
    const { initializePayment } = usePayment();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'pix' | 'cartao' | 'dinheiro'>('pix');

    const handleQuantityChange = (produtoId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(produtoId);
        } else {
            updateQuantity(produtoId, newQuantity);
        }
    };

    const handleObservationChange = (produtoId: string, observacoes: string) => {
        updateObservations(produtoId, observacoes);
    };

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            toast.error('Você precisa estar logado para finalizar o pedido');
            navigate('/login', { state: { from: { pathname: '/carrinho' } } });
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
        setShowPaymentModal(false);
        navigate('/pedidos');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Seu carrinho está vazio
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Adicione alguns produtos para começar seu pedido
                        </p>
                        <Link
                            to="/eventos"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Ver Eventos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <Link
                        to="/eventos"
                        className="text-blue-600 hover:text-blue-700 inline-flex items-center"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para eventos
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Itens do carrinho */}
                    <div className="lg:col-span-2">
                        <h1 className="text-2xl font-bold text-gray-900 mb-6">
                            Seu Carrinho ({items.length} {items.length === 1 ? 'item' : 'itens'})
                        </h1>

                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.produto.id} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-start space-x-4">
                                        <img
                                            src={item.produto.imagemUrl || '/api/placeholder/100/100'}
                                            alt={item.produto.nome}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />

                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {item.produto.nome}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-2">
                                                {item.produto.descricao}
                                            </p>
                                            <p className="text-lg font-bold text-blue-600">
                                                R$ {item.produto.preco.toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-end space-y-2">
                                            <button
                                                onClick={() => removeItem(item.produto.id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Controles de quantidade */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => handleQuantityChange(item.produto.id, item.quantidade - 1)}
                                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <span className="w-8 text-center font-semibold">
                                                {item.quantidade}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(item.produto.id, item.quantidade + 1)}
                                                className="p-1 rounded-full border border-gray-300 hover:bg-gray-50"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">
                                                R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Observações */}
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Observações
                                        </label>
                                        <textarea
                                            value={item.observacoes || ''}
                                            onChange={(e) => handleObservationChange(item.produto.id, e.target.value)}
                                            placeholder="Ex: sem cebola, bem temperado..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Resumo do pedido */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                Resumo do Pedido
                            </h2>

                            {/* Método de pagamento */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    Método de Pagamento
                                </h3>
                                <div className="space-y-2">
                                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="pix"
                                            checked={selectedPaymentMethod === 'pix'}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value as 'pix')}
                                            className="mr-3"
                                        />
                                        <Smartphone className="mr-2 h-5 w-5 text-green-600" />
                                        <span>PIX</span>
                                    </label>

                                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="cartao"
                                            checked={selectedPaymentMethod === 'cartao'}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value as 'cartao')}
                                            className="mr-3"
                                        />
                                        <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
                                        <span>Cartão</span>
                                    </label>

                                    <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="dinheiro"
                                            checked={selectedPaymentMethod === 'dinheiro'}
                                            onChange={(e) => setSelectedPaymentMethod(e.target.value as 'dinheiro')}
                                            className="mr-3"
                                        />
                                        <Banknote className="mr-2 h-5 w-5 text-yellow-600" />
                                        <span>Dinheiro</span>
                                    </label>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t pt-4 mb-6">
                                <div className="flex justify-between text-lg font-semibold">
                                    <span>Total:</span>
                                    <span className="text-blue-600">
                                        R$ {getTotalPrice().toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Botão de checkout */}
                            <button
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                                {isCheckingOut ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        Finalizar Pedido
                                    </>
                                )}
                            </button>

                            {!isAuthenticated && (
                                <p className="text-sm text-gray-600 mt-4 text-center">
                                    <Link to="/login" className="text-blue-600 hover:text-blue-700">
                                        Faça login
                                    </Link>
                                    {' '}para finalizar o pedido
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Pagamento */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSuccess={handlePaymentSuccess}
                pedidoId={`PEDIDO_${Date.now()}`}
            />
        </div>
    );
};

export default Cart;