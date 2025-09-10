using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FilaZero.Domain.Entities;

namespace FilaZero.Web.Security
{
    /// <summary>
    /// Serviço seguro para geração e validação de JWT
    /// </summary>
    public class JwtService
    {
        private readonly IConfiguration _configuration;
        private readonly string _secretKey;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly int _expiryMinutes;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration;
            _secretKey = _configuration["Jwt:SecretKey"] ?? throw new ArgumentNullException("Jwt:SecretKey");
            _issuer = _configuration["Jwt:Issuer"] ?? throw new ArgumentNullException("Jwt:Issuer");
            _audience = _configuration["Jwt:Audience"] ?? throw new ArgumentNullException("Jwt:Audience");
            _expiryMinutes = int.Parse(_configuration["Jwt:ExpiryInMinutes"] ?? "60");
        }

        /// <summary>
        /// Gera um JWT token seguro
        /// </summary>
        /// <param name="usuario">Usuário autenticado</param>
        /// <returns>JWT token</returns>
        public string GenerateToken(Usuario usuario)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_secretKey);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
                new Claim(ClaimTypes.Name, usuario.Nome),
                new Claim(ClaimTypes.Email, usuario.Email),
                new Claim("jti", Guid.NewGuid().ToString()), // JWT ID para revogação
                new Claim("iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(_expiryMinutes),
                Issuer = _issuer,
                Audience = _audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        /// <summary>
        /// Valida um JWT token
        /// </summary>
        /// <param name="token">Token a ser validado</param>
        /// <returns>Claims do usuário se válido, null caso contrário</returns>
        public ClaimsPrincipal? ValidateToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.UTF8.GetBytes(_secretKey);

                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = _issuer,
                    ValidateAudience = true,
                    ValidAudience = _audience,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero // Sem tolerância para expiração
                };

                var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
                return principal;
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Extrai o ID do usuário do token
        /// </summary>
        /// <param name="token">JWT token</param>
        /// <returns>ID do usuário ou null</returns>
        public Guid? GetUserIdFromToken(string token)
        {
            var principal = ValidateToken(token);
            if (principal?.Identity is ClaimsIdentity identity)
            {
                var userIdClaim = identity.FindFirst(ClaimTypes.NameIdentifier);
                if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
                {
                    return userId;
                }
            }
            return null;
        }

        /// <summary>
        /// Verifica se o token está próximo do vencimento
        /// </summary>
        /// <param name="token">JWT token</param>
        /// <returns>True se próximo do vencimento</returns>
        public bool IsTokenNearExpiry(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var jwtToken = tokenHandler.ReadJwtToken(token);
                
                var expiryTime = jwtToken.ValidTo;
                var timeUntilExpiry = expiryTime - DateTime.UtcNow;
                
                // Considera próximo do vencimento se restam menos de 5 minutos
                return timeUntilExpiry.TotalMinutes < 5;
            }
            catch
            {
                return true; // Se não conseguir ler, considera como próximo do vencimento
            }
        }
    }
}
