using AutoMapper;
using FilaZero.Application.DTOs;
using FilaZero.Domain.Entities;

namespace FilaZero.Application.Mappings
{
    /// <summary>
    /// Profile de mapeamento para Pedido
    /// </summary>
    public class PedidoMappingProfile : Profile
    {
        public PedidoMappingProfile()
        {
            // Pedido -> PedidoDto
            CreateMap<Pedido, PedidoDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.NumeroPedido, opt => opt.MapFrom(src => src.NumeroPedido))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.ValorTotal, opt => opt.MapFrom(src => src.ValorTotal))
                .ForMember(dest => dest.TaxaServico, opt => opt.MapFrom(src => src.TaxaServico))
                .ForMember(dest => dest.Desconto, opt => opt.MapFrom(src => src.Desconto))
                .ForMember(dest => dest.Observacoes, opt => opt.MapFrom(src => src.Observacoes))
                .ForMember(dest => dest.TempoEstimadoMinutos, opt => opt.MapFrom(src => src.TempoEstimadoMinutos))
                .ForMember(dest => dest.DataCriacao, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.DataAtualizacao, opt => opt.MapFrom(src => src.UpdatedAt))
                .ForMember(dest => dest.EventoId, opt => opt.MapFrom(src => src.EventoId))
                .ForMember(dest => dest.ConsumidorId, opt => opt.MapFrom(src => src.ConsumidorId))
                .ForMember(dest => dest.ConsumidorNome, opt => opt.MapFrom(src => src.Consumidor != null ? src.Consumidor.Nome : string.Empty))
                .ForMember(dest => dest.Itens, opt => opt.MapFrom(src => src.Itens))
                .ForMember(dest => dest.Pagamento, opt => opt.MapFrom(src => src.Pagamento));

            // ItemPedido -> ItemPedidoDto
            CreateMap<ItemPedido, ItemPedidoDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Quantidade, opt => opt.MapFrom(src => src.Quantidade))
                .ForMember(dest => dest.PrecoUnitario, opt => opt.MapFrom(src => src.PrecoUnitario))
                .ForMember(dest => dest.PrecoTotal, opt => opt.MapFrom(src => src.PrecoTotal))
                .ForMember(dest => dest.Observacoes, opt => opt.MapFrom(src => src.Observacoes))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.PedidoId, opt => opt.MapFrom(src => src.PedidoId))
                .ForMember(dest => dest.ProdutoId, opt => opt.MapFrom(src => src.ProdutoId))
                .ForMember(dest => dest.ProdutoNome, opt => opt.MapFrom(src => src.Produto != null ? src.Produto.Nome : string.Empty))
                .ForMember(dest => dest.ProdutoImagemUrl, opt => opt.MapFrom(src => src.Produto != null ? src.Produto.ImagemUrl : string.Empty));

            // CriarItemPedidoDto -> ItemPedido
            CreateMap<CriarItemPedidoDto, ItemPedido>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Quantidade, opt => opt.MapFrom(src => src.Quantidade))
                .ForMember(dest => dest.PrecoUnitario, opt => opt.Ignore()) // Será preenchido pelo serviço
                .ForMember(dest => dest.PrecoTotal, opt => opt.Ignore()) // Será calculado pelo serviço
                .ForMember(dest => dest.Observacoes, opt => opt.MapFrom(src => src.Observacoes))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => StatusItem.Aguardando))
                .ForMember(dest => dest.PedidoId, opt => opt.Ignore()) // Será preenchido pelo serviço
                .ForMember(dest => dest.ProdutoId, opt => opt.MapFrom(src => src.ProdutoId))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.Pedido, opt => opt.Ignore())
                .ForMember(dest => dest.Produto, opt => opt.Ignore());

            // AtualizarStatusPedidoDto -> Pedido (apenas para atualização de status)
            CreateMap<AtualizarStatusPedidoDto, Pedido>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.NumeroPedido, opt => opt.Ignore())
                .ForMember(dest => dest.ValorTotal, opt => opt.Ignore())
                .ForMember(dest => dest.TaxaServico, opt => opt.Ignore())
                .ForMember(dest => dest.Desconto, opt => opt.Ignore())
                .ForMember(dest => dest.Observacoes, opt => opt.Ignore())
                .ForMember(dest => dest.TempoEstimadoMinutos, opt => opt.Ignore())
                .ForMember(dest => dest.DataConfirmacao, opt => opt.Ignore())
                .ForMember(dest => dest.DataPreparo, opt => opt.Ignore())
                .ForMember(dest => dest.DataPronto, opt => opt.Ignore())
                .ForMember(dest => dest.DataEntregue, opt => opt.Ignore())
                .ForMember(dest => dest.EventoId, opt => opt.Ignore())
                .ForMember(dest => dest.ConsumidorId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.Ignore())
                .ForMember(dest => dest.Evento, opt => opt.Ignore())
                .ForMember(dest => dest.Consumidor, opt => opt.Ignore())
                .ForMember(dest => dest.Itens, opt => opt.Ignore())
                .ForMember(dest => dest.Pagamento, opt => opt.Ignore());
        }
    }
}
