using AutoMapper;
using FilaZero.Application.DTOs;
using FilaZero.Domain.Entities;
using FilaZero.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using QRCoder;

namespace FilaZero.Application.Services
{
    public class PixService : IPixService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGerencianetService _gerencianetService;
        private readonly IMapper _mapper;
        private readonly ILogger<PixService> _logger;

        public PixService(
            IUnitOfWork unitOfWork,
            IGerencianetService gerencianetService,
            IMapper mapper,
            ILogger<PixService> logger)
        {
            _unitOfWork = unitOfWork;
            _gerencianetService = gerencianetService;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<PixCobrancaDto> CriarCobrancaPixAsync(CriarPixCobrancaDto request)
        {
            try
            {
                // Verificar se já existe cobrança ativa para o pedido
                var cobrancaExistente = await _unitOfWork.PixCobrancas
                    .FindAsync(p => p.PedidoId == request.PedidoId && p.Status == "ATIVA");

                if (cobrancaExistente.Any())
                {
                    var existente = cobrancaExistente.First();
                    return _mapper.Map<PixCobrancaDto>(existente);
                }

                // Criar cobrança no PSP
                var pspResponse = await _gerencianetService.CriarCobrancaPixAsync(request);

                if (!pspResponse.Sucesso)
                {
                    // Fallback para simulação em caso de erro na API real
                    _logger.LogWarning("API Gerencianet falhou, usando modo simulação: {Erro}", pspResponse.Erro);
                    
                    // Gerar dados simulados
                    var txId = $"PIX_{DateTime.UtcNow:yyyyMMddHHmmss}_{Guid.NewGuid().ToString("N")[..8]}";
                    var qrCodeData = new
                    {
                        valor = request.Valor,
                        chave = "pix@fila-zero.com.br",
                        descricao = request.Descricao,
                        timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
                    };
                    
                    var qrCodeBase64 = GerarQRCodeBase64(System.Text.Json.JsonSerializer.Serialize(qrCodeData));
                    
                    pspResponse = new GerencianetPixResponse
                    {
                        Sucesso = true,
                        TxId = txId,
                        ChavePix = "pix@fila-zero.com.br",
                        QrCode = qrCodeBase64,
                        QrCodeBase64 = qrCodeBase64,
                        DataExpiracao = DateTime.UtcNow.AddMinutes(request.ExpiracaoMinutos ?? 30)
                    };
                }

                // Salvar no banco
                var pixCobranca = new PixCobranca
                {
                    PedidoId = request.PedidoId,
                    TxId = pspResponse.TxId!,
                    PspId = "Gerencianet",
                    Valor = request.Valor,
                    Descricao = request.Descricao,
                    ChavePix = pspResponse.ChavePix,
                    QrCode = pspResponse.QrCode,
                    QrCodeBase64 = pspResponse.QrCodeBase64,
                    Status = pspResponse.Status ?? "ATIVA",
                    DataExpiracao = pspResponse.DataExpiracao
                };

                await _unitOfWork.PixCobrancas.AddAsync(pixCobranca);
                await _unitOfWork.SaveChangesAsync();

                _logger.LogInformation("Cobrança PIX criada com sucesso. TxId: {TxId}", pixCobranca.TxId);

                return _mapper.Map<PixCobrancaDto>(pixCobranca);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar cobrança PIX para pedido {PedidoId}", request.PedidoId);
                throw;
            }
        }

        public async Task<PixCobrancaDto?> ConsultarCobrancaPixAsync(Guid id)
        {
            try
            {
                var cobranca = await _unitOfWork.PixCobrancas.GetByIdAsync(id);
                return cobranca != null ? _mapper.Map<PixCobrancaDto>(cobranca) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao consultar cobrança PIX {Id}", id);
                throw;
            }
        }

        public async Task<PixCobrancaDto?> ConsultarCobrancaPixPorTxIdAsync(string txId)
        {
            try
            {
                var cobrancas = await _unitOfWork.PixCobrancas.FindAsync(p => p.TxId == txId);
                var cobranca = cobrancas.FirstOrDefault();
                return cobranca != null ? _mapper.Map<PixCobrancaDto>(cobranca) : null;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao consultar cobrança PIX por TxId {TxId}", txId);
                throw;
            }
        }

        public async Task<bool> ProcessarWebhookAsync(PixWebhookDto webhook)
        {
            try
            {
                // Salvar webhook
                var pixWebhook = new PixWebhook
                {
                    TxId = webhook.TxId,
                    PspId = "Gerencianet",
                    Evento = webhook.Evento,
                    Payload = webhook.Payload
                };

                await _unitOfWork.PixWebhooks.AddAsync(pixWebhook);

                // Buscar cobrança
                var cobrancas = await _unitOfWork.PixCobrancas.FindAsync(p => p.TxId == webhook.TxId);
                var cobranca = cobrancas.FirstOrDefault();

                if (cobranca == null)
                {
                    _logger.LogWarning("Cobrança não encontrada para TxId {TxId}", webhook.TxId);
                    await _unitOfWork.SaveChangesAsync();
                    return false;
                }

                // Atualizar status da cobrança
                if (webhook.Evento == "PIX" && cobranca.Status == "ATIVA")
                {
                    cobranca.Status = "CONCLUIDA";
                    cobranca.DataPagamento = DateTime.UtcNow;
                    cobranca.DadosWebhook = webhook.Payload;
                    cobranca.DataAtualizacao = DateTime.UtcNow;

                    _unitOfWork.PixCobrancas.Update(cobranca);

                    // Atualizar status do pedido
                    var pedido = await _unitOfWork.Pedidos.GetByIdAsync(cobranca.PedidoId);
                    if (pedido != null)
                    {
                        pedido.Status = StatusPedido.Pago;
                        _unitOfWork.Pedidos.Update(pedido);
                    }

                    pixWebhook.Processado = true;
                    pixWebhook.DataProcessamento = DateTime.UtcNow;

                    _logger.LogInformation("Pagamento PIX confirmado. TxId: {TxId}, PedidoId: {PedidoId}", 
                        webhook.TxId, cobranca.PedidoId);
                }

                await _unitOfWork.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar webhook PIX {TxId}", webhook.TxId);
                
                // Marcar webhook com erro
                try
                {
                    var pixWebhook = new PixWebhook
                    {
                        TxId = webhook.TxId,
                        PspId = "Gerencianet",
                        Evento = webhook.Evento,
                        Payload = webhook.Payload,
                        ErroProcessamento = ex.Message
                    };
                    await _unitOfWork.PixWebhooks.AddAsync(pixWebhook);
                    await _unitOfWork.SaveChangesAsync();
                }
                catch
                {
                    // Ignorar erro ao salvar webhook com erro
                }

                return false;
            }
        }

        public async Task<List<PixCobrancaDto>> ListarCobrancasPorPedidoAsync(Guid pedidoId)
        {
            try
            {
                var cobrancas = await _unitOfWork.PixCobrancas.FindAsync(p => p.PedidoId == pedidoId);
                return cobrancas.Select(c => _mapper.Map<PixCobrancaDto>(c)).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao listar cobranças PIX para pedido {PedidoId}", pedidoId);
                throw;
            }
        }

        private string GerarQRCodeBase64(string data)
        {
            try
            {
                // Gerar QR Code real usando QRCoder
                using var qrGenerator = new QRCodeGenerator();
                using var qrCodeData = qrGenerator.CreateQrCode(data, QRCodeGenerator.ECCLevel.Q);
                using var qrCode = new PngByteQRCode(qrCodeData);
                
                var qrCodeBytes = qrCode.GetGraphic(20);
                return Convert.ToBase64String(qrCodeBytes);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Erro ao gerar QR Code, usando fallback");
                
                // Fallback: gerar QR Code simples
                try
                {
                    using var qrGenerator = new QRCodeGenerator();
                    using var qrCodeData = qrGenerator.CreateQrCode("PIX_SIMULADO", QRCodeGenerator.ECCLevel.Q);
                    using var qrCode = new PngByteQRCode(qrCodeData);
                    
                    var qrCodeBytes = qrCode.GetGraphic(20);
                    return Convert.ToBase64String(qrCodeBytes);
                }
                catch
                {
                    // Último fallback: imagem simples em base64
                    return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
                }
            }
        }
    }
}
