using System.ComponentModel.DataAnnotations;

namespace FilaZero.Domain.Entities
{
    public class PixWebhook : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string TxId { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string PspId { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Evento { get; set; } = string.Empty; // PIX, DEVOLUCAO, etc.

        [Required]
        public string Payload { get; set; } = string.Empty; // JSON completo do webhook

        public DateTime DataRecebimento { get; set; } = DateTime.UtcNow;

        public bool Processado { get; set; } = false;

        public DateTime? DataProcessamento { get; set; }

        [StringLength(500)]
        public string? ErroProcessamento { get; set; }
    }
}
