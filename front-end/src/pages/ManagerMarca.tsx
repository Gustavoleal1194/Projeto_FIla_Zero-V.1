import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    ArrowLeft,
    Save,
    Palette,
    Image,
    Eye,
    CheckCircle,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManagerMarca: React.FC = () => {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [formData, setFormData] = useState({
        nomeEvento: usuario?.eventoVinculado?.nome || 'Festa de Aniversário',
        corPrimaria: usuario?.eventoVinculado?.corPrimaria || '#FF6B6B',
        corSecundaria: usuario?.eventoVinculado?.corSecundaria || '#4ECDC4',
        corAccent: '#FFE66D',
        corTexto: '#2C3E50',
        corFundo: '#FFFFFF',
        logo: null as File | null,
        logoPreview: usuario?.eventoVinculado?.logoUrl || null,
        banner: null as File | null,
        bannerPreview: null as string | null,
        icone: null as File | null,
        iconePreview: null as string | null,
        fonte: 'Inter',
        tema: 'moderno'
    });

    const fontes = [
        'Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins',
        'Montserrat', 'Nunito', 'Source Sans Pro', 'Raleway'
    ];

    const temas = [
        { id: 'moderno', nome: 'Moderno', descricao: 'Design limpo e minimalista' },
        { id: 'elegante', nome: 'Elegante', descricao: 'Estilo sofisticado e clássico' },
        { id: 'divertido', nome: 'Divertido', descricao: 'Cores vibrantes e formas arredondadas' },
        { id: 'vintage', nome: 'Vintage', descricao: 'Estilo retrô e nostálgico' },
        { id: 'futurista', nome: 'Futurista', descricao: 'Design tecnológico e inovador' }
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner' | 'icone') => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB
                toast.error('Arquivo muito grande. Máximo 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setFormData(prev => ({
                    ...prev,
                    [type]: file,
                    [`${type}Preview`]: result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFile = (type: 'logo' | 'banner' | 'icone') => {
        setFormData(prev => ({
            ...prev,
            [type]: null,
            [`${type}Preview`]: null
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simular salvamento
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Personalização de marca salva com sucesso!');
        } catch (error) {
            toast.error('Erro ao salvar personalização');
        } finally {
            setIsLoading(false);
        }
    };

    const PreviewCard = () => (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <div className="text-center mb-6">
                {formData.logoPreview ? (
                    <img
                        src={formData.logoPreview}
                        alt="Logo"
                        className="h-16 mx-auto mb-4 object-contain"
                    />
                ) : (
                    <div className="h-16 w-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Image className="w-8 h-8 text-gray-400" />
                    </div>
                )}
                <h2
                    className="text-2xl font-bold"
                    style={{ color: formData.corTexto }}
                >
                    {formData.nomeEvento}
                </h2>
            </div>

            <div className="space-y-4">
                <div
                    className="p-4 rounded-lg"
                    style={{
                        backgroundColor: formData.corPrimaria,
                        color: formData.corFundo
                    }}
                >
                    <h3 className="font-semibold">Card Principal</h3>
                    <p className="text-sm opacity-90">Exemplo de card com cor primária</p>
                </div>

                <div
                    className="p-4 rounded-lg"
                    style={{
                        backgroundColor: formData.corSecundaria,
                        color: formData.corTexto
                    }}
                >
                    <h3 className="font-semibold">Card Secundário</h3>
                    <p className="text-sm opacity-90">Exemplo de card com cor secundária</p>
                </div>

                <div
                    className="p-4 rounded-lg border-2"
                    style={{
                        borderColor: formData.corAccent,
                        color: formData.corTexto
                    }}
                >
                    <h3 className="font-semibold">Card com Accent</h3>
                    <p className="text-sm opacity-90">Exemplo de card com cor de destaque</p>
                </div>
            </div>
        </div>
    );

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
                                        Personalização de Marca
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Customize a identidade visual do seu evento
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setPreviewMode(!previewMode)}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    {previewMode ? 'Editar' : 'Visualizar'}
                                </button>
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
                                            Salvar Marca
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {previewMode ? (
                    <PreviewCard />
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Cores */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <Palette className="w-5 h-5 mr-2 text-purple-600" />
                                    Paleta de Cores
                                </h2>
                            </div>
                            <div className="px-6 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <label htmlFor="corPrimaria" className="block text-sm font-medium text-gray-700 mb-2">
                                            Cor Primária
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                name="corPrimaria"
                                                id="corPrimaria"
                                                value={formData.corPrimaria}
                                                onChange={handleInputChange}
                                                className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={formData.corPrimaria}
                                                onChange={handleInputChange}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="corSecundaria" className="block text-sm font-medium text-gray-700 mb-2">
                                            Cor Secundária
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                name="corSecundaria"
                                                id="corSecundaria"
                                                value={formData.corSecundaria}
                                                onChange={handleInputChange}
                                                className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={formData.corSecundaria}
                                                onChange={handleInputChange}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="corAccent" className="block text-sm font-medium text-gray-700 mb-2">
                                            Cor de Destaque
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                name="corAccent"
                                                id="corAccent"
                                                value={formData.corAccent}
                                                onChange={handleInputChange}
                                                className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={formData.corAccent}
                                                onChange={handleInputChange}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="corTexto" className="block text-sm font-medium text-gray-700 mb-2">
                                            Cor do Texto
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                name="corTexto"
                                                id="corTexto"
                                                value={formData.corTexto}
                                                onChange={handleInputChange}
                                                className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={formData.corTexto}
                                                onChange={handleInputChange}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="corFundo" className="block text-sm font-medium text-gray-700 mb-2">
                                            Cor de Fundo
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="color"
                                                name="corFundo"
                                                id="corFundo"
                                                value={formData.corFundo}
                                                onChange={handleInputChange}
                                                className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={formData.corFundo}
                                                onChange={handleInputChange}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tipografia */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900">
                                    Tipografia
                                </h2>
                            </div>
                            <div className="px-6 py-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="fonte" className="block text-sm font-medium text-gray-700 mb-2">
                                            Fonte Principal
                                        </label>
                                        <select
                                            name="fonte"
                                            id="fonte"
                                            value={formData.fonte}
                                            onChange={handleInputChange}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {fontes.map(fonte => (
                                                <option key={fonte} value={fonte} style={{ fontFamily: fonte }}>
                                                    {fonte}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="tema" className="block text-sm font-medium text-gray-700 mb-2">
                                            Tema de Design
                                        </label>
                                        <select
                                            name="tema"
                                            id="tema"
                                            value={formData.tema}
                                            onChange={handleInputChange}
                                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            {temas.map(tema => (
                                                <option key={tema.id} value={tema.id}>
                                                    {tema.nome} - {tema.descricao}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Assets */}
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                    <Image className="w-5 h-5 mr-2 text-blue-600" />
                                    Assets Visuais
                                </h2>
                            </div>
                            <div className="px-6 py-6 space-y-8">
                                {/* Logo */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Logo do Evento
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'logo')}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                PNG, JPG ou SVG. Máximo 5MB.
                                            </p>
                                        </div>
                                        {formData.logoPreview && (
                                            <div className="relative">
                                                <img
                                                    src={formData.logoPreview}
                                                    alt="Logo preview"
                                                    className="h-16 w-16 object-contain border border-gray-300 rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile('logo')}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Banner */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Banner do Evento
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'banner')}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                PNG ou JPG. Recomendado: 1200x400px. Máximo 5MB.
                                            </p>
                                        </div>
                                        {formData.bannerPreview && (
                                            <div className="relative">
                                                <img
                                                    src={formData.bannerPreview}
                                                    alt="Banner preview"
                                                    className="h-16 w-32 object-cover border border-gray-300 rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile('banner')}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Ícone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ícone do Evento
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleFileUpload(e, 'icone')}
                                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">
                                                PNG ou SVG. Recomendado: 64x64px. Máximo 1MB.
                                            </p>
                                        </div>
                                        {formData.iconePreview && (
                                            <div className="relative">
                                                <img
                                                    src={formData.iconePreview}
                                                    alt="Ícone preview"
                                                    className="h-12 w-12 object-contain border border-gray-300 rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile('icone')}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
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
                                        Salvar Personalização
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ManagerMarca;
