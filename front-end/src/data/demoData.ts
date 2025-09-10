import { Evento, Produto, Categoria, Usuario } from '../types';

// Eventos fictícios para demonstração
export const eventosDemo: Evento[] = [
    {
        id: '1',
        nome: 'Festival de Música Rock',
        descricao: 'O maior festival de rock do Brasil! 3 dias de música, comida e diversão.',
        endereco: 'Parque Ibirapuera - Av. Pedro Álvares Cabral, s/n',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '04094-000',
        telefone: '(11) 99999-1111',
        email: 'contato@festivalrock.com.br',
        logoUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop',
        corPrimaria: '#FF6B35',
        corSecundaria: '#2C3E50',
        dataInicio: '2024-12-15T18:00:00Z',
        dataFim: '2024-12-17T23:59:59Z',
        ativo: true,
        gestorId: '1'
    },
    {
        id: '2',
        nome: 'Feira Gastronômica Gourmet',
        descricao: 'Sabores únicos da culinária mundial em um só lugar. Uma experiência gastronômica inesquecível.',
        endereco: 'Centro de Convenções Anhembi - Av. Olavo Fontoura, 1209',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '02012-021',
        telefone: '(11) 99999-2222',
        email: 'info@feiragourmet.com.br',
        logoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=200&fit=crop',
        corPrimaria: '#8B4513',
        corSecundaria: '#D2691E',
        dataInicio: '2024-12-20T10:00:00Z',
        dataFim: '2024-12-22T22:00:00Z',
        ativo: true,
        gestorId: '2'
    }
];

// Categorias fictícias
export const categoriasDemo: Categoria[] = [
    // Festival de Rock
    { id: '1', nome: 'Bebidas', descricao: 'Cervejas, refrigerantes e drinks', cor: '#FF6B35', ativa: true, eventoId: '1' },
    { id: '2', nome: 'Lanches', descricao: 'Hambúrgueres, hot dogs e petiscos', cor: '#FF6B35', ativa: true, eventoId: '1' },
    { id: '3', nome: 'Doces', descricao: 'Sobremesas e doces especiais', cor: '#FF6B35', ativa: true, eventoId: '1' },

    // Feira Gourmet
    { id: '4', nome: 'Pratos Principais', descricao: 'Especialidades gastronômicas', cor: '#8B4513', ativa: true, eventoId: '2' },
    { id: '5', nome: 'Aperitivos', descricao: 'Entradas e petiscos gourmet', cor: '#8B4513', ativa: true, eventoId: '2' },
    { id: '6', nome: 'Bebidas Premium', descricao: 'Vinhos, cervejas artesanais e drinks', cor: '#8B4513', ativa: true, eventoId: '2' },
    { id: '7', nome: 'Sobremesas', descricao: 'Doces finos e sobremesas especiais', cor: '#8B4513', ativa: true, eventoId: '2' }
];

// Produtos fictícios
export const produtosDemo: Produto[] = [
    // Festival de Rock - Bebidas
    {
        id: '1',
        nome: 'Cerveja Artesanal IPA',
        descricao: 'Cerveja artesanal com lúpulo intenso e sabor cítrico',
        preco: 12.00,
        imagemUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=200&fit=crop',
        categoriaId: '1',
        eventoId: '1',
        ativo: true,
        tempoPreparoMinutos: 2
    },
    {
        id: '2',
        nome: 'Refrigerante Cola 500ml',
        descricao: 'Refrigerante gelado para refrescar',
        preco: 6.00,
        imagemUrl: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=300&h=200&fit=crop',
        categoriaId: '1',
        eventoId: '1',
        ativo: true,
        tempoPreparoMinutos: 1
    },
    {
        id: '3',
        nome: 'Caipirinha de Limão',
        descricao: 'Tradicional caipirinha com cachaça premium',
        preco: 15.00,
        imagemUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop',
        categoriaId: '1',
        eventoId: '1',
        ativo: true,
        tempoPreparoMinutos: 5
    },

    // Festival de Rock - Lanches
    {
        id: '4',
        nome: 'Hambúrguer Rock\'n\'Roll',
        descricao: 'Hambúrguer com carne, queijo, bacon e molho especial',
        preco: 18.00,
        imagemUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop',
        categoriaId: '2',
        eventoId: '1',
        ativo: true,
        tempoPreparoMinutos: 15
    },
    {
        id: '5',
        nome: 'Hot Dog Completo',
        descricao: 'Pão, salsicha, molhos e acompanhamentos',
        preco: 12.00,
        imagemUrl: 'https://images.unsplash.com/photo-1617196034183-88b4e2f383ec?w=300&h=200&fit=crop',
        categoriaId: '2',
        eventoId: '1',
        ativo: true,
        tempoPreparoMinutos: 10
    },
    {
        id: '6',
        nome: 'Batata Frita Crocante',
        descricao: 'Batata frita temperada com sal e pimenta',
        preco: 8.00,
        imagemUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&h=200&fit=crop',
        categoriaId: '2',
        eventoId: '1',
        ativo: true,
        tempoPreparoMinutos: 8
    },

    // Feira Gourmet - Pratos Principais
    {
        id: '7',
        nome: 'Risotto de Cogumelos Porcini',
        descricao: 'Risotto cremoso com cogumelos porcini e queijo parmesão',
        preco: 45.00,
        imagemUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop',
        categoriaId: '4',
        eventoId: '2',
        ativo: true,
        tempoPreparoMinutos: 25
    },
    {
        id: '8',
        nome: 'Salmão Grelhado com Molho de Maracujá',
        descricao: 'Salmão fresco grelhado com molho agridoce de maracujá',
        preco: 55.00,
        imagemUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop',
        categoriaId: '4',
        eventoId: '2',
        ativo: true,
        tempoPreparoMinutos: 20
    },
    {
        id: '9',
        nome: 'Picanha na Chapa com Farofa',
        descricao: 'Picanha grelhada na chapa com farofa de banana',
        preco: 48.00,
        imagemUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
        categoriaId: '4',
        eventoId: '2',
        ativo: true,
        tempoPreparoMinutos: 30
    },

    // Feira Gourmet - Aperitivos
    {
        id: '10',
        nome: 'Bruschetta de Tomate e Manjericão',
        descricao: 'Pão italiano torrado com tomate, manjericão e azeite',
        preco: 18.00,
        imagemUrl: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=300&h=200&fit=crop',
        categoriaId: '5',
        eventoId: '2',
        ativo: true,
        tempoPreparoMinutos: 10
    },
    {
        id: '11',
        nome: 'Carpaccio de Salmão',
        descricao: 'Fatias finas de salmão com rúcula e molho de mostarda',
        preco: 32.00,
        imagemUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop',
        categoriaId: '5',
        eventoId: '2',
        ativo: true,
        tempoPreparoMinutos: 15
    },

    // Feira Gourmet - Bebidas Premium
    {
        id: '12',
        nome: 'Vinho Tinto Cabernet Sauvignon',
        descricao: 'Vinho tinto seco, harmoniza com carnes vermelhas',
        preco: 35.00,
        imagemUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=300&h=200&fit=crop',
        categoriaId: '6',
        eventoId: '2',
        ativo: true,
        tempoPreparoMinutos: 2
    },
    {
        id: '13',
        nome: 'Cerveja Artesanal Stout',
        descricao: 'Cerveja escura com notas de café e chocolate',
        preco: 18.00,
        imagemUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=200&fit=crop',
        categoriaId: '6',
        eventoId: '2',
        ativo: true,
        tempoPreparoMinutos: 2
    },

    // Feira Gourmet - Sobremesas
    {
        id: '14',
        nome: 'Tiramisu Tradicional',
        descricao: 'Sobremesa italiana com café, mascarpone e cacau',
        preco: 22.00,
        imagemUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=300&h=200&fit=crop',
        categoriaId: '7',
        eventoId: '2',
        ativo: true,
        tempoPreparoMinutos: 5
    },
    {
        id: '15',
        nome: 'Petit Gateau de Chocolate',
        descricao: 'Bolinho de chocolate quente com sorvete de baunilha',
        preco: 25.00,
        imagemUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&h=200&fit=crop',
        categoriaId: '7',
        eventoId: '2',
        ativo: true,
        tempoPreparoMinutos: 8
    }
];

// Usuários fictícios
export const usuariosDemo: Usuario[] = [
    {
        id: '1',
        nome: 'João Silva',
        email: 'joao@festivalrock.com',
        telefone: '(11) 99999-1111',
        tipo: 'Gestor',
        emailConfirmado: true,
        ultimoLogin: new Date().toISOString()
    },
    {
        id: '2',
        nome: 'Maria Santos',
        email: 'maria@feiragourmet.com',
        telefone: '(11) 99999-2222',
        tipo: 'Gestor',
        emailConfirmado: true,
        ultimoLogin: new Date().toISOString()
    },
    {
        id: '3',
        nome: 'Pedro Costa',
        email: 'pedro@cliente.com',
        telefone: '(11) 99999-3333',
        tipo: 'Consumidor',
        emailConfirmado: true,
        ultimoLogin: new Date().toISOString()
    },
    {
        id: '4',
        nome: 'Ana Oliveira',
        email: 'ana@cliente.com',
        telefone: '(11) 99999-4444',
        tipo: 'Consumidor',
        emailConfirmado: true,
        ultimoLogin: new Date().toISOString()
    },
    {
        id: '5',
        nome: 'Gustavo Idalgo Capistrano Leal',
        email: 'gustavo@cliente.com',
        telefone: '(11) 99999-5555',
        tipo: 'Consumidor',
        emailConfirmado: true,
        ultimoLogin: new Date().toISOString(),
        eventoVinculado: eventosDemo[0] // Festival de Rock
    }
];

// Credenciais de login para demonstração
export const credenciaisDemo = {
    'joao@festivalrock.com': { senha: '123456', eventoId: '1' },
    'maria@feiragourmet.com': { senha: '123456', eventoId: '2' },
    'pedro@cliente.com': { senha: '123456', eventoId: '1' },
    'ana@cliente.com': { senha: '123456', eventoId: '2' },
    'gustavo@cliente.com': { senha: '123456', eventoId: '1' }
};
