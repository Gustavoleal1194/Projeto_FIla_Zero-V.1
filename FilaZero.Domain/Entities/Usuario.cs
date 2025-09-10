using System;
using System.Collections.Generic;

namespace FilaZero.Domain.Entities
{
    /// <summary>
    /// Entidade que representa um usuário do sistema (Gestor, Equipe ou Consumidor)
    /// </summary>
    public class Usuario : BaseEntity
    {
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public TipoUsuario Tipo { get; set; }
        public string SenhaHash { get; set; }
        public string Salt { get; set; }
        public bool EmailConfirmado { get; set; }
        public DateTime? UltimoLogin { get; set; }
        
        // Relacionamentos
        public virtual ICollection<Evento> Eventos { get; set; } = new List<Evento>();
        public virtual ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
    }

    /// <summary>
    /// Enum que define os tipos de usuário no sistema
    /// </summary>
    public enum TipoUsuario
    {
        Gestor = 1,
        Equipe = 2,
        Consumidor = 3
    }
}