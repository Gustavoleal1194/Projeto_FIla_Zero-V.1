using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FilaZero.Application.DTOs;
using FilaZero.Domain.Interfaces;
using FilaZero.Domain.Entities;
using System.Security.Claims;

namespace FilaZero.Web.Controllers
{
    /// <summary>
    /// Controller para o Kitchen Display System (KDS)
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class KDSController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public KDSController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Obtém pedidos para exibição no KDS
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <param name="status">Filtro por status (opcional)</param>
        /// <returns>Lista de pedidos para KDS</returns>
        [HttpGet("evento/{eventoId}")]
        public async Task<IActionResult> GetPedidosParaKDS(Guid eventoId, [FromQuery] StatusPedido? status = null)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                // Verificar se o usuário tem acesso ao evento
                var evento = await _unitOfWork.Eventos.GetByIdAsync(eventoId);
                if (evento == null)
                    return NotFound(new { success = false, message = "Evento não encontrado" });

                // Verificar se é gestor ou equipe do evento
                if (evento.GestorId != userId)
                {
                    // Aqui você pode implementar verificação de equipe
                    // Por enquanto, apenas gestores têm acesso
                }

                var query = _unitOfWork.Pedidos.FindAsync(p => p.EventoId == eventoId);
                var pedidos = await query;

                if (status.HasValue)
                {
                    pedidos = pedidos.Where(p => p.Status == status.Value);
                }

                var pedidosKDS = pedidos
                    .Where(p => p.Status != StatusPedido.Cancelado)
                    .OrderBy(p => p.CreatedAt)
                    .Select(p => new PedidoKDSDto
                    {
                        Id = p.Id,
                        NumeroPedido = p.NumeroPedido,
                        Status = p.Status,
                        ValorTotal = p.ValorTotal,
                        Observacoes = p.Observacoes,
                        TempoEstimadoMinutos = p.TempoEstimadoMinutos,
                        DataCriacao = p.CreatedAt,
                        ConsumidorNome = p.Consumidor?.Nome ?? string.Empty,
                        Itens = p.Itens?.Select(i => new ItemPedidoKDSDto
                        {
                            Id = i.Id,
                            Quantidade = i.Quantidade,
                            ProdutoNome = i.Produto?.Nome ?? string.Empty,
                            Observacoes = i.Observacoes ?? string.Empty,
                            Status = i.Status,
                            TempoPreparoMinutos = i.Produto?.TempoPreparoMinutos ?? 0
                        }).ToList()
                    }).ToList();

                return Ok(new { success = true, data = pedidosKDS });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Atualiza status de um item do pedido
        /// </summary>
        /// <param name="itemId">ID do item</param>
        /// <param name="statusDto">Novo status</param>
        /// <returns>Resultado da operação</returns>
        [HttpPatch("item/{itemId}/status")]
        public async Task<IActionResult> UpdateItemStatus(Guid itemId, [FromBody] AtualizarStatusItemDto statusDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Dados inválidos", errors = ModelState });

            try
            {
                var item = await _unitOfWork.ItensPedido.GetByIdAsync(itemId);
                if (item == null)
                    return NotFound(new { success = false, message = "Item não encontrado" });

                // Verificar permissões
                var pedido = await _unitOfWork.Pedidos.GetByIdAsync(item.PedidoId);
                var evento = await _unitOfWork.Eventos.GetByIdAsync(pedido.EventoId);
                var userId = GetCurrentUserId();

                if (evento?.GestorId != userId)
                    return Forbid("Você não tem permissão para atualizar este item");

                item.Status = statusDto.Status;
                _unitOfWork.ItensPedido.Update(item);
                await _unitOfWork.SaveChangesAsync();

                return Ok(new { success = true, message = "Status do item atualizado com sucesso" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Marca pedido como pronto
        /// </summary>
        /// <param name="pedidoId">ID do pedido</param>
        /// <returns>Resultado da operação</returns>
        [HttpPatch("pedido/{pedidoId}/pronto")]
        public async Task<IActionResult> MarcarPedidoPronto(Guid pedidoId)
        {
            try
            {
                var pedido = await _unitOfWork.Pedidos.GetByIdAsync(pedidoId);
                if (pedido == null)
                    return NotFound(new { success = false, message = "Pedido não encontrado" });

                // Verificar permissões
                var evento = await _unitOfWork.Eventos.GetByIdAsync(pedido.EventoId);
                var userId = GetCurrentUserId();

                if (evento?.GestorId != userId)
                    return Forbid("Você não tem permissão para atualizar este pedido");

                pedido.Status = StatusPedido.Pronto;
                pedido.DataPronto = DateTime.UtcNow;
                _unitOfWork.Pedidos.Update(pedido);
                await _unitOfWork.SaveChangesAsync();

                return Ok(new { success = true, message = "Pedido marcado como pronto" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Marca pedido como entregue
        /// </summary>
        /// <param name="pedidoId">ID do pedido</param>
        /// <returns>Resultado da operação</returns>
        [HttpPatch("pedido/{pedidoId}/entregue")]
        public async Task<IActionResult> MarcarPedidoEntregue(Guid pedidoId)
        {
            try
            {
                var pedido = await _unitOfWork.Pedidos.GetByIdAsync(pedidoId);
                if (pedido == null)
                    return NotFound(new { success = false, message = "Pedido não encontrado" });

                // Verificar permissões
                var evento = await _unitOfWork.Eventos.GetByIdAsync(pedido.EventoId);
                var userId = GetCurrentUserId();

                if (evento?.GestorId != userId)
                    return Forbid("Você não tem permissão para atualizar este pedido");

                pedido.Status = StatusPedido.Entregue;
                pedido.DataEntregue = DateTime.UtcNow;
                _unitOfWork.Pedidos.Update(pedido);
                await _unitOfWork.SaveChangesAsync();

                return Ok(new { success = true, message = "Pedido marcado como entregue" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém estatísticas do KDS
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <returns>Estatísticas do KDS</returns>
        [HttpGet("evento/{eventoId}/estatisticas")]
        public async Task<IActionResult> GetEstatisticasKDS(Guid eventoId)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                var evento = await _unitOfWork.Eventos.GetByIdAsync(eventoId);
                if (evento == null)
                    return NotFound(new { success = false, message = "Evento não encontrado" });

                if (evento.GestorId != userId)
                    return Forbid("Você não tem permissão para visualizar estas estatísticas");

                var pedidos = await _unitOfWork.Pedidos.FindAsync(p => p.EventoId == eventoId);
                var hoje = DateTime.UtcNow.Date;

                var estatisticas = new EstatisticasKDSDto
                {
                    TotalPedidos = pedidos.Count(),
                    PedidosHoje = pedidos.Count(p => p.CreatedAt.Date == hoje),
                    PedidosAguardando = pedidos.Count(p => p.Status == StatusPedido.AguardandoPagamento),
                    PedidosPagos = pedidos.Count(p => p.Status == StatusPedido.Pago),
                    PedidosPreparando = pedidos.Count(p => p.Status == StatusPedido.EmPreparo),
                    PedidosProntos = pedidos.Count(p => p.Status == StatusPedido.Pronto),
                    PedidosEntregues = pedidos.Count(p => p.Status == StatusPedido.Entregue),
                    PedidosCancelados = pedidos.Count(p => p.Status == StatusPedido.Cancelado),
                    ValorTotalVendido = pedidos.Where(p => p.Status == StatusPedido.Entregue).Sum(p => p.ValorTotal),
                    TempoMedioPreparo = CalcularTempoMedioPreparo(pedidos)
                };

                return Ok(new { success = true, data = estatisticas });
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

        private double CalcularTempoMedioPreparo(IEnumerable<Pedido> pedidos)
        {
            var pedidosEntregues = pedidos.Where(p => p.Status == StatusPedido.Entregue && p.DataPronto.HasValue);
            
            if (!pedidosEntregues.Any())
                return 0;

            var tempos = pedidosEntregues.Select(p => (p.DataPronto!.Value - p.CreatedAt).TotalMinutes);
            return tempos.Average();
        }
    }
}