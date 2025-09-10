using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FilaZero.Application.DTOs;
using FilaZero.Domain.Interfaces;
using FilaZero.Domain.Entities;
using FilaZero.Domain.Interfaces.Services;
using System.Security.Claims;

namespace FilaZero.Web.Controllers
{
    /// <summary>
    /// Controller para operações de pedidos
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PedidosController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPedidoService _pedidoService;
        private readonly INotificationService _notificationService;

        public PedidosController(IUnitOfWork unitOfWork, IPedidoService pedidoService, INotificationService notificationService)
        {
            _unitOfWork = unitOfWork;
            _pedidoService = pedidoService;
            _notificationService = notificationService;
        }

        /// <summary>
        /// Cria um novo pedido
        /// </summary>
        /// <param name="criarPedidoDto">Dados do pedido</param>
        /// <returns>Pedido criado</returns>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreatePedido([FromBody] CriarPedidoDto criarPedidoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Dados inválidos", errors = ModelState });

            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                // Verificar se o evento existe
                var evento = await _unitOfWork.Eventos.GetByIdAsync(criarPedidoDto.EventoId);
                if (evento == null)
                    return NotFound(new { success = false, message = "Evento não encontrado" });

                // Criar pedido
                var pedido = new Pedido
                {
                    EventoId = criarPedidoDto.EventoId,
                    ConsumidorId = userId,
                    Observacoes = criarPedidoDto.Observacoes,
                    TempoEstimadoMinutos = 30 // Valor padrão
                };

                // Criar itens do pedido
                var itens = new List<ItemPedido>();
                foreach (var itemDto in criarPedidoDto.Itens)
                {
                    var produto = await _unitOfWork.Produtos.GetByIdAsync(itemDto.ProdutoId);
                    if (produto == null)
                        return BadRequest(new { success = false, message = $"Produto {itemDto.ProdutoId} não encontrado" });

                    var item = new ItemPedido
                    {
                        ProdutoId = itemDto.ProdutoId,
                        Quantidade = itemDto.Quantidade,
                        PrecoUnitario = produto.Preco,
                        PrecoTotal = produto.Preco * itemDto.Quantidade,
                        Observacoes = itemDto.Observacoes,
                        Status = StatusItem.Aguardando
                    };
                    itens.Add(item);
                }

                // Salvar pedido usando o service
                var pedidoCriado = await _pedidoService.CriarPedidoAsync(pedido, itens);

                // Notificar sobre novo pedido
                await _notificationService.NotificarNovoPedidoAsync(pedidoCriado.EventoId, pedidoCriado.Id, pedidoCriado.NumeroPedido);

                var pedidoDto = new PedidoDto
                {
                    Id = pedidoCriado.Id,
                    NumeroPedido = pedidoCriado.NumeroPedido,
                    Status = pedidoCriado.Status,
                    ValorTotal = pedidoCriado.ValorTotal,
                    TaxaServico = pedidoCriado.TaxaServico,
                    Desconto = pedidoCriado.Desconto,
                    Observacoes = pedidoCriado.Observacoes,
                    TempoEstimadoMinutos = pedidoCriado.TempoEstimadoMinutos,
                    DataCriacao = pedidoCriado.CreatedAt,
                    EventoId = pedidoCriado.EventoId,
                    ConsumidorId = pedidoCriado.ConsumidorId,
                    ConsumidorNome = pedidoCriado.Consumidor?.Nome,
                    Itens = pedidoCriado.Itens?.Select(i => new ItemPedidoDto
                    {
                        Id = i.Id,
                        Quantidade = i.Quantidade,
                        PrecoUnitario = i.PrecoUnitario,
                        PrecoTotal = i.PrecoTotal,
                        Observacoes = i.Observacoes,
                        Status = i.Status,
                        ProdutoId = i.ProdutoId,
                        ProdutoNome = i.Produto?.Nome,
                        ProdutoImagemUrl = i.Produto?.ImagemUrl
                    }).ToList()
                };

                return CreatedAtAction(nameof(GetPedido), new { id = pedidoCriado.Id }, new { success = true, data = pedidoDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém pedidos do usuário atual
        /// </summary>
        /// <returns>Lista de pedidos</returns>
        [HttpGet("usuario")]
        [Authorize]
        public async Task<IActionResult> GetPedidosByUsuario()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                var pedidos = await _unitOfWork.Pedidos.FindAsync(p => p.ConsumidorId == userId);
                var pedidosDto = pedidos.OrderByDescending(p => p.CreatedAt).Select(p => new PedidoDto
                {
                    Id = p.Id,
                    NumeroPedido = p.NumeroPedido,
                    Status = p.Status,
                    ValorTotal = p.ValorTotal,
                    TaxaServico = p.TaxaServico,
                    Desconto = p.Desconto,
                    Observacoes = p.Observacoes,
                    TempoEstimadoMinutos = p.TempoEstimadoMinutos,
                    DataCriacao = p.CreatedAt,
                    EventoId = p.EventoId,
                    ConsumidorId = p.ConsumidorId,
                    ConsumidorNome = p.Consumidor?.Nome,
                    Itens = p.Itens?.Select(i => new ItemPedidoDto
                    {
                        Id = i.Id,
                        Quantidade = i.Quantidade,
                        PrecoUnitario = i.PrecoUnitario,
                        PrecoTotal = i.PrecoTotal,
                        Observacoes = i.Observacoes,
                        Status = i.Status,
                        ProdutoId = i.ProdutoId,
                        ProdutoNome = i.Produto?.Nome,
                        ProdutoImagemUrl = i.Produto?.ImagemUrl
                    }).ToList()
                }).ToList();

                return Ok(new { success = true, data = pedidosDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém pedido por ID
        /// </summary>
        /// <param name="id">ID do pedido</param>
        /// <returns>Pedido</returns>
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetPedido(Guid id)
        {
            try
            {
                var pedido = await _unitOfWork.Pedidos.GetByIdAsync(id);
                if (pedido == null)
                    return NotFound(new { success = false, message = "Pedido não encontrado" });

                var userId = GetCurrentUserId();
                if (pedido.ConsumidorId != userId)
                    return Forbid("Você não tem permissão para visualizar este pedido");

                var pedidoDto = new PedidoDto
                {
                    Id = pedido.Id,
                    NumeroPedido = pedido.NumeroPedido,
                    Status = pedido.Status,
                    ValorTotal = pedido.ValorTotal,
                    TaxaServico = pedido.TaxaServico,
                    Desconto = pedido.Desconto,
                    Observacoes = pedido.Observacoes,
                    TempoEstimadoMinutos = pedido.TempoEstimadoMinutos,
                    DataCriacao = pedido.CreatedAt,
                    EventoId = pedido.EventoId,
                    ConsumidorId = pedido.ConsumidorId,
                    ConsumidorNome = pedido.Consumidor?.Nome,
                    Itens = pedido.Itens?.Select(i => new ItemPedidoDto
                    {
                        Id = i.Id,
                        Quantidade = i.Quantidade,
                        PrecoUnitario = i.PrecoUnitario,
                        PrecoTotal = i.PrecoTotal,
                        Observacoes = i.Observacoes,
                        Status = i.Status,
                        ProdutoId = i.ProdutoId,
                        ProdutoNome = i.Produto?.Nome,
                        ProdutoImagemUrl = i.Produto?.ImagemUrl
                    }).ToList()
                };

                return Ok(new { success = true, data = pedidoDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Atualiza status do pedido
        /// </summary>
        /// <param name="id">ID do pedido</param>
        /// <param name="statusDto">Novo status</param>
        /// <returns>Pedido atualizado</returns>
        [HttpPatch("{id}/status")]
        [Authorize]
        public async Task<IActionResult> UpdatePedidoStatus(Guid id, [FromBody] AtualizarStatusPedidoDto statusDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Dados inválidos", errors = ModelState });

            try
            {
                var pedido = await _unitOfWork.Pedidos.GetByIdAsync(id);
                if (pedido == null)
                    return NotFound(new { success = false, message = "Pedido não encontrado" });

                // Verificar permissões
                var userId = GetCurrentUserId();
                var evento = await _unitOfWork.Eventos.GetByIdAsync(pedido.EventoId);
                
                if (pedido.ConsumidorId != userId && evento?.GestorId != userId)
                    return Forbid("Você não tem permissão para atualizar este pedido");

                pedido.Status = statusDto.Status;
                _unitOfWork.Pedidos.Update(pedido);
                await _unitOfWork.SaveChangesAsync();

                // Notificar sobre atualização de status
                await _notificationService.NotificarAtualizacaoPedidoAsync(
                    pedido.EventoId, 
                    pedido.Id, 
                    pedido.NumeroPedido, 
                    statusDto.Status.ToString(),
                    pedido.ConsumidorId
                );

                return Ok(new { success = true, message = "Status do pedido atualizado com sucesso" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Cancela um pedido
        /// </summary>
        /// <param name="id">ID do pedido</param>
        /// <returns>Resultado da operação</returns>
        [HttpPatch("{id}/cancelar")]
        [Authorize]
        public async Task<IActionResult> CancelarPedido(Guid id)
        {
            try
            {
                var pedido = await _unitOfWork.Pedidos.GetByIdAsync(id);
                if (pedido == null)
                    return NotFound(new { success = false, message = "Pedido não encontrado" });

                var userId = GetCurrentUserId();
                if (pedido.ConsumidorId != userId)
                    return Forbid("Você não tem permissão para cancelar este pedido");

                if (pedido.Status == StatusPedido.Cancelado)
                    return BadRequest(new { success = false, message = "Pedido já está cancelado" });

                if (pedido.Status == StatusPedido.Entregue)
                    return BadRequest(new { success = false, message = "Não é possível cancelar um pedido já entregue" });

                pedido.Status = StatusPedido.Cancelado;
                _unitOfWork.Pedidos.Update(pedido);
                await _unitOfWork.SaveChangesAsync();

                return Ok(new { success = true, message = "Pedido cancelado com sucesso" });
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