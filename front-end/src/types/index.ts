// Tipos principais do sistema
export interface Usuario {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    tipo: 'Gestor' | 'Equipe' | 'Consumidor';
    emailConfirmado: boolean;
    ultimoLogin?: string;
    eventoVinculado?: Evento;
}

export interface Evento {
    id: string;
    nome: string;
    descricao: string;
    endereco: string;
    cidade: string;
    estado: string;
    cep: string;
    telefone: string;
    email: string;
    logoUrl: string;
    corPrimaria: string;
    corSecundaria: string;
    dataInicio: string;
    dataFim: string;
    ativo: boolean;
    gestorId: string;
}

export interface Categoria {
    id: string;
    nome: string;
    descricao: string;
    cor: string;
    ativa: boolean;
    eventoId: string;
}

export interface Produto {
    id: string;
    nome: string;
    descricao: string;
    preco: number;
    imagemUrl: string;
    ativo: boolean;
    categoriaId: string;
    eventoId: string;
    tempoPreparoMinutos: number;
    categoria?: Categoria;
}

export interface ItemPedido {
    id: string;
    produtoId: string;
    quantidade: number;
    precoUnitario: number;
    precoTotal: number;
    observacoes?: string;
    status: StatusItemPedido;
    produto?: Produto;
}

export interface Pedido {
    id: string;
    numeroPedido: string;
    eventoId: string;
    consumidorId?: string;
    status: StatusPedido;
    valorTotal: number;
    observacoes?: string;
    dataCriacao: string;
    dataAtualizacao: string;
    consumidorNome?: string;
    consumidorTelefone?: string;
    itens: ItemPedido[];
    pagamento?: Pagamento;
    tempoEstimadoMinutos?: number;
    evento?: Evento;
}

export interface Pagamento {
    id: string;
    pedidoId: string;
    valor: number;
    status: 'Pendente' | 'Processando' | 'Aprovado' | 'Rejeitado' | 'Cancelado';
    metodo: 'PIX' | 'Cartao' | 'Dinheiro';
    transacaoId: string;
    dataProcessamento?: string;
    dadosPagamento: DadosPagamento;
}

export interface DadosPagamento {
    // PIX
    chavePix?: string;
    nomePagador?: string;
    cpfCnpj?: string;

    // Cartão
    numeroCartao?: string;
    nomeCartao?: string;
    cvv?: string;
    dataValidade?: string;
}

export interface LoginRequest {
    email: string;
    senha: string;
}

export interface LoginResponse {
    token: string;
    usuario: Usuario;
    expiracao: string;
}

export interface CriarPedidoRequest {
    eventoId: string;
    consumidorNome?: string;
    consumidorTelefone?: string;
    observacoes?: string;
    itens: {
        produtoId: string;
        quantidade: number;
        observacoes?: string;
    }[];
}

export interface RegisterRequest {
    nome: string;
    email: string;
    telefone?: string;
    senha: string;
    confirmarSenha: string;
}

export enum StatusPedido {
    AguardandoPagamento = 0,
    Pago = 1,
    Preparando = 2,
    Pronto = 3,
    Entregue = 4,
    Cancelado = 5
}

export enum StatusItemPedido {
    Aguardando = 0,
    Preparando = 1,
    Pronto = 2,
    Entregue = 3,
    Cancelado = 4
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
}