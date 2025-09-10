using System;
using System.ComponentModel.DataAnnotations;

namespace FilaZero.Domain.Entities
{
    /// <summary>
    /// Entidade que representa um pagamento de um pedido
    /// </summary>
    public class Pagamento : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string TransacaoId { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "O valor deve ser maior que zero")]
        public decimal Valor { get; set; }
        
        public StatusPagamento Status { get; set; } = StatusPagamento.Pendente;
        public MetodoPagamento Metodo { get; set; }
        
        [StringLength(100)]
        public string GatewayPagamento { get; set; }
        
        [StringLength(500)]
        public string RespostaGateway { get; set; }
        
        public DateTime? DataProcessamento { get; set; }
        public DateTime? DataConfirmacao { get; set; }
        
        // Chave estrangeira
        public Guid PedidoId { get; set; }
        
        // Relacionamento
        public virtual Pedido Pedido { get; set; }
    }

    /// <summary>
    /// Enum que define os status possíveis de um pagamento
    /// </summary>
    public enum StatusPagamento
    {
        Pendente = 1,
        Processando = 2,
        Aprovado = 3,
        Negado = 4,
        Cancelado = 5,
        Estornado = 6
    }

    /// <summary>
    /// Enum que define os métodos de pagamento aceitos
    /// </summary>
    public enum MetodoPagamento
    {
        PIX = 1,
        CartaoCredito = 2,
        CartaoDebito = 3,
        Dinheiro = 4
    }
}
