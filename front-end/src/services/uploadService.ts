import axios from 'axios';

interface UploadResponse {
    success: boolean;
    data?: {
        url: string;
        fileName: string;
        size: number;
    };
    message?: string;
}

class UploadService {
    private api = axios.create({
        baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
        timeout: 30000, // 30 segundos para uploads
    });

    constructor() {
        // Interceptor para adicionar token de autenticação
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    /**
     * Upload de logo para evento
     */
    async uploadEventoLogo(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await this.api.post<UploadResponse>('/upload/evento/logo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao fazer upload da logo');
        }
    }

    /**
     * Upload de imagem para produto
     */
    async uploadProdutoImagem(file: File, eventoId: string): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('eventoId', eventoId);

        try {
            const response = await this.api.post<UploadResponse>('/upload/produto', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao fazer upload da imagem do produto');
        }
    }

    /**
     * Upload de imagem genérica
     */
    async uploadImagem(file: File, tipo: string = 'geral'): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tipo', tipo);

        try {
            const response = await this.api.post<UploadResponse>('/upload/imagem', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao fazer upload da imagem');
        }
    }

    /**
     * Remove uma imagem
     */
    async removerImagem(url: string): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await this.api.delete('/upload/imagem', {
                params: { url }
            });
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Erro ao remover imagem');
        }
    }

    /**
     * Valida se o arquivo é uma imagem válida
     */
    validarImagem(file: File): { valido: boolean; erro?: string } {
        // Verificar tipo de arquivo
        const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!tiposPermitidos.includes(file.type)) {
            return {
                valido: false,
                erro: 'Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP.'
            };
        }

        // Verificar tamanho (máximo 5MB)
        const tamanhoMaximo = 5 * 1024 * 1024; // 5MB
        if (file.size > tamanhoMaximo) {
            return {
                valido: false,
                erro: 'Arquivo muito grande. Máximo 5MB.'
            };
        }

        return { valido: true };
    }

    /**
     * Redimensiona uma imagem antes do upload
     */
    redimensionarImagem(file: File, maxWidth: number = 800, maxHeight: number = 600, qualidade: number = 0.8): Promise<File> {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calcular novas dimensões mantendo proporção
                let { width, height } = img;

                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // Desenhar imagem redimensionada
                ctx?.drawImage(img, 0, 0, width, height);

                // Converter para blob
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const fileRedimensionado = new File([blob], file.name, {
                                type: file.type,
                                lastModified: Date.now()
                            });
                            resolve(fileRedimensionado);
                        } else {
                            reject(new Error('Erro ao redimensionar imagem'));
                        }
                    },
                    file.type,
                    qualidade
                );
            };

            img.onerror = () => reject(new Error('Erro ao carregar imagem'));
            img.src = URL.createObjectURL(file);
        });
    }
}

export const uploadService = new UploadService();
export default uploadService;
