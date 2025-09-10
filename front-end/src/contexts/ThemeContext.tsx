import React, { createContext, useContext, useEffect, useCallback, ReactNode } from 'react';
import { useEvent } from './EventContext';

interface ThemeContextType {
    tema: {
        corPrimaria: string;
        corSecundaria: string;
        logoUrl: string;
        nome: string;
    };
    aplicarTema: (evento: any) => void;
    resetarTema: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const { eventoAtual } = useEvent();

    const temaPadrao = {
        corPrimaria: '#007bff',
        corSecundaria: '#6c757d',
        logoUrl: '/logo-fila-zero.png',
        nome: 'Fila Zero'
    };

    const [tema, setTema] = React.useState(temaPadrao);

    const aplicarTema = useCallback((evento: any) => {
        if (!evento) return;

        const novoTema = {
            corPrimaria: evento.corPrimaria || '#007bff',
            corSecundaria: evento.corSecundaria || '#6c757d',
            logoUrl: evento.logoUrl || '/logo-fila-zero.png',
            nome: evento.nome || 'Fila Zero'
        };

        setTema(novoTema);

        // Aplicar CSS customizado
        const root = document.documentElement;
        root.style.setProperty('--cor-primaria', novoTema.corPrimaria);
        root.style.setProperty('--cor-secundaria', novoTema.corSecundaria);
        root.style.setProperty('--cor-primaria-hover', escurecerCor(novoTema.corPrimaria, 10));
        root.style.setProperty('--cor-primaria-light', clarearCor(novoTema.corPrimaria, 20));
        root.style.setProperty('--cor-secundaria-hover', escurecerCor(novoTema.corSecundaria, 10));

        // Aplicar logo personalizada
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon && novoTema.logoUrl) {
            favicon.href = novoTema.logoUrl;
        }

        // Aplicar título da página
        document.title = `${novoTema.nome} - Fila Zero`;
    }, []);

    const resetarTema = useCallback(() => {
        setTema(temaPadrao);

        const root = document.documentElement;
        root.style.setProperty('--cor-primaria', temaPadrao.corPrimaria);
        root.style.setProperty('--cor-secundaria', temaPadrao.corSecundaria);
        root.style.setProperty('--cor-primaria-hover', escurecerCor(temaPadrao.corPrimaria, 10));
        root.style.setProperty('--cor-primaria-light', clarearCor(temaPadrao.corPrimaria, 20));
        root.style.setProperty('--cor-secundaria-hover', escurecerCor(temaPadrao.corSecundaria, 10));

        document.title = 'Fila Zero';
    }, []);

    // Aplicar tema quando evento mudar
    useEffect(() => {
        if (eventoAtual) {
            aplicarTema(eventoAtual);
        } else {
            resetarTema();
        }
    }, [eventoAtual, aplicarTema, resetarTema]);

    const value: ThemeContextType = {
        tema,
        aplicarTema,
        resetarTema,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Funções auxiliares para manipulação de cores
function escurecerCor(cor: string, percentual: number): string {
    const num = parseInt(cor.replace("#", ""), 16);
    const amt = Math.round(2.55 * percentual);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function clarearCor(cor: string, percentual: number): string {
    const num = parseInt(cor.replace("#", ""), 16);
    const amt = Math.round(2.55 * percentual);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}
