import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent } from '../contexts/EventContext';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
    ShoppingCart,
    Menu,
    Clock,
    MapPin,
    Phone,
    Mail,
    ArrowLeft,
    Users
} from 'lucide-react';

const EventoPage: React.FC = () => {
    const { eventoId } = useParams<{ eventoId: string }>();
    const navigate = useNavigate();
    const { eventoAtual, loading, error, carregarEvento } = useEvent();
    const { tema } = useTheme();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (eventoId) {
            carregarEvento(eventoId);
        }
    }, [eventoId, carregarEvento]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto mb-4"
                        style={{ borderColor: tema.corPrimaria }}></div>
                    <p className="text-gray-600">Carregando evento...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Erro ao carregar evento</h1>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: tema.corPrimaria }}
                    >
                        Voltar ao início
                    </button>
                </div>
            </div>
        );
    }

    if (!eventoAtual) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">📋</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Evento não encontrado</h1>
                    <p className="text-gray-600 mb-4">O evento que você está procurando não existe.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-2 rounded-lg text-white font-medium"
                        style={{ backgroundColor: tema.corPrimaria }}
                    >
                        Voltar ao início
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header do Evento */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => navigate('/')}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5 text-gray-600" />
                            </button>

                            {eventoAtual.logoUrl && (
                                <img
                                    src={eventoAtual.logoUrl}
                                    alt={eventoAtual.nome}
                                    className="h-10 w-10 rounded-lg object-cover"
                                />
                            )}

                            <div>
                                <h1 className="text-xl font-bold text-gray-900">{eventoAtual.nome}</h1>
                                <p className="text-sm text-gray-500">{eventoAtual.cidade}, {eventoAtual.estado}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            {isAuthenticated && (
                                <button
                                    onClick={() => navigate(`/evento/${eventoId}/pedidos`)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white font-medium"
                                    style={{ backgroundColor: tema.corSecundaria }}
                                >
                                    <Clock className="h-4 w-4" />
                                    <span>Meus Pedidos</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Conteúdo Principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Informações do Evento */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                            <div>
                                <h3 className="font-medium text-gray-900">Endereço</h3>
                                <p className="text-sm text-gray-600">{eventoAtual.endereco}</p>
                                <p className="text-sm text-gray-600">{eventoAtual.cep}</p>
                            </div>
                        </div>

                        {eventoAtual.telefone && (
                            <div className="flex items-start space-x-3">
                                <Phone className="h-5 w-5 text-gray-400 mt-1" />
                                <div>
                                    <h3 className="font-medium text-gray-900">Telefone</h3>
                                    <p className="text-sm text-gray-600">{eventoAtual.telefone}</p>
                                </div>
                            </div>
                        )}

                        {eventoAtual.email && (
                            <div className="flex items-start space-x-3">
                                <Mail className="h-5 w-5 text-gray-400 mt-1" />
                                <div>
                                    <h3 className="font-medium text-gray-900">Email</h3>
                                    <p className="text-sm text-gray-600">{eventoAtual.email}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {eventoAtual.descricao && (
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h3 className="font-medium text-gray-900 mb-2">Sobre o evento</h3>
                            <p className="text-sm text-gray-600">{eventoAtual.descricao}</p>
                        </div>
                    )}
                </div>

                {/* Ações Principais */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Cardápio */}
                    <button
                        onClick={() => navigate(`/evento/${eventoId}/menu`)}
                        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left group"
                    >
                        <div className="flex items-center space-x-4">
                            <div
                                className="p-3 rounded-lg"
                                style={{ backgroundColor: tema.corPrimaria + '20' }}
                            >
                                <Menu className="h-6 w-6" style={{ color: tema.corPrimaria }} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                                    Ver Cardápio
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Explore nossos produtos e faça seu pedido
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Carrinho */}
                    <button
                        onClick={() => navigate(`/evento/${eventoId}/carrinho`)}
                        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left group"
                    >
                        <div className="flex items-center space-x-4">
                            <div
                                className="p-3 rounded-lg"
                                style={{ backgroundColor: tema.corSecundaria + '20' }}
                            >
                                <ShoppingCart className="h-6 w-6" style={{ color: tema.corSecundaria }} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                                    Meu Carrinho
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Revise seus itens antes de finalizar
                                </p>
                            </div>
                        </div>
                    </button>

                    {/* Pedidos (apenas se autenticado) */}
                    {isAuthenticated && (
                        <button
                            onClick={() => navigate(`/evento/${eventoId}/pedidos`)}
                            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow text-left group"
                        >
                            <div className="flex items-center space-x-4">
                                <div
                                    className="p-3 rounded-lg"
                                    style={{ backgroundColor: tema.corPrimaria + '20' }}
                                >
                                    <Clock className="h-6 w-6" style={{ color: tema.corPrimaria }} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">
                                        Meus Pedidos
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Acompanhe seus pedidos em tempo real
                                    </p>
                                </div>
                            </div>
                        </button>
                    )}
                </div>

                {/* Status do Evento */}
                <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: eventoAtual.ativo ? '#10B981' : '#EF4444' }}
                            ></div>
                            <span className="font-medium text-gray-900">
                                {eventoAtual.ativo ? 'Evento ativo' : 'Evento inativo'}
                            </span>
                        </div>

                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Users className="h-4 w-4" />
                            <span>Online agora</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventoPage;
