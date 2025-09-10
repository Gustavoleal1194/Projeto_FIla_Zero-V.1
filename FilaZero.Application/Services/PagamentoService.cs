using System;
using System.Threading.Tasks;
using FilaZero.Domain.Entities;
using FilaZero.Domain.Interfaces;
using FilaZero.Domain.Interfaces.Services;

namespace FilaZero.Application.Services
{
    /// <summary>
    /// Serviço de pagamento (simulado)
    /// </summary>
    public class PagamentoService : IPagamentoService
    {
        private readonly IUnitOfWork _unitOfWork;

        public PagamentoService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Pagamento> ProcessarPagamentoAsync(Pedido pedido, MetodoPagamento metodo, string dadosPagamento)
        {
            // Simular processamento de pagamento
            var transacaoId = $"TXN_{DateTime.UtcNow.Ticks}";
            
            var pagamento = new Pagamento
            {
                TransacaoId = transacaoId,
                Valor = pedido.ValorTotal,
                Status = StatusPagamento.Processando,
                Metodo = metodo,
                GatewayPagamento = "FilaZeroMock",
                PedidoId = pedido.Id,
                DataProcessamento = DateTime.UtcNow
            };

            await _unitOfWork.Pagamentos.AddAsync(pagamento);
            await _unitOfWork.SaveChangesAsync();

            // Simular processamento assíncrono
            await Task.Delay(2000); // Simular delay de processamento

            // Simular aprovação do pagamento (90% de chance de aprovação)
            var random = new Random();
            var aprovado = random.NextDouble() < 0.9;

            pagamento.Status = aprovado ? StatusPagamento.Aprovado : StatusPagamento.Negado;
            pagamento.DataConfirmacao = DateTime.UtcNow;
            pagamento.RespostaGateway = aprovado 
                ? "Pagamento aprovado com sucesso" 
                : "Pagamento negado - dados inválidos";

            _unitOfWork.Pagamentos.Update(pagamento);

            // Atualizar status do pedido
            if (aprovado)
            {
                pedido.Status = StatusPedido.Pago;
                pedido.UpdatedAt = DateTime.UtcNow;
                _unitOfWork.Pedidos.Update(pedido);
            }

            await _unitOfWork.SaveChangesAsync();

            return pagamento;
        }

        public async Task<Pagamento> ConfirmarPagamentoAsync(string transacaoId)
        {
            var pagamento = await _unitOfWork.Pagamentos.FirstOrDefaultAsync(p => p.TransacaoId == transacaoId);
            if (pagamento == null)
                throw new ArgumentException("Pagamento não encontrado");

            if (pagamento.Status != StatusPagamento.Aprovado)
                throw new InvalidOperationException("Pagamento não está aprovado");

            pagamento.Status = StatusPagamento.Aprovado;
            pagamento.DataConfirmacao = DateTime.UtcNow;
            pagamento.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Pagamentos.Update(pagamento);
            await _unitOfWork.SaveChangesAsync();

            return pagamento;
        }

        public async Task<Pagamento> CancelarPagamentoAsync(string transacaoId)
        {
            var pagamento = await _unitOfWork.Pagamentos.FirstOrDefaultAsync(p => p.TransacaoId == transacaoId);
            if (pagamento == null)
                throw new ArgumentException("Pagamento não encontrado");

            if (pagamento.Status == StatusPagamento.Aprovado)
                throw new InvalidOperationException("Não é possível cancelar pagamento já aprovado");

            pagamento.Status = StatusPagamento.Cancelado;
            pagamento.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Pagamentos.Update(pagamento);
            await _unitOfWork.SaveChangesAsync();

            return pagamento;
        }

        public async Task<Pagamento> EstornarPagamentoAsync(string transacaoId)
        {
            var pagamento = await _unitOfWork.Pagamentos.FirstOrDefaultAsync(p => p.TransacaoId == transacaoId);
            if (pagamento == null)
                throw new ArgumentException("Pagamento não encontrado");

            if (pagamento.Status != StatusPagamento.Aprovado)
                throw new InvalidOperationException("Só é possível estornar pagamentos aprovados");

            pagamento.Status = StatusPagamento.Estornado;
            pagamento.UpdatedAt = DateTime.UtcNow;

            _unitOfWork.Pagamentos.Update(pagamento);
            await _unitOfWork.SaveChangesAsync();

            return pagamento;
        }

        public async Task<bool> ValidarPagamentoAsync(Pedido pedido, decimal valor)
        {
            // Validações básicas
            if (pedido == null)
                return false;

            if (valor <= 0)
                return false;

            if (Math.Abs(pedido.ValorTotal - valor) > 0.01m) // Tolerância de 1 centavo
                return false;

            return true;
        }

        public async Task<string> GerarQRCodePixAsync(decimal valor, string descricao)
        {
            // Simular geração de QR Code PIX
            var qrCodeData = $"PIX|{valor:F2}|{descricao}|{DateTime.UtcNow.Ticks}";
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(qrCodeData));
        }
    }
}
