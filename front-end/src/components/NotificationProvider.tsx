import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useSignalR } from '../hooks/useSignalR';
import { useNotifications } from '../hooks/useNotifications';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface NotificationContextType {
    isConnected: boolean;
    joinEventGroup: (eventoId: string) => Promise<void>;
    leaveEventGroup: (eventoId: string) => Promise<void>;
    joinKDSGroup: (eventoId: string) => Promise<void>;
    leaveKDSGroup: (eventoId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
};

interface NotificationProviderProps {
    children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
    const { token } = useAuth();
    const { isConnected, startConnection, joinEventGroup, leaveEventGroup, joinKDSGroup, leaveKDSGroup, connection } = useSignalR(token || undefined);
    const { requestPermission, showNotification } = useNotifications();

    useEffect(() => {
        if (token) {
            startConnection();
            requestPermission();
        }
    }, [token, startConnection, requestPermission]);

    useEffect(() => {
        if (connection && isConnected) {
            // Configurar listeners para notificações
            connection.on('NovoPedido', (data) => {
                toast.success(`Novo pedido #${data.NumeroPedido} recebido!`);
                showNotification('Novo Pedido', {
                    body: `Pedido #${data.NumeroPedido} recebido`,
                    tag: `pedido-${data.PedidoId}`
                });
            });

            connection.on('AtualizacaoPedido', (data) => {
                toast(`Pedido #${data.NumeroPedido} atualizado: ${data.NovoStatus}`, {
                    icon: 'ℹ️'
                });
                showNotification('Pedido Atualizado', {
                    body: `Pedido #${data.NumeroPedido}: ${data.NovoStatus}`,
                    tag: `pedido-${data.PedidoId}`
                });
            });

            connection.on('PedidoPronto', (data) => {
                toast.success(`🎉 Pedido #${data.NumeroPedido} está pronto!`, {
                    duration: 10000,
                    style: {
                        background: '#10B981',
                        color: 'white',
                        fontWeight: 'bold'
                    }
                });
                showNotification('Pedido Pronto!', {
                    body: `Seu pedido #${data.NumeroPedido} está pronto para retirada!`,
                    tag: `pedido-pronto-${data.PedidoId}`,
                    requireInteraction: true
                });
            });

            connection.on('Pagamento', (data) => {
                toast.success(`Pagamento do pedido #${data.NumeroPedido}: ${data.StatusPagamento}`);
                showNotification('Pagamento Processado', {
                    body: `Pedido #${data.NumeroPedido}: ${data.StatusPagamento}`,
                    tag: `pagamento-${data.PedidoId}`
                });
            });

            connection.on('CancelamentoPedido', (data) => {
                toast.error(`Pedido #${data.NumeroPedido} foi cancelado`);
                showNotification('Pedido Cancelado', {
                    body: `Pedido #${data.NumeroPedido} foi cancelado. ${data.Motivo}`,
                    tag: `pedido-cancelado-${data.PedidoId}`
                });
            });

            connection.on('NotificacaoPersonalizada', (data) => {
                toast(data.Mensagem, {
                    icon: '🔔'
                });
                showNotification('Notificação', {
                    body: data.Mensagem,
                    tag: `personalizada-${Date.now()}`
                });
            });
        }

        return () => {
            if (connection) {
                connection.off('NovoPedido');
                connection.off('AtualizacaoPedido');
                connection.off('PedidoPronto');
                connection.off('Pagamento');
                connection.off('CancelamentoPedido');
                connection.off('NotificacaoPersonalizada');
            }
        };
    }, [connection, isConnected, showNotification]);

    const value: NotificationContextType = {
        isConnected,
        joinEventGroup,
        leaveEventGroup,
        joinKDSGroup,
        leaveKDSGroup,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
