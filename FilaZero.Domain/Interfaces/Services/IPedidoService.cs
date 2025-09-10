using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FilaZero.Domain.Entities;

namespace FilaZero.Domain.Interfaces.Services
{
    /// <summary>
    /// Interface para serviços de pedidos
    /// </summary>
    public interface IPedidoService
    {
        Task<Pedido> CriarPedidoAsync(Pedido pedido, List<ItemPedido> itens);
        Task<Pedido> AtualizarStatusPedidoAsync(Guid pedidoId, StatusPedido novoStatus);
        Task<Pedido> ObterPedidoPorIdAsync(Guid pedidoId);
        Task<IEnumerable<Pedido>> ObterPedidosPorEventoAsync(Guid eventoId);
        Task<IEnumerable<Pedido>> ObterPedidosPorStatusAsync(Guid eventoId, StatusPedido status);
        Task<bool> CancelarPedidoAsync(Guid pedidoId, string motivo);
        Task<decimal> CalcularValorTotalAsync(List<ItemPedido> itens);
        Task<string> GerarNumeroPedidoAsync(Guid eventoId);
    }
}
