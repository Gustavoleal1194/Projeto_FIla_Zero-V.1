using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FilaZero.Web.Hubs
{
    /// <summary>
    /// Hub do SignalR para notificações em tempo real
    /// </summary>
    [Authorize]
    public class NotificationHub : Hub
    {
        /// <summary>
        /// Conecta o usuário a um grupo específico (ex: evento)
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <returns>Task</returns>
        public async Task JoinEventGroup(string eventoId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Evento_{eventoId}");
        }

        /// <summary>
        /// Remove o usuário de um grupo específico
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <returns>Task</returns>
        public async Task LeaveEventGroup(string eventoId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Evento_{eventoId}");
        }

        /// <summary>
        /// Conecta o usuário ao grupo de KDS (Kitchen Display System)
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <returns>Task</returns>
        public async Task JoinKDSGroup(string eventoId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"KDS_{eventoId}");
        }

        /// <summary>
        /// Remove o usuário do grupo de KDS
        /// </summary>
        /// <param name="eventoId">ID do evento</param>
        /// <returns>Task</returns>
        public async Task LeaveKDSGroup(string eventoId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"KDS_{eventoId}");
        }

        /// <summary>
        /// Conecta o usuário ao grupo de notificações pessoais
        /// </summary>
        /// <returns>Task</returns>
        public async Task JoinPersonalGroup()
        {
            var userId = GetCurrentUserId();
            if (userId.HasValue)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
            }
        }

        /// <summary>
        /// Remove o usuário do grupo de notificações pessoais
        /// </summary>
        /// <returns>Task</returns>
        public async Task LeavePersonalGroup()
        {
            var userId = GetCurrentUserId();
            if (userId.HasValue)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"User_{userId}");
            }
        }

        /// <summary>
        /// Chamado quando um cliente se conecta
        /// </summary>
        /// <returns>Task</returns>
        public override async Task OnConnectedAsync()
        {
            var userId = GetCurrentUserId();
            if (userId.HasValue)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
            }
            
            await base.OnConnectedAsync();
        }

        /// <summary>
        /// Chamado quando um cliente se desconecta
        /// </summary>
        /// <param name="exception">Exceção que causou a desconexão</param>
        /// <returns>Task</returns>
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = GetCurrentUserId();
            if (userId.HasValue)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"User_{userId}");
            }
            
            await base.OnDisconnectedAsync(exception);
        }

        private Guid? GetCurrentUserId()
        {
            var userIdClaim = Context.User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
                return userId;
            return null;
        }
    }
}
