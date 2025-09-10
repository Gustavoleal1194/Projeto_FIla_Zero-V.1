import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PaymentService, PaymentRequest, PaymentResponse, PaymentMethod } from '../services/paymentService';
import toast from 'react-hot-toast';

export interface PaymentContextType {
    // Estado
    isProcessing: boolean;
    currentPayment: PaymentRequest | null;
    paymentMethods: PaymentMethod[];
    selectedMethod: PaymentMethod | null;

    // Ações
    initializePayment: () => Promise<void>;
    selectPaymentMethod: (method: PaymentMethod) => void;
    processPayment: (request: PaymentRequest) => Promise<PaymentResponse>;
    checkPaymentStatus: (transactionId: string) => Promise<PaymentResponse>;
    clearPayment: () => void;

    // Utilitários
    formatCurrency: (value: number) => string;
    validatePaymentData: (request: PaymentRequest) => boolean;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error('usePayment deve ser usado dentro de PaymentProvider');
    }
    return context;
};

interface PaymentProviderProps {
    children: ReactNode;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentPayment, setCurrentPayment] = useState<PaymentRequest | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

    // Inicializar métodos de pagamento
    const initializePayment = useCallback(async () => {
        try {
            setIsProcessing(true);

            // Inicializar Stripe
            await PaymentService.initializeStripe();

            // Carregar métodos disponíveis
            const methods = PaymentService.getAvailablePaymentMethods();
            setPaymentMethods(methods);

            // Selecionar primeiro método por padrão
            if (methods.length > 0) {
                setSelectedMethod(methods[0]);
            }

            console.log('Payment system initialized successfully');
        } catch (error) {
            console.error('Erro ao inicializar sistema de pagamento:', error);
            toast.error('Erro ao inicializar sistema de pagamento');
        } finally {
            setIsProcessing(false);
        }
    }, []);

    // Selecionar método de pagamento
    const selectPaymentMethod = useCallback((method: PaymentMethod) => {
        setSelectedMethod(method);
        console.log('Payment method selected:', method.name);
    }, []);

    // Processar pagamento
    const processPayment = useCallback(async (request: PaymentRequest): Promise<PaymentResponse> => {
        try {
            setIsProcessing(true);
            setCurrentPayment(request);

            console.log('Processing payment:', {
                pedidoId: request.pedidoId,
                valor: request.valor,
                metodoPagamento: request.metodoPagamento
            });

            const response = await PaymentService.processPayment(request);

            if (response.success) {
                toast.success(response.message);
            } else {
                toast.error(response.message);
            }

            return response;
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            const errorResponse: PaymentResponse = {
                success: false,
                status: 'rejected',
                message: 'Erro interno do sistema',
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Erro desconhecido'
                }
            };

            toast.error('Erro ao processar pagamento');
            return errorResponse;
        } finally {
            setIsProcessing(false);
        }
    }, []);

    // Verificar status do pagamento
    const checkPaymentStatus = useCallback(async (transactionId: string): Promise<PaymentResponse> => {
        try {
            setIsProcessing(true);

            const response = await PaymentService.checkPaymentStatus(transactionId);

            if (response.success) {
                console.log('Payment status checked:', response.status);
            } else {
                console.error('Payment status check failed:', response.message);
            }

            return response;
        } catch (error) {
            console.error('Erro ao verificar status do pagamento:', error);
            const errorResponse: PaymentResponse = {
                success: false,
                status: 'rejected',
                message: 'Erro ao verificar status',
                error: {
                    code: 'STATUS_CHECK_ERROR',
                    message: error instanceof Error ? error.message : 'Erro desconhecido'
                }
            };

            return errorResponse;
        } finally {
            setIsProcessing(false);
        }
    }, []);

    // Limpar dados de pagamento
    const clearPayment = useCallback(() => {
        setCurrentPayment(null);
        setSelectedMethod(paymentMethods[0] || null);
        console.log('Payment data cleared');
    }, [paymentMethods]);

    // Formatar moeda
    const formatCurrency = useCallback((value: number): string => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }, []);

    // Validar dados de pagamento
    const validatePaymentData = useCallback((request: PaymentRequest): boolean => {
        const validation = PaymentService.validatePaymentData(request);

        if (!validation.isValid) {
            validation.errors.forEach(error => {
                toast.error(error);
            });
        }

        if (validation.warnings.length > 0) {
            validation.warnings.forEach(warning => {
                toast(warning, { icon: '⚠️' });
            });
        }

        return validation.isValid;
    }, []);

    const value: PaymentContextType = {
        // Estado
        isProcessing,
        currentPayment,
        paymentMethods,
        selectedMethod,

        // Ações
        initializePayment,
        selectPaymentMethod,
        processPayment,
        checkPaymentStatus,
        clearPayment,

        // Utilitários
        formatCurrency,
        validatePaymentData
    };

    return (
        <PaymentContext.Provider value={value}>
            {children}
        </PaymentContext.Provider>
    );
};
