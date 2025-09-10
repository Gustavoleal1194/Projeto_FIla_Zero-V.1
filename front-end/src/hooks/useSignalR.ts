import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface SignalRConnection {
    connection: signalR.HubConnection | null;
    isConnected: boolean;
    startConnection: () => Promise<void>;
    stopConnection: () => Promise<void>;
    joinEventGroup: (eventoId: string) => Promise<void>;
    leaveEventGroup: (eventoId: string) => Promise<void>;
    joinKDSGroup: (eventoId: string) => Promise<void>;
    leaveKDSGroup: (eventoId: string) => Promise<void>;
    joinPersonalGroup: () => Promise<void>;
    leavePersonalGroup: () => Promise<void>;
}

export const useSignalR = (token?: string): SignalRConnection => {
    const [isConnected, setIsConnected] = useState(false);
    const connectionRef = useRef<signalR.HubConnection | null>(null);

    const startConnection = async () => {
        if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
            return;
        }

        try {
            const connection = new signalR.HubConnectionBuilder()
                .withUrl('http://localhost:5000/notificationHub', {
                    accessTokenFactory: () => token || '',
                })
                .withAutomaticReconnect()
                .build();

            connection.onclose(() => {
                setIsConnected(false);
                console.log('SignalR connection closed');
            });

            connection.onreconnecting(() => {
                console.log('SignalR reconnecting...');
            });

            connection.onreconnected(() => {
                setIsConnected(true);
                console.log('SignalR reconnected');
            });

            await connection.start();
            connectionRef.current = connection;
            setIsConnected(true);
            console.log('SignalR connection started');
        } catch (error) {
            console.error('Error starting SignalR connection:', error);
        }
    };

    const stopConnection = async () => {
        if (connectionRef.current) {
            await connectionRef.current.stop();
            connectionRef.current = null;
            setIsConnected(false);
            console.log('SignalR connection stopped');
        }
    };

    const joinEventGroup = async (eventoId: string) => {
        if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
            await connectionRef.current.invoke('JoinEventGroup', eventoId);
        }
    };

    const leaveEventGroup = async (eventoId: string) => {
        if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
            await connectionRef.current.invoke('LeaveEventGroup', eventoId);
        }
    };

    const joinKDSGroup = async (eventoId: string) => {
        if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
            await connectionRef.current.invoke('JoinKDSGroup', eventoId);
        }
    };

    const leaveKDSGroup = async (eventoId: string) => {
        if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
            await connectionRef.current.invoke('LeaveKDSGroup', eventoId);
        }
    };

    const joinPersonalGroup = async () => {
        if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
            await connectionRef.current.invoke('JoinPersonalGroup');
        }
    };

    const leavePersonalGroup = async () => {
        if (connectionRef.current?.state === signalR.HubConnectionState.Connected) {
            await connectionRef.current.invoke('LeavePersonalGroup');
        }
    };

    useEffect(() => {
        return () => {
            stopConnection();
        };
    }, []);

    return {
        connection: connectionRef.current,
        isConnected,
        startConnection,
        stopConnection,
        joinEventGroup,
        leaveEventGroup,
        joinKDSGroup,
        leaveKDSGroup,
        joinPersonalGroup,
        leavePersonalGroup,
    };
};
