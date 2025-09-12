import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useQuery } from '@tanstack/react-query';
import {
    Calendar,
    MapPin,
    Star,
    CheckCircle,
    Clock,
    Users,
    ShoppingBag,
    Menu
} from 'lucide-react';
import toast from 'react-hot-toast';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated, usuario } = useAuth();

    const { data: eventos, isLoading: eventosLoading } = useQuery({
        queryKey: ['eventos'],
        queryFn: () => apiService.getEventos(),
        enabled: isAuthenticated
    });

    const [selectedEvento, setSelectedEvento] = React.useState<string>('');

    const handleEventoSelect = (eventoId: string) => {
        setSelectedEvento(eventoId);
        navigate(`/evento/${eventoId}`);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Acesso Negado
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Você precisa estar logado para acessar esta página.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Fazer Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Bem-vindo, {usuario?.nome}!
                    </h1>
                    <p className="text-gray-600">
                        Escolha um evento para começar a fazer pedidos.
                    </p>
                </div>

                {eventosLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {eventos?.map((evento) => (
                            <div
                                key={evento.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => handleEventoSelect(evento.id)}
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {evento.nome}
                                        </h3>
                                        <div className="flex items-center text-yellow-500">
                                            <Star className="w-5 h-5 fill-current" />
                                            <span className="ml-1 text-sm font-medium">4.8</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-4 line-clamp-2">
                                        {evento.descricao}
                                    </p>
                                    
                                    <div className="space-y-2">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            {new Date(evento.dataInicio).toLocaleDateString('pt-BR')}
                                        </div>
                                        
                                        <div className="flex items-center text-sm text-gray-500">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {evento.endereco}
                                        </div>
                                        
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock className="w-4 h-4 mr-2" />
                                            {evento.dataInicio} - {evento.dataFim}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-sm text-gray-500">
                                                <Users className="w-4 h-4 mr-1" />
                                                <span>Capacidade: 200</span>
                                            </div>
                                            <div className="flex items-center text-sm text-green-600">
                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                <span>Ativo</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {eventos?.length === 0 && !eventosLoading && (
                    <div className="text-center py-12">
                        <Menu className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Nenhum evento encontrado
                        </h3>
                        <p className="text-gray-500">
                            Não há eventos disponíveis no momento.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
