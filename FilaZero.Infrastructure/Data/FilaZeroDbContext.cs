using Microsoft.EntityFrameworkCore;
using FilaZero.Domain.Entities;

namespace FilaZero.Infrastructure.Data
{
    /// <summary>
    /// Contexto do Entity Framework para o Fila Zero
    /// </summary>
    public class FilaZeroDbContext : DbContext
    {
        public FilaZeroDbContext(DbContextOptions<FilaZeroDbContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Produto> Produtos { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<ItemPedido> ItensPedido { get; set; }
        public DbSet<Pagamento> Pagamentos { get; set; }
        public DbSet<PixCobranca> PixCobrancas { get; set; }
        public DbSet<PixWebhook> PixWebhooks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configurações das entidades
            ConfigureUsuario(modelBuilder);
            ConfigureEvento(modelBuilder);
            ConfigureCategoria(modelBuilder);
            ConfigureProduto(modelBuilder);
            ConfigurePedido(modelBuilder);
            ConfigureItemPedido(modelBuilder);
            ConfigurePagamento(modelBuilder);
            ConfigurePixCobranca(modelBuilder);
            ConfigurePixWebhook(modelBuilder);
        }

        private void ConfigureUsuario(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Telefone).HasMaxLength(20);
                entity.Property(e => e.SenhaHash).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Salt).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Tipo).IsRequired();
                
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.Telefone);
            });
        }


        private void ConfigureEvento(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Evento>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Descricao).HasMaxLength(500);
                entity.Property(e => e.Endereco).HasMaxLength(200);
                entity.Property(e => e.Cidade).HasMaxLength(100);
                entity.Property(e => e.Estado).HasMaxLength(50);
                entity.Property(e => e.CEP).HasMaxLength(10);
                entity.Property(e => e.Telefone).HasMaxLength(20);
                entity.Property(e => e.Email).HasMaxLength(100);
                entity.Property(e => e.LogoUrl).HasMaxLength(500);
                entity.Property(e => e.CorPrimaria).HasMaxLength(7).HasDefaultValue("#007bff");
                entity.Property(e => e.CorSecundaria).HasMaxLength(7).HasDefaultValue("#6c757d");

                entity.HasOne(e => e.Gestor)
                    .WithMany(u => u.Eventos)
                    .HasForeignKey(e => e.GestorId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }

        private void ConfigureCategoria(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Descricao).HasMaxLength(500);
                entity.Property(e => e.Cor).HasMaxLength(7).HasDefaultValue("#007bff");
                entity.Property(e => e.Ordem).IsRequired();

                entity.HasOne(e => e.Evento)
                    .WithMany(ev => ev.Categorias)
                    .HasForeignKey(e => e.EventoId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        private void ConfigureProduto(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Produto>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Descricao).HasMaxLength(500);
                entity.Property(e => e.Preco).IsRequired().HasColumnType("decimal(10,2)");
                entity.Property(e => e.ImagemUrl).HasMaxLength(500);
                entity.Property(e => e.TempoPreparoMinutos).IsRequired().HasDefaultValue(15);
                entity.Property(e => e.Ordem).IsRequired();

                entity.HasOne(e => e.Evento)
                    .WithMany(ev => ev.Produtos)
                    .HasForeignKey(e => e.EventoId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Categoria)
                    .WithMany(c => c.Produtos)
                    .HasForeignKey(e => e.CategoriaId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }

        private void ConfigurePedido(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pedido>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.NumeroPedido).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Status).IsRequired();
                entity.Property(e => e.ValorTotal).IsRequired().HasColumnType("decimal(10,2)");
                entity.Property(e => e.TaxaServico).IsRequired().HasColumnType("decimal(10,2)").HasDefaultValue(0);
                entity.Property(e => e.Desconto).IsRequired().HasColumnType("decimal(10,2)").HasDefaultValue(0);
                entity.Property(e => e.Observacoes).HasMaxLength(500);
                entity.Property(e => e.TempoEstimadoMinutos).IsRequired();

                entity.HasIndex(e => e.NumeroPedido).IsUnique();

                entity.HasOne(e => e.Evento)
                    .WithMany(ev => ev.Pedidos)
                    .HasForeignKey(e => e.EventoId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(e => e.Consumidor)
                    .WithMany(u => u.Pedidos)
                    .HasForeignKey(e => e.ConsumidorId)
                    .OnDelete(DeleteBehavior.SetNull);
            });
        }

        private void ConfigureItemPedido(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ItemPedido>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Quantidade).IsRequired();
                entity.Property(e => e.PrecoUnitario).IsRequired().HasColumnType("decimal(10,2)");
                entity.Property(e => e.PrecoTotal).IsRequired().HasColumnType("decimal(10,2)");
                entity.Property(e => e.Observacoes).HasMaxLength(500);
                entity.Property(e => e.Status).IsRequired();

                entity.HasOne(e => e.Pedido)
                    .WithMany(p => p.Itens)
                    .HasForeignKey(e => e.PedidoId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Produto)
                    .WithMany(pr => pr.ItensPedido)
                    .HasForeignKey(e => e.ProdutoId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
        }

        private void ConfigurePagamento(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pagamento>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TransacaoId).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Valor).IsRequired().HasColumnType("decimal(10,2)");
                entity.Property(e => e.Status).IsRequired();
                entity.Property(e => e.Metodo).IsRequired();
                entity.Property(e => e.GatewayPagamento).HasMaxLength(100);
                entity.Property(e => e.RespostaGateway).HasMaxLength(500);

                entity.HasIndex(e => e.TransacaoId).IsUnique();

                entity.HasOne(e => e.Pedido)
                    .WithOne(p => p.Pagamento)
                    .HasForeignKey<Pagamento>(e => e.PedidoId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        private void ConfigurePixCobranca(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PixCobranca>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TxId).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PspId).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Valor).IsRequired().HasColumnType("decimal(10,2)");
                entity.Property(e => e.Descricao).IsRequired().HasMaxLength(500);
                entity.Property(e => e.ChavePix).HasMaxLength(100);
                entity.Property(e => e.QrCode).HasMaxLength(1000);
                entity.Property(e => e.QrCodeBase64).HasMaxLength(5000);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(100);
                entity.Property(e => e.IdPagamento).HasMaxLength(100);
                entity.Property(e => e.DadosWebhook).HasMaxLength(1000);

                entity.HasIndex(e => e.TxId).IsUnique();
                entity.HasIndex(e => e.PedidoId);

                entity.HasOne(e => e.Pedido)
                    .WithMany()
                    .HasForeignKey(e => e.PedidoId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }

        private void ConfigurePixWebhook(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PixWebhook>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TxId).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PspId).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Evento).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Payload).IsRequired();
                entity.Property(e => e.ErroProcessamento).HasMaxLength(500);

                entity.HasIndex(e => e.TxId);
                entity.HasIndex(e => e.Processado);
            });
        }
    }
}
