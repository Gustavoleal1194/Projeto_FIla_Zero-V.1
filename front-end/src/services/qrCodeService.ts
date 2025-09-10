import QRCode from 'qrcode';

export interface QRCodeOptions {
    width?: number;
    height?: number;
    margin?: number;
    color?: {
        dark?: string;
        light?: string;
    };
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

export interface QRCodeData {
    eventoId: string;
    eventoNome: string;
    url: string;
    timestamp: number;
    customLogo?: string;
}

export class QRCodeService {
    private static readonly BASE_URL = process.env.REACT_APP_BASE_URL || window.location.origin;

    /**
     * Gera QR Code para acesso ao evento
     * @param eventoId - ID do evento
     * @param eventoNome - Nome do evento
     * @param options - Opções de personalização
     * @returns Promise<string> - Data URL do QR Code
     */
    static async generateEventQRCode(
        eventoId: string,
        eventoNome: string,
        options: QRCodeOptions = {}
    ): Promise<string> {
        try {
            const url = `${this.BASE_URL}/evento/${eventoId}`;

            const qrData: QRCodeData = {
                eventoId,
                eventoNome,
                url,
                timestamp: Date.now()
            };

            const qrOptions: QRCode.QRCodeToDataURLOptions = {
                width: options.width || 300,
                margin: options.margin || 2,
                color: {
                    dark: options.color?.dark || '#000000',
                    light: options.color?.light || '#FFFFFF'
                },
                errorCorrectionLevel: options.errorCorrectionLevel || 'M'
            };

            const qrCodeDataURL = await QRCode.toDataURL(url, qrOptions);

            // Log para auditoria
            console.log(`QR Code gerado para evento: ${eventoNome} (ID: ${eventoId})`);

            return qrCodeDataURL;
        } catch (error) {
            console.error('Erro ao gerar QR Code:', error);
            throw new Error('Falha na geração do QR Code');
        }
    }

    /**
     * Gera QR Code personalizado com logo do evento
     * @param eventoId - ID do evento
     * @param eventoNome - Nome do evento
     * @param logoUrl - URL do logo do evento
     * @param options - Opções de personalização
     * @returns Promise<string> - Data URL do QR Code personalizado
     */
    static async generateCustomQRCode(
        eventoId: string,
        eventoNome: string,
        logoUrl?: string,
        options: QRCodeOptions = {}
    ): Promise<string> {
        try {
            const baseQRCode = await this.generateEventQRCode(eventoId, eventoNome, options);

            if (!logoUrl) {
                return baseQRCode;
            }

            // Aqui implementaríamos a personalização com logo
            // Por enquanto, retornamos o QR Code base
            return baseQRCode;
        } catch (error) {
            console.error('Erro ao gerar QR Code personalizado:', error);
            throw new Error('Falha na geração do QR Code personalizado');
        }
    }

    /**
     * Valida se uma URL é um QR Code válido do sistema
     * @param url - URL a ser validada
     * @returns boolean - Se a URL é válida
     */
    static isValidQRCodeURL(url: string): boolean {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');

            // Verifica se é uma URL de evento válida
            return pathParts[1] === 'evento' && Boolean(pathParts[2]) && pathParts[2].length > 0;
        } catch {
            return false;
        }
    }

    /**
     * Extrai dados do QR Code a partir da URL
     * @param url - URL do QR Code
     * @returns {eventoId: string} | null - Dados extraídos ou null se inválido
     */
    static extractQRCodeData(url: string): { eventoId: string } | null {
        try {
            if (!this.isValidQRCodeURL(url)) {
                return null;
            }

            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/');
            const eventoId = pathParts[2];

            return { eventoId };
        } catch {
            return null;
        }
    }

    /**
     * Gera QR Code para impressão (alta resolução)
     * @param eventoId - ID do evento
     * @param eventoNome - Nome do evento
     * @returns Promise<string> - Data URL para impressão
     */
    static async generatePrintQRCode(
        eventoId: string,
        eventoNome: string
    ): Promise<string> {
        return this.generateEventQRCode(eventoId, eventoNome, {
            width: 600,
            height: 600,
            margin: 4,
            errorCorrectionLevel: 'H'
        });
    }
}
