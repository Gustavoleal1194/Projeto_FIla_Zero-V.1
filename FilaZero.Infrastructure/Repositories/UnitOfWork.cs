using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;
using FilaZero.Domain.Entities;
using FilaZero.Domain.Interfaces;
using FilaZero.Infrastructure.Data;

namespace FilaZero.Infrastructure.Repositories
{
    /// <summary>
    /// Implementação do Unit of Work pattern
    /// </summary>
    public class UnitOfWork : IUnitOfWork
    {
        private readonly FilaZeroDbContext _context;
        private IDbContextTransaction _transaction;

        public UnitOfWork(FilaZeroDbContext context)
        {
            _context = context;
            Usuarios = new Repository<Usuario>(_context);
            Eventos = new Repository<Evento>(_context);
            Categorias = new Repository<Categoria>(_context);
            Produtos = new Repository<Produto>(_context);
            Pedidos = new Repository<Pedido>(_context);
            ItensPedido = new Repository<ItemPedido>(_context);
            Pagamentos = new Repository<Pagamento>(_context);
            PixCobrancas = new Repository<PixCobranca>(_context);
            PixWebhooks = new Repository<PixWebhook>(_context);
        }

        public IRepository<Usuario> Usuarios { get; }
        public IRepository<Evento> Eventos { get; }
        public IRepository<Categoria> Categorias { get; }
        public IRepository<Produto> Produtos { get; }
        public IRepository<Pedido> Pedidos { get; }
        public IRepository<ItemPedido> ItensPedido { get; }
        public IRepository<Pagamento> Pagamentos { get; }
        public IRepository<PixCobranca> PixCobrancas { get; }
        public IRepository<PixWebhook> PixWebhooks { get; }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.CommitAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context?.Dispose();
        }
    }
}
