import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { User, LogOut, BarChart3, Palette, Utensils, Calendar, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    usuario: {
        nome: string;
        email: string;
    };
    isManagerArea: boolean;
    isConsumerArea: boolean;
    isPublicArea: boolean;
    eventoId?: string;
    onLogout: () => void;
    buttonRef: React.RefObject<HTMLButtonElement>;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
    isOpen,
    onClose,
    usuario,
    isManagerArea,
    isConsumerArea,
    isPublicArea,
    eventoId,
    onLogout,
    buttonRef
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    // Calcular posição do botão
    const getPosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            return {
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            };
        }
        return { top: 80, right: 16 };
    };

    const position = getPosition();

    const dropdownContent = (
        <div
            ref={dropdownRef}
            className="fixed w-48 bg-white rounded-md shadow-2xl py-1 z-[99999] border border-gray-200 ring-1 ring-black ring-opacity-5"
            style={{
                top: `${position.top}px`,
                right: `${position.right}px`
            }}
        >
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
                <div className="font-medium">{usuario.nome}</div>
                <div className="text-gray-500">{usuario.email}</div>
            </div>

            {/* Opções contextuais */}
            {isManagerArea && (
                <>
                    <Link
                        to="/manager/dashboard"
                        onClick={onClose}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Dashboard
                    </Link>
                    <Link
                        to="/manager/evento"
                        onClick={onClose}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <Calendar className="w-4 h-4 mr-2" />
                        Configurar Evento
                    </Link>
                    <Link
                        to="/manager/marca"
                        onClick={onClose}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <Palette className="w-4 h-4 mr-2" />
                        Personalizar Marca
                    </Link>
                    <Link
                        to="/manager/kds"
                        onClick={onClose}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <Utensils className="w-4 h-4 mr-2" />
                        KDS - Cozinha
                    </Link>
                </>
            )}

            {isConsumerArea && (
                <>
                    <Link
                        to={`/evento/${eventoId}`}
                        onClick={onClose}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <Utensils className="w-4 h-4 mr-2" />
                        Meu Evento
                    </Link>
                    <Link
                        to={`/evento/${eventoId}/perfil`}
                        onClick={onClose}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <User className="w-4 h-4 mr-2" />
                        Meu Perfil
                    </Link>
                    <Link
                        to={`/evento/${eventoId}/pedidos`}
                        onClick={onClose}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <Calendar className="w-4 h-4 mr-2" />
                        Meus Pedidos
                    </Link>
                </>
            )}

            {isPublicArea && (
                <>
                    <Link
                        to="/demo-login"
                        onClick={onClose}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar aos Eventos
                    </Link>
                    <Link
                        to="/"
                        onClick={onClose}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Página Inicial
                    </Link>
                </>
            )}

            <button
                onClick={onLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
            </button>
        </div>
    );

    return createPortal(dropdownContent, document.body);
};

export default UserDropdown;
