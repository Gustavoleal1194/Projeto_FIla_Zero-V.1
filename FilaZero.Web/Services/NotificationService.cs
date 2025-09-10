using Microsoft.AspNetCore.SignalR;
using FilaZero.Web.Hubs;
using FilaZero.Domain.Interfaces.Services;

namespace FilaZero.Web.Services
{
    /// <summary>
    /// Serviço para envio de notificações em tempo real
    /// </summary>
    public class NotificationService : INotificationService
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationService(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        /// <summary>
        /// Notifica sobre novo pedido
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <param name="pedidoId">ID do pedido</param>
        /// <param name="numeroPedido">Número do pedido</param>
        /// <returns>Task</returns>
        public async Task NotificarNovoPedidoAsync(Guid eventoId, Guid pedidoId, string numeroPedido)
        {
            var notification = new
            {
                Tipo = "NovoPedido",
                PedidoId = pedidoId,
                NumeroPedido = numeroPedido,
                EventoId = eventoId,
                Timestamp = DateTime.UtcNow,
                Mensagem = $"Novo pedido #{numeroPedido} recebido!"
            };

            // Notificar grupo do evento
            await _hubContext.Clients.Group($"Evento_{eventoId}").SendAsync("NovoPedido", notification);
            
            // Notificar grupo do KDS
            await _hubContext.Clients.Group($"KDS_{eventoId}").SendAsync("NovoPedidoKDS", notification);
        }

        /// <summary>
        /// Notifica sobre atualização de status do pedido
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <param name="pedidoId">ID do pedido</param>
        /// <param name="numeroPedido">Número do pedido</param>
        /// <param name="novoStatus">Novo status</param>
        /// <param name="consumidorId">ID do consumidor (opcional)</param>
        /// <returns>Task</returns>
        public async Task NotificarAtualizacaoPedidoAsync(Guid eventoId, Guid pedidoId, string numeroPedido, string novoStatus, Guid? consumidorId = null)
        {
            var notification = new
            {
                Tipo = "AtualizacaoPedido",
                PedidoId = pedidoId,
                NumeroPedido = numeroPedido,
                EventoId = eventoId,
                NovoStatus = novoStatus,
                Timestamp = DateTime.UtcNow,
                Mensagem = $"Pedido #{numeroPedido} atualizado para: {novoStatus}"
            };

            // Notificar grupo do evento
            await _hubContext.Clients.Group($"Evento_{eventoId}").SendAsync("AtualizacaoPedido", notification);
            
            // Notificar grupo do KDS
            await _hubContext.Clients.Group($"KDS_{eventoId}").SendAsync("AtualizacaoPedidoKDS", notification);

            // Notificar consumidor específico se fornecido
            if (consumidorId.HasValue)
            {
                await _hubContext.Clients.Group($"User_{consumidorId}").SendAsync("AtualizacaoPedido", notification);
            }
        }

        /// <summary>
        /// Notifica sobre atualização de item do pedido
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <param name="pedidoId">ID do pedido</param>
        /// <param name="itemId">ID do item</param>
        /// <param name="produtoNome">Nome do produto</param>
        /// <param name="novoStatus">Novo status</param>
        /// <returns>Task</returns>
        public async Task NotificarAtualizacaoItemAsync(Guid eventoId, Guid pedidoId, Guid itemId, string produtoNome, string novoStatus)
        {
            var notification = new
            {
                Tipo = "AtualizacaoItem",
                PedidoId = pedidoId,
                ItemId = itemId,
                ProdutoNome = produtoNome,
                EventoId = eventoId,
                NovoStatus = novoStatus,
                Timestamp = DateTime.UtcNow,
                Mensagem = $"Item {produtoNome} atualizado para: {novoStatus}"
            };

            // Notificar grupo do KDS
            await _hubContext.Clients.Group($"KDS_{eventoId}").SendAsync("AtualizacaoItem", notification);
        }

        /// <summary>
        /// Notifica sobre pagamento processado
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <param name="pedidoId">ID do pedido</param>
        /// <param name="numeroPedido">Número do pedido</param>
        /// <param name="statusPagamento">Status do pagamento</param>
        /// <param name="consumidorId">ID do consumidor</param>
        /// <returns>Task</returns>
        public async Task NotificarPagamentoAsync(Guid eventoId, Guid pedidoId, string numeroPedido, string statusPagamento, Guid consumidorId)
        {
            var notification = new
            {
                Tipo = "Pagamento",
                PedidoId = pedidoId,
                NumeroPedido = numeroPedido,
                EventoId = eventoId,
                StatusPagamento = statusPagamento,
                Timestamp = DateTime.UtcNow,
                Mensagem = $"Pagamento do pedido #{numeroPedido}: {statusPagamento}"
            };

            // Notificar grupo do evento
            await _hubContext.Clients.Group($"Evento_{eventoId}").SendAsync("Pagamento", notification);
            
            // Notificar grupo do KDS
            await _hubContext.Clients.Group($"KDS_{eventoId}").SendAsync("PagamentoKDS", notification);

            // Notificar consumidor específico
            await _hubContext.Clients.Group($"User_{consumidorId}").SendAsync("Pagamento", notification);
        }

        /// <summary>
        /// Notifica sobre pedido pronto
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <param name="pedidoId">ID do pedido</param>
        /// <param name="numeroPedido">Número do pedido</param>
        /// <param name="consumidorId">ID do consumidor</param>
        /// <returns>Task</returns>
        public async Task NotificarPedidoProntoAsync(Guid eventoId, Guid pedidoId, string numeroPedido, Guid consumidorId)
        {
            var notification = new
            {
                Tipo = "PedidoPronto",
                PedidoId = pedidoId,
                NumeroPedido = numeroPedido,
                EventoId = eventoId,
                Timestamp = DateTime.UtcNow,
                Mensagem = $"Seu pedido #{numeroPedido} está pronto para retirada!",
                Urgente = true
            };

            // Notificar consumidor específico
            await _hubContext.Clients.Group($"User_{consumidorId}").SendAsync("PedidoPronto", notification);
            
            // Notificar grupo do evento
            await _hubContext.Clients.Group($"Evento_{eventoId}").SendAsync("PedidoPronto", notification);
        }

        /// <summary>
        /// Notifica sobre cancelamento de pedido
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <param name="pedidoId">ID do pedido</param>
        /// <param name="numeroPedido">Número do pedido</param>
        /// <param name="consumidorId">ID do consumidor</param>
        /// <param name="motivo">Motivo do cancelamento</param>
        /// <returns>Task</returns>
        public async Task NotificarCancelamentoPedidoAsync(Guid eventoId, Guid pedidoId, string numeroPedido, Guid consumidorId, string motivo = "")
        {
            var notification = new
            {
                Tipo = "CancelamentoPedido",
                PedidoId = pedidoId,
                NumeroPedido = numeroPedido,
                EventoId = eventoId,
                Motivo = motivo,
                Timestamp = DateTime.UtcNow,
                Mensagem = $"Pedido #{numeroPedido} foi cancelado. {motivo}"
            };

            // Notificar consumidor específico
            await _hubContext.Clients.Group($"User_{consumidorId}").SendAsync("CancelamentoPedido", notification);
            
            // Notificar grupo do evento
            await _hubContext.Clients.Group($"Evento_{eventoId}").SendAsync("CancelamentoPedido", notification);
            
            // Notificar grupo do KDS
            await _hubContext.Clients.Group($"KDS_{eventoId}").SendAsync("CancelamentoPedidoKDS", notification);
        }

        /// <summary>
        /// Envia notificação personalizada para um usuário
        /// </summary>
        /// <param name="userId">ID do usuário</param>
        /// <param name="tipo">Tipo da notificação</param>
        /// <param name="mensagem">Mensagem</param>
        /// <param name="dados">Dados adicionais</param>
        /// <returns>Task</returns>
        public async Task EnviarNotificacaoPersonalizadaAsync(Guid userId, string tipo, string mensagem, object? dados = null)
        {
            var notification = new
            {
                Tipo = tipo,
                Mensagem = mensagem,
                Dados = dados,
                Timestamp = DateTime.UtcNow
            };

            await _hubContext.Clients.Group($"User_{userId}").SendAsync("NotificacaoPersonalizada", notification);
        }
    }
}
