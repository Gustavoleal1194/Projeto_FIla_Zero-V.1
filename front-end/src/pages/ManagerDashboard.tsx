import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    Settings,
    Palette,
    ChefHat,
    Users,
    Calendar,
    MapPin,
    Clock,
    LogOut,
    Menu,
    X,
    Bell,
    TrendingUp,
    Package,
    CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const ManagerDashboard: React.FC = () => {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        toast.success('Logout realizado com sucesso!');
        navigate('/manager/login');
    };

    const menuItems = [
        {
            id: 'evento',
            title: 'Dados do Evento',
            description: 'Configure informações básicas',
            icon: Settings,
            color: 'bg-blue-500',
            href: '/manager/evento'
        },
        {
            id: 'marca',
            title: 'Personalização',
            description: 'Logos, cores e identidade visual',
            icon: Palette,
            color: 'bg-purple-500',
            href: '/manager/marca'
        },
        {
            id: 'kds',
            title: 'Kitchen Display',
            description: 'Monitore pedidos da cozinha',
            icon: ChefHat,
            color: 'bg-orange-500',
            href: '/manager/kds'
        }
    ];

    const stats = [
        {
            title: 'Pedidos Hoje',
            value: '24',
            change: '+12%',
            icon: Package,
            color: 'text-blue-600'
        },
        {
            title: 'Tempo Médio',
            value: '12min',
            change: '-3min',
            icon: Clock,
            color: 'text-green-600'
        },
        {
            title: 'Taxa de Sucesso',
            value: '98%',
            change: '+2%',
            icon: CheckCircle,
            color: 'text-purple-600'
        },
        {
            title: 'Clientes Ativos',
            value: '156',
            change: '+8%',
            icon: Users,
            color: 'text-orange-600'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                        <div className="flex-shrink-0 flex items-center px-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Settings className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-3">
                                    <h1 className="text-lg font-semibold text-gray-900">Gestor</h1>
                                    <p className="text-sm text-gray-500">Área Administrativa</p>
                                </div>
                            </div>
                        </div>
                        <nav className="mt-5 px-2 space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.href)}
                                    className="w-full group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                >
                                    <item.icon className="mr-4 h-6 w-6" />
                                    {item.title}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
                    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
                        <div className="flex items-center flex-shrink-0 px-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-600 rounded-lg">
                                    <Settings className="w-6 h-6 text-white" />
                                </div>
                                <div className="ml-3">
                                    <h1 className="text-lg font-semibold text-gray-900">Gestor</h1>
                                    <p className="text-sm text-gray-500">Área Administrativa</p>
                                </div>
                            </div>
                        </div>
                        <nav className="mt-5 flex-1 px-2 space-y-1">
                            {menuItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.href)}
                                    className="w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                >
                                    <item.icon className="mr-3 h-5 w-5" />
                                    {item.title}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                        <button
                            onClick={handleLogout}
                            className="flex-shrink-0 w-full group block"
                        >
                            <div className="flex items-center">
                                <div>
                                    <LogOut className="inline-block h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                        Sair
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64 flex flex-col flex-1">
                {/* Top bar */}
                <div className="sticky top-0 z-10 lg:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex-1">
                    {/* Header */}
                    <div className="bg-white shadow">
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="py-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Dashboard do Gestor
                                        </h1>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Bem-vindo, {usuario?.nome || 'Gestor'}! Gerencie seu evento de forma eficiente.
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <button className="p-2 text-gray-400 hover:text-gray-600">
                                            <Bell className="w-5 h-5" />
                                        </button>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">
                                                    {usuario?.nome?.charAt(0) || 'G'}
                                                </span>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">
                                                {usuario?.nome || 'Gestor'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-4 sm:px-6 lg:px-8 py-8">
                        {/* Event Info */}
                        {usuario?.eventoVinculado && (
                            <div className="bg-white rounded-lg shadow p-6 mb-8">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    Informações do Evento
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Nome</p>
                                            <p className="text-lg text-gray-900">{usuario.eventoVinculado.nome}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Local</p>
                                            <p className="text-lg text-gray-900">{usuario.eventoVinculado.endereco}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-purple-600" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Data</p>
                                            <p className="text-lg text-gray-900">{usuario.eventoVinculado.dataInicio}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white rounded-lg shadow p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    {stat.title}
                                                </dt>
                                                <dd className="flex items-baseline">
                                                    <div className="text-2xl font-semibold text-gray-900">
                                                        {stat.value}
                                                    </div>
                                                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                                                        <TrendingUp className="self-center flex-shrink-0 h-4 w-4 text-green-500" />
                                                        <span className="sr-only">Increased by</span>
                                                        {stat.change}
                                                    </div>
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Ações Rápidas
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {menuItems.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => navigate(item.href)}
                                            className="group relative bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                                        >
                                            <div>
                                                <span className={`rounded-lg inline-flex p-3 ${item.color} text-white`}>
                                                    <item.icon className="h-6 w-6" />
                                                </span>
                                            </div>
                                            <div className="mt-4">
                                                <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-2 text-sm text-gray-500">
                                                    {item.description}
                                                </p>
                                            </div>
                                            <span
                                                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                                                aria-hidden="true"
                                            >
                                                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                                                </svg>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
