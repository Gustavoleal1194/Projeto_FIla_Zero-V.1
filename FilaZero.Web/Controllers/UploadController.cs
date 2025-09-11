using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FilaZero.Web.Controllers
{
    /// <summary>
    /// Controller para operações de upload de arquivos
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<UploadController> _logger;

        public UploadController(IWebHostEnvironment environment, ILogger<UploadController> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        /// <summary>
        /// Upload de imagem para evento (logo)
        /// </summary>
        /// <param name="file">Arquivo de imagem</param>
        /// <returns>URL da imagem</returns>
        [HttpPost("evento/logo")]
        [Authorize]
        public async Task<IActionResult> UploadEventoLogo(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "Nenhum arquivo enviado" });

            // Validar tipo de arquivo
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                return BadRequest(new { success = false, message = "Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP" });

            // Validar tamanho (máximo 5MB)
            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { success = false, message = "Arquivo muito grande. Máximo 5MB" });

            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                // Criar diretório se não existir
                var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "eventos", userId.ToString());
                Directory.CreateDirectory(uploadsPath);

                // Gerar nome único para o arquivo
                var fileName = $"logo_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Salvar arquivo
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Retornar URL da imagem
                var imageUrl = $"/uploads/eventos/{userId}/{fileName}";
                
                return Ok(new { 
                    success = true, 
                    data = new { 
                        url = imageUrl,
                        fileName = fileName,
                        size = file.Length
                    } 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao fazer upload da logo do evento");
                return StatusCode(500, new { success = false, message = "Erro interno do servidor" });
            }
        }

        /// <summary>
        /// Upload de imagem para produto
        /// </summary>
        /// <param name="file">Arquivo de imagem</param>
        /// <param name="eventoId">ID do evento</param>
        /// <returns>URL da imagem</returns>
        [HttpPost("produto")]
        [Authorize]
        public async Task<IActionResult> UploadProdutoImagem(IFormFile file, [FromForm] Guid eventoId)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "Nenhum arquivo enviado" });

            // Validar tipo de arquivo
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                return BadRequest(new { success = false, message = "Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP" });

            // Validar tamanho (máximo 5MB)
            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { success = false, message = "Arquivo muito grande. Máximo 5MB" });

            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                // Criar diretório se não existir
                var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "produtos", eventoId.ToString());
                Directory.CreateDirectory(uploadsPath);

                // Gerar nome único para o arquivo
                var fileName = $"produto_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Salvar arquivo
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Retornar URL da imagem
                var imageUrl = $"/uploads/produtos/{eventoId}/{fileName}";
                
                return Ok(new { 
                    success = true, 
                    data = new { 
                        url = imageUrl,
                        fileName = fileName,
                        size = file.Length
                    } 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao fazer upload da imagem do produto");
                return StatusCode(500, new { success = false, message = "Erro interno do servidor" });
            }
        }

        /// <summary>
        /// Upload de imagem genérica
        /// </summary>
        /// <param name="file">Arquivo de imagem</param>
        /// <param name="tipo">Tipo de upload (evento, produto, categoria)</param>
        /// <returns>URL da imagem</returns>
        [HttpPost("imagem")]
        [Authorize]
        public async Task<IActionResult> UploadImagem(IFormFile file, [FromForm] string tipo = "geral")
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { success = false, message = "Nenhum arquivo enviado" });

            // Validar tipo de arquivo
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif", "image/webp" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                return BadRequest(new { success = false, message = "Tipo de arquivo não permitido. Use JPG, PNG, GIF ou WebP" });

            // Validar tamanho (máximo 5MB)
            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { success = false, message = "Arquivo muito grande. Máximo 5MB" });

            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                // Criar diretório se não existir
                var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", tipo, userId.ToString());
                Directory.CreateDirectory(uploadsPath);

                // Gerar nome único para o arquivo
                var fileName = $"{tipo}_{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(uploadsPath, fileName);

                // Salvar arquivo
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Retornar URL da imagem
                var imageUrl = $"/uploads/{tipo}/{userId}/{fileName}";
                
                return Ok(new { 
                    success = true, 
                    data = new { 
                        url = imageUrl,
                        fileName = fileName,
                        size = file.Length
                    } 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao fazer upload da imagem");
                return StatusCode(500, new { success = false, message = "Erro interno do servidor" });
            }
        }

        /// <summary>
        /// Remove uma imagem
        /// </summary>
        /// <param name="url">URL da imagem a ser removida</param>
        /// <returns>Resultado da operação</returns>
        [HttpDelete("imagem")]
        [Authorize]
        public IActionResult RemoverImagem([FromQuery] string url)
        {
            if (string.IsNullOrEmpty(url))
                return BadRequest(new { success = false, message = "URL da imagem não fornecida" });

            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { success = false, message = "Token inválido" });

                // Extrair caminho do arquivo da URL
                var uri = new Uri(url);
                var filePath = Path.Combine(_environment.WebRootPath, uri.AbsolutePath.TrimStart('/'));

                // Verificar se o arquivo existe
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                    return Ok(new { success = true, message = "Imagem removida com sucesso" });
                }
                else
                {
                    return NotFound(new { success = false, message = "Imagem não encontrada" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao remover imagem");
                return StatusCode(500, new { success = false, message = "Erro interno do servidor" });
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
