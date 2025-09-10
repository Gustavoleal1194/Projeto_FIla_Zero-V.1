using Xunit;
using FluentAssertions;
using FilaZero.Domain.Entities;
using FilaZero.Domain.Events;

namespace FilaZero.Tests.Domain.Entities
{
    public class PedidoTests
    {
        [Fact]
        public void CriarPedido_DeveAdicionarEventoDeDominio()
        {
            // Arrange
            var eventoId = Guid.NewGuid();
            var consumidorId = Guid.NewGuid();
            var itens = new List<ItemPedido>
            {
                new ItemPedido
                {
                    ProdutoId = Guid.NewGuid(),
                    Quantidade = 2,
                    PrecoUnitario = 10.50m,
                    Status = StatusItemPedido.AguardandoPreparo
                }
            };

            // Act
            var pedido = new Pedido
            {
                EventoId = eventoId,
                ConsumidorId = consumidorId,
                Status = StatusPedido.AguardandoPagamento,
                Itens = itens
            };

            // Assert
            pedido.Should().NotBeNull();
            pedido.EventoId.Should().Be(eventoId);
            pedido.ConsumidorId.Should().Be(consumidorId);
            pedido.Status.Should().Be(StatusPedido.AguardandoPagamento);
        }

        [Fact]
        public void CalcularValorTotal_DeveCalcularCorretamente()
        {
            // Arrange
            var pedido = new Pedido
            {
                EventoId = Guid.NewGuid(),
                ConsumidorId = Guid.NewGuid(),
                Status = StatusPedido.AguardandoPagamento,
                Itens = new List<ItemPedido>
                {
                    new ItemPedido
                    {
                        Quantidade = 2,
                        PrecoUnitario = 10.00m,
                        Status = StatusItemPedido.AguardandoPreparo
                    },
                    new ItemPedido
                    {
                        Quantidade = 1,
                        PrecoUnitario = 15.00m,
                        Status = StatusItemPedido.AguardandoPreparo
                    }
                }
            };

            // Act
            pedido.CalcularValorTotal();

            // Assert
            pedido.ValorTotal.Should().Be(35.00m);
        }
    }
}
