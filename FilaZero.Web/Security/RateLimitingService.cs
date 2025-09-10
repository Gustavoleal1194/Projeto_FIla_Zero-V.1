using System.Collections.Concurrent;

namespace FilaZero.Web.Security
{
    /// <summary>
    /// Serviço de rate limiting para proteção contra ataques
    /// </summary>
    public class RateLimitingService
    {
        private readonly ConcurrentDictionary<string, List<DateTime>> _requests = new();
        private readonly int _maxRequests;
        private readonly TimeSpan _timeWindow;

        public RateLimitingService(int maxRequests = 100, int timeWindowMinutes = 15)
        {
            _maxRequests = maxRequests;
            _timeWindow = TimeSpan.FromMinutes(timeWindowMinutes);
        }

        /// <summary>
        /// Verifica se a requisição está dentro do limite de rate
        /// </summary>
        /// <param name="clientId">Identificador do cliente (IP, UserId, etc.)</param>
        /// <returns>True se permitido, False se bloqueado</returns>
        public bool IsAllowed(string clientId)
        {
            var now = DateTime.UtcNow;
            var clientRequests = _requests.GetOrAdd(clientId, _ => new List<DateTime>());

            lock (clientRequests)
            {
                // Remove requisições antigas
                clientRequests.RemoveAll(requestTime => now - requestTime > _timeWindow);

                // Verifica se excedeu o limite
                if (clientRequests.Count >= _maxRequests)
                {
                    return false;
                }

                // Adiciona a nova requisição
                clientRequests.Add(now);
                return true;
            }
        }

        /// <summary>
        /// Obtém informações sobre o rate limiting do cliente
        /// </summary>
        /// <param name="clientId">Identificador do cliente</param>
        /// <returns>Informações do rate limiting</returns>
        public RateLimitInfo GetRateLimitInfo(string clientId)
        {
            var now = DateTime.UtcNow;
            var clientRequests = _requests.GetOrAdd(clientId, _ => new List<DateTime>());

            lock (clientRequests)
            {
                // Remove requisições antigas
                clientRequests.RemoveAll(requestTime => now - requestTime > _timeWindow);

                return new RateLimitInfo
                {
                    RemainingRequests = Math.Max(0, _maxRequests - clientRequests.Count),
                    ResetTime = clientRequests.Any() ? clientRequests.Min().Add(_timeWindow) : now.Add(_timeWindow),
                    IsBlocked = clientRequests.Count >= _maxRequests
                };
            }
        }

        /// <summary>
        /// Limpa requisições antigas (chamado periodicamente)
        /// </summary>
        public void CleanupOldRequests()
        {
            var now = DateTime.UtcNow;
            var keysToRemove = new List<string>();

            foreach (var kvp in _requests)
            {
                lock (kvp.Value)
                {
                    kvp.Value.RemoveAll(requestTime => now - requestTime > _timeWindow);
                    if (!kvp.Value.Any())
                    {
                        keysToRemove.Add(kvp.Key);
                    }
                }
            }

            foreach (var key in keysToRemove)
            {
                _requests.TryRemove(key, out _);
            }
        }
    }

    /// <summary>
    /// Informações sobre rate limiting
    /// </summary>
    public class RateLimitInfo
    {
        public int RemainingRequests { get; set; }
        public DateTime ResetTime { get; set; }
        public bool IsBlocked { get; set; }
    }
}
