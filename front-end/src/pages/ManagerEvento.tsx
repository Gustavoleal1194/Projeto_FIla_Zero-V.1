import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    ArrowLeft,
    Save,
    Calendar,
    MapPin,
    Users,
    Phone,
    Settings,
    CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManagerEvento: React.FC = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nome: usuario?.eventoVinculado?.nome || 'Festa de Aniversário',
        descricao: 'Uma festa incrível para celebrar!',
        data: usuario?.eventoVinculado?.dataInicio || '2024-12-25',
        horaInicio: '19:00',
        horaFim: '02:00',
        local: usuario?.eventoVinculado?.endereco || 'Salão de Festas Central',
        endereco: 'Rua das Flores, 123 - Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        telefone: '(11) 99999-9999',
        email: usuario?.email || 'contato@festa.com',
        site: 'https://www.festa.com',
        capacidade: '200',
        tipoEvento: 'aniversario',
        faixaEtaria: 'todas',
        dressCode: 'casual',
        observacoes: 'Estacionamento gratuito disponível'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
            // Simular salvamento
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Dados do evento salvos com sucesso!');
        } catch (error) {
            toast.error('Erro ao salvar dados do evento');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => navigate('/manager/dashboard')}
                                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Dados do Evento
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Configure as informações básicas do seu evento
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Salvar Alterações
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Informações Básicas */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <Settings className="w-5 h-5 mr-2 text-blue-600" />
                                Informações Básicas
                            </h2>
                        </div>
                        <div className="px-6 py-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome do Evento *
                                    </label>
                                    <input
                                        type="text"
                                        name="nome"
                                        id="nome"
                                        required
                                        value={formData.nome}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ex: Festa de Aniversário"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="tipoEvento" className="block text-sm font-medium text-gray-700 mb-2">
                                        Tipo de Evento *
                                    </label>
                                    <select
                                        name="tipoEvento"
                                        id="tipoEvento"
                                        value={formData.tipoEvento}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="aniversario">Aniversário</option>
                                        <option value="casamento">Casamento</option>
                                        <option value="formatura">Formatura</option>
                                        <option value="corporativo">Corporativo</option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-2">
                                    Descrição do Evento
                                </label>
                                <textarea
                                    name="descricao"
                                    id="descricao"
                                    rows={3}
                                    value={formData.descricao}
                                    onChange={handleInputChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Descreva seu evento..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data e Horário */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                                Data e Horário
                            </h2>
                        </div>
                        <div className="px-6 py-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-2">
                                        Data do Evento *
                                    </label>
                                    <input
                                        type="date"
                                        name="data"
                                        id="data"
                                        required
                                        value={formData.data}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="horaInicio" className="block text-sm font-medium text-gray-700 mb-2">
                                        Hora de Início *
                                    </label>
                                    <input
                                        type="time"
                                        name="horaInicio"
                                        id="horaInicio"
                                        required
                                        value={formData.horaInicio}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="horaFim" className="block text-sm font-medium text-gray-700 mb-2">
                                        Hora de Término *
                                    </label>
                                    <input
                                        type="time"
                                        name="horaFim"
                                        id="horaFim"
                                        required
                                        value={formData.horaFim}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Localização */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-red-600" />
                                Localização
                            </h2>
                        </div>
                        <div className="px-6 py-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="local" className="block text-sm font-medium text-gray-700 mb-2">
                                        Nome do Local *
                                    </label>
                                    <input
                                        type="text"
                                        name="local"
                                        id="local"
                                        required
                                        value={formData.local}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ex: Salão de Festas Central"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="capacidade" className="block text-sm font-medium text-gray-700 mb-2">
                                        Capacidade *
                                    </label>
                                    <input
                                        type="number"
                                        name="capacidade"
                                        id="capacidade"
                                        required
                                        value={formData.capacidade}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="200"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="endereco" className="block text-sm font-medium text-gray-700 mb-2">
                                    Endereço Completo *
                                </label>
                                <input
                                    type="text"
                                    name="endereco"
                                    id="endereco"
                                    required
                                    value={formData.endereco}
                                    onChange={handleInputChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Rua, número, bairro"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                                        Cidade *
                                    </label>
                                    <input
                                        type="text"
                                        name="cidade"
                                        id="cidade"
                                        required
                                        value={formData.cidade}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="São Paulo"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                                        Estado *
                                    </label>
                                    <input
                                        type="text"
                                        name="estado"
                                        id="estado"
                                        required
                                        value={formData.estado}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="SP"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
                                        CEP *
                                    </label>
                                    <input
                                        type="text"
                                        name="cep"
                                        id="cep"
                                        required
                                        value={formData.cep}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="01234-567"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contato */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <Phone className="w-5 h-5 mr-2 text-purple-600" />
                                Informações de Contato
                            </h2>
                        </div>
                        <div className="px-6 py-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Telefone *
                                    </label>
                                    <input
                                        type="tel"
                                        name="telefone"
                                        id="telefone"
                                        required
                                        value={formData.telefone}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="(11) 99999-9999"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="contato@festa.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-2">
                                    Site (Opcional)
                                </label>
                                <input
                                    type="url"
                                    name="site"
                                    id="site"
                                    value={formData.site}
                                    onChange={handleInputChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="https://www.festa.com"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Configurações Adicionais */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <Users className="w-5 h-5 mr-2 text-orange-600" />
                                Configurações Adicionais
                            </h2>
                        </div>
                        <div className="px-6 py-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="faixaEtaria" className="block text-sm font-medium text-gray-700 mb-2">
                                        Faixa Etária
                                    </label>
                                    <select
                                        name="faixaEtaria"
                                        id="faixaEtaria"
                                        value={formData.faixaEtaria}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="todas">Todas as idades</option>
                                        <option value="criancas">Crianças (0-12 anos)</option>
                                        <option value="adolescentes">Adolescentes (13-17 anos)</option>
                                        <option value="adultos">Adultos (18+ anos)</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="dressCode" className="block text-sm font-medium text-gray-700 mb-2">
                                        Dress Code
                                    </label>
                                    <select
                                        name="dressCode"
                                        id="dressCode"
                                        value={formData.dressCode}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="casual">Casual</option>
                                        <option value="esporte">Esporte</option>
                                        <option value="elegante">Elegante</option>
                                        <option value="formal">Formal</option>
                                        <option value="fantasia">Fantasia</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-2">
                                    Observações Adicionais
                                </label>
                                <textarea
                                    name="observacoes"
                                    id="observacoes"
                                    rows={4}
                                    value={formData.observacoes}
                                    onChange={handleInputChange}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Informações importantes para os convidados..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Salvando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Salvar Dados do Evento
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ManagerEvento;
