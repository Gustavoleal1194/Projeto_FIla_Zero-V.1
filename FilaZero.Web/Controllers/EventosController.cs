using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FilaZero.Application.DTOs;
using FilaZero.Domain.Interfaces;
using FilaZero.Domain.Entities;
using System.Security.Claims;

namespace FilaZero.Web.Controllers
{
    /// <summary>
    /// Controller para operações de eventos
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class EventosController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public EventosController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// Obtém todos os eventos ativos
        /// </summary>
        /// <returns>Lista de eventos</returns>
        [HttpGet]
        public async Task<IActionResult> GetEventos()
        {
            try
            {
                var eventos = await _unitOfWork.Eventos.FindAsync(e => e.Ativo);
                var eventosDto = eventos.Select(e => new EventoDto
                {
                    Id = e.Id,
                    Nome = e.Nome,
                    Descricao = e.Descricao,
                    Endereco = e.Endereco,
                    Cidade = e.Cidade,
                    Estado = e.Estado,
                    CEP = e.CEP,
                    Telefone = e.Telefone,
                    Email = e.Email,
                    LogoUrl = e.LogoUrl,
                    CorPrimaria = e.CorPrimaria,
                    CorSecundaria = e.CorSecundaria,
                    DataInicio = e.DataInicio ?? DateTime.MinValue,
                    DataFim = e.DataFim ?? DateTime.MinValue,
                    Ativo = e.Ativo,
                    CreatedAt = e.CreatedAt
                }).ToList();

                return Ok(new { success = true, data = eventosDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém evento por ID
        /// </summary>
        /// <param name="id">ID do evento</param>
        /// <returns>Evento</returns>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEvento(Guid id)
        {
            try
            {
                var evento = await _unitOfWork.Eventos.GetByIdAsync(id);
                if (evento == null)
                    return NotFound(new { success = false, message = "Evento não encontrado" });

                var eventoDto = new EventoDto
                {
                    Id = evento.Id,
                    Nome = evento.Nome,
                    Descricao = evento.Descricao,
                    Endereco = evento.Endereco,
                    Cidade = evento.Cidade,
                    Estado = evento.Estado,
                    CEP = evento.CEP,
                    Telefone = evento.Telefone,
                    Email = evento.Email,
                    LogoUrl = evento.LogoUrl,
                    CorPrimaria = evento.CorPrimaria,
                    CorSecundaria = evento.CorSecundaria,
                    DataInicio = evento.DataInicio ?? DateTime.MinValue,
                    DataFim = evento.DataFim ?? DateTime.MinValue,
                    Ativo = evento.Ativo,
                    CreatedAt = evento.CreatedAt
                };

                return Ok(new { success = true, data = eventoDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Cria um novo evento
        /// </summary>
        /// <param name="eventoDto">Dados do evento</param>
        /// <returns>Evento criado</returns>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateEvento([FromBody] CriarEventoDto eventoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Dados inválidos", errors = ModelState });

            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                var evento = new Evento
                {
                    Nome = eventoDto.Nome,
                    Descricao = eventoDto.Descricao,
                    Endereco = eventoDto.Endereco,
                    Cidade = eventoDto.Cidade,
                    Estado = eventoDto.Estado,
                    CEP = eventoDto.CEP,
                    Telefone = eventoDto.Telefone,
                    Email = eventoDto.Email,
                    LogoUrl = eventoDto.LogoUrl,
                    CorPrimaria = eventoDto.CorPrimaria,
                    CorSecundaria = eventoDto.CorSecundaria,
                    DataInicio = eventoDto.DataInicio,
                    DataFim = eventoDto.DataFim,
                    GestorId = userId.Value,
                    Ativo = true
                };

                await _unitOfWork.Eventos.AddAsync(evento);
                await _unitOfWork.SaveChangesAsync();

                var eventoCriadoDto = new EventoDto
                {
                    Id = evento.Id,
                    Nome = evento.Nome,
                    Descricao = evento.Descricao,
                    Endereco = evento.Endereco,
                    Cidade = evento.Cidade,
                    Estado = evento.Estado,
                    CEP = evento.CEP,
                    Telefone = evento.Telefone,
                    Email = evento.Email,
                    LogoUrl = evento.LogoUrl,
                    CorPrimaria = evento.CorPrimaria,
                    CorSecundaria = evento.CorSecundaria,
                    DataInicio = evento.DataInicio ?? DateTime.MinValue,
                    DataFim = evento.DataFim ?? DateTime.MinValue,
                    Ativo = evento.Ativo,
                    CreatedAt = evento.CreatedAt
                };

                return CreatedAtAction(nameof(GetEvento), new { id = evento.Id }, new { success = true, data = eventoCriadoDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Atualiza um evento
        /// </summary>
        /// <param name="id">ID do evento</param>
        /// <param name="eventoDto">Dados atualizados</param>
        /// <returns>Evento atualizado</returns>
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateEvento(Guid id, [FromBody] AtualizarEventoDto eventoDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Dados inválidos", errors = ModelState });

            try
            {
                var evento = await _unitOfWork.Eventos.GetByIdAsync(id);
                if (evento == null)
                    return NotFound(new { success = false, message = "Evento não encontrado" });

                var userId = GetCurrentUserId();
                if (evento.GestorId != userId)
                    return Forbid("Você não tem permissão para atualizar este evento");

                evento.Nome = eventoDto.Nome;
                evento.Descricao = eventoDto.Descricao;
                evento.Endereco = eventoDto.Endereco;
                evento.Cidade = eventoDto.Cidade;
                evento.Estado = eventoDto.Estado;
                evento.CEP = eventoDto.CEP;
                evento.Telefone = eventoDto.Telefone;
                evento.Email = eventoDto.Email;
                evento.LogoUrl = eventoDto.LogoUrl;
                evento.CorPrimaria = eventoDto.CorPrimaria;
                evento.CorSecundaria = eventoDto.CorSecundaria;
                evento.DataInicio = eventoDto.DataInicio;
                evento.DataFim = eventoDto.DataFim;
                evento.Ativo = eventoDto.Ativo;

                _unitOfWork.Eventos.Update(evento);
                await _unitOfWork.SaveChangesAsync();

                var eventoAtualizadoDto = new EventoDto
                {
                    Id = evento.Id,
                    Nome = evento.Nome,
                    Descricao = evento.Descricao,
                    Endereco = evento.Endereco,
                    Cidade = evento.Cidade,
                    Estado = evento.Estado,
                    CEP = evento.CEP,
                    Telefone = evento.Telefone,
                    Email = evento.Email,
                    LogoUrl = evento.LogoUrl,
                    CorPrimaria = evento.CorPrimaria,
                    CorSecundaria = evento.CorSecundaria,
                    DataInicio = evento.DataInicio ?? DateTime.MinValue,
                    DataFim = evento.DataFim ?? DateTime.MinValue,
                    Ativo = evento.Ativo,
                    CreatedAt = evento.CreatedAt
                };

                return Ok(new { success = true, data = eventoAtualizadoDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém eventos do usuário atual
        /// </summary>
        /// <returns>Lista de eventos do usuário</returns>
        [HttpGet("meus-eventos")]
        [Authorize]
        public async Task<IActionResult> GetMeusEventos()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                var eventos = await _unitOfWork.Eventos.FindAsync(e => e.GestorId == userId);
                var eventosDto = eventos.Select(e => new EventoDto
                {
                    Id = e.Id,
                    Nome = e.Nome,
                    Descricao = e.Descricao,
                    Endereco = e.Endereco,
                    Cidade = e.Cidade,
                    Estado = e.Estado,
                    CEP = e.CEP,
                    Telefone = e.Telefone,
                    Email = e.Email,
                    LogoUrl = e.LogoUrl,
                    CorPrimaria = e.CorPrimaria,
                    CorSecundaria = e.CorSecundaria,
                    DataInicio = e.DataInicio ?? DateTime.MinValue,
                    DataFim = e.DataFim ?? DateTime.MinValue,
                    Ativo = e.Ativo,
                    CreatedAt = e.CreatedAt
                }).OrderByDescending(e => e.CreatedAt).ToList();

                return Ok(new { success = true, data = eventosDto });
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
