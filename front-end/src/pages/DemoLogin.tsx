import React from 'react';
import { Link } from 'react-router-dom';
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
    const { login } = useAuth();

    const handleDemoLogin = async (email: string, senha: string) => {
        const success = await login({ email, senha });
        if (success) {
            // O redirecionamento será feito automaticamente pelo AuthContext
        }
    };

    const demos = [
        {
            id: '1',
            nome: 'Festival de Música Rock',
            descricao: 'Gestor do evento de rock',
            email: 'joao@festivalrock.com',
            senha: '123456',
            cor: '#FF6B35',
            icon: <Music className="w-8 h-8" />,
            features: ['Gestão completa', 'Dashboard em tempo real', 'Relatórios avançados']
        },
        {
            id: '2',
            nome: 'Feira Gastronômica Gourmet',
            descricao: 'Gestora do evento gastronômico',
            email: 'maria@feiragourmet.com',
            senha: '123456',
            cor: '#8B4513',
            icon: <ChefHat className="w-8 h-8" />,
            features: ['Cardápio premium', 'Pedidos gourmet', 'Experiência única']
        },
        {
            id: '3',
            nome: 'Cliente - Festival Rock',
            descricao: 'Cliente do festival de rock',
            email: 'pedro@cliente.com',
            senha: '123456',
            cor: '#FF6B35',
            icon: <Users className="w-8 h-8" />,
            features: ['Fazer pedidos', 'Acompanhar status', 'Histórico de pedidos']
        },
        {
            id: '4',
            nome: 'Cliente - Feira Gourmet',
            descricao: 'Cliente da feira gastronômica',
            email: 'ana@cliente.com',
            senha: '123456',
            cor: '#8B4513',
            icon: <Star className="w-8 h-8" />,
            features: ['Cardápio gourmet', 'Pedidos especiais', 'Experiência premium']
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
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                        >
                            {/* Header do Card */}
                            <div
                                className="h-32 flex items-center justify-center text-white"
                                style={{ backgroundColor: demo.cor }}
                            >
                                <div className="text-center">
                                    {demo.icon}
                                    <h3 className="text-lg font-bold mt-2">{demo.nome}</h3>
                                </div>
                            </div>

                            {/* Conteúdo do Card */}
                            <div className="p-6">
                                <p className="text-gray-600 mb-4">{demo.descricao}</p>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Mail className="w-4 h-4 mr-2" />
                                        <span className="font-mono text-xs">{demo.email}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Lock className="w-4 h-4 mr-2" />
                                        <span className="font-mono text-xs">{demo.senha}</span>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="mb-6">
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

                                {/* Botão de Login */}
                                <button
                                    onClick={() => handleDemoLogin(demo.email, demo.senha)}
                                    className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-white font-medium transition-colors"
                                    style={{ backgroundColor: demo.cor }}
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    Fazer Login
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </button>
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
