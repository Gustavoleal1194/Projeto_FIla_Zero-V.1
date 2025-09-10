using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FilaZero.Domain.Entities
{
    /// <summary>
    /// Entidade que representa um produto do cardápio
    /// </summary>
    public class Produto : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Nome { get; set; }
        
        [StringLength(500)]
        public string Descricao { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "O preço deve ser maior que zero")]
        public decimal Preco { get; set; }
        
        public string ImagemUrl { get; set; }
        public bool Disponivel { get; set; } = true;
        public int TempoPreparoMinutos { get; set; } = 15;
        public int Ordem { get; set; }
        public bool Destaque { get; set; } = false;
        
        // Chaves estrangeiras
        public Guid EventoId { get; set; }
        public Guid CategoriaId { get; set; }
        
        // Relacionamentos
        public virtual Evento Evento { get; set; }
        public virtual Categoria Categoria { get; set; }
        public virtual ICollection<ItemPedido> ItensPedido { get; set; } = new List<ItemPedido>();
    }
}
