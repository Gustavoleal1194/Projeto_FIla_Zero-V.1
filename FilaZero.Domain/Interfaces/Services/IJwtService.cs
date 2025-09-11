using System.Security.Claims;
using FilaZero.Domain.Entities;

namespace FilaZero.Domain.Interfaces.Services
{
    /// <summary>
    /// Interface para serviços de JWT
    /// </summary>
    public interface IJwtService
    {
        /// <summary>
        /// Gera um token JWT para o usuário
        /// </summary>
        /// <param name="usuario">Usuário para gerar o token</param>
        /// <returns>Token JWT</returns>
        string GenerateToken(Usuario usuario);

        /// <summary>
        /// Valida um token JWT
        /// </summary>
        /// <param name="token">Token a ser validado</param>
        /// <returns>ClaimsPrincipal se válido, null caso contrário</returns>
        ClaimsPrincipal? ValidateToken(string token);

        /// <summary>
        /// Extrai o ID do usuário do token
        /// </summary>
        /// <param name="token">Token JWT</param>
        /// <returns>ID do usuário ou null se não encontrado</returns>
        Guid? GetUserIdFromToken(string token);
    }
}
