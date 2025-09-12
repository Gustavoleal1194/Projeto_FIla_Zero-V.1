import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, User, LogOut, Home, Menu as MenuIcon, X, ArrowLeft } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { usuario, logout, isAuthenticated } = useAuth();
    const { getTotalItems } = useCart();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-lg sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">FZ</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">Fila Zero</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link
                                to="/"
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')
                                    ? 'text-blue-600 bg-blue-50'
                                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                    }`}
                            >
                                Início
                            </Link>

                            {isAuthenticated && (
                                <>
                                    <Link
                                        to="/dashboard"
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/pedidos"
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/pedidos')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        Pedidos
                                    </Link>
                                    <Link
                                        to="/kds"
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/kds')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        KDS
                                    </Link>
                                </>
                            )}
                        </nav>

                        {/* Right side */}
                        <div className="flex items-center space-x-4">
                            {/* Cart */}
                            <Link
                                to="/carrinho"
                                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </Link>

                            {/* User Menu */}
                            {isAuthenticated ? (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                                    >
                                        <User className="w-6 h-6" />
                                        <span className="hidden sm:block">{usuario?.nome}</span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-2xl py-1 z-[99999] border border-gray-200 ring-1 ring-black ring-opacity-5" style={{ position: 'fixed', top: '80px', right: '16px' }}>
                                            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                                <div className="font-medium">{usuario?.nome}</div>
                                                <div className="text-gray-500">{usuario?.email}</div>
                                            </div>

                                            <Link
                                                to="/demo-login"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                <ArrowLeft className="w-4 h-4 mr-2" />
                                                Voltar aos Eventos
                                            </Link>
                                            <Link
                                                to="/"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                <Home className="w-4 h-4 mr-2" />
                                                Página Inicial
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Sair
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    to="/login"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Entrar
                                </Link>
                            )}

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden border-t border-gray-200 py-4">
                            <nav className="flex flex-col space-y-2">
                                <Link
                                    to="/"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Início
                                </Link>

                                {isAuthenticated && (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/dashboard')
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/pedidos"
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/pedidos')
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Pedidos
                                        </Link>
                                        <Link
                                            to="/kds"
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/kds')
                                                ? 'text-blue-600 bg-blue-50'
                                                : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                                }`}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            KDS
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    )}
                </div>
            </header>

            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;
