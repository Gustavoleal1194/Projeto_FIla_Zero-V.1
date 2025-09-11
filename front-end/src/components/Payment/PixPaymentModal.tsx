import React, { useState, useEffect } from 'react';
import { XCircle, Clock, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface PixPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (transactionId: string) => void;
    onCancel: () => void;
    qrCode: string;
    pixKey: string;
    valor: number;
    transactionId: string;
    expirationTime: number;
}

export const PixPaymentModal: React.FC<PixPaymentModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    onCancel,
    qrCode,
    pixKey,
    valor,
    transactionId,
    expirationTime
}) => {
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutos em segundos
    const [isExpired, setIsExpired] = useState(false);
    const [copied, setCopied] = useState(false);

    // Timer countdown
    useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setIsExpired(true);
                    clearInterval(timer);
                    // Auto-cancelar após 2 minutos
                    setTimeout(() => {
                        onCancel();
                    }, 1000);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, onCancel]);

    // Reset timer quando modal abre
    useEffect(() => {
        if (isOpen) {
            setTimeLeft(120);
            setIsExpired(false);
            setCopied(false);
        }
    }, [isOpen]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCopyPixKey = async () => {
        try {
            await navigator.clipboard.writeText(pixKey);
            setCopied(true);
            toast.success('Chave PIX copiada!');

            // Reset copied state after 2 seconds
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback for older browsers
            const input = document.createElement('input');
            input.value = pixKey;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            setCopied(true);
            toast.success('Chave PIX copiada!');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handlePaymentConfirmed = () => {
        onSuccess(transactionId);
        onClose();
    };

    const handleCancel = () => {
        onCancel();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-2xl">💳</span>
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Pagamento PIX</h2>
                                <p className="text-sm text-gray-500">Escaneie o QR Code ou copie a chave</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Timer */}
                    <div className={`mb-6 p-4 rounded-lg border-2 transition-colors ${timeLeft > 30
                            ? 'bg-green-50 border-green-200'
                            : timeLeft > 10
                                ? 'bg-yellow-50 border-yellow-200'
                                : 'bg-red-50 border-red-200'
                        }`}>
                        <div className="flex items-center justify-center space-x-2">
                            <Clock className={`w-5 h-5 ${timeLeft > 30
                                    ? 'text-green-600'
                                    : timeLeft > 10
                                        ? 'text-yellow-600'
                                        : 'text-red-600'
                                }`} />
                            <span className={`text-lg font-bold ${timeLeft > 30
                                    ? 'text-green-800'
                                    : timeLeft > 10
                                        ? 'text-yellow-800'
                                        : 'text-red-800'
                                }`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                        <p className="text-center text-sm text-gray-600 mt-1">
                            {timeLeft > 30
                                ? 'Tempo restante para pagamento'
                                : timeLeft > 10
                                    ? 'Tempo esgotando!'
                                    : 'Tempo esgotado!'
                            }
                        </p>
                    </div>

                    {/* QR Code */}
                    <div className="mb-6 text-center">
                        <h3 className="font-semibold text-gray-900 mb-3">Escaneie o QR Code</h3>
                        <div className="flex justify-center">
                            <img
                                src={`data:image/png;base64,${qrCode}`}
                                alt="QR Code PIX"
                                className="border-2 border-gray-300 rounded-lg shadow-lg"
                                style={{ width: 200, height: 200 }}
                            />
                        </div>
                    </div>

                    {/* PIX Copia e Cola */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-3">PIX Copia e Cola</h3>
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={pixKey}
                                    readOnly
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white font-mono"
                                />
                                <button
                                    onClick={handleCopyPixKey}
                                    disabled={copied}
                                    className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${copied
                                            ? 'bg-green-600 text-white'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle className="w-4 h-4 inline mr-1" />
                                            Copiado!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4 inline mr-1" />
                                            Copiar
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Valor */}
                    <div className="mb-6 text-center">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Valor a pagar</p>
                            <p className="text-2xl font-bold text-blue-900">
                                R$ {valor.toFixed(2).replace('.', ',')}
                            </p>
                        </div>
                    </div>

                    {/* Botões */}
                    <div className="space-y-3">
                        <button
                            onClick={handlePaymentConfirmed}
                            disabled={isExpired}
                            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${isExpired
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                        >
                            {isExpired ? 'Tempo Esgotado' : '✅ Pagamento Realizado'}
                        </button>

                        <button
                            onClick={handleCancel}
                            className="w-full py-2 px-4 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            ❌ Cancelar Pagamento
                        </button>
                    </div>

                    {/* Instruções */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-800 text-center">
                            💡 <strong>Instruções:</strong> Escaneie o QR Code com seu app de banco ou copie a chave PIX e cole no app
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
