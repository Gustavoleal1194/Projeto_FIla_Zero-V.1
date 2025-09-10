using System;
using System.Threading.Tasks;
using FilaZero.Domain.Entities;

namespace FilaZero.Domain.Interfaces.Services
{
    /// <summary>
    /// Interface para serviços de autenticação
    /// </summary>
    public interface IAuthService
    {
        Task<Usuario> AuthenticateAsync(string email, string senha);
        Task<Usuario> RegisterAsync(Usuario usuario, string senha);
        Task<bool> ChangePasswordAsync(Guid usuarioId, string senhaAtual, string novaSenha);
        Task<bool> ResetPasswordAsync(string email);
        Task<bool> ConfirmEmailAsync(Guid usuarioId, string token);
        Task<string> GenerateJwtTokenAsync(Usuario usuario);
        Task<bool> ValidateTokenAsync(string token);
        Task<Usuario> GetUserFromTokenAsync(string token);
    }
}
