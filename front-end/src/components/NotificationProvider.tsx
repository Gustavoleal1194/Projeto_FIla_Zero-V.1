import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

interface NotificationContextType {
    showNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showInfo: (message: string) => void;
    showWarning: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
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
    const showNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'info':
                toast(message, { icon: 'ℹ️' });
                break;
            case 'warning':
                toast(message, { icon: '⚠️' });
                break;
        }
    };

    const showSuccess = (message: string) => showNotification(message, 'success');
    const showError = (message: string) => showNotification(message, 'error');
    const showInfo = (message: string) => showNotification(message, 'info');
    const showWarning = (message: string) => showNotification(message, 'warning');

    const value: NotificationContextType = {
        showNotification,
        showSuccess,
        showError,
        showInfo,
        showWarning,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
