using System;
using System.Collections.Generic;

namespace FilaZero.Domain.Entities
{
    /// <summary>
    /// Entidade que representa um evento/estabelecimento
    /// </summary>
    public class Evento : BaseEntity
    {
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public string Endereco { get; set; }
        public string Cidade { get; set; }
        public string Estado { get; set; }
        public string CEP { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public string LogoUrl { get; set; }
        public string CorPrimaria { get; set; } = "#007bff";
        public string CorSecundaria { get; set; } = "#6c757d";
        public bool Ativo { get; set; } = true;
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        
        // Chaves estrangeiras
        public Guid GestorId { get; set; }
        
        // Relacionamentos
        public virtual Usuario Gestor { get; set; }
        public virtual ICollection<Produto> Produtos { get; set; } = new List<Produto>();
        public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
        public virtual ICollection<Categoria> Categorias { get; set; } = new List<Categoria>();
    }
}
