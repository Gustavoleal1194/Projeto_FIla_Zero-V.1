using FilaZero.Domain.Entities;

namespace FilaZero.Domain.Specifications
{
    /// <summary>
    /// Especificação para pedidos aguardando pagamento
    /// </summary>
    public class PedidosAguardandoPagamentoSpec : BaseSpecification<Pedido>
    {
        public PedidosAguardandoPagamentoSpec(Guid eventoId)
            : base(p => p.EventoId == eventoId && p.Status == StatusPedido.AguardandoPagamento)
        {
            AddInclude(p => p.Evento);
            AddInclude(p => p.Consumidor);
            AddInclude(p => p.Itens);
            AddInclude(p => p.Pagamento);
            ApplyOrderBy(p => p.CreatedAt);
        }
    }
}
