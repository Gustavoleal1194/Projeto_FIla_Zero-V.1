namespace FilaZero.Application.DTOs
{
    public class PixCobrancaDto
    {
        public Guid Id { get; set; }
        public Guid PedidoId { get; set; }
        public string TxId { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public string? ChavePix { get; set; }
        public string? QrCode { get; set; }
        public string? QrCodeBase64 { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime? DataExpiracao { get; set; }
        public DateTime? DataPagamento { get; set; }
        public DateTime DataCriacao { get; set; }
    }

    public class CriarPixCobrancaDto
    {
        public Guid PedidoId { get; set; }
        public decimal Valor { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public string? ChavePix { get; set; }
        public int? ExpiracaoMinutos { get; set; } = 30; // Padrão 30 minutos
    }

    public class PixWebhookDto
    {
        public string TxId { get; set; } = string.Empty;
        public string Evento { get; set; } = string.Empty;
        public string Payload { get; set; } = string.Empty;
    }
}
