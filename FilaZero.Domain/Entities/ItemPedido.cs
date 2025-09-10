using System;
using System.ComponentModel.DataAnnotations;

namespace FilaZero.Domain.Entities
{
    /// <summary>
    /// Entidade que representa um item individual de um pedido
    /// </summary>
    public class ItemPedido : BaseEntity
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "A quantidade deve ser maior que zero")]
        public int Quantidade { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "O preço unitário deve ser maior que zero")]
        public decimal PrecoUnitario { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "O preço total deve ser maior que zero")]
        public decimal PrecoTotal { get; set; }
        
        public string Observacoes { get; set; }
        public StatusItem Status { get; set; } = StatusItem.Aguardando;
        
        // Chaves estrangeiras
        public Guid PedidoId { get; set; }
        public Guid ProdutoId { get; set; }
        
        // Relacionamentos
        public virtual Pedido Pedido { get; set; }
        public virtual Produto Produto { get; set; }
    }

    /// <summary>
    /// Enum que define os status possíveis de um item do pedido
    /// </summary>
    public enum StatusItem
    {
        Aguardando = 1,
        EmPreparo = 2,
        Pronto = 3,
        Entregue = 4,
        Cancelado = 5
    }
}
