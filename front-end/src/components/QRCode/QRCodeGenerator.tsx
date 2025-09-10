import React, { useState, useCallback, useEffect } from 'react';
import { QRCodeService, QRCodeOptions } from '../../services/qrCodeService';
import { useEvent } from '../../contexts/EventContext';
import { Download, RefreshCw, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface QRCodeGeneratorProps {
    className?: string;
    showControls?: boolean;
    autoGenerate?: boolean;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
    className = '',
    showControls = true,
    autoGenerate = true
}) => {
    const { eventoAtual } = useEvent();
    const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [options, setOptions] = useState<QRCodeOptions>({
        width: 300,
        margin: 2,
        color: {
            dark: '#000000',
            light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
    });

    const generateQRCode = useCallback(async () => {
        if (!eventoAtual) {
            toast.error('Nenhum evento selecionado');
            return;
        }

        // Verificar se já existe QR Code em cache para este evento
        const cacheKey = `qr_code_${eventoAtual.id}`;
        const cachedQRCode = localStorage.getItem(cacheKey);

        if (cachedQRCode) {
            setQrCodeDataURL(cachedQRCode);
            return;
        }

        setIsGenerating(true);
        try {
            const qrCode = await QRCodeService.generateEventQRCode(
                eventoAtual.id,
                eventoAtual.nome,
                options
            );
            setQrCodeDataURL(qrCode);

            // Salvar no cache
            localStorage.setItem(cacheKey, qrCode);

            toast.success('QR Code gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar QR Code:', error);
            toast.error('Erro ao gerar QR Code');
        } finally {
            setIsGenerating(false);
        }
    }, [eventoAtual, options]);

    const downloadQRCode = useCallback(() => {
        if (!qrCodeDataURL) return;

        const link = document.createElement('a');
        link.download = `qrcode-${eventoAtual?.nome || 'evento'}-${Date.now()}.png`;
        link.href = qrCodeDataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('QR Code baixado!');
    }, [qrCodeDataURL, eventoAtual]);

    const copyQRCodeURL = useCallback(async () => {
        if (!eventoAtual) return;

        const url = `${window.location.origin}/evento/${eventoAtual.id}`;
        try {
            await navigator.clipboard.writeText(url);
            setIsCopied(true);
            toast.success('URL copiada para a área de transferência!');
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Erro ao copiar URL:', error);
            toast.error('Erro ao copiar URL');
        }
    }, [eventoAtual]);

    const clearCache = useCallback(() => {
        if (!eventoAtual) return;

        const cacheKey = `qr_code_${eventoAtual.id}`;
        localStorage.removeItem(cacheKey);
        setQrCodeDataURL('');
        toast.success('Cache do QR Code limpo! Clique em "Gerar QR Code" para criar um novo.');
    }, [eventoAtual]);

    const generatePrintQRCode = useCallback(async () => {
        if (!eventoAtual) return;

        setIsGenerating(true);
        try {
            const qrCode = await QRCodeService.generatePrintQRCode(
                eventoAtual.id,
                eventoAtual.nome
            );
            setQrCodeDataURL(qrCode);
            toast.success('QR Code para impressão gerado!');
        } catch (error) {
            console.error('Erro ao gerar QR Code para impressão:', error);
            toast.error('Erro ao gerar QR Code para impressão');
        } finally {
            setIsGenerating(false);
        }
    }, [eventoAtual]);

    // Auto-gerar QR Code quando o evento mudar
    useEffect(() => {
        if (autoGenerate && eventoAtual && !qrCodeDataURL) {
            generateQRCode();
        }
    }, [eventoAtual, autoGenerate, generateQRCode, qrCodeDataURL]);

    if (!eventoAtual) {
        return (
            <div className={`flex items-center justify-center p-8 ${className}`}>
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Nenhum evento selecionado</p>
                    <p className="text-sm text-gray-400">Selecione um evento para gerar o QR Code</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
            <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    QR Code - {eventoAtual.nome}
                </h3>
                <p className="text-sm text-gray-600">
                    Escaneie para acessar o cardápio do evento
                </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
                {/* QR Code Display */}
                <div className="relative">
                    {qrCodeDataURL ? (
                        <img
                            src={qrCodeDataURL}
                            alt={`QR Code para ${eventoAtual.nome}`}
                            className="border-2 border-gray-200 rounded-lg"
                            style={{ width: options.width, height: options.width }}
                        />
                    ) : (
                        <div
                            className="border-2 border-gray-200 rounded-lg flex items-center justify-center bg-gray-50"
                            style={{ width: options.width, height: options.width }}
                        >
                            {isGenerating ? (
                                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin" />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <p className="text-sm">Clique em "Gerar QR Code"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Controls */}
                {showControls && (
                    <div className="flex flex-wrap gap-2 justify-center">
                        <button
                            onClick={generateQRCode}
                            disabled={isGenerating}
                            className="btn-primary flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                            {isGenerating ? 'Gerando...' : 'Gerar QR Code'}
                        </button>

                        <button
                            onClick={downloadQRCode}
                            disabled={!qrCodeDataURL}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Baixar
                        </button>

                        <button
                            onClick={copyQRCodeURL}
                            className="btn-secondary flex items-center gap-2"
                        >
                            {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {isCopied ? 'Copiado!' : 'Copiar URL'}
                        </button>

                        <button
                            onClick={generatePrintQRCode}
                            disabled={isGenerating}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                            Versão Impressão
                        </button>

                        <button
                            onClick={clearCache}
                            className="btn-outline flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Limpar Cache
                        </button>
                    </div>
                )}

                {/* URL Display */}
                <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">URL do Evento:</p>
                    <p className="text-sm text-blue-600 break-all">
                        {window.location.origin}/evento/{eventoAtual.id}
                    </p>
                </div>
            </div>
        </div>
    );
};
