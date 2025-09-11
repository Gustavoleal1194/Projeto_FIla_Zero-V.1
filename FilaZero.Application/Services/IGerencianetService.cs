using FilaZero.Application.DTOs;

namespace FilaZero.Application.Services
{
    public interface IGerencianetService
    {
        Task<string> ObterTokenAcessoAsync();
        Task<GerencianetPixResponse> CriarCobrancaPixAsync(CriarPixCobrancaDto request);
        Task<GerencianetPixResponse> ConsultarCobrancaPixAsync(string txId);
        Task<bool> ValidarWebhookAsync(string payload, string signature);
    }

    public class GerencianetPixResponse
    {
        public bool Sucesso { get; set; }
        public string? TxId { get; set; }
        public string? QrCode { get; set; }
        public string? QrCodeBase64 { get; set; }
        public string? ChavePix { get; set; }
        public string? Status { get; set; }
        public DateTime? DataExpiracao { get; set; }
        public string? Erro { get; set; }
        public int? CodigoErro { get; set; }
    }
}
