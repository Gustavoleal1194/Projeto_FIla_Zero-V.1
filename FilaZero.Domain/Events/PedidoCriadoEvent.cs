using System;
using FilaZero.Domain.Common;
using FilaZero.Domain.Entities;

namespace FilaZero.Domain.Events
{
    /// <summary>
    /// Evento disparado quando um pedido é criado
    /// </summary>
    public class PedidoCriadoEvent : IDomainEvent
    {
        public Guid Id { get; }
        public DateTime OccurredOn { get; }
        public Guid PedidoId { get; }
        public Guid EventoId { get; }
        public Guid? ConsumidorId { get; }
        public string NumeroPedido { get; }
        public decimal ValorTotal { get; }

        public PedidoCriadoEvent(Pedido pedido)
        {
            Id = Guid.NewGuid();
            OccurredOn = DateTime.UtcNow;
            PedidoId = pedido.Id;
            EventoId = pedido.EventoId;
            ConsumidorId = pedido.ConsumidorId ?? Guid.Empty;
            NumeroPedido = pedido.NumeroPedido;
            ValorTotal = pedido.ValorTotal;
        }
    }
}
