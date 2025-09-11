using AutoMapper;
using FilaZero.Application.DTOs;
using FilaZero.Domain.Entities;

namespace FilaZero.Application.Mappings
{
    /// <summary>
    /// Profile de mapeamento para Pagamento
    /// </summary>
    public class PagamentoMappingProfile : Profile
    {
        public PagamentoMappingProfile()
        {
            // Pagamento -> PagamentoDto
            CreateMap<Pagamento, PagamentoDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.TransacaoId, opt => opt.MapFrom(src => src.TransacaoId))
                .ForMember(dest => dest.Valor, opt => opt.MapFrom(src => src.Valor))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status))
                .ForMember(dest => dest.Metodo, opt => opt.MapFrom(src => src.Metodo))
                .ForMember(dest => dest.GatewayPagamento, opt => opt.MapFrom(src => src.GatewayPagamento))
                .ForMember(dest => dest.RespostaGateway, opt => opt.MapFrom(src => src.RespostaGateway))
                .ForMember(dest => dest.DataCriacao, opt => opt.MapFrom(src => src.CreatedAt))
                .ForMember(dest => dest.DataProcessamento, opt => opt.MapFrom(src => src.DataProcessamento))
                .ForMember(dest => dest.DataConfirmacao, opt => opt.MapFrom(src => src.DataConfirmacao))
                .ForMember(dest => dest.PedidoId, opt => opt.MapFrom(src => src.PedidoId));

            // ProcessarPagamentoDto -> Pagamento
            CreateMap<ProcessarPagamentoDto, Pagamento>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.TransacaoId, opt => opt.Ignore()) // Será gerado pelo serviço
                .ForMember(dest => dest.Valor, opt => opt.MapFrom(src => src.Valor))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => StatusPagamento.Pendente))
                .ForMember(dest => dest.Metodo, opt => opt.MapFrom(src => src.Metodo))
                .ForMember(dest => dest.GatewayPagamento, opt => opt.Ignore()) // Será preenchido pelo serviço
                .ForMember(dest => dest.RespostaGateway, opt => opt.Ignore()) // Será preenchido pelo serviço
                .ForMember(dest => dest.DataProcessamento, opt => opt.Ignore())
                .ForMember(dest => dest.DataConfirmacao, opt => opt.Ignore())
                .ForMember(dest => dest.PedidoId, opt => opt.MapFrom(src => src.PedidoId))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.Pedido, opt => opt.Ignore());
        }
    }
}

