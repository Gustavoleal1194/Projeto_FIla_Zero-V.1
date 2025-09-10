import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { EventProvider } from './contexts/EventContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PaymentProvider } from './contexts/PaymentContext';

// Components
import Header from './components/Layout/Header';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import EventoPage from './pages/EventoPage';
import EventoHome from './pages/EventoHome';
import DemoLogin from './pages/DemoLogin';
import { QRCodeAccess } from './pages/QRCodeAccess';
import InstitutionalHome from './pages/InstitutionalHome';
import ConsumerLogin from './pages/ConsumerLogin';
import ConsumerApp from './pages/ConsumerApp';
import ConsumerCart from './pages/ConsumerCart';
import ConsumerProfile from './pages/ConsumerProfile';
import ConsumerOrders from './pages/ConsumerOrders';
import ClientLogin from './pages/ClientLogin';

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

function App() {
    return (
        <HelmetProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <EventProvider>
                        <ThemeProvider>
                            <PaymentProvider>
                                <CartProvider>
                                    <Router>
                                        <div className="min-h-screen bg-gray-50">
                                            <Header />

                                            <main>
                                                <Routes>
                                                    {/* Home Institucional */}
                                                    <Route path="/" element={<InstitutionalHome />} />
                                                    <Route path="/demo" element={<DemoLogin />} />

                                                    {/* App do Consumidor */}
                                                    <Route path="/evento/:eventoId/login" element={<ConsumerLogin />} />
                                                    <Route path="/evento/:eventoId" element={<ConsumerApp />} />
                                                    <Route path="/evento/:eventoId/menu" element={<ConsumerApp />} />
                                                    <Route path="/evento/:eventoId/carrinho" element={<ConsumerCart />} />
                                                    <Route path="/evento/:eventoId/perfil" element={<ConsumerProfile />} />
                                                    <Route path="/evento/:eventoId/pedidos" element={<ConsumerOrders />} />

                                                    {/* KDS */}
                                                    <Route path="/kds/:eventoId" element={<div>KDS do Evento (em desenvolvimento)</div>} />

                                                    {/* Login do Consumidor */}
                                                    <Route path="/login" element={<ConsumerLogin />} />

                                                    {/* Login para clientes (gestores) */}
                                                    <Route path="/client-login" element={<ClientLogin />} />

                                                    {/* Rotas antigas (manter para compatibilidade) */}
                                                    <Route path="/carrinho" element={<Cart />} />
                                                    <Route path="/qr/:eventoId" element={<QRCodeAccess />} />

                                                    {/* Rotas protegidas serão adicionadas aqui */}
                                                    <Route path="/dashboard" element={<div>Dashboard (em desenvolvimento)</div>} />
                                                    <Route path="/pedidos" element={<div>Pedidos (em desenvolvimento)</div>} />
                                                    <Route path="/kds" element={<div>KDS (em desenvolvimento)</div>} />
                                                    <Route path="/eventos" element={<div>Eventos (em desenvolvimento)</div>} />
                                                </Routes>
                                            </main>

                                            <Toaster
                                                position="top-right"
                                                toastOptions={{
                                                    duration: 4000,
                                                    style: {
                                                        background: '#363636',
                                                        color: '#fff',
                                                    },
                                                    success: {
                                                        duration: 3000,
                                                        iconTheme: {
                                                            primary: '#10B981',
                                                            secondary: '#fff',
                                                        },
                                                    },
                                                    error: {
                                                        duration: 5000,
                                                        iconTheme: {
                                                            primary: '#EF4444',
                                                            secondary: '#fff',
                                                        },
                                                    },
                                                }}
                                            />
                                        </div>
                                    </Router>
                                </CartProvider>
                            </PaymentProvider>
                        </ThemeProvider>
                    </EventProvider>
                </AuthProvider>
            </QueryClientProvider>
        </HelmetProvider>
    );
}

export default App;