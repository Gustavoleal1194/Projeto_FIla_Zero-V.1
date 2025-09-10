import { useState, useEffect, useCallback } from 'react';

interface NotificationHook {
    permission: NotificationPermission | null;
    requestPermission: () => Promise<boolean>;
    showNotification: (title: string, options?: NotificationOptions) => void;
}

export const useNotifications = (): NotificationHook => {
    const [permission, setPermission] = useState<NotificationPermission | null>(null);

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (!('Notification' in window)) {
            console.warn('Este navegador não suporta notificações');
            return false;
        }

        if (Notification.permission === 'granted') {
            return true;
        }

        if (Notification.permission === 'denied') {
            console.warn('Permissão para notificações foi negada');
            return false;
        }

        const permission = await Notification.requestPermission();
        setPermission(permission);
        return permission === 'granted';
    }, []);

    const showNotification = useCallback((title: string, options?: NotificationOptions) => {
        if (permission === 'granted') {
            new Notification(title, {
                icon: '/logo192.png',
                badge: '/logo192.png',
                ...options
            });
        }
    }, [permission]);

    return {
        permission,
        requestPermission,
        showNotification
    };
};
