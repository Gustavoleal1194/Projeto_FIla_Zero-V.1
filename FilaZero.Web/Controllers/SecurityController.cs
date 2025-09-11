using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FilaZero.Web.Security;
using System.Security.Claims;

namespace FilaZero.Web.Controllers
{
    /// <summary>
    /// Controller para operações de segurança
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class SecurityController : ControllerBase
    {
        private readonly JwtService _jwtService;
        private readonly RateLimitingService _rateLimitingService;

        public SecurityController(JwtService jwtService, RateLimitingService rateLimitingService)
        {
            _jwtService = jwtService;
            _rateLimitingService = rateLimitingService;
        }

        /// <summary>
        /// Renova o token JWT se estiver próximo do vencimento
        /// </summary>
        /// <returns>Novo token JWT</returns>
        [HttpPost("refresh-token")]
        public Task<IActionResult> RefreshToken()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Task.FromResult<IActionResult>(Unauthorized(new { success = false, message = "Token inválido" }));

                // Aqui você buscaria o usuário do banco de dados
                // Por simplicidade, vamos criar um usuário mock
                var usuario = new FilaZero.Domain.Entities.Usuario
                {
                    Id = userId.Value,
                    Nome = User.FindFirst(ClaimTypes.Name)?.Value ?? "Usuário",
                    Email = User.FindFirst(ClaimTypes.Email)?.Value ?? ""
                };

                var newToken = _jwtService.GenerateToken(usuario);

                return Task.FromResult<IActionResult>(Ok(new { 
                    success = true, 
                    token = newToken,
                    message = "Token renovado com sucesso"
                }));
            }
            catch (Exception ex)
            {
                return Task.FromResult<IActionResult>(StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message }));
            }
        }

        /// <summary>
        /// Obtém informações sobre rate limiting do usuário
        /// </summary>
        /// <returns>Informações de rate limiting</returns>
        [HttpGet("rate-limit-info")]
        public IActionResult GetRateLimitInfo()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                var clientId = $"user:{userId}";
                var rateLimitInfo = _rateLimitingService.GetRateLimitInfo(clientId);

                return Ok(new { 
                    success = true, 
                    data = new {
                        remainingRequests = rateLimitInfo.RemainingRequests,
                        resetTime = rateLimitInfo.ResetTime,
                        isBlocked = rateLimitInfo.IsBlocked
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = "Erro interno do servidor", error = ex.Message });
            }
        }

        /// <summary>
        /// Valida o token atual
        /// </summary>
        /// <returns>Status do token</returns>
        [HttpGet("validate-token")]
        public IActionResult ValidateToken()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                return Ok(new { 
                    success = true, 
                    message = "Token válido",
                    userId = userId
                });
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
