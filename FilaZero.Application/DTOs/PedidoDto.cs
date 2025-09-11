using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using FilaZero.Domain.Entities;

namespace FilaZero.Application.DTOs
{
    /// <summary>
    /// DTO para exibição de pedidos
    /// </summary>
    public class PedidoDto
    {
        public Guid Id { get; set; }
        public string NumeroPedido { get; set; } = string.Empty;
        public StatusPedido Status { get; set; }
        public decimal ValorTotal { get; set; }
        public decimal TaxaServico { get; set; }
        public decimal Desconto { get; set; }
        public string Observacoes { get; set; } = string.Empty;
        public int TempoEstimadoMinutos { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? DataAtualizacao { get; set; }
        public Guid EventoId { get; set; }
        public Guid? ConsumidorId { get; set; }
        public string ConsumidorNome { get; set; } = string.Empty;
        public List<ItemPedidoDto> Itens { get; set; } = new List<ItemPedidoDto>();
        public PagamentoDto? Pagamento { get; set; }
    }

    /// <summary>
    /// DTO para criação de pedidos
    /// </summary>
    public class CriarPedidoDto
    {
        [Required(ErrorMessage = "Evento é obrigatório")]
        public Guid EventoId { get; set; }

        [Required(ErrorMessage = "Itens são obrigatórios")]
        [MinLength(1, ErrorMessage = "Deve ter pelo menos 1 item")]
        public List<CriarItemPedidoDto> Itens { get; set; } = new List<CriarItemPedidoDto>();

        [StringLength(500, ErrorMessage = "Observações devem ter no máximo 500 caracteres")]
        public string Observacoes { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO para criação de itens do pedido
    /// </summary>
    public class CriarItemPedidoDto
    {
        [Required(ErrorMessage = "Produto é obrigatório")]
        public Guid ProdutoId { get; set; }

        [Required(ErrorMessage = "Quantidade é obrigatória")]
        [Range(1, int.MaxValue, ErrorMessage = "Quantidade deve ser maior que zero")]
        public int Quantidade { get; set; }

        [StringLength(500, ErrorMessage = "Observações devem ter no máximo 500 caracteres")]
        public string Observacoes { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO para exibição de itens do pedido
    /// </summary>
    public class ItemPedidoDto
    {
        public Guid Id { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoUnitario { get; set; }
        public decimal PrecoTotal { get; set; }
        public string Observacoes { get; set; } = string.Empty;
        public StatusItem Status { get; set; }
        public Guid PedidoId { get; set; }
        public Guid ProdutoId { get; set; }
        public string ProdutoNome { get; set; } = string.Empty;
        public string ProdutoImagemUrl { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO para atualização de status do pedido
    /// </summary>
    public class AtualizarStatusPedidoDto
    {
        [Required(ErrorMessage = "Status é obrigatório")]
        public StatusPedido Status { get; set; }
    }


}