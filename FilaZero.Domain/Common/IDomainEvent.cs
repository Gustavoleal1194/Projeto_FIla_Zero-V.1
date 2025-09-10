using System;

namespace FilaZero.Domain.Common
{
    /// <summary>
    /// Interface para eventos de domínio
    /// </summary>
    public interface IDomainEvent
    {
        Guid Id { get; }
        DateTime OccurredOn { get; }
    }
}
