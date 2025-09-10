using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FilaZero.Application.DTOs;
using FilaZero.Domain.Interfaces;
using FilaZero.Domain.Interfaces.Services;
using FilaZero.Domain.Entities;
using System.Security.Claims;

namespace FilaZero.Web.Controllers
{
    /// <summary>
    /// Controller para operações de pagamentos
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PagamentosController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPagamentoService _pagamentoService;

        public PagamentosController(IUnitOfWork unitOfWork, IPagamentoService pagamentoService)
        {
            _unitOfWork = unitOfWork;
            _pagamentoService = pagamentoService;
        }

        /// <summary>
        /// Processa um pagamento
        /// </summary>
        /// <param name="processarPagamentoDto">Dados do pagamento</param>
        /// <returns>Resultado do pagamento</returns>
        [HttpPost("processar")]
        [Authorize]
        public async Task<IActionResult> ProcessarPagamento([FromBody] ProcessarPagamentoDto processarPagamentoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Dados inválidos", errors = ModelState });

            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                // Verificar se o pedido existe e pertence ao usuário
                var pedido = await _unitOfWork.Pedidos.GetByIdAsync(processarPagamentoDto.PedidoId);
                if (pedido == null)
                    return NotFound(new { success = false, message = "Pedido não encontrado" });

                if (pedido.ConsumidorId != userId)
                    return Forbid("Você não tem permissão para pagar este pedido");

                if (pedido.Status != StatusPedido.AguardandoPagamento)
                    return BadRequest(new { success = false, message = "Pedido não está aguardando pagamento" });

                // Processar pagamento
                var pagamento = await _pagamentoService.ProcessarPagamentoAsync(
                    pedido,
                    processarPagamentoDto.Metodo,
                    processarPagamentoDto.DadosPagamento
                );

                if (pagamento == null)
                    return BadRequest(new { success = false, message = "Erro ao processar pagamento" });

                var pagamentoDto = new PagamentoDto
                {
                    Id = pagamento.Id,
                    TransacaoId = pagamento.TransacaoId,
                    Valor = pagamento.Valor,
                    Status = pagamento.Status,
                    Metodo = pagamento.Metodo,
                    GatewayPagamento = pagamento.GatewayPagamento,
                    RespostaGateway = pagamento.RespostaGateway,
                    DataCriacao = pagamento.CreatedAt,
                    DataProcessamento = pagamento.DataProcessamento,
                    DataConfirmacao = pagamento.DataConfirmacao,
                    PedidoId = pagamento.PedidoId
                };

                return Ok(new { success = true, data = pagamentoDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém pagamento por ID
        /// </summary>
        /// <param name="id">ID do pagamento</param>
        /// <returns>Pagamento</returns>
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetPagamento(Guid id)
        {
            try
            {
                var pagamento = await _unitOfWork.Pagamentos.GetByIdAsync(id);
                if (pagamento == null)
                    return NotFound(new { success = false, message = "Pagamento não encontrado" });

                var userId = GetCurrentUserId();
                var pedido = await _unitOfWork.Pedidos.GetByIdAsync(pagamento.PedidoId);
                
                if (pedido?.ConsumidorId != userId)
                    return Forbid("Você não tem permissão para visualizar este pagamento");

                var pagamentoDto = new PagamentoDto
                {
                    Id = pagamento.Id,
                    TransacaoId = pagamento.TransacaoId,
                    Valor = pagamento.Valor,
                    Status = pagamento.Status,
                    Metodo = pagamento.Metodo,
                    GatewayPagamento = pagamento.GatewayPagamento,
                    RespostaGateway = pagamento.RespostaGateway,
                    DataCriacao = pagamento.CreatedAt,
                    DataProcessamento = pagamento.DataProcessamento,
                    DataConfirmacao = pagamento.DataConfirmacao,
                    PedidoId = pagamento.PedidoId
                };

                return Ok(new { success = true, data = pagamentoDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém pagamentos do usuário atual
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

                var pedidos = await _unitOfWork.Pedidos.FindAsync(p => p.ConsumidorId == userId);
                var pedidoIds = pedidos.Select(p => p.Id).ToList();
                
                var pagamentos = await _unitOfWork.Pagamentos.FindAsync(p => pedidoIds.Contains(p.PedidoId));
                var pagamentosDto = pagamentos.OrderByDescending(p => p.CreatedAt).Select(p => new PagamentoDto
                {
                    Id = p.Id,
                    TransacaoId = p.TransacaoId,
                    Valor = p.Valor,
                    Status = p.Status,
                    Metodo = p.Metodo,
                    GatewayPagamento = p.GatewayPagamento,
                    RespostaGateway = p.RespostaGateway,
                    DataCriacao = p.CreatedAt,
                    DataProcessamento = p.DataProcessamento,
                    DataConfirmacao = p.DataConfirmacao,
                    PedidoId = p.PedidoId
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
        /// <returns>Resultado da operação</returns>
        [HttpPost("{id}/confirmar")]
        [Authorize]
        public async Task<IActionResult> ConfirmarPagamento(Guid id)
        {
            try
            {
                var pagamento = await _unitOfWork.Pagamentos.GetByIdAsync(id);
                if (pagamento == null)
                    return NotFound(new { success = false, message = "Pagamento não encontrado" });

                var userId = GetCurrentUserId();
                var pedido = await _unitOfWork.Pedidos.GetByIdAsync(pagamento.PedidoId);
                var evento = await _unitOfWork.Eventos.GetByIdAsync(pedido.EventoId);
                
                if (pedido?.ConsumidorId != userId && evento?.GestorId != userId)
                    return Forbid("Você não tem permissão para confirmar este pagamento");

                var pagamentoConfirmado = await _pagamentoService.ConfirmarPagamentoAsync(pagamento.TransacaoId);
                if (pagamentoConfirmado == null)
                    return BadRequest(new { success = false, message = "Erro ao confirmar pagamento" });

                return Ok(new { success = true, message = "Pagamento confirmado com sucesso" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Cancela um pagamento
        /// </summary>
        /// <param name="id">ID do pagamento</param>
        /// <returns>Resultado da operação</returns>
        [HttpPost("{id}/cancelar")]
        [Authorize]
        public async Task<IActionResult> CancelarPagamento(Guid id)
        {
            try
            {
                var pagamento = await _unitOfWork.Pagamentos.GetByIdAsync(id);
                if (pagamento == null)
                    return NotFound(new { success = false, message = "Pagamento não encontrado" });

                var userId = GetCurrentUserId();
                var pedido = await _unitOfWork.Pedidos.GetByIdAsync(pagamento.PedidoId);
                var evento = await _unitOfWork.Eventos.GetByIdAsync(pedido.EventoId);
                
                if (pedido?.ConsumidorId != userId && evento?.GestorId != userId)
                    return Forbid("Você não tem permissão para cancelar este pagamento");

                var pagamentoCancelado = await _pagamentoService.CancelarPagamentoAsync(pagamento.TransacaoId);
                if (pagamentoCancelado == null)
                    return BadRequest(new { success = false, message = "Erro ao cancelar pagamento" });

                return Ok(new { success = true, message = "Pagamento cancelado com sucesso" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
                return userId;
            return null;
        }
    }
}
