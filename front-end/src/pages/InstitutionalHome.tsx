import React from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Clock,
    Smartphone,
    BarChart3,
    Shield,
    Zap,
    Star,
    Play
} from 'lucide-react';

const InstitutionalHome: React.FC = () => {
    const features = [
        {
            icon: <Zap className="w-8 h-8 text-blue-600" />,
            title: "Acesso Instantâneo",
            description: "QR Code na pulseira = acesso imediato ao cardápio. Zero instalação, zero espera."
        },
        {
            icon: <Clock className="w-8 h-8 text-green-600" />,
            title: "Elimine as Filas",
            description: "Pedidos direto do celular. Notificação quando estiver pronto. Tempo de espera reduzido em 70%."
        },
        {
            icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
            title: "Aumente sua Receita",
            description: "Cardápio digital com fotos, descrições e preços. Ticket médio 40% maior."
        },
        {
            icon: <Shield className="w-8 h-8 text-red-600" />,
            title: "Pagamento Seguro",
            description: "PIX, cartão ou dinheiro. Transações criptografadas e auditadas."
        },
        {
            icon: <Users className="w-8 h-8 text-orange-600" />,
            title: "Gestão Inteligente",
            description: "KDS para cozinha, relatórios em tempo real, controle de estoque."
        },
        {
            icon: <Smartphone className="w-8 h-8 text-indigo-600" />,
            title: "PWA Avançada",
            description: "Funciona offline, notificações push, experiência nativa no celular."
        }
    ];

    const stats = [
        { number: "70%", label: "Redução no tempo de espera" },
        { number: "40%", label: "Aumento no ticket médio" },
        { number: "95%", label: "Satisfação do cliente" },
        { number: "24/7", label: "Suporte técnico" }
    ];

    const testimonials = [
        {
            name: "Maria Silva",
            role: "Organizadora de Eventos",
            content: "O FilaZero revolucionou nossos eventos. Os clientes adoram a praticidade e nossa receita aumentou 45%.",
            rating: 5
        },
        {
            name: "João Santos",
            role: "Gestor de Festa",
            content: "Sistema incrível! Eliminamos as filas e conseguimos atender muito mais pessoas com a mesma equipe.",
            rating: 5
        },
        {
            name: "Ana Costa",
            role: "Produtora de Eventos",
            content: "Interface intuitiva, suporte excelente. Nossos eventos agora são muito mais eficientes.",
            rating: 5
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-2xl font-bold text-blue-600">FilaZero</h1>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/demo"
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Demo
                            </Link>
                            <Link
                                to="/manager/login"
                                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Área do Gestor
                            </Link>
                            <Link
                                to="/contato"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                            >
                                Contato
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Elimine as Filas,<br />
                            <span className="text-yellow-300">Maximize a Receita</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100">
                            Sistema completo para eventos: QR Code, pedidos digitais, pagamentos e gestão inteligente.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/demo"
                                className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center"
                            >
                                <Play className="w-5 h-5 mr-2" />
                                Ver Demo
                            </Link>
                            <Link
                                to="/login"
                                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                            >
                                Acessar Evento
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Por que escolher o FilaZero?
                        </h2>
                        <p className="text-xl text-gray-600">
                            Tecnologia avançada para eventos de sucesso
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
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

            {/* How It Works Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Como Funciona
                        </h2>
                        <p className="text-xl text-gray-600">
                            Simples, rápido e eficiente
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-blue-600">1</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Configure seu Evento
                            </h3>
                            <p className="text-gray-600">
                                Cadastre produtos, preços e configure o tema personalizado do seu evento.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-green-600">2</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Distribua as Pulseiras
                            </h3>
                            <p className="text-gray-600">
                                Cada pulseira tem um QR Code único que dá acesso instantâneo ao cardápio.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-purple-600">3</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Monitore em Tempo Real
                            </h3>
                            <p className="text-gray-600">
                                Acompanhe pedidos, receita e performance através do KDS e relatórios.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            O que nossos clientes dizem
                        </h2>
                        <p className="text-xl text-gray-600">
                            Depoimentos de quem já usa o FilaZero
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                                <div className="flex items-center mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Pronto para revolucionar seus eventos?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100">
                        Entre em contato e descubra como o FilaZero pode transformar seu negócio.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/contato"
                            className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-colors"
                        >
                            Solicitar Orçamento
                        </Link>
                        <Link
                            to="/manager/login"
                            className="bg-green-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors"
                        >
                            Área do Gestor
                        </Link>
                        <Link
                            to="/login"
                            className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                        >
                            Acessar Evento
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">FilaZero</h3>
                            <p className="text-gray-400">
                                Sistema completo para gestão de eventos e eliminação de filas.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Produto</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="/demo" className="hover:text-white">Demo</Link></li>
                                <li><Link to="/login" className="hover:text-white">Acessar Evento</Link></li>
                                <li><Link to="/manager/login" className="hover:text-white">Área do Gestor</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Suporte</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="/ajuda" className="hover:text-white">Central de Ajuda</Link></li>
                                <li><Link to="/contato" className="hover:text-white">Contato</Link></li>
                                <li><Link to="/status" className="hover:text-white">Status do Sistema</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Empresa</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><Link to="/sobre" className="hover:text-white">Sobre Nós</Link></li>
                                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                                <li><Link to="/carreiras" className="hover:text-white">Carreiras</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2024 FilaZero. Todos os direitos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default InstitutionalHome;
