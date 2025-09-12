import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    Usuario,
    Evento,
    Produto,
    Categoria,
    Pedido,
    ApiResponse
} from '../types';

class ApiService {
    private api: AxiosInstance;


    constructor() {
        this.api = axios.create({
            baseURL: process.env.REACT_APP_API_URL || 'https://projeto-fila-zero-v-1-2.onrender.com/api',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor para adicionar token de autenticação
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Interceptor para tratar respostas
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('usuario');
                    window.location.href = '/login';
                }

                // Retry automático para erro 429 (Too Many Requests)
                if (error.response?.status === 429) {
                    const config = error.config;
                    if (!config._retry) {
                        config._retry = true;
                        config._retryCount = 0;
                    }

                    if (config._retryCount < 3) {
                        config._retryCount++;
                        const delay = Math.pow(2, config._retryCount) * 1000; // Exponential backoff
                        await new Promise(resolve => setTimeout(resolve, delay));
                        return this.api(config);
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // Autenticação
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response: AxiosResponse<ApiResponse<LoginResponse>> = await this.api.post('/auth/login', credentials);
        return response.data.data!;
    }

    async loginCpf(cpf: string): Promise<LoginResponse> {
        const response: AxiosResponse<ApiResponse<LoginResponse>> = await this.api.post('/auth/login-cpf', { cpf });
        return response.data.data!;
    }

    async register(data: RegisterRequest): Promise<LoginResponse> {
        const response: AxiosResponse<ApiResponse<LoginResponse>> = await this.api.post('/auth/register', data);
        return response.data.data!;
    }

    async logout(): Promise<void> {
        await this.api.post('/auth/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    }

    async getUsuarioAtual(): Promise<Usuario> {
        const response: AxiosResponse<ApiResponse<Usuario>> = await this.api.get('/auth/profile');
        return response.data.data!;
    }

    // Eventos
    async getEventos(): Promise<Evento[]> {
        const response: AxiosResponse<ApiResponse<Evento[]>> = await this.api.get('/eventos');
        return response.data.data!;
    }

    async getEvento(id: string): Promise<Evento> {
        const response: AxiosResponse<ApiResponse<Evento>> = await this.api.get(`/eventos/${id}`);
        return response.data.data!;
    }

    async getEventoById(id: string): Promise<Evento> {
        const response: AxiosResponse<ApiResponse<Evento>> = await this.api.get(`/eventos/${id}`);
        return response.data.data!;
    }

    async getMeusEventos(): Promise<Evento[]> {
        const response: AxiosResponse<ApiResponse<Evento[]>> = await this.api.get('/eventos/meus-eventos');
        return response.data.data!;
    }

    // Produtos
    async getProdutos(eventoId: string): Promise<Produto[]> {
        const response: AxiosResponse<ApiResponse<Produto[]>> = await this.api.get(`/produtos/evento/${eventoId}`);
        return response.data.data!;
    }

    async getProduto(id: string): Promise<Produto> {
        const response: AxiosResponse<ApiResponse<Produto>> = await this.api.get(`/produtos/${id}`);
        return response.data.data!;
    }

    // Pedidos

    async getPedidos(eventoId?: string): Promise<Pedido[]> {
        const url = eventoId ? `/pedidos?eventoId=${eventoId}` : '/pedidos';
        const response: AxiosResponse<ApiResponse<Pedido[]>> = await this.api.get(url);
        return response.data.data!;
    }

    async getPedido(id: string): Promise<Pedido> {
        const response: AxiosResponse<ApiResponse<Pedido>> = await this.api.get(`/pedidos/${id}`);
        return response.data.data!;
    }

    async atualizarStatusPedido(id: string, status: string): Promise<Pedido> {
        const response: AxiosResponse<ApiResponse<Pedido>> = await this.api.patch(`/pedidos/${id}/status`, { status });
        return response.data.data!;
    }

    async marcarPedidoEntregue(pedidoId: string): Promise<void> {
        await this.api.patch(`/kds/pedido/${pedidoId}/entregue`);
    }

    // KDS (Kitchen Display System)
    async getPedidosKDS(eventoId: string): Promise<Pedido[]> {
        const response: AxiosResponse<ApiResponse<Pedido[]>> = await this.api.get(`/kds/evento/${eventoId}`);
        return response.data.data!;
    }

    async getPedidosParaKDS(eventoId: string): Promise<Pedido[]> {
        const response: AxiosResponse<ApiResponse<Pedido[]>> = await this.api.get(`/kds/evento/${eventoId}`);
        return response.data.data!;
    }

    async getEstatisticasKDS(eventoId: string): Promise<any> {
        const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/kds/evento/${eventoId}/estatisticas`);
        return response.data.data!;
    }

    async getProdutosByEvento(eventoId: string): Promise<Produto[]> {
        const response: AxiosResponse<ApiResponse<Produto[]>> = await this.api.get(`/produtos/evento/${eventoId}`);
        return response.data.data!;
    }

    async getPedidosByUsuario(): Promise<Pedido[]> {
        const response: AxiosResponse<ApiResponse<Pedido[]>> = await this.api.get('/pedidos/usuario');
        return response.data.data!;
    }

    async criarPedido(data: {
        eventoId: string;
        itens: Array<{
            produtoId: string;
            quantidade: number;
            precoUnitario: number;
            precoTotal: number;
            observacoes: string;
        }>;
        observacoes: string;
        valorTotal: number;
    }): Promise<ApiResponse<any>> {
        const response: AxiosResponse<ApiResponse<any>> = await this.api.post('/pedidos', data);
        return response.data;
    }

    // Categorias
    async getCategoriasByEvento(eventoId: string): Promise<any[]> {
        const response: AxiosResponse<ApiResponse<any[]>> = await this.api.get(`/categorias/evento/${eventoId}`);
        return response.data.data!;
    }

    // Health Check
    async healthCheck(): Promise<{ status: string; timestamp: string }> {
        const response: AxiosResponse<{ status: string; timestamp: string }> = await this.api.get('/health');
        return response.data;
    }

    // Pagamentos
    async processarPagamento(data: {
        pedidoId: string;
        valor: number;
        metodo: string;
        dadosPagamento: string;
    }): Promise<ApiResponse<any>> {
        const response: AxiosResponse<ApiResponse<any>> = await this.api.post('/pagamentos/processar', data);
        return response.data;
    }

    async getPagamento(id: string): Promise<any> {
        const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/pagamentos/${id}`);
        return response.data.data!;
    }

    async getPagamentosByUsuario(): Promise<any[]> {
        const response: AxiosResponse<ApiResponse<any[]>> = await this.api.get('/pagamentos/usuario');
        return response.data.data!;
    }

    async confirmarPagamento(id: string): Promise<ApiResponse<any>> {
        const response: AxiosResponse<ApiResponse<any>> = await this.api.post(`/pagamentos/${id}/confirmar`);
        return response.data;
    }

    // PIX
    async criarCobrancaPix(data: {
        pedidoId: string;
        valor: number;
        descricao: string;
        expiracaoMinutos?: number;
    }): Promise<ApiResponse<any>> {
        const response: AxiosResponse<ApiResponse<any>> = await this.api.post('/pix/cobranca', data);
        return response.data;
    }

    async consultarCobrancaPix(id: string): Promise<ApiResponse<any>> {
        const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/pix/cobranca/${id}`);
        return response.data;
    }

    async consultarCobrancaPixPorTxId(txId: string): Promise<ApiResponse<any>> {
        const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/pix/cobranca/txid/${txId}`);
        return response.data;
    }

    async listarCobrancasPorPedido(pedidoId: string): Promise<ApiResponse<any[]>> {
        const response: AxiosResponse<ApiResponse<any[]>> = await this.api.get(`/pix/cobranca/pedido/${pedidoId}`);
        return response.data;
    }

    async cancelarPagamento(id: string): Promise<ApiResponse<any>> {
        const response: AxiosResponse<ApiResponse<any>> = await this.api.post(`/pagamentos/${id}/cancelar`);
        return response.data;
    }
}

export const apiService = new ApiService();
export default apiService;