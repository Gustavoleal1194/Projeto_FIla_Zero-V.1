using System.ComponentModel.DataAnnotations;

namespace FilaZero.Domain.Entities
{
    public class PixCobranca : BaseEntity
    {
        [Required]
        public Guid PedidoId { get; set; }
        public Pedido Pedido { get; set; }

        [Required]
        [StringLength(100)]
        public string TxId { get; set; } = string.Empty; // ID da transação no PSP

        [Required]
        [StringLength(100)]
        public string PspId { get; set; } = string.Empty; // ID do PSP (Gerencianet, etc.)

        [Required]
        public decimal Valor { get; set; }

        [Required]
        [StringLength(500)]
        public string Descricao { get; set; } = string.Empty;

        [StringLength(100)]
        public string? ChavePix { get; set; }

        [StringLength(1000)]
        public string? QrCode { get; set; } // URL do QR Code

        [StringLength(5000)]
        public string? QrCodeBase64 { get; set; } // QR Code em base64

        [StringLength(100)]
        public string? Status { get; set; } = "ATIVA"; // ATIVA, CONCLUIDA, REMOVIDA_PELO_USUARIO_RECEBEDOR, REMOVIDA_PELO_PSP

        public DateTime? DataExpiracao { get; set; }

        public DateTime? DataPagamento { get; set; }

        [StringLength(100)]
        public string? IdPagamento { get; set; } // ID do pagamento no PSP

        [StringLength(1000)]
        public string? DadosWebhook { get; set; } // JSON do webhook recebido

        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;

        public DateTime? DataAtualizacao { get; set; }
    }
}
