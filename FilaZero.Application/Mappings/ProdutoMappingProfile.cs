using AutoMapper;
using FilaZero.Application.DTOs;
using FilaZero.Domain.Entities;

namespace FilaZero.Application.Mappings
{
    /// <summary>
    /// Profile de mapeamento para Produto
    /// </summary>
    public class ProdutoMappingProfile : Profile
    {
        public ProdutoMappingProfile()
        {
            // Produto -> ProdutoDto
            CreateMap<Produto, ProdutoDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Nome, opt => opt.MapFrom(src => src.Nome))
                .ForMember(dest => dest.Descricao, opt => opt.MapFrom(src => src.Descricao))
                .ForMember(dest => dest.Preco, opt => opt.MapFrom(src => src.Preco))
                .ForMember(dest => dest.ImagemUrl, opt => opt.MapFrom(src => src.ImagemUrl))
                .ForMember(dest => dest.TempoPreparoMinutos, opt => opt.MapFrom(src => src.TempoPreparoMinutos))
                .ForMember(dest => dest.Ordem, opt => opt.MapFrom(src => src.Ordem))
                .ForMember(dest => dest.Ativo, opt => opt.MapFrom(src => src.Disponivel))
                .ForMember(dest => dest.Destaque, opt => opt.MapFrom(src => src.Destaque))
                .ForMember(dest => dest.EventoId, opt => opt.MapFrom(src => src.EventoId))
                .ForMember(dest => dest.CategoriaId, opt => opt.MapFrom(src => src.CategoriaId))
                .ForMember(dest => dest.CategoriaNome, opt => opt.MapFrom(src => src.Categoria != null ? src.Categoria.Nome : string.Empty))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));

            // CriarProdutoDto -> Produto
            CreateMap<CriarProdutoDto, Produto>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Nome, opt => opt.MapFrom(src => src.Nome))
                .ForMember(dest => dest.Descricao, opt => opt.MapFrom(src => src.Descricao))
                .ForMember(dest => dest.Preco, opt => opt.MapFrom(src => src.Preco))
                .ForMember(dest => dest.ImagemUrl, opt => opt.MapFrom(src => src.ImagemUrl))
                .ForMember(dest => dest.TempoPreparoMinutos, opt => opt.MapFrom(src => src.TempoPreparoMinutos))
                .ForMember(dest => dest.Ordem, opt => opt.MapFrom(src => src.Ordem))
                .ForMember(dest => dest.Disponivel, opt => opt.MapFrom(src => src.Ativo))
                .ForMember(dest => dest.Destaque, opt => opt.MapFrom(src => src.Destaque))
                .ForMember(dest => dest.EventoId, opt => opt.MapFrom(src => src.EventoId))
                .ForMember(dest => dest.CategoriaId, opt => opt.MapFrom(src => src.CategoriaId))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.Evento, opt => opt.Ignore())
                .ForMember(dest => dest.Categoria, opt => opt.Ignore())
                .ForMember(dest => dest.ItensPedido, opt => opt.Ignore());

            // AtualizarProdutoDto -> Produto
            CreateMap<AtualizarProdutoDto, Produto>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Nome, opt => opt.MapFrom(src => src.Nome))
                .ForMember(dest => dest.Descricao, opt => opt.MapFrom(src => src.Descricao))
                .ForMember(dest => dest.Preco, opt => opt.MapFrom(src => src.Preco))
                .ForMember(dest => dest.ImagemUrl, opt => opt.MapFrom(src => src.ImagemUrl))
                .ForMember(dest => dest.TempoPreparoMinutos, opt => opt.MapFrom(src => src.TempoPreparoMinutos))
                .ForMember(dest => dest.Ordem, opt => opt.MapFrom(src => src.Ordem))
                .ForMember(dest => dest.Disponivel, opt => opt.MapFrom(src => src.Ativo))
                .ForMember(dest => dest.Destaque, opt => opt.MapFrom(src => src.Destaque))
                .ForMember(dest => dest.CategoriaId, opt => opt.MapFrom(src => src.CategoriaId))
                .ForMember(dest => dest.EventoId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.Ignore())
                .ForMember(dest => dest.Evento, opt => opt.Ignore())
                .ForMember(dest => dest.Categoria, opt => opt.Ignore())
                .ForMember(dest => dest.ItensPedido, opt => opt.Ignore());
        }
    }
}

