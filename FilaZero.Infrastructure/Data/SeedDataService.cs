using Microsoft.EntityFrameworkCore;
using FilaZero.Domain.Entities;
using System.Security.Cryptography;
using System.Text;

namespace FilaZero.Infrastructure.Data
{
    /// <summary>
    /// Serviço para popular o banco de dados com dados iniciais
    /// </summary>
    public class SeedDataService
    {
        private readonly FilaZeroDbContext _context;

        public SeedDataService(FilaZeroDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Popula o banco de dados com dados de demonstração
        /// </summary>
        public async Task SeedAsync()
        {
            // Verificar se já existem dados
            if (await _context.Usuarios.AnyAsync())
            {
                return; // Já foi populado
            }

            // Criar usuários
            var gestor1 = await CreateUsuario("Gustavo Leal", "gustavo@filazero.com", "11999999999", "Gestor", "123456");
            var gestor2 = await CreateUsuario("Maria Silva", "maria@filazero.com", "11888888888", "Gestor", "123456");
            var consumidor1 = await CreateUsuario("João Santos", "joao@email.com", "11777777777", "Consumidor", "123456");
            var consumidor2 = await CreateUsuario("Ana Costa", "ana@email.com", "11666666666", "Consumidor", "123456");

            await _context.Usuarios.AddRangeAsync(gestor1, gestor2, consumidor1, consumidor2);
            await _context.SaveChangesAsync();

            // Criar eventos
            var evento1 = new Evento
            {
                Id = Guid.NewGuid(),
                Nome = "Festival de Rock 2024",
                Descricao = "O maior festival de rock do Brasil com as melhores bandas nacionais e internacionais",
                Endereco = "Parque Ibirapuera, São Paulo",
                Cidade = "São Paulo",
                Estado = "SP",
                CEP = "04038-000",
                Telefone = "1133333333",
                Email = "contato@festivalrock.com",
                LogoUrl = "https://via.placeholder.com/200x100/FF6B35/FFFFFF?text=Festival+Rock",
                CorPrimaria = "#FF6B35",
                CorSecundaria = "#2C3E50",
                Ativo = true,
                DataInicio = DateTime.Now.AddDays(30),
                DataFim = DateTime.Now.AddDays(32),
                GestorId = gestor1.Id,
                CreatedAt = DateTime.Now,
                IsActive = true
            };

            var evento2 = new Evento
            {
                Id = Guid.NewGuid(),
                Nome = "Festa Junina do Sertão",
                Descricao = "Tradicional festa junina com comidas típicas e quadrilhas",
                Endereco = "Praça da Matriz, Campina Grande",
                Cidade = "Campina Grande",
                Estado = "PB",
                CEP = "58400-000",
                Telefone = "1183333333",
                Email = "contato@festajunina.com",
                LogoUrl = "https://via.placeholder.com/200x100/FFD700/8B4513?text=Festa+Junina",
                CorPrimaria = "#FFD700",
                CorSecundaria = "#8B4513",
                Ativo = true,
                DataInicio = DateTime.Now.AddDays(15),
                DataFim = DateTime.Now.AddDays(17),
                GestorId = gestor2.Id,
                CreatedAt = DateTime.Now,
                IsActive = true
            };

            await _context.Eventos.AddRangeAsync(evento1, evento2);
            await _context.SaveChangesAsync();

            // Criar categorias para o Festival de Rock
            var categoria1 = new Categoria
            {
                Id = Guid.NewGuid(),
                Nome = "Bebidas",
                Descricao = "Cervejas, refrigerantes e bebidas alcoólicas",
                Cor = "#FF6B35",
                Ordem = 1,
                Ativo = true,
                EventoId = evento1.Id,
                CreatedAt = DateTime.Now,
                IsActive = true
            };

            var categoria2 = new Categoria
            {
                Id = Guid.NewGuid(),
                Nome = "Lanches",
                Descricao = "Hambúrgueres, hot dogs e petiscos",
                Cor = "#E74C3C",
                Ordem = 2,
                Ativo = true,
                EventoId = evento1.Id,
                CreatedAt = DateTime.Now,
                IsActive = true
            };

            var categoria3 = new Categoria
            {
                Id = Guid.NewGuid(),
                Nome = "Doces",
                Descricao = "Sobremesas e doces tradicionais",
                Cor = "#9B59B6",
                Ordem = 3,
                Ativo = true,
                EventoId = evento1.Id,
                CreatedAt = DateTime.Now,
                IsActive = true
            };

            // Criar categorias para a Festa Junina
            var categoria4 = new Categoria
            {
                Id = Guid.NewGuid(),
                Nome = "Comidas Típicas",
                Descricao = "Pé de moleque, pamonha, canjica e outras delícias",
                Cor = "#FFD700",
                Ordem = 1,
                Ativo = true,
                EventoId = evento2.Id,
                CreatedAt = DateTime.Now,
                IsActive = true
            };

            var categoria5 = new Categoria
            {
                Id = Guid.NewGuid(),
                Nome = "Bebidas Juninas",
                Descricao = "Quentão, vinho quente e bebidas tradicionais",
                Cor = "#8B4513",
                Ordem = 2,
                Ativo = true,
                EventoId = evento2.Id,
                CreatedAt = DateTime.Now,
                IsActive = true
            };

            await _context.Categorias.AddRangeAsync(categoria1, categoria2, categoria3, categoria4, categoria5);
            await _context.SaveChangesAsync();

            // Criar produtos para o Festival de Rock
            var produtosRock = new List<Produto>
            {
                new Produto
                {
                    Id = Guid.NewGuid(),
                    Nome = "Cerveja Artesanal IPA",
                    Descricao = "Cerveja artesanal com sabor intenso de lúpulo",
                    Preco = 12.00m,
                    ImagemUrl = "https://via.placeholder.com/300x200/FF6B35/FFFFFF?text=Cerveja+IPA",
                    Disponivel = true,
                    TempoPreparoMinutos = 2,
                    Ordem = 1,
                    Destaque = true,
                    EventoId = evento1.Id,
                    CategoriaId = categoria1.Id,
                    CreatedAt = DateTime.Now,
                    IsActive = true
                },
                new Produto
                {
                    Id = Guid.NewGuid(),
                    Nome = "Hambúrguer Rock'n'Roll",
                    Descricao = "Hambúrguer com carne artesanal, queijo cheddar e molho especial",
                    Preco = 25.00m,
                    ImagemUrl = "https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=Hambúrguer",
                    Disponivel = true,
                    TempoPreparoMinutos = 15,
                    Ordem = 2,
                    Destaque = true,
                    EventoId = evento1.Id,
                    CategoriaId = categoria2.Id,
                    CreatedAt = DateTime.Now,
                    IsActive = true
                },
                new Produto
                {
                    Id = Guid.NewGuid(),
                    Nome = "Refrigerante Cola",
                    Descricao = "Refrigerante gelado de cola 350ml",
                    Preco = 6.00m,
                    ImagemUrl = "https://via.placeholder.com/300x200/2C3E50/FFFFFF?text=Refrigerante",
                    Disponivel = true,
                    TempoPreparoMinutos = 1,
                    Ordem = 3,
                    Destaque = false,
                    EventoId = evento1.Id,
                    CategoriaId = categoria1.Id,
                    CreatedAt = DateTime.Now,
                    IsActive = true
                },
                new Produto
                {
                    Id = Guid.NewGuid(),
                    Nome = "Hot Dog Completo",
                    Descricao = "Hot dog com salsicha, molho, mostarda e cebola",
                    Preco = 18.00m,
                    ImagemUrl = "https://via.placeholder.com/300x200/E74C3C/FFFFFF?text=Hot+Dog",
                    Disponivel = true,
                    TempoPreparoMinutos = 10,
                    Ordem = 4,
                    Destaque = false,
                    EventoId = evento1.Id,
                    CategoriaId = categoria2.Id,
                    CreatedAt = DateTime.Now,
                    IsActive = true
                },
                new Produto
                {
                    Id = Guid.NewGuid(),
                    Nome = "Brownie de Chocolate",
                    Descricao = "Brownie caseiro com calda de chocolate",
                    Preco = 15.00m,
                    ImagemUrl = "https://via.placeholder.com/300x200/9B59B6/FFFFFF?text=Brownie",
                    Disponivel = true,
                    TempoPreparoMinutos = 5,
                    Ordem = 5,
                    Destaque = false,
                    EventoId = evento1.Id,
                    CategoriaId = categoria3.Id,
                    CreatedAt = DateTime.Now,
                    IsActive = true
                }
            };

            // Criar produtos para a Festa Junina
            var produtosJunina = new List<Produto>
            {
                new Produto
                {
                    Id = Guid.NewGuid(),
                    Nome = "Pé de Moleque",
                    Descricao = "Doce tradicional de amendoim e rapadura",
                    Preco = 8.00m,
                    ImagemUrl = "https://via.placeholder.com/300x200/FFD700/8B4513?text=Pé+de+Moleque",
                    Disponivel = true,
                    TempoPreparoMinutos = 3,
                    Ordem = 1,
                    Destaque = true,
                    EventoId = evento2.Id,
                    CategoriaId = categoria4.Id,
                    CreatedAt = DateTime.Now,
                    IsActive = true
                },
                new Produto
                {
                    Id = Guid.NewGuid(),
                    Nome = "Pamonha",
                    Descricao = "Pamonha doce com coco ralado",
                    Preco = 12.00m,
                    ImagemUrl = "https://via.placeholder.com/300x200/FFD700/8B4513?text=Pamonha",
                    Disponivel = true,
                    TempoPreparoMinutos = 8,
                    Ordem = 2,
                    Destaque = true,
                    EventoId = evento2.Id,
                    CategoriaId = categoria4.Id,
                    CreatedAt = DateTime.Now,
                    IsActive = true
                },
                new Produto
                {
                    Id = Guid.NewGuid(),
                    Nome = "Quentão",
                    Descricao = "Bebida quente com cachaça, gengibre e especiarias",
                    Preco = 10.00m,
                    ImagemUrl = "https://via.placeholder.com/300x200/8B4513/FFD700?text=Quentão",
                    Disponivel = true,
                    TempoPreparoMinutos = 5,
                    Ordem = 3,
                    Destaque = false,
                    EventoId = evento2.Id,
                    CategoriaId = categoria5.Id,
                    CreatedAt = DateTime.Now,
                    IsActive = true
                },
                new Produto
                {
                    Id = Guid.NewGuid(),
                    Nome = "Canjica",
                    Descricao = "Doce de milho com leite condensado e canela",
                    Preco = 9.00m,
                    ImagemUrl = "https://via.placeholder.com/300x200/FFD700/8B4513?text=Canjica",
                    Disponivel = true,
                    TempoPreparoMinutos = 6,
                    Ordem = 4,
                    Destaque = false,
                    EventoId = evento2.Id,
                    CategoriaId = categoria4.Id,
                    CreatedAt = DateTime.Now,
                    IsActive = true
                }
            };

            await _context.Produtos.AddRangeAsync(produtosRock);
            await _context.Produtos.AddRangeAsync(produtosJunina);
            await _context.SaveChangesAsync();

            // Criar alguns pedidos de exemplo
            var pedido1 = new Pedido
            {
                Id = Guid.NewGuid(),
                NumeroPedido = "PED-001",
                Status = StatusPedido.Entregue,
                ValorTotal = 45.00m,
                TaxaServico = 4.50m,
                Desconto = 0.00m,
                Observacoes = "Sem cebola no hambúrguer",
                DataConfirmacao = DateTime.Now.AddHours(-2),
                DataPreparo = DateTime.Now.AddHours(-1),
                DataPronto = DateTime.Now.AddMinutes(-30),
                DataEntregue = DateTime.Now.AddMinutes(-15),
                TempoEstimadoMinutos = 20,
                EventoId = evento1.Id,
                ConsumidorId = consumidor1.Id,
                CreatedAt = DateTime.Now.AddHours(-2),
                IsActive = true
            };

            var pedido2 = new Pedido
            {
                Id = Guid.NewGuid(),
                NumeroPedido = "PED-002",
                Status = StatusPedido.EmPreparo,
                ValorTotal = 30.00m,
                TaxaServico = 3.00m,
                Desconto = 0.00m,
                Observacoes = "Quentão bem quente",
                DataConfirmacao = DateTime.Now.AddMinutes(-30),
                DataPreparo = DateTime.Now.AddMinutes(-15),
                TempoEstimadoMinutos = 15,
                EventoId = evento2.Id,
                ConsumidorId = consumidor2.Id,
                CreatedAt = DateTime.Now.AddMinutes(-30),
                IsActive = true
            };

            await _context.Pedidos.AddRangeAsync(pedido1, pedido2);
            await _context.SaveChangesAsync();

            // Criar itens dos pedidos
            var itemPedido1 = new ItemPedido
            {
                Id = Guid.NewGuid(),
                Quantidade = 2,
                PrecoUnitario = 12.00m,
                PrecoTotal = 24.00m,
                Observacoes = "Bem gelada",
                Status = StatusItem.Entregue,
                PedidoId = pedido1.Id,
                ProdutoId = produtosRock[0].Id,
                CreatedAt = DateTime.Now.AddHours(-2),
                IsActive = true
            };

            var itemPedido2 = new ItemPedido
            {
                Id = Guid.NewGuid(),
                Quantidade = 1,
                PrecoUnitario = 25.00m,
                PrecoTotal = 25.00m,
                Observacoes = "Sem cebola",
                Status = StatusItem.Entregue,
                PedidoId = pedido1.Id,
                ProdutoId = produtosRock[1].Id,
                CreatedAt = DateTime.Now.AddHours(-2),
                IsActive = true
            };

            var itemPedido3 = new ItemPedido
            {
                Id = Guid.NewGuid(),
                Quantidade = 3,
                PrecoUnitario = 10.00m,
                PrecoTotal = 30.00m,
                Observacoes = "Bem quente",
                Status = StatusItem.EmPreparo,
                PedidoId = pedido2.Id,
                ProdutoId = produtosJunina[2].Id,
                CreatedAt = DateTime.Now.AddMinutes(-30),
                IsActive = true
            };

            await _context.ItensPedido.AddRangeAsync(itemPedido1, itemPedido2, itemPedido3);
            await _context.SaveChangesAsync();

            // Criar pagamentos
            var pagamento1 = new Pagamento
            {
                Id = Guid.NewGuid(),
                TransacaoId = "TXN-001-2024",
                Valor = 45.00m,
                Status = StatusPagamento.Aprovado,
                Metodo = MetodoPagamento.CartaoCredito,
                GatewayPagamento = "Stripe",
                RespostaGateway = "Aprovado",
                DataProcessamento = DateTime.Now.AddHours(-2),
                DataConfirmacao = DateTime.Now.AddHours(-2),
                PedidoId = pedido1.Id,
                CreatedAt = DateTime.Now.AddHours(-2),
                IsActive = true
            };

            var pagamento2 = new Pagamento
            {
                Id = Guid.NewGuid(),
                TransacaoId = "TXN-002-2024",
                Valor = 30.00m,
                Status = StatusPagamento.Aprovado,
                Metodo = MetodoPagamento.PIX,
                GatewayPagamento = "PIX",
                RespostaGateway = "Aprovado",
                DataProcessamento = DateTime.Now.AddMinutes(-30),
                DataConfirmacao = DateTime.Now.AddMinutes(-30),
                PedidoId = pedido2.Id,
                CreatedAt = DateTime.Now.AddMinutes(-30),
                IsActive = true
            };

            await _context.Pagamentos.AddRangeAsync(pagamento1, pagamento2);
            await _context.SaveChangesAsync();

            Console.WriteLine("✅ Banco de dados populado com sucesso!");
        }

        private async Task<Usuario> CreateUsuario(string nome, string email, string telefone, string tipo, string senha)
        {
            var salt = GenerateSalt();
            var senhaHash = HashPassword(senha, salt);

            return new Usuario
            {
                Id = Guid.NewGuid(),
                Nome = nome,
                Email = email,
                Telefone = telefone,
                Tipo = tipo == "Gestor" ? TipoUsuario.Gestor : TipoUsuario.Consumidor,
                SenhaHash = senhaHash,
                Salt = salt,
                EmailConfirmado = true,
                UltimoLogin = DateTime.Now,
                CreatedAt = DateTime.Now,
                IsActive = true
            };
        }

        private string GenerateSalt()
        {
            var saltBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            return Convert.ToBase64String(saltBytes);
        }

        private string HashPassword(string password, string salt)
        {
            using (var sha256 = SHA256.Create())
            {
                var saltedPassword = password + salt;
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
}
