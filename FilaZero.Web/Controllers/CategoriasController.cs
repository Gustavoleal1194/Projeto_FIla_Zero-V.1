using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FilaZero.Application.DTOs;
using FilaZero.Domain.Interfaces;
using FilaZero.Domain.Entities;
using System.Security.Claims;

namespace FilaZero.Web.Controllers
{
    /// <summary>
    /// Controller para operações de categorias
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriasController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public CategoriasController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Obtém categorias de um evento
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <returns>Lista de categorias</returns>
        [HttpGet("evento/{eventoId}")]
        public async Task<IActionResult> GetCategoriasByEvento(Guid eventoId)
        {
            try
            {
                var categorias = await _unitOfWork.Categorias.FindAsync(c => c.EventoId == eventoId && c.Ativo);
                var categoriasDto = categorias.Select(c => new CategoriaDto
                {
                    Id = c.Id,
                    Nome = c.Nome,
                    Descricao = c.Descricao,
                    Cor = c.Cor,
                    Ordem = c.Ordem,
                    Ativo = c.Ativo,
                    EventoId = c.EventoId,
                    CreatedAt = c.CreatedAt
                }).OrderBy(c => c.Ordem).ToList();

                return Ok(new { success = true, data = categoriasDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém categoria por ID
        /// </summary>
        /// <param name="id">ID da categoria</param>
        /// <returns>Categoria</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoria(Guid id)
        {
            try
            {
                var categoria = await _unitOfWork.Categorias.GetByIdAsync(id);
                if (categoria == null)
                    return NotFound(new { success = false, message = "Categoria não encontrada" });

                var categoriaDto = new CategoriaDto
                {
                    Id = categoria.Id,
                    Nome = categoria.Nome,
                    Descricao = categoria.Descricao,
                    Cor = categoria.Cor,
                    Ordem = categoria.Ordem,
                    Ativo = categoria.Ativo,
                    EventoId = categoria.EventoId,
                    CreatedAt = categoria.CreatedAt
                };

                return Ok(new { success = true, data = categoriaDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Cria uma nova categoria
        /// </summary>
        /// <param name="categoriaDto">Dados da categoria</param>
        /// <returns>Categoria criada</returns>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateCategoria([FromBody] CriarCategoriaDto categoriaDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Dados inválidos", errors = ModelState });

            try
            {
                // Verificar se o usuário é gestor do evento
                var evento = await _unitOfWork.Eventos.GetByIdAsync(categoriaDto.EventoId);
                if (evento == null)
                    return NotFound(new { success = false, message = "Evento não encontrado" });

                var userId = GetCurrentUserId();
                if (evento.GestorId != userId)
                    return Forbid("Você não tem permissão para criar categorias neste evento");

                var categoria = new Categoria
                {
                    Nome = categoriaDto.Nome,
                    Descricao = categoriaDto.Descricao,
                    Cor = categoriaDto.Cor,
                    Ordem = categoriaDto.Ordem,
                    Ativo = categoriaDto.Ativo,
                    EventoId = categoriaDto.EventoId
                };

                await _unitOfWork.Categorias.AddAsync(categoria);
                await _unitOfWork.SaveChangesAsync();

                var categoriaCriadaDto = new CategoriaDto
                {
                    Id = categoria.Id,
                    Nome = categoria.Nome,
                    Descricao = categoria.Descricao,
                    Cor = categoria.Cor,
                    Ordem = categoria.Ordem,
                    Ativo = categoria.Ativo,
                    EventoId = categoria.EventoId,
                    CreatedAt = categoria.CreatedAt
                };

                return CreatedAtAction(nameof(GetCategoria), new { id = categoria.Id }, new { success = true, data = categoriaCriadaDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Atualiza uma categoria
        /// </summary>
        /// <param name="id">ID da categoria</param>
        /// <param name="categoriaDto">Dados atualizados</param>
        /// <returns>Categoria atualizada</returns>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateCategoria(Guid id, [FromBody] AtualizarCategoriaDto categoriaDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Dados inválidos", errors = ModelState });

            try
            {
                var categoria = await _unitOfWork.Categorias.GetByIdAsync(id);
                if (categoria == null)
                    return NotFound(new { success = false, message = "Categoria não encontrada" });

                // Verificar se o usuário é gestor do evento
                var evento = await _unitOfWork.Eventos.GetByIdAsync(categoria.EventoId);
                var userId = GetCurrentUserId();
                if (evento?.GestorId != userId)
                    return Forbid("Você não tem permissão para atualizar esta categoria");

                categoria.Nome = categoriaDto.Nome;
                categoria.Descricao = categoriaDto.Descricao;
                categoria.Cor = categoriaDto.Cor;
                categoria.Ordem = categoriaDto.Ordem;
                categoria.Ativo = categoriaDto.Ativo;

                _unitOfWork.Categorias.Update(categoria);
                await _unitOfWork.SaveChangesAsync();

                var categoriaAtualizadaDto = new CategoriaDto
                {
                    Id = categoria.Id,
                    Nome = categoria.Nome,
                    Descricao = categoria.Descricao,
                    Cor = categoria.Cor,
                    Ordem = categoria.Ordem,
                    Ativo = categoria.Ativo,
                    EventoId = categoria.EventoId,
                    CreatedAt = categoria.CreatedAt
                };

                return Ok(new { success = true, data = categoriaAtualizadaDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Remove uma categoria
        /// </summary>
        /// <param name="id">ID da categoria</param>
        /// <returns>Resultado da operação</returns>
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteCategoria(Guid id)
        {
            try
            {
                var categoria = await _unitOfWork.Categorias.GetByIdAsync(id);
                if (categoria == null)
                    return NotFound(new { success = false, message = "Categoria não encontrada" });

                // Verificar se o usuário é gestor do evento
                var evento = await _unitOfWork.Eventos.GetByIdAsync(categoria.EventoId);
                var userId = GetCurrentUserId();
                if (evento?.GestorId != userId)
                    return Forbid("Você não tem permissão para remover esta categoria");

                _unitOfWork.Categorias.Remove(categoria);
                await _unitOfWork.SaveChangesAsync();

                return Ok(new { success = true, message = "Categoria removida com sucesso" });
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
