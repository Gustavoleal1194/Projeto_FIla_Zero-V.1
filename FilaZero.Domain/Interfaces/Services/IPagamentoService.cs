using System;
using System.Threading.Tasks;
using FilaZero.Domain.Entities;

namespace FilaZero.Domain.Interfaces.Services
{
    /// <summary>
    /// Interface para serviços de pagamento
    /// </summary>
    public interface IPagamentoService
    {
        Task<Pagamento> ProcessarPagamentoAsync(Pedido pedido, MetodoPagamento metodo, string dadosPagamento);
        Task<Pagamento> ConfirmarPagamentoAsync(string transacaoId);
        Task<Pagamento> CancelarPagamentoAsync(string transacaoId);
        Task<Pagamento> EstornarPagamentoAsync(string transacaoId);
        Task<bool> ValidarPagamentoAsync(Pedido pedido, decimal valor);
        Task<string> GerarQRCodePixAsync(decimal valor, string descricao);
    }
}
