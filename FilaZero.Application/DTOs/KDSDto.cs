using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using FilaZero.Domain.Entities;

namespace FilaZero.Application.DTOs
{
    /// <summary>
    /// DTO para exibição de pedidos no KDS
    /// </summary>
    public class PedidoKDSDto
    {
        public Guid Id { get; set; }
        public string NumeroPedido { get; set; } = string.Empty;
        public StatusPedido Status { get; set; }
        public decimal ValorTotal { get; set; }
        public string Observacoes { get; set; } = string.Empty;
        public int TempoEstimadoMinutos { get; set; }
        public DateTime DataCriacao { get; set; }
        public string ConsumidorNome { get; set; } = string.Empty;
        public List<ItemPedidoKDSDto> Itens { get; set; } = new List<ItemPedidoKDSDto>();
    }

    /// <summary>
    /// DTO para exibição de itens do pedido no KDS
    /// </summary>
    public class ItemPedidoKDSDto
    {
        public Guid Id { get; set; }
        public int Quantidade { get; set; }
        public string ProdutoNome { get; set; } = string.Empty;
        public string Observacoes { get; set; } = string.Empty;
        public StatusItem Status { get; set; }
        public int TempoPreparoMinutos { get; set; }
    }

    /// <summary>
    /// DTO para atualização de status de item
    /// </summary>
    public class AtualizarStatusItemDto
    {
        [Required(ErrorMessage = "Status é obrigatório")]
        public StatusItem Status { get; set; }
    }

    /// <summary>
    /// DTO para estatísticas do KDS
    /// </summary>
    public class EstatisticasKDSDto
    {
        public int TotalPedidos { get; set; }
        public int PedidosHoje { get; set; }
        public int PedidosAguardando { get; set; }
        public int PedidosPagos { get; set; }
        public int PedidosPreparando { get; set; }
        public int PedidosProntos { get; set; }
        public int PedidosEntregues { get; set; }
        public int PedidosCancelados { get; set; }
        public decimal ValorTotalVendido { get; set; }
        public double TempoMedioPreparo { get; set; }
    }
}
