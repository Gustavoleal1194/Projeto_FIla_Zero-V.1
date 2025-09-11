/**
 * Utilitários para manipulação de URLs de imagens
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/**
 * Converte uma URL relativa de imagem para URL absoluta
 * @param imageUrl URL da imagem (pode ser relativa ou absoluta)
 * @returns URL absoluta da imagem
 */
export const getImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) {
        return 'https://via.placeholder.com/100x100?text=Sem+Imagem';
    }

    // Se já é uma URL absoluta, retorna como está
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }

    // Se é uma URL relativa, adiciona o base URL da API
    return `${API_BASE_URL}${imageUrl}`;
};

/**
 * Converte uma URL relativa de imagem para URL absoluta (versão específica para backend)
 * @param imageUrl URL da imagem (pode ser relativa ou absoluta)
 * @returns URL absoluta da imagem
 */
export const getBackendImageUrl = (imageUrl?: string): string => {
    if (!imageUrl) {
        return 'https://via.placeholder.com/100x100?text=Sem+Imagem';
    }

    // Se já é uma URL absoluta, retorna como está
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }

    // Se é uma URL relativa, adiciona o base URL do backend
    return `http://localhost:5000${imageUrl}`;
};
