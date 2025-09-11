using FilaZero.Web.Security;
using System.Net;

namespace FilaZero.Web.Middleware
{
    /// <summary>
    /// Middleware de rate limiting
    /// </summary>
    public class RateLimitingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly RateLimitingService _rateLimitingService;

        public RateLimitingMiddleware(RequestDelegate next, RateLimitingService rateLimitingService)
        {
            _next = next;
            _rateLimitingService = rateLimitingService;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var clientId = GetClientId(context);
            
            if (!_rateLimitingService.IsAllowed(clientId))
            {
                var rateLimitInfo = _rateLimitingService.GetRateLimitInfo(clientId);
                
                context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
                context.Response.Headers["X-RateLimit-Limit"] = "100";
                context.Response.Headers["X-RateLimit-Remaining"] = "0";
                context.Response.Headers["X-RateLimit-Reset"] = ((DateTimeOffset)rateLimitInfo.ResetTime).ToUnixTimeSeconds().ToString();
                
                await context.Response.WriteAsync("Rate limit exceeded. Please try again later.");
                return;
            }

            await _next(context);
        }

        private string GetClientId(HttpContext context)
        {
            // Prioridade: UserId > IP > ConnectionId
            var userId = context.User?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (!string.IsNullOrEmpty(userId))
                return $"user:{userId}";

            var ipAddress = GetClientIpAddress(context);
            return $"ip:{ipAddress}";
        }

        private string GetClientIpAddress(HttpContext context)
        {
            // Verifica headers de proxy
            var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
            if (!string.IsNullOrEmpty(forwardedFor))
            {
                return forwardedFor.Split(',')[0].Trim();
            }

            var realIp = context.Request.Headers["X-Real-IP"].FirstOrDefault();
            if (!string.IsNullOrEmpty(realIp))
            {
                return realIp;
            }

            return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        }
    }
}
