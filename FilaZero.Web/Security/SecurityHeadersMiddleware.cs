using System.Net;

namespace FilaZero.Web.Security
{
    /// <summary>
    /// Middleware para adicionar headers de segurança
    /// </summary>
    public class SecurityHeadersMiddleware
    {
        private readonly RequestDelegate _next;

        public SecurityHeadersMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Content Security Policy
            context.Response.Headers.Add("Content-Security-Policy", 
                "default-src 'self'; " +
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                "style-src 'self' 'unsafe-inline'; " +
                "img-src 'self' data: https:; " +
                "font-src 'self' data:; " +
                "connect-src 'self' ws: wss:; " +
                "frame-ancestors 'none';");

            // X-Frame-Options
            context.Response.Headers.Add("X-Frame-Options", "DENY");

            // X-Content-Type-Options
            context.Response.Headers.Add("X-Content-Type-Options", "nosniff");

            // X-XSS-Protection
            context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");

            // Referrer-Policy
            context.Response.Headers.Add("Referrer-Policy", "strict-origin-when-cross-origin");

            // Permissions-Policy
            context.Response.Headers.Add("Permissions-Policy", 
                "geolocation=(), " +
                "microphone=(), " +
                "camera=(), " +
                "payment=(), " +
                "usb=(), " +
                "magnetometer=(), " +
                "gyroscope=(), " +
                "speaker=()");

            // Strict-Transport-Security (apenas em HTTPS)
            if (context.Request.IsHttps)
            {
                context.Response.Headers.Add("Strict-Transport-Security", 
                    "max-age=31536000; includeSubDomains; preload");
            }

            // Cache-Control para APIs
            if (context.Request.Path.StartsWithSegments("/api"))
            {
                context.Response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate");
                context.Response.Headers.Add("Pragma", "no-cache");
                context.Response.Headers.Add("Expires", "0");
            }

            await _next(context);
        }
    }
}
