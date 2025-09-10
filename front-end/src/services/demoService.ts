import { Evento, Produto, Categoria, Usuario, LoginRequest, LoginResponse } from '../types';
import { eventosDemo, produtosDemo, categoriasDemo, usuariosDemo, credenciaisDemo } from '../data/demoData';

// Simula delay de API
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class DemoService {
    // Simula login
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        await delay(1000); // Simula delay de rede
        
        const credencial = credenciaisDemo[credentials.email as keyof typeof credenciaisDemo];
        
        if (!credencial || credencial.senha !== credentials.senha) {
            throw new Error('Credenciais inválidas');
        }

        const usuario = usuariosDemo.find(u => u.email === credentials.email);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const evento = eventosDemo.find(e => e.id === credencial.eventoId);
        
        return {
            token: `demo_token_${usuario.id}_${Date.now()}`,
            usuario: {
                ...usuario,
                eventoVinculado: evento
            },
            expiracao: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
        };
    }

    // Simula busca de eventos
    async getEventos(): Promise<Evento[]> {
        await delay(500);
        return eventosDemo;
    }

    // Simula busca de evento por ID
    async getEventoById(id: string): Promise<Evento> {
        await delay(300);
        const evento = eventosDemo.find(e => e.id === id);
        if (!evento) {
            throw new Error('Evento não encontrado');
        }
        return evento;
    }

    // Simula busca de produtos por evento
    async getProdutos(eventoId: string): Promise<Produto[]> {
        await delay(400);
        return produtosDemo.filter(p => p.eventoId === eventoId);
    }

    // Simula busca de categorias por evento
    async getCategorias(eventoId: string): Promise<Categoria[]> {
        await delay(300);
        return categoriasDemo.filter(c => c.eventoId === eventoId);
    }

    // Simula busca de usuário atual
    async getUsuarioAtual(): Promise<Usuario> {
        await delay(200);
        // Simula usuário logado (em uma aplicação real, viria do token)
        return usuariosDemo[0];
    }

    // Simula criação de pedido
    async criarPedido(pedido: any): Promise<any> {
        await delay(1500);
        return {
            id: `pedido_${Date.now()}`,
            ...pedido,
            status: 'AguardandoPagamento',
            dataCriacao: new Date().toISOString()
        };
    }

    // Simula busca de pedidos
    async getPedidos(eventoId?: string): Promise<any[]> {
        await delay(400);
        return [
            {
                id: '1',
                numero: '001',
                status: 'EmPreparo',
                total: 45.00,
                dataCriacao: new Date().toISOString(),
                itens: [
                    { produto: 'Hambúrguer Rock\'n\'Roll', quantidade: 1, preco: 18.00 },
                    { produto: 'Cerveja Artesanal IPA', quantidade: 2, preco: 12.00 }
                ]
            }
        ];
    }
}

export const demoService = new DemoService();
