using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FilaZero.Application.Services;
using FilaZero.Application.DTOs;
using System.Security.Claims;

namespace FilaZero.Web.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PixController : ControllerBase
    {
        private readonly IPixService _pixService;
        private readonly ILogger<PixController> _logger;

        public PixController(IPixService pixService, ILogger<PixController> logger)
        {
            _pixService = pixService;
            _logger = logger;
        }

        /// <summary>
        /// Cria uma nova cobrança PIX
        /// </summary>
        [HttpPost("cobranca")]
        public async Task<IActionResult> CriarCobrancaPix([FromBody] CriarPixCobrancaDto request)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new { success = false, message = "Dados inválidos", errors = ModelState });

                var cobranca = await _pixService.CriarCobrancaPixAsync(request);

                return Ok(new { success = true, data = cobranca });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar cobrança PIX");
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Consulta uma cobrança PIX por ID
        /// </summary>
        [HttpGet("cobranca/{id}")]
        public async Task<IActionResult> ConsultarCobrancaPix(Guid id)
        {
            try
            {
                var cobranca = await _pixService.ConsultarCobrancaPixAsync(id);
                
                if (cobranca == null)
                    return NotFound(new { success = false, message = "Cobrança PIX não encontrada" });

                return Ok(new { success = true, data = cobranca });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao consultar cobrança PIX {Id}", id);
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Consulta uma cobrança PIX por TxId
        /// </summary>
        [HttpGet("cobranca/txid/{txId}")]
        public async Task<IActionResult> ConsultarCobrancaPixPorTxId(string txId)
        {
            try
            {
                var cobranca = await _pixService.ConsultarCobrancaPixPorTxIdAsync(txId);
                
                if (cobranca == null)
                    return NotFound(new { success = false, message = "Cobrança PIX não encontrada" });

                return Ok(new { success = true, data = cobranca });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao consultar cobrança PIX por TxId {TxId}", txId);
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Lista cobranças PIX de um pedido
        /// </summary>
        [HttpGet("cobranca/pedido/{pedidoId}")]
        public async Task<IActionResult> ListarCobrancasPorPedido(Guid pedidoId)
        {
            try
            {
                var cobrancas = await _pixService.ListarCobrancasPorPedidoAsync(pedidoId);
                return Ok(new { success = true, data = cobrancas });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao listar cobranças PIX para pedido {PedidoId}", pedidoId);
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Webhook para receber notificações do PSP
        /// </summary>
        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> ProcessarWebhook([FromBody] PixWebhookDto webhook)
        {
            try
            {
                _logger.LogInformation("Webhook PIX recebido. TxId: {TxId}, Evento: {Evento}", 
                    webhook.TxId, webhook.Evento);

                var sucesso = await _pixService.ProcessarWebhookAsync(webhook);

                if (sucesso)
                {
                    return Ok(new { success = true, message = "Webhook processado com sucesso" });
                }
                else
                {
                    return BadRequest(new { success = false, message = "Erro ao processar webhook" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar webhook PIX {TxId}", webhook.TxId);
                return StatusCode(500, new { success = false, message = "Erro interno do servidor" });
            }
        }

        /// <summary>
        /// Endpoint para testar webhook (desenvolvimento)
        /// </summary>
        [HttpPost("webhook/test")]
        [AllowAnonymous]
        public async Task<IActionResult> TestarWebhook([FromBody] object payload)
        {
            try
            {
                _logger.LogInformation("Webhook de teste recebido: {Payload}", payload);
                return Ok(new { success = true, message = "Webhook de teste recebido" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao processar webhook de teste");
                return StatusCode(500, new { success = false, message = "Erro interno do servidor" });
            }
        }
    }
}
