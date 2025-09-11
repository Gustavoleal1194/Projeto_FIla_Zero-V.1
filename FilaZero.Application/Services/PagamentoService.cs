using System;
using System.Threading.Tasks;
using FilaZero.Domain.Entities;
using FilaZero.Domain.Interfaces;
using FilaZero.Domain.Interfaces.Services;
using FilaZero.Application.DTOs;

namespace FilaZero.Application.Services
{
    /// <summary>
    /// Serviço para processamento de pagamentos
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
            try
            {
                // Gerar ID de transação único
                var transacaoId = GerarTransacaoId(metodo);

                // Criar registro de pagamento
                var pagamento = new Pagamento
                {
                    TransacaoId = transacaoId,
                    Valor = pedido.ValorTotal,
                    Status = StatusPagamento.Processando,
                    Metodo = metodo,
                    GatewayPagamento = ObterGatewayPagamento(metodo),
                    DataProcessamento = DateTime.UtcNow,
                    PedidoId = pedido.Id
                };

                await _unitOfWork.Pagamentos.AddAsync(pagamento);
                await _unitOfWork.SaveChangesAsync();

                // Simular processamento do pagamento
                var dadosDict = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(dadosPagamento) ?? new Dictionary<string, string>();
                var resultado = await SimularProcessamentoPagamento(metodo, dadosDict);

                // Atualizar status do pagamento
                pagamento.Status = resultado.Aprovado ? StatusPagamento.Aprovado : StatusPagamento.Negado;
                pagamento.RespostaGateway = resultado.Mensagem;
                
                if (resultado.Aprovado)
                {
                    pagamento.DataConfirmacao = DateTime.UtcNow;
                    
                    // Atualizar status do pedido
                    pedido.Status = StatusPedido.Pago;
                    pedido.DataConfirmacao = DateTime.UtcNow;
                    _unitOfWork.Pedidos.Update(pedido);
                }

                _unitOfWork.Pagamentos.Update(pagamento);
                await _unitOfWork.SaveChangesAsync();

                return pagamento;
            }
            catch (Exception ex)
            {
                // Log do erro
                Console.WriteLine($"Erro ao processar pagamento: {ex.Message}");
                throw;
            }
        }

        public async Task<Pagamento> ConfirmarPagamentoAsync(string transacaoId)
        {
            try
            {
                var pagamento = await _unitOfWork.Pagamentos.FirstOrDefaultAsync(p => p.TransacaoId == transacaoId);
                if (pagamento == null)
                    throw new ArgumentException("Pagamento não encontrado");

                // Simular confirmação do gateway
                await Task.Delay(1000); // Simula delay de rede

                pagamento.Status = StatusPagamento.Aprovado;
                pagamento.DataConfirmacao = DateTime.UtcNow;
                pagamento.RespostaGateway = "Pagamento confirmado com sucesso";

                _unitOfWork.Pagamentos.Update(pagamento);
                await _unitOfWork.SaveChangesAsync();

                return pagamento;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao confirmar pagamento: {ex.Message}");
                throw;
            }
        }

        public async Task<Pagamento> CancelarPagamentoAsync(string transacaoId)
        {
            try
            {
                var pagamento = await _unitOfWork.Pagamentos.FirstOrDefaultAsync(p => p.TransacaoId == transacaoId);
                if (pagamento == null)
                    throw new ArgumentException("Pagamento não encontrado");

                // Simular cancelamento no gateway
                await Task.Delay(1000); // Simula delay de rede

                pagamento.Status = StatusPagamento.Cancelado;
                pagamento.RespostaGateway = "Pagamento cancelado com sucesso";

                _unitOfWork.Pagamentos.Update(pagamento);
                await _unitOfWork.SaveChangesAsync();

                return pagamento;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao cancelar pagamento: {ex.Message}");
                throw;
            }
        }

        public async Task<Pagamento?> ObterPagamentoPorTransacaoAsync(string transacaoId)
        {
            return await _unitOfWork.Pagamentos.FirstOrDefaultAsync(p => p.TransacaoId == transacaoId);
        }

        public async Task<Pagamento> EstornarPagamentoAsync(string transacaoId)
        {
            try
            {
                var pagamento = await _unitOfWork.Pagamentos.FirstOrDefaultAsync(p => p.TransacaoId == transacaoId);
                if (pagamento == null)
                    throw new ArgumentException("Pagamento não encontrado");

                // Simular estorno no gateway
                await Task.Delay(1000);

                pagamento.Status = StatusPagamento.Estornado;
                pagamento.RespostaGateway = "Pagamento estornado com sucesso";

                _unitOfWork.Pagamentos.Update(pagamento);
                await _unitOfWork.SaveChangesAsync();

                return pagamento;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao estornar pagamento: {ex.Message}");
                throw;
            }
        }

        public Task<bool> ValidarPagamentoAsync(Pedido pedido, decimal valor)
        {
            try
            {
                // Validar se o valor do pedido confere
                var isValid = Math.Abs(pedido.ValorTotal - valor) < 0.01m;
                return Task.FromResult(isValid);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao validar pagamento: {ex.Message}");
                return Task.FromResult(false);
            }
        }

        public async Task<string> GerarQRCodePixAsync(decimal valor, string descricao)
        {
            try
            {
                // Simular geração de QR Code PIX
                await Task.Delay(500);
                
                var qrCodeData = new
                {
                    valor = valor.ToString("F2"),
                    descricao = descricao,
                    chave = "pix@filazero.com",
                    timestamp = DateTime.UtcNow.Ticks
                };

                return System.Text.Json.JsonSerializer.Serialize(qrCodeData);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro ao gerar QR Code PIX: {ex.Message}");
                throw;
            }
        }

        private string GerarTransacaoId(MetodoPagamento metodo)
        {
            var prefixo = metodo switch
            {
                MetodoPagamento.PIX => "PIX",
                MetodoPagamento.CartaoCredito => "CC",
                MetodoPagamento.CartaoDebito => "CD",
                MetodoPagamento.Dinheiro => "DIN",
                _ => "TXN"
            };

            return $"{prefixo}-{DateTime.UtcNow:yyyyMMddHHmmss}-{Guid.NewGuid().ToString("N")[..8].ToUpper()}";
        }

        private string ObterGatewayPagamento(MetodoPagamento metodo)
        {
            return metodo switch
            {
                MetodoPagamento.PIX => "PIX",
                MetodoPagamento.CartaoCredito => "Stripe",
                MetodoPagamento.CartaoDebito => "Stripe",
                MetodoPagamento.Dinheiro => "Local",
                _ => "Desconhecido"
            };
        }

        private async Task<(bool Aprovado, string Mensagem)> SimularProcessamentoPagamento(MetodoPagamento metodo, Dictionary<string, string> dadosPagamento)
        {
            // Simular delay de processamento
            await Task.Delay(2000);

            // Simular diferentes cenários baseados no método
            return metodo switch
            {
                MetodoPagamento.PIX => SimularPIX(dadosPagamento),
                MetodoPagamento.CartaoCredito => SimularCartaoCredito(dadosPagamento),
                MetodoPagamento.CartaoDebito => SimularCartaoDebito(dadosPagamento),
                MetodoPagamento.Dinheiro => (true, "Pagamento em dinheiro confirmado"),
                _ => (false, "Método de pagamento não suportado")
            };
        }

        private (bool Aprovado, string Mensagem) SimularPIX(Dictionary<string, string> dadosPagamento)
        {
            // Simular validação PIX
            if (!dadosPagamento.ContainsKey("chavePix") || string.IsNullOrEmpty(dadosPagamento["chavePix"]))
            {
                return (false, "Chave PIX inválida");
            }

            // 95% de chance de aprovação para PIX
            var aprovado = Random.Shared.Next(1, 101) <= 95;
            return aprovado 
                ? (true, "PIX processado com sucesso") 
                : (false, "Falha no processamento PIX");
        }

        private (bool Aprovado, string Mensagem) SimularCartaoCredito(Dictionary<string, string> dadosPagamento)
        {
            // Simular validação de cartão
            if (!dadosPagamento.ContainsKey("numeroCartao") || string.IsNullOrEmpty(dadosPagamento["numeroCartao"]))
            {
                return (false, "Número do cartão inválido");
            }

            // 90% de chance de aprovação para cartão de crédito
            var aprovado = Random.Shared.Next(1, 101) <= 90;
            return aprovado 
                ? (true, "Cartão de crédito aprovado") 
                : (false, "Cartão de crédito recusado");
        }

        private (bool Aprovado, string Mensagem) SimularCartaoDebito(Dictionary<string, string> dadosPagamento)
        {
            // Simular validação de cartão
            if (!dadosPagamento.ContainsKey("numeroCartao") || string.IsNullOrEmpty(dadosPagamento["numeroCartao"]))
            {
                return (false, "Número do cartão inválido");
            }

            // 85% de chance de aprovação para cartão de débito
            var aprovado = Random.Shared.Next(1, 101) <= 85;
            return aprovado 
                ? (true, "Cartão de débito aprovado") 
                : (false, "Cartão de débito recusado");
        }
    }
}