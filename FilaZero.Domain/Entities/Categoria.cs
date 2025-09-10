using System;
using System.Collections.Generic;

namespace FilaZero.Domain.Entities
{
    /// <summary>
    /// Entidade que representa uma categoria de produtos
    /// </summary>
    public class Categoria : BaseEntity
    {
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public string Cor { get; set; } = "#007bff";
        public int Ordem { get; set; }
        public bool Ativo { get; set; } = true;
        
        // Chave estrangeira
        public Guid EventoId { get; set; }
        
        // Relacionamentos
        public virtual Evento Evento { get; set; }
        public virtual ICollection<Produto> Produtos { get; set; } = new List<Produto>();
    }
}
