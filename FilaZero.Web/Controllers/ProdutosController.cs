using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FilaZero.Application.DTOs;
using FilaZero.Domain.Interfaces;
using FilaZero.Domain.Entities;
using System.Security.Claims;

namespace FilaZero.Web.Controllers
{
    /// <summary>
    /// Controller para operações de produtos
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ProdutosController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProdutosController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Obtém todos os produtos de um evento
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <returns>Lista de produtos</returns>
        [HttpGet("evento/{eventoId}")]
        public async Task<IActionResult> GetProdutosByEvento(Guid eventoId)
        {
            try
            {
                var produtos = await _unitOfWork.Produtos.FindAsync(p => p.EventoId == eventoId && p.Disponivel);
                var produtosDto = produtos.Select(p => new ProdutoDto
                {
                    Id = p.Id,
                    Nome = p.Nome,
                    Descricao = p.Descricao,
                    Preco = p.Preco,
                    ImagemUrl = p.ImagemUrl,
                    TempoPreparoMinutos = p.TempoPreparoMinutos,
                    Ordem = p.Ordem,
                    Ativo = p.Disponivel,
                    Destaque = p.Destaque,
                    EventoId = p.EventoId,
                    CategoriaId = p.CategoriaId,
                    CategoriaNome = p.Categoria?.Nome ?? string.Empty,
                    CreatedAt = p.CreatedAt
                }).OrderBy(p => p.Ordem).ToList();

                return Ok(new { success = true, data = produtosDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém produto por ID
        /// </summary>
        /// <param name="id">ID do produto</param>
        /// <returns>Produto</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduto(Guid id)
        {
            try
            {
                var produto = await _unitOfWork.Produtos.GetByIdAsync(id);
                if (produto == null)
                    return NotFound(new { success = false, message = "Produto não encontrado" });

                var produtoDto = new ProdutoDto
                {
                    Id = produto.Id,
                    Nome = produto.Nome,
                    Descricao = produto.Descricao,
                    Preco = produto.Preco,
                    ImagemUrl = produto.ImagemUrl,
                    TempoPreparoMinutos = produto.TempoPreparoMinutos,
                    Ordem = produto.Ordem,
                    Ativo = produto.Disponivel,
                    Destaque = produto.Destaque,
                    EventoId = produto.EventoId,
                    CategoriaId = produto.CategoriaId,
                    CategoriaNome = produto.Categoria?.Nome ?? string.Empty,
                    CreatedAt = produto.CreatedAt
                };

                return Ok(new { success = true, data = produtoDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Cria um novo produto
        /// </summary>
        /// <param name="produtoDto">Dados do produto</param>
        /// <returns>Produto criado</returns>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateProduto([FromBody] CriarProdutoDto produtoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Dados inválidos", errors = ModelState });

            try
            {
                // Verificar se o usuário é gestor do evento
                var evento = await _unitOfWork.Eventos.GetByIdAsync(produtoDto.EventoId);
                if (evento == null)
                    return NotFound(new { success = false, message = "Evento não encontrado" });

                var userId = GetCurrentUserId();
                if (evento.GestorId != userId)
                    return Forbid("Você não tem permissão para criar produtos neste evento");

                var produto = new Produto
                {
                    Nome = produtoDto.Nome,
                    Descricao = produtoDto.Descricao,
                    Preco = produtoDto.Preco,
                    ImagemUrl = produtoDto.ImagemUrl,
                    TempoPreparoMinutos = produtoDto.TempoPreparoMinutos,
                    Ordem = produtoDto.Ordem,
                    Disponivel = produtoDto.Ativo,
                    Destaque = produtoDto.Destaque,
                    EventoId = produtoDto.EventoId,
                    CategoriaId = produtoDto.CategoriaId
                };

                await _unitOfWork.Produtos.AddAsync(produto);
                await _unitOfWork.SaveChangesAsync();

                var produtoCriadoDto = new ProdutoDto
                {
                    Id = produto.Id,
                    Nome = produto.Nome,
                    Descricao = produto.Descricao,
                    Preco = produto.Preco,
                    ImagemUrl = produto.ImagemUrl,
                    TempoPreparoMinutos = produto.TempoPreparoMinutos,
                    Ordem = produto.Ordem,
                    Ativo = produto.Disponivel,
                    Destaque = produto.Destaque,
                    EventoId = produto.EventoId,
                    CategoriaId = produto.CategoriaId,
                    CreatedAt = produto.CreatedAt
                };

                return CreatedAtAction(nameof(GetProduto), new { id = produto.Id }, new { success = true, data = produtoCriadoDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Atualiza um produto
        /// </summary>
        /// <param name="id">ID do produto</param>
        /// <param name="produtoDto">Dados atualizados</param>
        /// <returns>Produto atualizado</returns>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateProduto(Guid id, [FromBody] AtualizarProdutoDto produtoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Dados inválidos", errors = ModelState });

            try
            {
                var produto = await _unitOfWork.Produtos.GetByIdAsync(id);
                if (produto == null)
                    return NotFound(new { success = false, message = "Produto não encontrado" });

                // Verificar se o usuário é gestor do evento
                var evento = await _unitOfWork.Eventos.GetByIdAsync(produto.EventoId);
                var userId = GetCurrentUserId();
                if (evento?.GestorId != userId)
                    return Forbid("Você não tem permissão para atualizar este produto");

                produto.Nome = produtoDto.Nome;
                produto.Descricao = produtoDto.Descricao;
                produto.Preco = produtoDto.Preco;
                produto.ImagemUrl = produtoDto.ImagemUrl;
                produto.TempoPreparoMinutos = produtoDto.TempoPreparoMinutos;
                produto.Ordem = produtoDto.Ordem;
                produto.Disponivel = produtoDto.Ativo;
                produto.Destaque = produtoDto.Destaque;
                produto.CategoriaId = produtoDto.CategoriaId;

                _unitOfWork.Produtos.Update(produto);
                await _unitOfWork.SaveChangesAsync();

                var produtoAtualizadoDto = new ProdutoDto
                {
                    Id = produto.Id,
                    Nome = produto.Nome,
                    Descricao = produto.Descricao,
                    Preco = produto.Preco,
                    ImagemUrl = produto.ImagemUrl,
                    TempoPreparoMinutos = produto.TempoPreparoMinutos,
                    Ordem = produto.Ordem,
                    Ativo = produto.Disponivel,
                    Destaque = produto.Destaque,
                    EventoId = produto.EventoId,
                    CategoriaId = produto.CategoriaId,
                    CreatedAt = produto.CreatedAt
                };

                return Ok(new { success = true, data = produtoAtualizadoDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Remove um produto (soft delete)
        /// </summary>
        /// <param name="id">ID do produto</param>
        /// <returns>Resultado da operação</returns>
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteProduto(Guid id)
        {
            try
            {
                var produto = await _unitOfWork.Produtos.GetByIdAsync(id);
                if (produto == null)
                    return NotFound(new { success = false, message = "Produto não encontrado" });

                // Verificar se o usuário é gestor do evento
                var evento = await _unitOfWork.Eventos.GetByIdAsync(produto.EventoId);
                var userId = GetCurrentUserId();
                if (evento?.GestorId != userId)
                    return Forbid("Você não tem permissão para remover este produto");

                _unitOfWork.Produtos.Remove(produto);
                await _unitOfWork.SaveChangesAsync();

                return Ok(new { success = true, message = "Produto removido com sucesso" });
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