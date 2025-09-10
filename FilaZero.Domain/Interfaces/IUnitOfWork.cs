using System;
using System.Threading.Tasks;
using FilaZero.Domain.Entities;

namespace FilaZero.Domain.Interfaces
{
    /// <summary>
    /// Interface para Unit of Work pattern
    /// </summary>
    public interface IUnitOfWork : IDisposable
    {
        IRepository<Usuario> Usuarios { get; }
        IRepository<Evento> Eventos { get; }
        IRepository<Categoria> Categorias { get; }
        IRepository<Produto> Produtos { get; }
        IRepository<Pedido> Pedidos { get; }
        IRepository<ItemPedido> ItensPedido { get; }
        IRepository<Pagamento> Pagamentos { get; }
        
        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
