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

// Components
import Header from './components/Layout/Header';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Cart from './pages/Cart';
import EventoPage from './pages/EventoPage';
import EventoHome from './pages/EventoHome';
import DemoLogin from './pages/DemoLogin';

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
                            <CartProvider>
                                <Router>
                                    <div className="min-h-screen bg-gray-50">
                                        <Header />

                                        <main>
                                            <Routes>
                                                <Route path="/" element={<Home />} />
                                                <Route path="/login" element={<Login />} />
                                                <Route path="/demo" element={<DemoLogin />} />
                                                <Route path="/carrinho" element={<Cart />} />

                                                {/* Rotas de Evento */}
                                                <Route path="/evento/:eventoId" element={<EventoHome />} />
                                                <Route path="/evento/:eventoId/menu" element={<EventoHome />} />
                                                <Route path="/evento/:eventoId/carrinho" element={<div>Carrinho do Evento (em desenvolvimento)</div>} />
                                                <Route path="/evento/:eventoId/pedidos" element={<div>Pedidos do Evento (em desenvolvimento)</div>} />
                                                <Route path="/evento/:eventoId/kds" element={<div>KDS do Evento (em desenvolvimento)</div>} />

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
                        </ThemeProvider>
                    </EventProvider>
                </AuthProvider>
            </QueryClientProvider>
        </HelmetProvider>
    );
}

export default App;