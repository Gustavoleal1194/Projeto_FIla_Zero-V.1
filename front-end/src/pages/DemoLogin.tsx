import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    User,
    Mail,
    Lock,
    ArrowRight,
    Music,
    ChefHat,
    Users,
    Star
} from 'lucide-react';

const DemoLogin: React.FC = () => {
    const { loginCpf } = useAuth();
    const navigate = useNavigate();

    const handleDemoLogin = async (demo: any) => {
        try {
            // Fazer login automático como consumidor com CPF
            await loginCpf(demo.cpf, demo.eventoId);

            // Redirecionar para o evento após login
            navigate(`/evento/${demo.eventoId}`);
        } catch (error) {
            console.error('Erro ao fazer login demo:', error);
            // Em caso de erro, redirecionar mesmo assim
            navigate(`/evento/${demo.eventoId}`);
        }
    };

    const demos = [
        {
            id: '1',
            nome: '🎸 Festival Rock Underground',
            descricao: 'Demo público - acesso automático',
            cpf: '123.456.789-00',
            codigoPulseira: '123456',
            cor: '#FF6B35',
            icon: <Music className="w-8 h-8" />,
            features: ['Acesso automático', 'Gestão completa', 'Dashboard em tempo real', 'Relatórios avançados'],
            eventoId: '11111111-1111-1111-1111-111111111111',
            tema: 'rock',
            imagem: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
            cardapio: ['Hambúrguer Rock', 'Batata Frita Crocante', 'Cerveja Artesanal', 'Refrigerante', 'Água']
        },
        {
            id: '2',
            nome: '🍷 Feira Gourmet Premium',
            descricao: 'Demo público - acesso automático',
            cpf: '123.456.789-00',
            codigoPulseira: '123456',
            cor: '#8B4513',
            icon: <ChefHat className="w-8 h-8" />,
            features: ['Acesso público', 'Cardápio premium', 'Pedidos gourmet', 'Experiência única'],
            eventoId: '22222222-2222-2222-2222-222222222222',
            tema: 'gourmet',
            imagem: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
            cardapio: ['Risotto de Trufas', 'Salada Caesar Premium', 'Vinho Tinto Reserva', 'Sobremesa de Chocolate', 'Café Especial']
        },
        {
            id: '3',
            nome: '🎪 Festa Junina Tradicional',
            descricao: 'Demo público - acesso automático',
            cpf: '123.456.789-00',
            codigoPulseira: '123456',
            cor: '#FFD700',
            icon: <Users className="w-8 h-8" />,
            features: ['Acesso público', 'Fazer pedidos', 'Acompanhar status', 'Histórico de pedidos'],
            eventoId: '33333333-3333-3333-3333-333333333333',
            tema: 'junina',
            imagem: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop',
            cardapio: ['Pé de Moleque', 'Pipoca Doce', 'Quentão', 'Cocada', 'Pamonha']
        },
        {
            id: '4',
            nome: '🎨 Festival de Arte & Cultura',
            descricao: 'Demo público - acesso automático',
            cpf: '123.456.789-00',
            codigoPulseira: '123456',
            cor: '#9B59B6',
            icon: <Star className="w-8 h-8" />,
            features: ['Acesso público', 'Cardápio artístico', 'Pedidos especiais', 'Experiência cultural'],
            eventoId: '44444444-4444-4444-4444-444444444444',
            tema: 'arte',
            imagem: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=600&fit=crop',
            cardapio: ['Tapas Artesanais', 'Smoothie Colorido', 'Chá de Ervas', 'Biscoito Decorado', 'Água Infusada']
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        🎯 Demonstração do Sistema
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Escolha uma conta para testar o sistema de whitelabel.
                        Cada conta está vinculada a um evento específico com tema personalizado.
                    </p>
                </div>

                {/* Cards de Demonstração */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {demos.map((demo) => (
                        <div
                            key={demo.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                        >
                            {/* Header do Card */}
                            <div
                                className="h-32 flex items-center justify-center text-white relative overflow-hidden"
                                style={{ backgroundColor: demo.cor }}
                            >
                                {/* Imagem de fundo */}
                                <div
                                    className="absolute inset-0 bg-cover bg-center opacity-30"
                                    style={{ backgroundImage: `url(${demo.imagem})` }}
                                ></div>
                                <div className="text-center relative z-10">
                                    {demo.icon}
                                    <h3 className="text-lg font-bold mt-2 drop-shadow-lg">{demo.nome}</h3>
                                </div>
                            </div>

                            {/* Conteúdo do Card */}
                            <div className="p-6 flex-1 flex flex-col">
                                <p className="text-gray-600 mb-4">{demo.descricao}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <User className="w-4 h-4 mr-2" />
                                        <span className="font-mono text-xs">CPF: {demo.cpf}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Lock className="w-4 h-4 mr-2" />
                                        <span className="font-mono text-xs">Pulseira: {demo.codigoPulseira}</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-4">
                                    <h4 className="font-semibold text-gray-900 mb-2">Funcionalidades:</h4>
                                    <ul className="space-y-1">
                                        {demo.features.map((feature, index) => (
                                            <li key={index} className="text-sm text-gray-600 flex items-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-2"></div>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Cardápio do Evento */}
                                <div className="mb-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">🍽️ Cardápio:</h4>
                                    <div className="flex flex-wrap gap-1">
                                        {demo.cardapio.map((item, index) => (
                                            <span
                                                key={index}
                                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Botão de Login */}
                                <div className="mt-auto">
                                    <button
                                        onClick={() => handleDemoLogin(demo)}
                                        className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium transition-colors"
                                        style={{ backgroundColor: demo.cor }}
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Acessar Evento
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Informações Adicionais */}
                <div className="bg-blue-50 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                        🚀 Como funciona a demonstração:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-blue-600 font-bold">1</span>
                            </div>
                            <div>
                                <strong>Escolha uma conta</strong>
                                <p>Clique em "Fazer Login" em qualquer card acima</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-blue-600 font-bold">2</span>
                            </div>
                            <div>
                                <strong>Redirecionamento automático</strong>
                                <p>Você será levado para o evento específico</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 mt-0.5">
                                <span className="text-blue-600 font-bold">3</span>
                            </div>
                            <div>
                                <strong>Tema personalizado</strong>
                                <p>Cores, logo e identidade visual do evento</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Link para Login Normal */}
                <div className="text-center">
                    <p className="text-gray-600 mb-4">
                        Ou faça login com sua conta normal:
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <User className="w-4 h-4 mr-2" />
                        Login Normal
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default DemoLogin;
