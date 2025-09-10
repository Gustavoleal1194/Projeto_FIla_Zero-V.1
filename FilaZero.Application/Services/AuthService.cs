using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using FilaZero.Domain.Entities;
using FilaZero.Domain.Interfaces;
using FilaZero.Domain.Interfaces.Services;
using FilaZero.Application.DTOs;

namespace FilaZero.Application.Services
{
    /// <summary>
    /// Serviço de autenticação
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IConfiguration _configuration;

        public AuthService(IUnitOfWork unitOfWork, IConfiguration configuration)
        {
            _unitOfWork = unitOfWork;
            _configuration = configuration;
        }

        public async Task<Usuario> AuthenticateAsync(string email, string senha)
        {
            var usuario = await _unitOfWork.Usuarios.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
            
            if (usuario == null || !VerifyPassword(senha, usuario.SenhaHash, usuario.Salt))
                return null;

            usuario.UltimoLogin = DateTime.UtcNow;
            _unitOfWork.Usuarios.Update(usuario);
            await _unitOfWork.SaveChangesAsync();

            return usuario;
        }

        public async Task<Usuario> RegisterAsync(Usuario usuario, string senha)
        {
            // Verificar se email já existe
            var existingUser = await _unitOfWork.Usuarios.FirstOrDefaultAsync(u => u.Email == usuario.Email);
            if (existingUser != null)
                throw new InvalidOperationException("Email já está em uso");

            // Gerar hash da senha
            var (hash, salt) = HashPassword(senha);
            usuario.SenhaHash = hash;
            usuario.Salt = salt;
            usuario.EmailConfirmado = false;

            await _unitOfWork.Usuarios.AddAsync(usuario);
            await _unitOfWork.SaveChangesAsync();

            return usuario;
        }

        public async Task<bool> ChangePasswordAsync(Guid usuarioId, string senhaAtual, string novaSenha)
        {
            var usuario = await _unitOfWork.Usuarios.GetByIdAsync(usuarioId);
            if (usuario == null)
                return false;

            if (!VerifyPassword(senhaAtual, usuario.SenhaHash, usuario.Salt))
                return false;

            var (hash, salt) = HashPassword(novaSenha);
            usuario.SenhaHash = hash;
            usuario.Salt = salt;
            usuario.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Usuarios.Update(usuario);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<bool> ResetPasswordAsync(string email)
        {
            var usuario = await _unitOfWork.Usuarios.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
            if (usuario == null)
                return false;

            // Aqui você implementaria a lógica de envio de email para reset de senha
            // Por enquanto, apenas retornamos true
            return true;
        }

        public async Task<bool> ConfirmEmailAsync(Guid usuarioId, string token)
        {
            var usuario = await _unitOfWork.Usuarios.GetByIdAsync(usuarioId);
            if (usuario == null)
                return false;

            // Aqui você implementaria a validação do token
            // Por enquanto, apenas confirmamos o email
            usuario.EmailConfirmado = true;
            usuario.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Usuarios.Update(usuario);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<string> GenerateJwtTokenAsync(Usuario usuario)
        {
            // Esta implementação será substituída pelo JwtService seguro
            // Mantida para compatibilidade temporária
            var token = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{usuario.Id}:{usuario.Email}:{DateTime.UtcNow.Ticks}"));
            return token;
        }

        public async Task<bool> ValidateTokenAsync(string token)
        {
            try
            {
                var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(token));
                var parts = decoded.Split(':');
                return parts.Length == 3 && Guid.TryParse(parts[0], out _);
            }
            catch
            {
                return false;
            }
        }

        public async Task<Usuario> GetUserFromTokenAsync(string token)
        {
            try
            {
                var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(token));
                var parts = decoded.Split(':');
                
                if (parts.Length != 3 || !Guid.TryParse(parts[0], out var userId))
                    return null;

                return await _unitOfWork.Usuarios.GetByIdAsync(userId);
            }
            catch
            {
                return null;
            }
        }

        private (string hash, string salt) HashPassword(string password)
        {
            using var rng = RandomNumberGenerator.Create();
            var saltBytes = new byte[32];
            rng.GetBytes(saltBytes);
            var salt = Convert.ToBase64String(saltBytes);

            var hash = HashPasswordWithSalt(password, salt);
            return (hash, salt);
        }

        private string HashPasswordWithSalt(string password, string salt)
        {
            using var sha256 = SHA256.Create();
            var saltedPassword = password + salt;
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(saltedPassword));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string password, string hash, string salt)
        {
            var computedHash = HashPasswordWithSalt(password, salt);
            return computedHash == hash;
        }
    }
}
