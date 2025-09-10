using System;

namespace FilaZero.Domain.Interfaces.Services
{
    /// <summary>
    /// Interface para serviço de notificações em tempo real
    /// </summary>
    public interface INotificationService
    {
        /// <summary>
        /// Notifica sobre novo pedido
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <param name="pedidoId">ID do pedido</param>
        /// <param name="numeroPedido">Número do pedido</param>
        /// <returns>Task</returns>
        Task NotificarNovoPedidoAsync(Guid eventoId, Guid pedidoId, string numeroPedido);

        /// <summary>
        /// Notifica sobre atualização de status do pedido
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <param name="pedidoId">ID do pedido</param>
        /// <param name="numeroPedido">Número do pedido</param>
        /// <param name="novoStatus">Novo status</param>
        /// <param name="consumidorId">ID do consumidor (opcional)</param>
        /// <returns>Task</returns>
        Task NotificarAtualizacaoPedidoAsync(Guid eventoId, Guid pedidoId, string numeroPedido, string novoStatus, Guid? consumidorId = null);

        /// <summary>
        /// Notifica sobre atualização de item do pedido
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <param name="pedidoId">ID do pedido</param>
        /// <param name="itemId">ID do item</param>
        /// <param name="produtoNome">Nome do produto</param>
        /// <param name="novoStatus">Novo status</param>
        /// <returns>Task</returns>
        Task NotificarAtualizacaoItemAsync(Guid eventoId, Guid pedidoId, Guid itemId, string produtoNome, string novoStatus);

        /// <summary>
        /// Notifica sobre pagamento processado
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <param name="pedidoId">ID do pedido</param>
        /// <param name="numeroPedido">Número do pedido</param>
        /// <param name="statusPagamento">Status do pagamento</param>
        /// <param name="consumidorId">ID do consumidor</param>
        /// <returns>Task</returns>
        Task NotificarPagamentoAsync(Guid eventoId, Guid pedidoId, string numeroPedido, string statusPagamento, Guid consumidorId);

        /// <summary>
        /// Notifica sobre pedido pronto
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <param name="pedidoId">ID do pedido</param>
        /// <param name="numeroPedido">Número do pedido</param>
        /// <param name="consumidorId">ID do consumidor</param>
        /// <returns>Task</returns>
        Task NotificarPedidoProntoAsync(Guid eventoId, Guid pedidoId, string numeroPedido, Guid consumidorId);

        /// <summary>
        /// Notifica sobre cancelamento de pedido
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <param name="pedidoId">ID do pedido</param>
        /// <param name="numeroPedido">Número do pedido</param>
        /// <param name="consumidorId">ID do consumidor</param>
        /// <param name="motivo">Motivo do cancelamento</param>
        /// <returns>Task</returns>
        Task NotificarCancelamentoPedidoAsync(Guid eventoId, Guid pedidoId, string numeroPedido, Guid consumidorId, string motivo = "");

        /// <summary>
        /// Envia notificação personalizada para um usuário
        /// </summary>
        /// <param name="userId">ID do usuário</param>
        /// <param name="tipo">Tipo da notificação</param>
        /// <param name="mensagem">Mensagem</param>
        /// <param name="dados">Dados adicionais</param>
        /// <returns>Task</returns>
        Task EnviarNotificacaoPersonalizadaAsync(Guid userId, string tipo, string mensagem, object? dados = null);
    }
}
