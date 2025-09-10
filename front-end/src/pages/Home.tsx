import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { demoService } from '../services/demoService';
import { Evento } from '../types';
import {
    Calendar,
    MapPin,
    Clock,
    Users,
    ArrowRight,
    Star,
    CheckCircle,
    Smartphone,
    CreditCard,
    Truck
} from 'lucide-react';

const Home: React.FC = () => {
    const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);

    const { data: eventos, isLoading: eventosLoading } = useQuery(
        ['eventos'],
        () => demoService.getEventos(),
        {
            onSuccess: (data) => {
                if (data.length > 0) {
                    setSelectedEvento(data[0]);
                }
            }
        }
    );

    const features = [
        {
            icon: <Smartphone className="w-8 h-8 text-blue-600" />,
            title: "PWA Mobile",
            description: "Acesse de qualquer dispositivo com nossa Progressive Web App"
        },
        {
            icon: <CreditCard className="w-8 h-8 text-green-600" />,
            title: "Pagamento Rápido",
            description: "PIX, cartão e dinheiro com processamento instantâneo"
        },
        {
            icon: <Truck className="w-8 h-8 text-orange-600" />,
            title: "Entrega Rápida",
            description: "Sistema de filas inteligente para entrega otimizada"
        },
        {
            icon: <Users className="w-8 h-8 text-purple-600" />,
            title: "Gestão Completa",
            description: "Dashboard completo para gestores e equipe"
        }
    ];

    const stats = [
        { label: "Eventos Ativos", value: eventos?.length || 0 },
        { label: "Pedidos Hoje", value: "1,234" },
        { label: "Usuários Ativos", value: "5,678" },
        { label: "Satisfação", value: "98%" }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Fila Zero
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            O futuro dos pedidos em eventos está aqui
                        </p>
                        <p className="text-lg mb-12 text-blue-200 max-w-3xl mx-auto">
                            Sistema completo de gestão de pedidos para eventos, com PWA mobile,
                            pagamentos instantâneos e dashboard em tempo real.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/demo"
                                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                            >
                                🎯 Testar Sistema
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Link>
                            <Link
                                to="/login"
                                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                Acessar Meu Evento
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Por que escolher o Fila Zero?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Tecnologia de ponta para revolucionar a experiência de pedidos em eventos
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <div className="mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Events Section */}
            {eventos && eventos.length > 0 && (
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Eventos Disponíveis
                            </h2>
                            <p className="text-xl text-gray-600">
                                Escolha um evento para fazer seu pedido
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {eventos.map((evento) => (
                                <div
                                    key={evento.id}
                                    className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                                >
                                    <div
                                        className="h-48 bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${evento.logoUrl || '/api/placeholder/400/200'})`,
                                            backgroundColor: evento.corPrimaria
                                        }}
                                    >
                                        <div className="h-full bg-black bg-opacity-40 flex items-center justify-center">
                                            <div className="text-center text-white">
                                                <h3 className="text-2xl font-bold mb-2">{evento.nome}</h3>
                                                <p className="text-blue-200">{evento.cidade}, {evento.estado}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <p className="text-gray-600 mb-4">{evento.descricao}</p>

                                        <div className="space-y-2 mb-6">
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2" />
                                                <span className="text-sm">{evento.endereco}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <span className="text-sm">
                                                    {new Date(evento.dataInicio).toLocaleDateString('pt-BR')} -
                                                    {new Date(evento.dataFim).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </div>

                                        <Link
                                            to={`/evento/${evento.id}`}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
                                        >
                                            Fazer Pedido
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-20 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Pronto para começar?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Junte-se aos milhares de eventos que já usam o Fila Zero para
                        revolucionar a experiência de pedidos.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/registro"
                            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Criar Conta Grátis
                        </Link>
                        <Link
                            to="/contato"
                            className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Falar com Vendas
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">FZ</span>
                                </div>
                                <span className="text-xl font-bold">Fila Zero</span>
                            </div>
                            <p className="text-gray-400">
                                O futuro dos pedidos em eventos está aqui.
                            </p>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Produto</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="/features" className="hover:text-white">Recursos</Link></li>
                                <li><Link to="/precos" className="hover:text-white">Preços</Link></li>
                                <li><Link to="/demo" className="hover:text-white">Demo</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Suporte</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="/ajuda" className="hover:text-white">Central de Ajuda</Link></li>
                                <li><Link to="/contato" className="hover:text-white">Contato</Link></li>
                                <li><Link to="/status" className="hover:text-white">Status</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="/privacidade" className="hover:text-white">Privacidade</Link></li>
                                <li><Link to="/termos" className="hover:text-white">Termos</Link></li>
                                <li><Link to="/cookies" className="hover:text-white">Cookies</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 Fila Zero. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;