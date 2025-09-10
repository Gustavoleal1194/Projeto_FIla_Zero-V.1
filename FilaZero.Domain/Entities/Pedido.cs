using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using FilaZero.Domain.Events;

namespace FilaZero.Domain.Entities
{
    /// <summary>
    /// Entidade que representa um pedido do consumidor
    /// </summary>
    public class Pedido : BaseEntity
    {
        [Required]
        [StringLength(20)]
        public string NumeroPedido { get; set; }
        
        public StatusPedido Status { get; set; } = StatusPedido.AguardandoPagamento;
        
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor total deve ser maior que zero")]
        public decimal ValorTotal { get; set; }
        
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "A taxa de serviço não pode ser negativa")]
        public decimal TaxaServico { get; set; } = 0;
        
        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "O valor do desconto não pode ser negativo")]
        public decimal Desconto { get; set; } = 0;
        
        public string Observacoes { get; set; }
        public DateTime? DataConfirmacao { get; set; }
        public DateTime? DataPreparo { get; set; }
        public DateTime? DataPronto { get; set; }
        public DateTime? DataEntregue { get; set; }
        public int TempoEstimadoMinutos { get; set; }
        
        // Chaves estrangeiras
        public Guid EventoId { get; set; }
        public Guid? ConsumidorId { get; set; }
        
        // Relacionamentos
        public virtual Evento Evento { get; set; }
        public virtual Usuario Consumidor { get; set; }
        public virtual ICollection<ItemPedido> Itens { get; set; } = new List<ItemPedido>();
        public virtual Pagamento Pagamento { get; set; }

        // Métodos de domínio
        public static Pedido Criar(Guid eventoId, Guid? consumidorId, List<ItemPedido> itens, string observacoes = null)
        {
            var pedido = new Pedido
            {
                EventoId = eventoId,
                ConsumidorId = consumidorId,
                Status = StatusPedido.AguardandoPagamento,
                Itens = itens,
                Observacoes = observacoes,
                NumeroPedido = GerarNumeroPedido()
            };

            pedido.CalcularValorTotal();
            pedido.AddDomainEvent(new PedidoCriadoEvent(pedido));
            
            return pedido;
        }

        public void AtualizarStatus(StatusPedido novoStatus)
        {
            var statusAnterior = Status;
            Status = novoStatus;
            
            AtualizarDataStatus(novoStatus);
            AddDomainEvent(new PedidoStatusAlteradoEvent(this, statusAnterior));
        }

        public void CalcularValorTotal()
        {
            ValorTotal = Itens.Sum(i => i.PrecoTotal) + TaxaServico - Desconto;
        }

        private void AtualizarDataStatus(StatusPedido status)
        {
            var agora = DateTime.UtcNow;
            
            switch (status)
            {
                case StatusPedido.Confirmado:
                    DataConfirmacao = agora;
                    break;
                case StatusPedido.EmPreparo:
                    DataPreparo = agora;
                    break;
                case StatusPedido.Pronto:
                    DataPronto = agora;
                    break;
                case StatusPedido.Entregue:
                    DataEntregue = agora;
                    break;
            }
        }

        private static string GerarNumeroPedido()
        {
            return $"P{DateTime.UtcNow:yyyyMMddHHmmss}{Random.Shared.Next(1000, 9999)}";
        }
    }

    /// <summary>
    /// Enum que define os status possíveis de um pedido
    /// </summary>
    public enum StatusPedido
    {
        AguardandoPagamento = 1,
        Pago = 2,
        Confirmado = 3,
        EmPreparo = 4,
        Pronto = 5,
        Entregue = 6,
        Cancelado = 7
    }
}
