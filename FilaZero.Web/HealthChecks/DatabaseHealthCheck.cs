using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.EntityFrameworkCore;
using FilaZero.Infrastructure.Data;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace FilaZero.Web.HealthChecks
{
    /// <summary>
    /// Health check para verificar conectividade com o banco de dados
    /// </summary>
    public class DatabaseHealthCheck : IHealthCheck
    {
        private readonly FilaZeroDbContext _context;

        public DatabaseHealthCheck(FilaZeroDbContext context)
        {
            _context = context;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                await _context.Database.CanConnectAsync(cancellationToken);
                return HealthCheckResult.Healthy("Database is accessible");
            }
            catch (Exception ex)
            {
                return HealthCheckResult.Unhealthy("Database is not accessible", ex);
            }
        }
    }
}
