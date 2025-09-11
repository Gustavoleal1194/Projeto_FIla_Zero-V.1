using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FilaZero.Domain.Interfaces;
using FilaZero.Domain.Entities;
using FilaZero.Domain.Interfaces.Services;
using FilaZero.Application.Services;
using System.Security.Claims;
using System.Text.Json;
using FilaZero.Application.DTOs;

namespace FilaZero.Web.Controllers
{
    /// <summary>
    /// Controller para operações de pagamento
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPagamentoService _pagamentoService;
        private readonly IPixService _pixService;

        public PaymentController(IUnitOfWork unitOfWork, IPagamentoService pagamentoService, IPixService pixService)
        {
            _unitOfWork = unitOfWork;
            _pagamentoService = pagamentoService;
            _pixService = pixService;
        }

        /// <summary>
        /// Processa um pagamento
        /// </summary>
        /// <param name="data">Dados do pagamento</param>
        /// <returns>Resultado do processamento</returns>
        [HttpPost("processar")]
        public async Task<IActionResult> ProcessarPagamento([FromBody] ProcessarPagamentoDto data)
        {
            try
            {
                // Buscar o pedido
                var pedido = await _unitOfWork.Pedidos.GetByIdAsync(Guid.Parse(data.PedidoId));
                if (pedido == null)
                    return NotFound(new { success = false, message = "Pedido não encontrado" });

                // Validar valor
                if (Math.Abs(pedido.ValorTotal - data.Valor) > 0.01m)
                    return BadRequest(new { success = false, message = "Valor do pagamento não confere com o pedido" });

                // Criar pagamento
                var pagamento = new Pagamento
                {
                    PedidoId = pedido.Id,
                    Valor = data.Valor,
                    Metodo = Enum.Parse<MetodoPagamento>(data.Metodo),
                    Status = StatusPagamento.Pendente,
                    RespostaGateway = data.DadosPagamento,
                    DataProcessamento = DateTime.UtcNow
                };

                await _unitOfWork.Pagamentos.AddAsync(pagamento);
                await _unitOfWork.SaveChangesAsync();

                // Processar baseado no método
                var response = await ProcessarPorMetodo(pagamento, data);

                return Ok(new { success = true, data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém um pagamento por ID
        /// </summary>
        /// <param name="id">ID do pagamento</param>
        /// <returns>Dados do pagamento</returns>
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetPagamento(Guid id)
        {
            try
            {
                var pagamento = await _unitOfWork.Pagamentos.GetByIdAsync(id);
                if (pagamento == null)
                    return NotFound(new { success = false, message = "Pagamento não encontrado" });

                var response = new
                {
                    id = pagamento.Id,
                    pedidoId = pagamento.PedidoId,
                    valor = pagamento.Valor,
                    metodo = pagamento.Metodo.ToString(),
                    status = pagamento.Status.ToString(),
                    dadosPagamento = pagamento.RespostaGateway,
                    dataPagamento = pagamento.DataProcessamento,
                    transacaoId = pagamento.TransacaoId
                };

                return Ok(new { success = true, data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém pagamentos do usuário
        /// </summary>
        /// <returns>Lista de pagamentos</returns>
        [HttpGet("usuario")]
        [Authorize]
        public async Task<IActionResult> GetPagamentosByUsuario()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                var pagamentos = await _unitOfWork.Pagamentos.FindAsync(p => p.Pedido.ConsumidorId == userId);
                var pagamentosDto = pagamentos.Select(p => new
                {
                    id = p.Id,
                    pedidoId = p.PedidoId,
                    valor = p.Valor,
                    metodo = p.Metodo.ToString(),
                    status = p.Status.ToString(),
                    dataPagamento = p.DataProcessamento,
                    transacaoId = p.TransacaoId
                }).ToList();

                return Ok(new { success = true, data = pagamentosDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Confirma um pagamento
        /// </summary>
        /// <param name="id">ID do pagamento</param>
        /// <returns>Resultado da confirmação</returns>
        [HttpPost("{id}/confirmar")]
        [Authorize]
        public async Task<IActionResult> ConfirmarPagamento(Guid id)
        {
            try
            {
                var pagamento = await _unitOfWork.Pagamentos.GetByIdAsync(id);
                if (pagamento == null)
                    return NotFound(new { success = false, message = "Pagamento não encontrado" });

                // Verificar se o usuário tem permissão
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                var pedido = await _unitOfWork.Pedidos.GetByIdAsync(pagamento.PedidoId);
                if (pedido.ConsumidorId != userId)
                    return Forbid("Você não tem permissão para confirmar este pagamento");

                // Atualizar status
                pagamento.Status = StatusPagamento.Aprovado;
                pagamento.DataConfirmacao = DateTime.UtcNow;
                _unitOfWork.Pagamentos.Update(pagamento);

                // Atualizar status do pedido
                pedido.Status = StatusPedido.Pago;
                _unitOfWork.Pedidos.Update(pedido);

                await _unitOfWork.SaveChangesAsync();

                return Ok(new { success = true, message = "Pagamento confirmado com sucesso" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Gera QR Code PIX
        /// </summary>
        /// <param name="pedidoId">ID do pedido</param>
        /// <returns>QR Code PIX</returns>
        [HttpPost("pix/qrcode")]
        public async Task<IActionResult> GerarQRCodePix([FromBody] GerarQRCodePixDto data)
        {
            try
            {
                var pedido = await _unitOfWork.Pedidos.GetByIdAsync(data.PedidoId);
                if (pedido == null)
                    return NotFound(new { success = false, message = "Pedido não encontrado" });

                // Gerar QR Code PIX (simulação)
                var qrCodeData = new
                {
                    valor = pedido.ValorTotal,
                    chave = "pix@fila-zero.com.br",
                    descricao = $"Pedido {pedido.NumeroPedido}",
                    timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
                };

                // Em produção, integrar com API de PIX real (Mercado Pago, PagSeguro, etc.)
                var qrCodeBase64 = GerarQRCodeBase64(JsonSerializer.Serialize(qrCodeData));

                var response = new
                {
                    qrCode = qrCodeBase64,
                    chavePix = "pix@fila-zero.com.br",
                    valor = pedido.ValorTotal,
                    descricao = $"Pedido {pedido.NumeroPedido}",
                    expiracao = DateTime.UtcNow.AddMinutes(15).ToString("yyyy-MM-ddTHH:mm:ssZ")
                };

                return Ok(new { success = true, data = response });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        private async Task<object> ProcessarPorMetodo(Pagamento pagamento, ProcessarPagamentoDto data)
        {
            switch (pagamento.Metodo)
            {
                case MetodoPagamento.PIX:
                    return await ProcessarPix(pagamento, data);
                case MetodoPagamento.CartaoCredito:
                case MetodoPagamento.CartaoDebito:
                    return await ProcessarCartao(pagamento, data);
                case MetodoPagamento.Dinheiro:
                    return await ProcessarDinheiro(pagamento, data);
                default:
                    throw new ArgumentException("Método de pagamento não suportado");
            }
        }

        private async Task<object> ProcessarPix(Pagamento pagamento, ProcessarPagamentoDto data)
        {
            try
            {
                // Criar cobrança PIX real
                var pixRequest = new CriarPixCobrancaDto
                {
                    PedidoId = pagamento.PedidoId,
                    Valor = pagamento.Valor,
                    Descricao = $"Pedido {pagamento.PedidoId}",
                    ExpiracaoMinutos = 30
                };

                var pixCobranca = await _pixService.CriarCobrancaPixAsync(pixRequest);

                // Atualizar pagamento com dados do PIX
                pagamento.TransacaoId = pixCobranca.TxId;
                pagamento.GatewayPagamento = "Gerencianet PIX";
                pagamento.Status = StatusPagamento.Pendente;
                pagamento.RespostaGateway = JsonSerializer.Serialize(new
                {
                    qrCode = pixCobranca.QrCode,
                    qrCodeBase64 = pixCobranca.QrCodeBase64,
                    chavePix = pixCobranca.ChavePix,
                    expiracao = pixCobranca.DataExpiracao
                });

                _unitOfWork.Pagamentos.Update(pagamento);
                await _unitOfWork.SaveChangesAsync();

                return new
                {
                    transacaoId = pagamento.TransacaoId,
                    status = pagamento.Status.ToString(),
                    message = "PIX gerado com sucesso",
                    qrCode = pixCobranca.QrCodeBase64,
                    chavePix = pixCobranca.ChavePix,
                    valor = pixCobranca.Valor,
                    expiracao = pixCobranca.DataExpiracao
                };
            }
            catch (Exception ex)
            {
                // Fallback para simulação em caso de erro
                var qrCodeData = new
                {
                    valor = pagamento.Valor,
                    chave = "pix@fila-zero.com.br", // Simulação
                    descricao = $"Pedido {pagamento.PedidoId}",
                    timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds()
                };

                var qrCodeBase64 = GerarQRCodeBase64(JsonSerializer.Serialize(qrCodeData));
                var transacaoId = $"PIX_{DateTime.UtcNow:yyyyMMddHHmmss}_{Guid.NewGuid().ToString("N")[..8]}";

                pagamento.TransacaoId = transacaoId;
                pagamento.GatewayPagamento = "Simulado PIX (Erro)";
                pagamento.Status = StatusPagamento.Pendente;
                _unitOfWork.Pagamentos.Update(pagamento);
                await _unitOfWork.SaveChangesAsync();

                return new
                {
                    transacaoId,
                    status = "Pendente",
                    message = "PIX gerado (modo simulação - erro na integração)",
                    qrCode = qrCodeBase64,
                    chavePix = "pix@fila-zero.com.br",
                    valor = pagamento.Valor,
                    expiracao = DateTime.UtcNow.AddMinutes(15).ToString("yyyy-MM-ddTHH:mm:ssZ")
                };
            }
        }

        private async Task<object> ProcessarCartao(Pagamento pagamento, ProcessarPagamentoDto data)
        {
            // Simulação de processamento de cartão
            var transacaoId = $"CARD_{DateTime.UtcNow:yyyyMMddHHmmss}_{Guid.NewGuid().ToString("N")[..8]}";
            
            // Simular aprovação (90% de sucesso)
            var isAprovado = new Random().NextDouble() > 0.1;
            
            pagamento.TransacaoId = transacaoId;
            pagamento.Status = isAprovado ? StatusPagamento.Aprovado : StatusPagamento.Negado;
            _unitOfWork.Pagamentos.Update(pagamento);

            if (isAprovado)
            {
                var pedido = await _unitOfWork.Pedidos.GetByIdAsync(pagamento.PedidoId);
                pedido.Status = StatusPedido.Pago;
                _unitOfWork.Pedidos.Update(pedido);
            }

            await _unitOfWork.SaveChangesAsync();

            return new
            {
                transacaoId,
                status = isAprovado ? "Aprovado" : "Rejeitado",
                message = isAprovado ? "Pagamento aprovado" : "Pagamento rejeitado"
            };
        }

        private async Task<object> ProcessarDinheiro(Pagamento pagamento, ProcessarPagamentoDto data)
        {
            var transacaoId = $"CASH_{DateTime.UtcNow:yyyyMMddHHmmss}_{Guid.NewGuid().ToString("N")[..8]}";
            
            pagamento.TransacaoId = transacaoId;
            pagamento.Status = StatusPagamento.Pendente;
            _unitOfWork.Pagamentos.Update(pagamento);
            await _unitOfWork.SaveChangesAsync();

            return new
            {
                transacaoId,
                status = "Pendente",
                message = "Pagamento em dinheiro - aguardando confirmação na retirada"
            };
        }

        private string GerarQRCodeBase64(string data)
        {
            // Simulação de geração de QR Code
            // Em produção, usar biblioteca como QRCoder ou integrar com serviço externo
            var qrCodeImage = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"QR_CODE_PLACEHOLDER_{data}"));
            return $"data:image/png;base64,{qrCodeImage}";
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim != null ? Guid.Parse(userIdClaim.Value) : null;
        }
    }

    public class ProcessarPagamentoDto
    {
        public string PedidoId { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public string Metodo { get; set; } = string.Empty;
        public string DadosPagamento { get; set; } = string.Empty;
    }

    public class GerarQRCodePixDto
    {
        public Guid PedidoId { get; set; }
    }
}
