import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';
import { Pedido, StatusPedido } from '../types';
import { Clock, CheckCircle, XCircle, Package, Truck } from 'lucide-react';

const Orders: React.FC = () => {
    const { data: pedidos, isLoading } = useQuery(
        ['pedidos-usuario'],
        () => apiService.getPedidos()
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
                return <XCircle className="w-5 h-5 text-red-500" />;
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
                return 'bg-yellow-100 text-yellow-800';
            case StatusPedido.Pago:
                return 'bg-blue-100 text-blue-800';
            case StatusPedido.Preparando:
                return 'bg-orange-100 text-orange-800';
            case StatusPedido.Pronto:
                return 'bg-green-100 text-green-800';
            case StatusPedido.Entregue:
                return 'bg-green-100 text-green-800';
            case StatusPedido.Cancelado:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Meus Pedidos</h1>

            {pedidos && pedidos.length > 0 ? (
                <div className="space-y-6">
                    {pedidos.map((pedido) => (
                        <div key={pedido.id} className="card">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Pedido #{pedido.numeroPedido}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(pedido.dataCriacao).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getStatusIcon(pedido.status)}
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pedido.status)}`}>
                                        {getStatusText(pedido.status)}
                                    </span>
                                </div>
                            </div>

                            {pedido.itens && pedido.itens.length > 0 && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Itens:</h4>
                                    <div className="space-y-2">
                                        {pedido.itens.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600">
                                                    {item.quantidade}x {item.produto?.nome}
                                                </span>
                                                <span className="font-medium">
                                                    R$ {item.precoTotal.toFixed(2).replace('.', ',')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {pedido.observacoes && (
                                <div className="mb-4">
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">Observações:</h4>
                                    <p className="text-sm text-gray-600">{pedido.observacoes}</p>
                                </div>
                            )}

                            <div className="flex justify-between items-center pt-4 border-t">
                                <div className="text-sm text-gray-600">
                                    <p>Tempo estimado: {pedido.tempoEstimadoMinutos} minutos</p>
                                    {pedido.evento && (
                                        <p>Evento: {pedido.evento.nome}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-gray-900">
                                        Total: R$ {pedido.valorTotal.toFixed(2).replace('.', ',')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">Nenhum pedido encontrado</h2>
                    <p className="text-gray-600 mb-6">Você ainda não fez nenhum pedido</p>
                    <a href="/" className="btn-primary">
                        Fazer primeiro pedido
                    </a>
                </div>
            )}
        </div>
    );
};

export default Orders;
