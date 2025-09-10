using Microsoft.Extensions.DependencyInjection;
using FilaZero.Domain.Interfaces.Services;
using FilaZero.Application.Services;

namespace FilaZero.Application.Extensions
{
    /// <summary>
    /// Extensões para configuração de serviços da camada de aplicação
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Adiciona os serviços de aplicação ao container de DI
        /// </summary>
        /// <param name="services">Coleção de serviços</param>
        /// <returns>Coleção de serviços configurada</returns>
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // Registrar serviços
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IPedidoService, PedidoService>();
            services.AddScoped<IPagamentoService, PagamentoService>();

            return services;
        }
    }
}
