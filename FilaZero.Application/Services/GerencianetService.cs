using System.Text;
using System.Text.Json;
using FilaZero.Application.DTOs;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FilaZero.Application.Services
{
    public class GerencianetService : IGerencianetService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<GerencianetService> _logger;
        private string? _accessToken;
        private DateTime _tokenExpiration = DateTime.MinValue;

        public GerencianetService(HttpClient httpClient, IConfiguration configuration, ILogger<GerencianetService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<string> ObterTokenAcessoAsync()
        {
            if (!string.IsNullOrEmpty(_accessToken) && DateTime.UtcNow < _tokenExpiration)
                return _accessToken;

            try
            {
                var clientId = _configuration["Pix:Gerencianet:ClientId"];
                var clientSecret = _configuration["Pix:Gerencianet:ClientSecret"];
                var baseUrl = _configuration["Pix:Gerencianet:BaseUrl"];

                if (string.IsNullOrEmpty(clientId) || string.IsNullOrEmpty(clientSecret))
                {
                    throw new InvalidOperationException("Configurações PIX Gerencianet não encontradas");
                }

                var credentials = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{clientId}:{clientSecret}"));

                var request = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/oauth/token")
                {
                    Headers = { { "Authorization", $"Basic {credentials}" } },
                    Content = new FormUrlEncodedContent(new[]
                    {
                        new KeyValuePair<string, string>("grant_type", "client_credentials")
                    })
                };

                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var tokenResponse = JsonSerializer.Deserialize<GerencianetTokenResponse>(json);

                if (tokenResponse?.AccessToken == null)
                    throw new InvalidOperationException("Token de acesso não obtido");

                _accessToken = tokenResponse.AccessToken;
                _tokenExpiration = DateTime.UtcNow.AddSeconds(tokenResponse.ExpiresIn - 60); // 1 minuto de margem

                _logger.LogInformation("Token de acesso Gerencianet obtido com sucesso");
                return _accessToken;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao obter token de acesso Gerencianet");
                throw;
            }
        }

        public async Task<GerencianetPixResponse> CriarCobrancaPixAsync(CriarPixCobrancaDto request)
        {
            try
            {
                var token = await ObterTokenAcessoAsync();
                var baseUrl = _configuration["Pix:Gerencianet:BaseUrl"];
                var chavePix = _configuration["Pix:Gerencianet:ChavePix"];

                var txId = $"FZ{DateTime.UtcNow:yyyyMMddHHmmss}{Guid.NewGuid().ToString("N")[..8]}";

                var cobrancaRequest = new
                {
                    calendario = new
                    {
                        expiracao = request.ExpiracaoMinutos ?? 30
                    },
                    valor = new
                    {
                        original = request.Valor.ToString("F2", System.Globalization.CultureInfo.InvariantCulture)
                    },
                    chave = chavePix,
                    solicitacaoPagador = request.Descricao,
                    infoAdicionais = new[]
                    {
                        new { nome = "PedidoId", valor = request.PedidoId.ToString() }
                    }
                };

                var json = JsonSerializer.Serialize(cobrancaRequest);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var httpRequest = new HttpRequestMessage(HttpMethod.Post, $"{baseUrl}/v2/cob/{txId}")
                {
                    Headers = { { "Authorization", $"Bearer {token}" } },
                    Content = content
                };

                var response = await _httpClient.SendAsync(httpRequest);
                var responseJson = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var cobrancaResponse = JsonSerializer.Deserialize<GerencianetCobrancaResponse>(responseJson);
                    
                    return new GerencianetPixResponse
                    {
                        Sucesso = true,
                        TxId = txId,
                        QrCode = cobrancaResponse?.PixCopiaECola,
                        QrCodeBase64 = await GerarQrCodeBase64Async(cobrancaResponse?.PixCopiaECola),
                        ChavePix = chavePix,
                        Status = cobrancaResponse?.Status ?? "ATIVA",
                        DataExpiracao = cobrancaResponse?.Calendario?.Expiracao != null 
                            ? DateTime.UtcNow.AddSeconds(cobrancaResponse.Calendario.Expiracao) 
                            : null
                    };
                }
                else
                {
                    var errorResponse = JsonSerializer.Deserialize<GerencianetErrorResponse>(responseJson);
                    return new GerencianetPixResponse
                    {
                        Sucesso = false,
                        Erro = errorResponse?.Detail ?? "Erro desconhecido",
                        CodigoErro = (int)response.StatusCode
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar cobrança PIX");
                return new GerencianetPixResponse
                {
                    Sucesso = false,
                    Erro = ex.Message
                };
            }
        }

        public async Task<GerencianetPixResponse> ConsultarCobrancaPixAsync(string txId)
        {
            try
            {
                var token = await ObterTokenAcessoAsync();
                var baseUrl = _configuration["Pix:Gerencianet:BaseUrl"];

                var httpRequest = new HttpRequestMessage(HttpMethod.Get, $"{baseUrl}/v2/cob/{txId}")
                {
                    Headers = { { "Authorization", $"Bearer {token}" } }
                };

                var response = await _httpClient.SendAsync(httpRequest);
                var responseJson = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var cobrancaResponse = JsonSerializer.Deserialize<GerencianetCobrancaResponse>(responseJson);
                    
                    return new GerencianetPixResponse
                    {
                        Sucesso = true,
                        TxId = txId,
                        QrCode = cobrancaResponse?.PixCopiaECola,
                        QrCodeBase64 = await GerarQrCodeBase64Async(cobrancaResponse?.PixCopiaECola),
                        ChavePix = cobrancaResponse?.Chave,
                        Status = cobrancaResponse?.Status ?? "ATIVA"
                    };
                }
                else
                {
                    return new GerencianetPixResponse
                    {
                        Sucesso = false,
                        Erro = "Erro ao consultar cobrança",
                        CodigoErro = (int)response.StatusCode
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao consultar cobrança PIX");
                return new GerencianetPixResponse
                {
                    Sucesso = false,
                    Erro = ex.Message
                };
            }
        }

        public async Task<bool> ValidarWebhookAsync(string payload, string signature)
        {
            try
            {
                // Implementar validação de assinatura do webhook
                // A Gerencianet envia um header X-GN-Signature com a assinatura
                // Por simplicidade, retornando true - em produção deve validar a assinatura
                return await Task.FromResult(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao validar webhook");
                return false;
            }
        }

        private async Task<string?> GerarQrCodeBase64Async(string? qrCode)
        {
            if (string.IsNullOrEmpty(qrCode))
                return null;

            try
            {
                // Usar uma biblioteca de QR Code (ex: QRCoder)
                // Por simplicidade, retornando um QR Code simulado
                var qrCodeBytes = Encoding.UTF8.GetBytes(qrCode);
                return Convert.ToBase64String(qrCodeBytes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao gerar QR Code base64");
                return null;
            }
        }
    }

    // Classes para deserialização JSON
    public class GerencianetTokenResponse
    {
        public string AccessToken { get; set; } = string.Empty;
        public int ExpiresIn { get; set; }
        public string TokenType { get; set; } = string.Empty;
    }

    public class GerencianetCobrancaResponse
    {
        public string TxId { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string Chave { get; set; } = string.Empty;
        public string PixCopiaECola { get; set; } = string.Empty;
        public GerencianetCalendario? Calendario { get; set; }
    }

    public class GerencianetCalendario
    {
        public int Expiracao { get; set; }
    }

    public class GerencianetErrorResponse
    {
        public string Detail { get; set; } = string.Empty;
    }
}
