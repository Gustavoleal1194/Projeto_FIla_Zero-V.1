import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeService } from '../services/qrCodeService';
import { useEvent } from '../contexts/EventContext';
import { useTheme } from '../contexts/ThemeContext';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export const QRCodeAccess: React.FC = () => {
    const { eventoId } = useParams<{ eventoId: string }>();
    const navigate = useNavigate();
    const { carregarEvento, eventoAtual, loading, error } = useEvent();
    const { aplicarTema } = useTheme();
    const [isValidating, setIsValidating] = useState(true);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        const validateAndLoadEvent = async () => {
            if (!eventoId) {
                setValidationError('ID do evento não fornecido');
                setIsValidating(false);
                return;
            }

            try {
                // Valida se o eventoId é válido
                const isValid = QRCodeService.isValidQRCodeURL(`/evento/${eventoId}`);
                if (!isValid) {
                    setValidationError('QR Code inválido ou corrompido');
                    setIsValidating(false);
                    return;
                }

                // Carrega o evento
                await carregarEvento(eventoId);
            } catch (error) {
                console.error('Erro ao validar QR Code:', error);
                setValidationError('Erro ao acessar o evento');
                setIsValidating(false);
            }
        };

        validateAndLoadEvent();
    }, [eventoId, carregarEvento]);

    // Aplica o tema quando o evento for carregado
    useEffect(() => {
        if (eventoAtual) {
            aplicarTema(eventoAtual);
        }
    }, [eventoAtual, aplicarTema]);

    // Redireciona para o menu do evento quando carregado
    useEffect(() => {
        if (eventoAtual && !loading && !error) {
            // Pequeno delay para mostrar a validação
            setTimeout(() => {
                navigate(`/evento/${eventoAtual.id}/menu`, { replace: true });
            }, 1500);
        }
    }, [eventoAtual, loading, error, navigate]);

    if (isValidating || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Validando QR Code...
                    </h2>
                    <p className="text-gray-600">
                        Aguarde enquanto verificamos o acesso ao evento
                    </p>
                </div>
            </div>
        );
    }

    if (validationError || error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-6">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Erro de Acesso
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {validationError || 'Não foi possível acessar o evento'}
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary w-full"
                        >
                            Tentar Novamente
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-secondary w-full"
                        >
                            Voltar ao Início
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (eventoAtual) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Acesso Autorizado!
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Bem-vindo ao evento <strong>{eventoAtual.nome}</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                        Redirecionando para o cardápio...
                    </p>
                </div>
            </div>
        );
    }

    return null;
};
