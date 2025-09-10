import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Pedido, StatusPedido, StatusItemPedido } from '../types';
import { apiService } from '../services/api';
import { Clock, CheckCircle, Package, Truck, AlertCircle } from 'lucide-react';

const KDS: React.FC = () => {
    const { eventoId } = useParams<{ eventoId: string }>();
    const [selectedStatus, setSelectedStatus] = useState<StatusPedido | null>(null);

    const { data: pedidos, isLoading, refetch } = useQuery(
        ['kds-pedidos', eventoId],
        () => apiService.getPedidosKDS(eventoId!),
        {
            enabled: !!eventoId,
            refetchInterval: 5000, // Atualizar a cada 5 segundos
        }
    );

    const getStatusIcon = (status: StatusPedido) => {
        switch (status) {
            case StatusPedido.AguardandoPagamento:
                return <Clock className="w-5 h-5 text-yellow-500" />;
            case StatusPedido.Pago:
                return <CheckCircle className="w-5 h-5 text-blue-500" />;
            case StatusPedido.Preparando:
                return <Package className="w-5 h-5 text-orange-500" />;
            case StatusPedido.Pronto:
                return <Truck className="w-5 h-5 text-green-500" />;
            case StatusPedido.Entregue:
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case StatusPedido.Cancelado:
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            default:
                return <Clock className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusText = (status: StatusPedido) => {
        switch (status) {
            case StatusPedido.AguardandoPagamento:
                return 'Aguardando Pagamento';
            case StatusPedido.Pago:
                return 'Pago';
            case StatusPedido.Preparando:
                return 'Preparando';
            case StatusPedido.Pronto:
                return 'Pronto para Retirada';
            case StatusPedido.Entregue:
                return 'Entregue';
            case StatusPedido.Cancelado:
                return 'Cancelado';
            default:
                return 'Desconhecido';
        }
    };

    const getStatusColor = (status: StatusPedido) => {
        switch (status) {
            case StatusPedido.AguardandoPagamento:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case StatusPedido.Pago:
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case StatusPedido.Preparando:
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case StatusPedido.Pronto:
                return 'bg-green-100 text-green-800 border-green-200';
            case StatusPedido.Entregue:
                return 'bg-green-100 text-green-800 border-green-200';
            case StatusPedido.Cancelado:
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getItemStatusColor = (status: StatusItemPedido) => {
        switch (status) {
            case StatusItemPedido.Aguardando:
                return 'bg-yellow-100 text-yellow-800';
            case StatusItemPedido.Preparando:
                return 'bg-orange-100 text-orange-800';
            case StatusItemPedido.Pronto:
                return 'bg-green-100 text-green-800';
            case StatusItemPedido.Entregue:
                return 'bg-green-100 text-green-800';
            case StatusItemPedido.Cancelado:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getItemStatusText = (status: StatusItemPedido) => {
        switch (status) {
            case StatusItemPedido.Aguardando:
                return 'Aguardando';
            case StatusItemPedido.Preparando:
                return 'Preparando';
            case StatusItemPedido.Pronto:
                return 'Pronto';
            case StatusItemPedido.Entregue:
                return 'Entregue';
            case StatusItemPedido.Cancelado:
                return 'Cancelado';
            default:
                return 'Desconhecido';
        }
    };

    const pedidosFiltrados = selectedStatus
        ? pedidos?.filter(p => p.status === selectedStatus)
        : pedidos;

    const statusCounts = pedidos?.reduce((acc, pedido) => {
        acc[pedido.status] = (acc[pedido.status] || 0) + 1;
        return acc;
    }, {} as Record<StatusPedido, number>) || {};

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Kitchen Display System (KDS)</h1>
                <button
                    onClick={() => refetch()}
                    className="btn-secondary"
                >
                    Atualizar
                </button>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                {Object.entries(statusCounts).map(([status, count]) => (
                    <button
                        key={status}
                        onClick={() => setSelectedStatus(selectedStatus === Number(status) ? null : Number(status))}
                        className={`p-4 rounded-lg border-2 transition-colors ${selectedStatus === Number(status)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <div className="flex items-center justify-center mb-2">
                            {getStatusIcon(Number(status))}
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-gray-900">{String(count)}</p>
                            <p className="text-sm text-gray-600">
                                {getStatusText(Number(status)) as React.ReactNode}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Pedidos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {pedidosFiltrados?.map((pedido) => (
                    <div key={pedido.id} className="card border-2">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    #{pedido.numeroPedido}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {new Date(pedido.dataCriacao).toLocaleString('pt-BR')}
                                </p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(pedido.status)}`}>
                                {getStatusText(pedido.status)}
                            </div>
                        </div>

                        {pedido.itens && pedido.itens.length > 0 && (
                            <div className="space-y-2 mb-4">
                                {pedido.itens.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.quantidade}x {item.produto?.nome}
                                            </p>
                                            {item.observacoes && (
                                                <p className="text-xs text-gray-600 italic">
                                                    Obs: {item.observacoes}
                                                </p>
                                            )}
                                        </div>
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getItemStatusColor(item.status)}`}>
                                            {getItemStatusText(item.status)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {pedido.observacoes && (
                            <div className="mb-4 p-2 bg-yellow-50 rounded">
                                <p className="text-sm text-yellow-800">
                                    <strong>Obs:</strong> {pedido.observacoes}
                                </p>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-4 border-t">
                            <div className="text-sm text-gray-600">
                                <p>Tempo: {pedido.tempoEstimadoMinutos} min</p>
                                <p>Total: R$ {pedido.valorTotal.toFixed(2).replace('.', ',')}</p>
                            </div>
                            <div className="flex space-x-2">
                                {pedido.status === StatusPedido.Pago && (
                                    <button className="btn-primary text-sm">
                                        Iniciar Preparo
                                    </button>
                                )}
                                {pedido.status === StatusPedido.Preparando && (
                                    <button className="btn-primary text-sm">
                                        Marcar Pronto
                                    </button>
                                )}
                                {pedido.status === StatusPedido.Pronto && (
                                    <button className="btn-secondary text-sm">
                                        Entregue
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {pedidosFiltrados?.length === 0 && (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        {selectedStatus ? 'Nenhum pedido neste status' : 'Nenhum pedido encontrado'}
                    </h2>
                    <p className="text-gray-600">
                        {selectedStatus
                            ? 'Não há pedidos com o status selecionado no momento.'
                            : 'Não há pedidos para exibir no momento.'
                        }
                    </p>
                </div>
            )}
        </div>
    );
};

export default KDS;
