using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FilaZero.Application.DTOs;
using FilaZero.Domain.Interfaces.Services;
using FilaZero.Domain.Entities;
using System.Security.Claims;

namespace FilaZero.Web.Controllers
{
    /// <summary>
    /// Controller para operações de autenticação
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        /// <summary>
        /// Realiza login do usuário
        /// </summary>
        /// <param name="loginDto">Dados de login</param>
        /// <returns>Token de autenticação</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Dados inválidos", errors = ModelState });

            try
            {
                var usuario = await _authService.AuthenticateAsync(loginDto.Email, loginDto.Senha);
                if (usuario == null)
                    return Unauthorized(new { success = false, message = "Email ou senha inválidos" });

                var token = await _authService.GenerateJwtTokenAsync(usuario);
                
                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        usuario = new UsuarioDto
                        {
                            Id = usuario.Id,
                            Nome = usuario.Nome,
                            Email = usuario.Email,
                            Telefone = usuario.Telefone,
                            Tipo = usuario.Tipo,
                            EmailConfirmado = usuario.EmailConfirmado,
                            UltimoLogin = usuario.UltimoLogin,
                            CreatedAt = usuario.CreatedAt
                        },
                        token
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Registra um novo usuário
        /// </summary>
        /// <param name="criarUsuarioDto">Dados do usuário</param>
        /// <returns>Usuário criado</returns>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CriarUsuarioDto criarUsuarioDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Dados inválidos", errors = ModelState });

            try
            {
                var usuario = new Usuario
                {
                    Nome = criarUsuarioDto.Nome,
                    Email = criarUsuarioDto.Email,
                    Telefone = criarUsuarioDto.Telefone,
                    Tipo = criarUsuarioDto.Tipo
                };

                var usuarioCriado = await _authService.RegisterAsync(usuario, criarUsuarioDto.Senha);
                var token = await _authService.GenerateJwtTokenAsync(usuarioCriado);
                
                return Ok(new
                {
                    success = true,
                    data = new
                    {
                        usuario = new UsuarioDto
                        {
                            Id = usuarioCriado.Id,
                            Nome = usuarioCriado.Nome,
                            Email = usuarioCriado.Email,
                            Telefone = usuarioCriado.Telefone,
                            Tipo = usuarioCriado.Tipo,
                            EmailConfirmado = usuarioCriado.EmailConfirmado,
                            UltimoLogin = usuarioCriado.UltimoLogin,
                            CreatedAt = usuarioCriado.CreatedAt
                        },
                        token
                    }
                });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Obtém dados do usuário atual
        /// </summary>
        /// <returns>Dados do usuário</returns>
        [HttpGet("profile")]
        [Authorize]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                var usuario = await _authService.GetUserFromTokenAsync(GetCurrentToken());
                if (usuario == null)
                    return NotFound(new { success = false, message = "Usuário não encontrado" });

                return Ok(new
                {
                    success = true,
                    data = new UsuarioDto
                    {
                        Id = usuario.Id,
                        Nome = usuario.Nome,
                        Email = usuario.Email,
                        Telefone = usuario.Telefone,
                        Tipo = usuario.Tipo,
                        EmailConfirmado = usuario.EmailConfirmado,
                        UltimoLogin = usuario.UltimoLogin,
                        CreatedAt = usuario.CreatedAt
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Altera a senha do usuário
        /// </summary>
        /// <param name="alterarSenhaDto">Dados para alteração de senha</param>
        /// <returns>Resultado da operação</returns>
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] AlterarSenhaDto alterarSenhaDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "Dados inválidos", errors = ModelState });

            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                var sucesso = await _authService.ChangePasswordAsync(userId.Value, alterarSenhaDto.SenhaAtual, alterarSenhaDto.NovaSenha);
                
                if (!sucesso)
                    return BadRequest(new { success = false, message = "Senha atual incorreta" });

                return Ok(new { success = true, message = "Senha alterada com sucesso" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Realiza logout do usuário
        /// </summary>
        /// <returns>Resultado da operação</returns>
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            try
            {
                // Em uma implementação real, você invalidaria o token aqui
                return Ok(new { success = true, message = "Logout realizado com sucesso" });
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

        private string GetCurrentToken()
        {
            var authHeader = Request.Headers["Authorization"].FirstOrDefault();
            return authHeader?.Replace("Bearer ", "");
        }
    }
}