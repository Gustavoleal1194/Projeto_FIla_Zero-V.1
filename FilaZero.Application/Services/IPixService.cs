using FilaZero.Application.DTOs;

namespace FilaZero.Application.Services
{
    public interface IPixService
    {
        Task<PixCobrancaDto> CriarCobrancaPixAsync(CriarPixCobrancaDto request);
        Task<PixCobrancaDto?> ConsultarCobrancaPixAsync(Guid id);
        Task<PixCobrancaDto?> ConsultarCobrancaPixPorTxIdAsync(string txId);
        Task<bool> ProcessarWebhookAsync(PixWebhookDto webhook);
        Task<List<PixCobrancaDto>> ListarCobrancasPorPedidoAsync(Guid pedidoId);
    }
}
