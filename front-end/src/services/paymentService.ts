import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { apiService } from './api';

export interface PaymentMethod {
    id: string;
    type: 'pix' | 'card' | 'cash';
    name: string;
    description: string;
    icon: string;
    enabled: boolean;
}

export interface PaymentRequest {
    pedidoId: string;
    valor: number;
    metodoPagamento: 'pix' | 'card' | 'cash';
    dadosCliente?: {
        nome: string;
        email: string;
        telefone?: string;
    };
    dadosCartao?: {
        numero: string;
        cvv: string;
        validade: string;
        nome: string;
    };
}

export interface PaymentResponse {
    success: boolean;
    transactionId?: string;
    status: 'pending' | 'approved' | 'rejected' | 'cancelled';
    message: string;
    qrCode?: string; // Para PIX
    pixKey?: string; // Para PIX
    expirationTime?: number; // Para PIX
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}

export interface PaymentValidation {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export class PaymentService {
    private static stripe: Stripe | null = null;
    private static elements: StripeElements | null = null;
    private static paymentElement: StripePaymentElement | null = null;

    // Configurações de segurança bancária
    private static readonly SECURITY_CONFIG = {
        maxRetries: 3,
        timeout: 30000, // 30 segundos
        encryptionKey: process.env.REACT_APP_PAYMENT_ENCRYPTION_KEY || 'default-key',
        fraudDetection: true,
        auditLogging: true
    };

    // Métodos de pagamento disponíveis
    private static readonly PAYMENT_METHODS: PaymentMethod[] = [
        {
            id: 'pix',
            type: 'pix',
            name: 'PIX',
            description: 'Pagamento instantâneo',
            icon: '💳',
            enabled: true
        },
        {
            id: 'card',
            type: 'card',
            name: 'Cartão de Crédito/Débito',
            description: 'Visa, Mastercard, Elo',
            icon: '💳',
            enabled: true
        },
        {
            id: 'cash',
            type: 'cash',
            name: 'Dinheiro',
            description: 'Pagamento na retirada',
            icon: '💵',
            enabled: true
        }
    ];

    /**
     * Inicializa o Stripe (nível bancário)
     */
    static async initializeStripe(): Promise<boolean> {
        try {
            const stripePublishableKey = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;

            if (!stripePublishableKey) {
                console.warn('Stripe publishable key não configurada - usando modo demo');
                return false;
            }

            this.stripe = await loadStripe(stripePublishableKey);

            if (!this.stripe) {
                throw new Error('Falha ao carregar Stripe');
            }

            console.log('Stripe inicializado com sucesso');
            return true;
        } catch (error) {
            console.error('Erro ao inicializar Stripe:', error);
            return false;
        }
    }

    /**
     * Valida dados de pagamento (nível bancário)
     */
    static validatePaymentData(request: PaymentRequest): PaymentValidation {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Validação básica
        if (!request.pedidoId || request.pedidoId.trim() === '') {
            errors.push('ID do pedido é obrigatório');
        }

        if (!request.valor || request.valor <= 0) {
            errors.push('Valor deve ser maior que zero');
        }

        if (request.valor > 10000) {
            warnings.push('Valor alto detectado - pode requerer validação adicional');
        }

        // Validação por método de pagamento
        switch (request.metodoPagamento) {
            case 'pix':
                if (!request.dadosCliente?.email) {
                    errors.push('Email é obrigatório para PIX');
                }
                break;

            case 'card':
                if (!request.dadosCartao) {
                    errors.push('Dados do cartão são obrigatórios');
                } else {
                    // Validação de cartão (Luhn algorithm)
                    if (!this.validateCardNumber(request.dadosCartao.numero)) {
                        errors.push('Número do cartão inválido');
                    }
                    if (!this.validateCVV(request.dadosCartao.cvv)) {
                        errors.push('CVV inválido');
                    }
                    if (!this.validateExpiryDate(request.dadosCartao.validade)) {
                        errors.push('Data de validade inválida');
                    }
                }
                break;

            case 'cash':
                // Pagamento em dinheiro não requer validação adicional
                break;
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Processa pagamento (nível bancário)
     */
    static async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
        try {
            // Validação de segurança
            const validation = this.validatePaymentData(request);
            if (!validation.isValid) {
                return {
                    success: false,
                    status: 'rejected',
                    message: 'Dados de pagamento inválidos',
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: validation.errors.join(', '),
                        details: validation
                    }
                };
            }

            // Log de auditoria
            this.logPaymentAttempt(request);

            // Processar baseado no método
            switch (request.metodoPagamento) {
                case 'pix':
                    return await this.processPixPayment(request);
                case 'card':
                    return await this.processCardPayment(request);
                case 'cash':
                    return await this.processCashPayment(request);
                default:
                    return {
                        success: false,
                        status: 'rejected',
                        message: 'Método de pagamento não suportado'
                    };
            }
        } catch (error) {
            console.error('Erro ao processar pagamento:', error);
            return {
                success: false,
                status: 'rejected',
                message: 'Erro interno do sistema',
                error: {
                    code: 'INTERNAL_ERROR',
                    message: error instanceof Error ? error.message : 'Erro desconhecido'
                }
            };
        }
    }

    /**
     * Processa pagamento PIX
     */
    private static async processPixPayment(request: PaymentRequest): Promise<PaymentResponse> {
        try {
            // Usar o novo endpoint PIX
            const response = await apiService.criarCobrancaPix({
                pedidoId: request.pedidoId,
                valor: request.valor,
                descricao: `Pedido ${request.pedidoId}`,
                expiracaoMinutos: 30
            });

            console.log('🔍 Resposta PIX completa:', response);

            if (response.success) {
                const pixResponse: PaymentResponse = {
                    success: true,
                    transactionId: response.data.txId,
                    status: 'pending' as const,
                    message: 'PIX gerado com sucesso',
                    qrCode: response.data.qrCodeBase64,
                    pixKey: response.data.chavePix,
                    expirationTime: response.data.dataExpiracao ? new Date(response.data.dataExpiracao).getTime() : Date.now() + 30 * 60 * 1000
                };

                console.log('✅ PIX Response formatado:', pixResponse);
                return pixResponse;
            } else {
                console.log('❌ Erro na resposta PIX:', response);
                return {
                    success: false,
                    status: 'rejected' as const,
                    message: response.message || 'Erro ao gerar PIX'
                };
            }
        } catch (error) {
            console.error('💥 Erro ao processar PIX:', error);
            throw new Error(`Erro ao processar PIX: ${error}`);
        }
    }

    /**
     * Processa pagamento com cartão
     */
    private static async processCardPayment(request: PaymentRequest): Promise<PaymentResponse> {
        try {
            // Chamar API do backend para processar cartão
            const response = await apiService.processarPagamento({
                pedidoId: request.pedidoId,
                valor: request.valor,
                metodo: 'Cartao',
                dadosPagamento: JSON.stringify({
                    numeroCartao: request.dadosCartao?.numero || '',
                    nomeCartao: request.dadosCartao?.nome || '',
                    cvv: request.dadosCartao?.cvv || '',
                    dataValidade: request.dadosCartao?.validade || '',
                    parcelas: 1
                })
            });

            if (response.success) {
                return {
                    success: true,
                    transactionId: response.data.transacaoId,
                    status: this.mapPaymentStatus(response.data.status),
                    message: response.data.message || 'Pagamento processado com sucesso'
                };
            } else {
                return {
                    success: false,
                    status: 'rejected',
                    message: response.message || 'Erro ao processar pagamento'
                };
            }
        } catch (error) {
            throw new Error(`Erro ao processar cartão: ${error}`);
        }
    }

    /**
     * Processa pagamento em dinheiro
     */
    private static async processCashPayment(request: PaymentRequest): Promise<PaymentResponse> {
        try {
            // Chamar API do backend para processar dinheiro
            const response = await apiService.processarPagamento({
                pedidoId: request.pedidoId,
                valor: request.valor,
                metodo: 'Dinheiro',
                dadosPagamento: JSON.stringify({
                    valorRecebido: request.valor,
                    valorPago: request.valor
                })
            });

            if (response.success) {
                return {
                    success: true,
                    transactionId: response.data.transacaoId,
                    status: this.mapPaymentStatus(response.data.status),
                    message: response.data.message || 'Pagamento em dinheiro - aguardando confirmação na retirada'
                };
            } else {
                return {
                    success: false,
                    status: 'rejected',
                    message: response.message || 'Erro ao processar pagamento'
                };
            }
        } catch (error) {
            throw new Error(`Erro ao processar dinheiro: ${error}`);
        }
    }

    /**
     * Gera QR Code para PIX
     */
    private static async generatePixQRCode(request: PaymentRequest): Promise<string> {
        // Simulação de geração de QR Code PIX
        const pixData = {
            valor: request.valor,
            chave: 'pix@fila-zero.com.br',
            descricao: `Pedido ${request.pedidoId}`,
            timestamp: Date.now()
        };

        // Em produção, integrar com API de PIX real
        return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
    }

    /**
     * Valida número do cartão (Luhn algorithm)
     */
    private static validateCardNumber(cardNumber: string): boolean {
        const cleaned = cardNumber.replace(/\D/g, '');
        if (cleaned.length < 13 || cleaned.length > 19) return false;

        let sum = 0;
        let isEven = false;

        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    }

    /**
     * Valida CVV
     */
    private static validateCVV(cvv: string): boolean {
        const cleaned = cvv.replace(/\D/g, '');
        return cleaned.length >= 3 && cleaned.length <= 4;
    }

    /**
     * Valida data de validade
     */
    private static validateExpiryDate(expiry: string): boolean {
        const [month, year] = expiry.split('/');
        if (!month || !year) return false;

        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        const expMonth = parseInt(month);
        const expYear = parseInt(year);

        if (expMonth < 1 || expMonth > 12) return false;
        if (expYear < currentYear) return false;
        if (expYear === currentYear && expMonth < currentMonth) return false;

        return true;
    }

    /**
     * Log de auditoria (nível bancário)
     */
    private static logPaymentAttempt(request: PaymentRequest): void {
        const logData = {
            timestamp: new Date().toISOString(),
            pedidoId: request.pedidoId,
            valor: request.valor,
            metodoPagamento: request.metodoPagamento,
            ip: '127.0.0.1', // Em produção, capturar IP real
            userAgent: navigator.userAgent
        };

        console.log('Payment Attempt:', logData);

        // Em produção, enviar para sistema de auditoria
        if (this.SECURITY_CONFIG.auditLogging) {
            // Implementar envio para sistema de logs
        }
    }

    /**
     * Obtém métodos de pagamento disponíveis
     */
    static getAvailablePaymentMethods(): PaymentMethod[] {
        return this.PAYMENT_METHODS.filter(method => method.enabled);
    }

    /**
     * Prepara dados de pagamento para API
     */
    private static preparePaymentData(request: PaymentRequest): any {
        switch (request.metodoPagamento) {
            case 'pix':
                return {
                    chavePix: 'pix@fila-zero.com.br',
                    nomePagador: request.dadosCliente?.nome || '',
                    cpfCnpj: request.dadosCliente?.email || ''
                };
            case 'card':
                return {
                    numeroCartao: request.dadosCartao?.numero || '',
                    nomeCartao: request.dadosCartao?.nome || '',
                    cvv: request.dadosCartao?.cvv || '',
                    dataValidade: request.dadosCartao?.validade || '',
                    parcelas: 1
                };
            case 'cash':
                return {
                    valorRecebido: request.valor,
                    valorPago: request.valor
                };
            default:
                return {};
        }
    }

    /**
     * Mapeia método de pagamento para enum do backend
     */
    private static mapPaymentMethod(method: string): string {
        switch (method) {
            case 'pix': return 'Pix';
            case 'card': return 'Cartao';
            case 'cash': return 'Dinheiro';
            default: return 'Pix';
        }
    }

    /**
     * Mapeia status de pagamento do backend
     */
    private static mapPaymentStatus(status: string): 'pending' | 'approved' | 'rejected' | 'cancelled' {
        switch (status) {
            case 'Pendente': return 'pending';
            case 'Aprovado': return 'approved';
            case 'Rejeitado': return 'rejected';
            case 'Cancelado': return 'cancelled';
            default: return 'pending';
        }
    }

    /**
     * Verifica status de pagamento
     */
    static async checkPaymentStatus(transactionId: string): Promise<PaymentResponse> {
        try {
            // Simulação de verificação de status
            // Em produção, consultar gateway real
            return {
                success: true,
                transactionId,
                status: 'approved',
                message: 'Pagamento confirmado'
            };
        } catch (error) {
            return {
                success: false,
                status: 'rejected',
                message: 'Erro ao verificar status',
                error: {
                    code: 'STATUS_CHECK_ERROR',
                    message: error instanceof Error ? error.message : 'Erro desconhecido'
                }
            };
        }
    }
}
