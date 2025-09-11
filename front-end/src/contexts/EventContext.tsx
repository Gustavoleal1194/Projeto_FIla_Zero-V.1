import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Evento } from '../types';
import { apiService } from '../services/api';

interface EventContextType {
    eventoAtual: Evento | null;
    loading: boolean;
    error: string | null;
    setEventoAtual: (evento: Evento | null) => void;
    carregarEvento: (eventoId: string) => Promise<void>;
    limparEvento: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvent = () => {
    const context = useContext(EventContext);
    if (context === undefined) {
        throw new Error('useEvent deve ser usado dentro de um EventProvider');
    }
    return context;
};

interface EventProviderProps {
    children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
    const [eventoAtual, setEventoAtual] = useState<Evento | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const carregarEvento = useCallback(async (eventoId: string) => {
        // Evitar carregar o mesmo evento novamente
        if (eventoAtual?.id === eventoId) {
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Buscar dados do evento usando API real
            const evento = await apiService.getEventoById(eventoId);
            setEventoAtual(evento);

            // Aplicar tema dinâmico
            aplicarTemaEvento(evento);

        } catch (err: any) {
            setError(err.message || 'Erro ao carregar evento');
            console.error('Erro ao carregar evento:', err);
        } finally {
            setLoading(false);
        }
    }, [eventoAtual?.id]);

    const aplicarTemaEvento = (evento: Evento) => {
        if (!evento) return;

        // Aplicar cores personalizadas
        const root = document.documentElement;
        root.style.setProperty('--cor-primaria', evento.corPrimaria);
        root.style.setProperty('--cor-secundaria', evento.corSecundaria);

        // Aplicar logo personalizada
        const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
        if (favicon && evento.logoUrl) {
            favicon.href = evento.logoUrl;
        }

        // Aplicar título da página
        document.title = `${evento.nome} - Fila Zero`;
    };

    const limparEvento = () => {
        setEventoAtual(null);
        setError(null);

        // Resetar tema padrão
        const root = document.documentElement;
        root.style.setProperty('--cor-primaria', '#007bff');
        root.style.setProperty('--cor-secundaria', '#6c757d');
        document.title = 'Fila Zero';
    };

    const value: EventContextType = {
        eventoAtual,
        loading,
        error,
        setEventoAtual,
        carregarEvento,
        limparEvento,
    };

    return (
        <EventContext.Provider value={value}>
            {children}
        </EventContext.Provider>
    );
};
