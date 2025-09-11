using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FilaZero.Domain.Entities;
using FilaZero.Domain.Interfaces;
using FilaZero.Domain.Interfaces.Services;

namespace FilaZero.Application.Services
{
    /// <summary>
    /// Serviço de pedidos
    /// </summary>
    public class PedidoService : IPedidoService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PedidoService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Pedido> CriarPedidoAsync(Pedido pedido, List<ItemPedido> itens)
        {
            await _unitOfWork.BeginTransactionAsync();
            try
            {
                // Gerar número do pedido
                pedido.NumeroPedido = await GerarNumeroPedidoAsync(pedido.EventoId);
                
                // Calcular valor total
                pedido.ValorTotal = await CalcularValorTotalAsync(itens);
                
                // Adicionar pedido
                await _unitOfWork.Pedidos.AddAsync(pedido);
                await _unitOfWork.SaveChangesAsync();

                // Adicionar itens do pedido
                foreach (var item in itens)
                {
                    item.PedidoId = pedido.Id;
                    item.PrecoTotal = item.Quantidade * item.PrecoUnitario;
                }

                await _unitOfWork.ItensPedido.AddRangeAsync(itens);
                await _unitOfWork.SaveChangesAsync();

                await _unitOfWork.CommitTransactionAsync();
                return pedido;
            }
            catch
            {
                await _unitOfWork.RollbackTransactionAsync();
                throw;
            }
        }

        public async Task<Pedido> AtualizarStatusPedidoAsync(Guid pedidoId, StatusPedido novoStatus)
        {
            var pedido = await _unitOfWork.Pedidos.GetByIdAsync(pedidoId);
            if (pedido == null)
                throw new ArgumentException("Pedido não encontrado");

            var statusAnterior = pedido.Status;
            pedido.Status = novoStatus;
            pedido.UpdatedAt = DateTime.UtcNow;

            // Atualizar timestamps baseado no status
            switch (novoStatus)
            {
                case StatusPedido.Confirmado:
                    pedido.DataConfirmacao = DateTime.UtcNow;
                    break;
                case StatusPedido.EmPreparo:
                    pedido.DataPreparo = DateTime.UtcNow;
                    break;
                case StatusPedido.Pronto:
                    pedido.DataPronto = DateTime.UtcNow;
                    break;
                case StatusPedido.Entregue:
                    pedido.DataEntregue = DateTime.UtcNow;
                    break;
            }

            _unitOfWork.Pedidos.Update(pedido);
            await _unitOfWork.SaveChangesAsync();

            return pedido;
        }

        public async Task<Pedido> ObterPedidoPorIdAsync(Guid pedidoId)
        {
            return await _unitOfWork.Pedidos.GetByIdAsync(pedidoId);
        }

        public async Task<IEnumerable<Pedido>> ObterPedidosPorEventoAsync(Guid eventoId)
        {
            return await _unitOfWork.Pedidos.FindAsync(p => p.EventoId == eventoId);
        }

        public async Task<IEnumerable<Pedido>> ObterPedidosPorStatusAsync(Guid eventoId, StatusPedido status)
        {
            return await _unitOfWork.Pedidos.FindAsync(p => p.EventoId == eventoId && p.Status == status);
        }

        public async Task<bool> CancelarPedidoAsync(Guid pedidoId, string motivo)
        {
            var pedido = await _unitOfWork.Pedidos.GetByIdAsync(pedidoId);
            if (pedido == null)
                return false;

            // Só pode cancelar se ainda não foi confirmado
            if (pedido.Status != StatusPedido.AguardandoPagamento && pedido.Status != StatusPedido.Pago)
                return false;

            pedido.Status = StatusPedido.Cancelado;
            pedido.Observacoes = string.IsNullOrEmpty(pedido.Observacoes) 
                ? $"Cancelado: {motivo}" 
                : $"{pedido.Observacoes} | Cancelado: {motivo}";
            pedido.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Pedidos.Update(pedido);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public Task<decimal> CalcularValorTotalAsync(List<ItemPedido> itens)
        {
            return Task.FromResult(itens.Sum(item => item.Quantidade * item.PrecoUnitario));
        }

        public async Task<string> GerarNumeroPedidoAsync(Guid eventoId)
        {
            var evento = await _unitOfWork.Eventos.GetByIdAsync(eventoId);
            if (evento == null)
                throw new ArgumentException("Evento não encontrado");

            var hoje = DateTime.UtcNow.Date;
            var pedidosHoje = await _unitOfWork.Pedidos.CountAsync(p => 
                p.EventoId == eventoId && 
                p.CreatedAt.Date == hoje);

            var numero = pedidosHoje + 1;
            return $"{evento.Nome.Substring(0, 3).ToUpper()}{hoje:ddMMyyyy}{numero:D4}";
        }
    }
}
