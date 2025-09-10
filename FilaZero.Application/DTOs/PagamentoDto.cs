using System;
using System.ComponentModel.DataAnnotations;
using FilaZero.Domain.Entities;

namespace FilaZero.Application.DTOs
{
    /// <summary>
    /// DTO para exibição de pagamentos
    /// </summary>
    public class PagamentoDto
    {
        public Guid Id { get; set; }
        public string TransacaoId { get; set; }
        public decimal Valor { get; set; }
        public StatusPagamento Status { get; set; }
        public MetodoPagamento Metodo { get; set; }
        public string GatewayPagamento { get; set; }
        public string RespostaGateway { get; set; }
        public DateTime DataCriacao { get; set; }
        public DateTime? DataProcessamento { get; set; }
        public DateTime? DataConfirmacao { get; set; }
        public Guid PedidoId { get; set; }
    }

    /// <summary>
    /// DTO para processamento de pagamentos
    /// </summary>
    public class ProcessarPagamentoDto
    {
        [Required(ErrorMessage = "Pedido é obrigatório")]
        public Guid PedidoId { get; set; }

        [Required(ErrorMessage = "Valor é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Valor deve ser maior que zero")]
        public decimal Valor { get; set; }

        [Required(ErrorMessage = "Método de pagamento é obrigatório")]
        public MetodoPagamento Metodo { get; set; }

        [Required(ErrorMessage = "Dados do pagamento são obrigatórios")]
        public string DadosPagamento { get; set; }
    }

    /// <summary>
    /// DTO para dados de pagamento PIX
    /// </summary>
    public class DadosPagamentoPixDto
    {
        [Required(ErrorMessage = "Chave PIX é obrigatória")]
        public string ChavePix { get; set; }

        [Required(ErrorMessage = "Nome do pagador é obrigatório")]
        public string NomePagador { get; set; }

        [Required(ErrorMessage = "CPF/CNPJ é obrigatório")]
        public string CpfCnpj { get; set; }
    }

    /// <summary>
    /// DTO para dados de pagamento com cartão
    /// </summary>
    public class DadosPagamentoCartaoDto
    {
        [Required(ErrorMessage = "Número do cartão é obrigatório")]
        [CreditCard(ErrorMessage = "Número do cartão inválido")]
        public string NumeroCartao { get; set; }

        [Required(ErrorMessage = "Nome no cartão é obrigatório")]
        public string NomeCartao { get; set; }

        [Required(ErrorMessage = "CVV é obrigatório")]
        [StringLength(4, MinimumLength = 3, ErrorMessage = "CVV deve ter 3 ou 4 dígitos")]
        public string Cvv { get; set; }

        [Required(ErrorMessage = "Data de validade é obrigatória")]
        public string DataValidade { get; set; }

        [Required(ErrorMessage = "Parcelas é obrigatório")]
        [Range(1, 12, ErrorMessage = "Parcelas deve ser entre 1 e 12")]
        public int Parcelas { get; set; }
    }
}
