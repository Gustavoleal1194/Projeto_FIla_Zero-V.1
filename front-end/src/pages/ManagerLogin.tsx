import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    User,
    Lock,
    Eye,
    EyeOff,
    Building2,
    Calendar,
    ChefHat,
    Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManagerLogin: React.FC = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        eventoId: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { loginManager } = useAuth();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simular login do gestor
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Para demonstração, aceitar qualquer email/password
            if (formData.email && formData.password) {
                const managerData = {
                    id: 'manager_001',
                    nome: 'Gestor do Evento',
                    email: formData.email,
                    tipo: 'manager',
                    eventoId: formData.eventoId || 'EVENTO_DEMO',
                    evento: {
                        id: formData.eventoId || 'EVENTO_DEMO',
                        nome: 'Festa de Aniversário',
                        data: '2024-12-25',
                        local: 'Salão de Festas Central',
                        tema: 'Festa Neon',
                        corPrimaria: '#FF6B6B',
                        corSecundaria: '#4ECDC4',
                        logo: null
                    }
                };

                loginManager(managerData);
                toast.success('Login realizado com sucesso!');
                navigate('/manager/dashboard');
            } else {
                toast.error('Preencha todos os campos');
            }
        } catch (error) {
            toast.error('Erro ao fazer login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-600 rounded-full">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Área do Gestor
                    </h1>
                    <p className="text-gray-600">
                        Acesse sua conta para gerenciar seu evento
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email do Gestor
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Senha
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="Sua senha"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Evento ID */}
                        <div>
                            <label htmlFor="eventoId" className="block text-sm font-medium text-gray-700 mb-2">
                                ID do Evento (Opcional)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Calendar className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="eventoId"
                                    name="eventoId"
                                    type="text"
                                    value={formData.eventoId}
                                    onChange={handleInputChange}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    placeholder="EVENTO_123 (deixe vazio para demo)"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Entrando...
                                </div>
                            ) : (
                                'Entrar na Área do Gestor'
                            )}
                        </button>
                    </form>

                    {/* Demo Info */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">
                            🎯 Modo Demonstração
                        </h3>
                        <p className="text-xs text-blue-700">
                            Use qualquer email e senha para testar a área do gestor.
                            O sistema criará dados de demonstração automaticamente.
                        </p>
                    </div>
                </div>

                {/* Features Preview */}
                <div className="mt-8 grid grid-cols-1 gap-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Settings className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Gerenciamento do Evento</h3>
                                <p className="text-sm text-gray-600">Configure dados, horários e informações</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Building2 className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Personalização de Marca</h3>
                                <p className="text-sm text-gray-600">Upload de logos, cores e assets</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <ChefHat className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Kitchen Display System</h3>
                                <p className="text-sm text-gray-600">Monitore pedidos em tempo real</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        ← Voltar para página inicial
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ManagerLogin;
