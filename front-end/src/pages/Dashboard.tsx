import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import {
    Plus,
    Users,
    ShoppingCart,
    Package,
    TrendingUp,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Settings,
    LogOut,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { usuario, logout, isAuthenticated } = useAuth();
    const [eventos, setEventos] = useState<any[]>([]);

    // Redirecionar se não estiver logado
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/client-login');
            return;
        }

        if (usuario?.tipo !== 'Gestor') {
            navigate('/');
            return;
        }
    }, [isAuthenticated, usuario, navigate]);

    // Buscar eventos do gestor
    const { data: eventosData, isLoading: eventosLoading, refetch: refetchEventos } = useQuery(
        ['eventos-gestor'],
        () => apiService.getMeusEventos(),
        {
            enabled: isAuthenticated && usuario?.tipo === 'Gestor'
        }
    );

    useEffect(() => {
        if (eventosData) {
            setEventos(eventosData);
        }
    }, [eventosData]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleCriarEvento = () => {
        navigate('/eventos/novo');
    };

    const handleVerEvento = (eventoId: string) => {
        navigate(`/eventos/${eventoId}`);
    };

    const handleEditarEvento = (eventoId: string) => {
        navigate(`/eventos/${eventoId}/editar`);
    };

    const handleKDS = (eventoId: string) => {
        navigate(`/kds/${eventoId}`);
    };

    if (!isAuthenticated || usuario?.tipo !== 'Gestor') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-600">
                                Olá, {usuario?.nome}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Sair</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Eventos Ativos</p>
                                <p className="text-2xl font-bold text-gray-900">{eventos.filter(e => e.ativo).length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <ShoppingCart className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Pedidos Hoje</p>
                                <p className="text-2xl font-bold text-gray-900">0</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Package className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Produtos</p>
                                <p className="text-2xl font-bold text-gray-900">0</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Receita Hoje</p>
                                <p className="text-2xl font-bold text-gray-900">R$ 0,00</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ações Rápidas */}
                <div className="bg-white rounded-lg shadow mb-8">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Ações Rápidas</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button
                                onClick={handleCriarEvento}
                                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Plus className="h-6 w-6 text-blue-600" />
                                <div className="text-left">
                                    <h3 className="font-medium text-gray-900">Criar Evento</h3>
                                    <p className="text-sm text-gray-600">Novo evento</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/eventos')}
                                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Calendar className="h-6 w-6 text-green-600" />
                                <div className="text-left">
                                    <h3 className="font-medium text-gray-900">Gerenciar Eventos</h3>
                                    <p className="text-sm text-gray-600">Ver todos os eventos</p>
                                </div>
                            </button>

                            <button
                                onClick={() => navigate('/pedidos')}
                                className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <ShoppingCart className="h-6 w-6 text-yellow-600" />
                                <div className="text-left">
                                    <h3 className="font-medium text-gray-900">Pedidos</h3>
                                    <p className="text-sm text-gray-600">Gerenciar pedidos</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Lista de Eventos */}
                <div className="bg-white rounded-lg shadow">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-medium text-gray-900">Meus Eventos</h2>
                    </div>
                    <div className="p-6">
                        {eventosLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Carregando eventos...</p>
                            </div>
                        ) : eventos.length === 0 ? (
                            <div className="text-center py-8">
                                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum evento encontrado</h3>
                                <p className="text-gray-600 mb-4">Comece criando seu primeiro evento</p>
                                <button
                                    onClick={handleCriarEvento}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Criar Evento
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {eventos.map((evento) => (
                                    <div key={evento.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">{evento.nome}</h3>
                                                <p className="text-sm text-gray-600 mb-2">{evento.descricao}</p>
                                                <div className="flex items-center text-sm text-gray-500 space-x-4">
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 mr-1" />
                                                        {evento.cidade}, {evento.estado}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Calendar className="h-4 w-4 mr-1" />
                                                        {new Date(evento.dataInicio).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 text-xs rounded-full ${evento.ativo
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {evento.ativo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleVerEvento(evento.id)}
                                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span>Ver</span>
                                            </button>
                                            <button
                                                onClick={() => handleEditarEvento(evento.id)}
                                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span>Editar</span>
                                            </button>
                                            <button
                                                onClick={() => handleKDS(evento.id)}
                                                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 text-sm text-green-600 border border-green-600 rounded-lg hover:bg-green-50"
                                            >
                                                <Package className="h-4 w-4" />
                                                <span>KDS</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
