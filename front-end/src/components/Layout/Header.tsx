import React, { useState, useRef } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart, User, Menu, X, BarChart3, Calendar, Palette, Utensils } from 'lucide-react';
import UserDropdown from '../UserDropdown';

const Header: React.FC = () => {
    const { usuario, logout, isAuthenticated } = useAuth();
    const { getTotalItems } = useCart();
    const location = useLocation();
    const params = useParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const isActive = (path: string) => location.pathname === path;

    // Determinar o contexto da navegação
    const isManagerArea = location.pathname.startsWith('/manager');
    const isConsumerArea = location.pathname.startsWith('/evento/');
    const isPublicArea = !isManagerArea && !isConsumerArea;

    // Obter eventoId se estiver na área do consumidor
    const eventoId = params.eventoId;

    const handleLogout = () => {
        logout();
        setIsMenuOpen(false);
    };

    return (
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

                    {/* Desktop Navigation - Contextual */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {/* Navegação Pública */}
                        {isPublicArea && (
                            <>
                                <Link
                                    to="/"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Início
                                </Link>
                                <Link
                                    to="/demo"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/demo')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Demo
                                </Link>
                            </>
                        )}

                        {/* Navegação do Gestor */}
                        {isManagerArea && isAuthenticated && !location.pathname.includes('/login') && !location.pathname.includes('/register') && (
                            <>
                                <Link
                                    to="/manager/dashboard"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/manager/dashboard')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <BarChart3 className="w-4 h-4 inline mr-1" />
                                    Dashboard
                                </Link>
                                <Link
                                    to="/manager/evento"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/manager/evento')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Evento
                                </Link>
                                <Link
                                    to="/manager/marca"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/manager/marca')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Palette className="w-4 h-4 inline mr-1" />
                                    Marca
                                </Link>
                                <Link
                                    to="/manager/kds"
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/manager/kds')
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Utensils className="w-4 h-4 inline mr-1" />
                                    KDS
                                </Link>
                            </>
                        )}

                        {/* Navegação do Consumidor */}
                        {isConsumerArea && isAuthenticated && (
                            <>
                                <Link
                                    to={`/evento/${eventoId}`}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(`/evento/${eventoId}`)
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Utensils className="w-4 h-4 inline mr-1" />
                                    Cardápio
                                </Link>
                                <Link
                                    to={`/evento/${eventoId}/carrinho`}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(`/evento/${eventoId}/carrinho`)
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <ShoppingCart className="w-4 h-4 inline mr-1" />
                                    Carrinho
                                </Link>
                                <Link
                                    to={`/evento/${eventoId}/pedidos`}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(`/evento/${eventoId}/pedidos`)
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Calendar className="w-4 h-4 inline mr-1" />
                                    Pedidos
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Cart - Apenas na área do consumidor */}
                        {isConsumerArea && (
                            <Link
                                to={`/evento/${eventoId}/carrinho`}
                                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {getTotalItems() > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {getTotalItems()}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <>
                                <button
                                    ref={buttonRef}
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                                >
                                    <User className="w-6 h-6" />
                                    <span className="hidden sm:block">{usuario?.nome}</span>
                                </button>

                                <UserDropdown
                                    isOpen={isMenuOpen}
                                    onClose={() => setIsMenuOpen(false)}
                                    usuario={usuario!}
                                    isManagerArea={isManagerArea}
                                    isConsumerArea={isConsumerArea}
                                    isPublicArea={isPublicArea}
                                    eventoId={eventoId}
                                    onLogout={handleLogout}
                                    buttonRef={buttonRef}
                                />
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                {isPublicArea && (
                                    <Link
                                        to="/manager/login"
                                        className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                                    >
                                        Gestor
                                    </Link>
                                )}
                                <Link
                                    to={isConsumerArea ? `/evento/${eventoId}/login` : "/login"}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Entrar
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation - Contextual */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 py-4">
                        <nav className="flex flex-col space-y-2">
                            {/* Navegação Pública */}
                            {isPublicArea && (
                                <>
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
                                    <Link
                                        to="/demo"
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/demo')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Demo
                                    </Link>
                                </>
                            )}

                            {/* Navegação do Gestor */}
                            {isManagerArea && isAuthenticated && (
                                <>
                                    <Link
                                        to="/manager/dashboard"
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/manager/dashboard')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <BarChart3 className="w-4 h-4 inline mr-2" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/manager/evento"
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/manager/evento')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Evento
                                    </Link>
                                    <Link
                                        to="/manager/marca"
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/manager/marca')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Palette className="w-4 h-4 inline mr-2" />
                                        Marca
                                    </Link>
                                    <Link
                                        to="/manager/kds"
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/manager/kds')
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Utensils className="w-4 h-4 inline mr-2" />
                                        KDS
                                    </Link>
                                </>
                            )}

                            {/* Navegação do Consumidor */}
                            {isConsumerArea && isAuthenticated && (
                                <>
                                    <Link
                                        to={`/evento/${eventoId}`}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(`/evento/${eventoId}`)
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Utensils className="w-4 h-4 inline mr-2" />
                                        Cardápio
                                    </Link>
                                    <Link
                                        to={`/evento/${eventoId}/carrinho`}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(`/evento/${eventoId}/carrinho`)
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <ShoppingCart className="w-4 h-4 inline mr-2" />
                                        Carrinho
                                    </Link>
                                    <Link
                                        to={`/evento/${eventoId}/pedidos`}
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(`/evento/${eventoId}/pedidos`)
                                            ? 'text-blue-600 bg-blue-50'
                                            : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                            }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Calendar className="w-4 h-4 inline mr-2" />
                                        Pedidos
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
