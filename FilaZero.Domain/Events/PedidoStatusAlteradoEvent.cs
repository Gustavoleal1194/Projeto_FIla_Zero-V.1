using System;
using FilaZero.Domain.Common;
using FilaZero.Domain.Entities;

namespace FilaZero.Domain.Events
{
    /// <summary>
    /// Evento disparado quando o status de um pedido é alterado
    /// </summary>
    public class PedidoStatusAlteradoEvent : IDomainEvent
    {
        public Guid Id { get; }
        public DateTime OccurredOn { get; }
        public Guid PedidoId { get; }
        public Guid EventoId { get; }
        public Guid? ConsumidorId { get; }
        public string NumeroPedido { get; }
        public StatusPedido StatusAnterior { get; }
        public StatusPedido NovoStatus { get; }

        public PedidoStatusAlteradoEvent(Pedido pedido, StatusPedido statusAnterior)
        {
            Id = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            PedidoId = pedido.Id;
            EventoId = pedido.EventoId;
            ConsumidorId = pedido.ConsumidorId;
            NumeroPedido = pedido.NumeroPedido;
            StatusAnterior = statusAnterior;
            NovoStatus = pedido.Status;
        }
    }
}
