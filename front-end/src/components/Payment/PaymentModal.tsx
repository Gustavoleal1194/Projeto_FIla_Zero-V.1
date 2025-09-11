import React, { useState, useEffect } from 'react';
import { usePayment } from '../../contexts/PaymentContext';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { PaymentRequest } from '../../services/paymentService';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';
import { PixPaymentModal } from './PixPaymentModal';
import {
    CreditCard,
    Smartphone,
    DollarSign,
    CheckCircle,
    XCircle,
    Loader2,
    AlertCircle
} from 'lucide-react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (transactionId: string) => void;
    pedidoId: string;
    eventoId: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    pedidoId,
    eventoId
}) => {
    const {
        isProcessing,
        paymentMethods,
        selectedMethod,
        selectPaymentMethod,
        processPayment,
        formatCurrency,
        validatePaymentData
    } = usePayment();

    const { getTotalPrice, items } = useCart();
    const { usuario } = useAuth();

    const [paymentData, setPaymentData] = useState<Partial<PaymentRequest>>({
        pedidoId,
        valor: getTotalPrice(),
        metodoPagamento: 'pix',
        dadosCliente: {
            nome: usuario?.nome || '',
            email: usuario?.email || '',
            telefone: usuario?.telefone || ''
        }
    });

    const [cardData, setCardData] = useState({
        numero: '',
        cvv: '',
        validade: '',
        nome: ''
    });

    const [paymentResponse, setPaymentResponse] = useState<any>(null);
    const [observations, setObservations] = useState<Record<string, string>>({});
    const [showPixModal, setShowPixModal] = useState(false);

    // Atualizar valor quando carrinho mudar
    useEffect(() => {
        setPaymentData(prev => ({
            ...prev,
            valor: getTotalPrice()
        }));
    }, [getTotalPrice]);

    // Selecionar método padrão
    useEffect(() => {
        if (paymentMethods.length > 0 && !selectedMethod) {
            selectPaymentMethod(paymentMethods[0]);
        }
    }, [paymentMethods, selectedMethod, selectPaymentMethod]);

    const handleMethodChange = (method: any) => {
        selectPaymentMethod(method);
        setPaymentData(prev => ({
            ...prev,
            metodoPagamento: method.type
        }));
    };

    const handleCardDataChange = (field: string, value: string) => {
        setCardData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedMethod) {
            return;
        }

        try {
            // Primeiro, criar o pedido no backend
            const pedidoData = {
                eventoId: eventoId,
                itens: items.map(item => ({
                    produtoId: item.produto.id,
                    quantidade: item.quantidade,
                    precoUnitario: item.produto.preco,
                    precoTotal: item.produto.preco * item.quantidade,
                    observacoes: observations[item.produto.id] || ''
                })),
                observacoes: '',
                valorTotal: getTotalPrice()
            };

            const pedidoResponse = await apiService.criarPedido(pedidoData);

            if (!pedidoResponse.success) {
                throw new Error(pedidoResponse.message || 'Erro ao criar pedido');
            }

            const pedidoIdReal = pedidoResponse.data?.id;

            // Agora processar o pagamento
            const request: PaymentRequest = {
                pedidoId: pedidoIdReal,
                valor: getTotalPrice(),
                metodoPagamento: selectedMethod.type,
                dadosCliente: paymentData.dadosCliente,
                dadosCartao: selectedMethod.type === 'card' ? cardData : undefined
            };

            // Validar dados
            if (!validatePaymentData(request)) {
                return;
            }

            const response = await processPayment(request);
            setPaymentResponse(response);

            // Para PIX, abrir modal específico com timer
            if (response.success && selectedMethod.type === 'pix') {
                setShowPixModal(true);
            } else if (response.success && selectedMethod.type !== 'pix') {
                // Para outros métodos, finalizar automaticamente
                setTimeout(() => {
                    onSuccess(response.transactionId!);
                    onClose();
                }, 2000);
            }
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            setPaymentResponse({
                success: false,
                status: 'rejected',
                message: error instanceof Error ? error.message : 'Erro ao processar pagamento'
            });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Pagamento</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Resumo do Pedido */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2">Resumo do Pedido</h3>
                        <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex justify-between">
                                <span>Itens:</span>
                                <span>{items.reduce((total, item) => total + item.quantidade, 0)}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-gray-900">
                                <span>Total:</span>
                                <span>{formatCurrency(getTotalPrice())}</span>
                            </div>
                        </div>
                    </div>

                    {/* Métodos de Pagamento */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Escolha a forma de pagamento
                            </label>
                            <div className="space-y-2">
                                {paymentMethods.map((method) => (
                                    <label
                                        key={method.id}
                                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${selectedMethod?.id === method.id
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method.id}
                                            checked={selectedMethod?.id === method.id}
                                            onChange={() => handleMethodChange(method)}
                                            className="sr-only"
                                        />
                                        <div className="flex items-center space-x-3">
                                            <span className="text-2xl">{method.icon}</span>
                                            <div>
                                                <div className="font-medium text-gray-900">{method.name}</div>
                                                <div className="text-sm text-gray-500">{method.description}</div>
                                            </div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Dados do Cartão */}
                        {selectedMethod?.type === 'card' && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">Dados do Cartão</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Número do Cartão
                                    </label>
                                    <input
                                        type="text"
                                        value={cardData.numero}
                                        onChange={(e) => handleCardDataChange('numero', e.target.value)}
                                        placeholder="1234 5678 9012 3456"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        maxLength={19}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Validade
                                        </label>
                                        <input
                                            type="text"
                                            value={cardData.validade}
                                            onChange={(e) => handleCardDataChange('validade', e.target.value)}
                                            placeholder="MM/AA"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            maxLength={5}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            CVV
                                        </label>
                                        <input
                                            type="text"
                                            value={cardData.cvv}
                                            onChange={(e) => handleCardDataChange('cvv', e.target.value)}
                                            placeholder="123"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            maxLength={4}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome no Cartão
                                    </label>
                                    <input
                                        type="text"
                                        value={cardData.nome}
                                        onChange={(e) => handleCardDataChange('nome', e.target.value)}
                                        placeholder="Nome como está no cartão"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Dados do Cliente */}
                        {selectedMethod?.type === 'pix' && (
                            <div className="space-y-4">
                                <h3 className="font-medium text-gray-900">Dados para PIX</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nome Completo
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentData.dadosCliente?.nome || ''}
                                        onChange={(e) => setPaymentData(prev => ({
                                            ...prev,
                                            dadosCliente: {
                                                ...prev.dadosCliente!,
                                                nome: e.target.value
                                            }
                                        }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={paymentData.dadosCliente?.email || ''}
                                        onChange={(e) => setPaymentData(prev => ({
                                            ...prev,
                                            dadosCliente: {
                                                ...prev.dadosCliente!,
                                                email: e.target.value
                                            }
                                        }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Botões */}
                        <div className="flex space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={isProcessing}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isProcessing || !selectedMethod}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Processando...
                                    </>
                                ) : (
                                    `Pagar ${formatCurrency(getTotalPrice())}`
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Resposta do Pagamento */}
                    {paymentResponse && (
                        <div className={`mt-4 p-4 rounded-lg ${paymentResponse.success
                            ? 'bg-green-50 border border-green-200'
                            : 'bg-red-50 border border-red-200'
                            }`}>
                            <div className="flex items-center mb-3">
                                {paymentResponse.success ? (
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                                )}
                                <span className={`font-medium ${paymentResponse.success ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                    {paymentResponse.message}
                                </span>
                            </div>


                            {/* Informações de Cartão */}
                            {paymentResponse.success && selectedMethod?.type === 'card' && (
                                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                                    <div className="text-center">
                                        <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                        <p className="font-semibold text-gray-900">Pagamento Processado</p>
                                        <p className="text-sm text-gray-600">ID da Transação: {paymentResponse.data?.transacaoId}</p>
                                    </div>
                                </div>
                            )}

                            {/* Informações de Dinheiro */}
                            {paymentResponse.success && selectedMethod?.type === 'cash' && (
                                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                                    <div className="text-center">
                                        <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                        <p className="font-semibold text-gray-900">Pagamento em Dinheiro</p>
                                        <p className="text-sm text-gray-600">Aguarde confirmação na retirada</p>
                                        <p className="text-xs text-gray-500 mt-1">ID: {paymentResponse.data?.transacaoId}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal PIX com Timer */}
            {showPixModal && paymentResponse && (
                <PixPaymentModal
                    isOpen={showPixModal}
                    onClose={() => setShowPixModal(false)}
                    onSuccess={(transactionId) => {
                        setShowPixModal(false);
                        onSuccess(transactionId);
                        onClose();
                    }}
                    onCancel={() => {
                        setShowPixModal(false);
                        setPaymentResponse({ success: false, status: 'cancelled', message: 'Pagamento cancelado' });
                    }}
                    qrCode={paymentResponse.qrCode || ''}
                    pixKey={paymentResponse.pixKey || ''}
                    valor={paymentData.valor || 0}
                    transactionId={paymentResponse.transactionId || ''}
                    expirationTime={paymentResponse.expirationTime || Date.now() + 120000}
                />
            )}
        </div>
    );
};
