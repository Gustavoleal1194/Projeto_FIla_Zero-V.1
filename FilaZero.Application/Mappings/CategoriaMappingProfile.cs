using AutoMapper;
using FilaZero.Application.DTOs;
using FilaZero.Domain.Entities;

namespace FilaZero.Application.Mappings
{
    /// <summary>
    /// Profile de mapeamento para Categoria
    /// </summary>
    public class CategoriaMappingProfile : Profile
    {
        public CategoriaMappingProfile()
        {
            // Categoria -> CategoriaDto
            CreateMap<Categoria, CategoriaDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Nome, opt => opt.MapFrom(src => src.Nome))
                .ForMember(dest => dest.Descricao, opt => opt.MapFrom(src => src.Descricao))
                .ForMember(dest => dest.Cor, opt => opt.MapFrom(src => src.Cor))
                .ForMember(dest => dest.Ordem, opt => opt.MapFrom(src => src.Ordem))
                .ForMember(dest => dest.Ativo, opt => opt.MapFrom(src => src.Ativo))
                .ForMember(dest => dest.EventoId, opt => opt.MapFrom(src => src.EventoId))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));

            // CriarCategoriaDto -> Categoria
            CreateMap<CriarCategoriaDto, Categoria>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Nome, opt => opt.MapFrom(src => src.Nome))
                .ForMember(dest => dest.Descricao, opt => opt.MapFrom(src => src.Descricao))
                .ForMember(dest => dest.Cor, opt => opt.MapFrom(src => src.Cor))
                .ForMember(dest => dest.Ordem, opt => opt.MapFrom(src => src.Ordem))
                .ForMember(dest => dest.Ativo, opt => opt.MapFrom(src => src.Ativo))
                .ForMember(dest => dest.EventoId, opt => opt.MapFrom(src => src.EventoId))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.Evento, opt => opt.Ignore())
                .ForMember(dest => dest.Produtos, opt => opt.Ignore());

            // AtualizarCategoriaDto -> Categoria
            CreateMap<AtualizarCategoriaDto, Categoria>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Nome, opt => opt.MapFrom(src => src.Nome))
                .ForMember(dest => dest.Descricao, opt => opt.MapFrom(src => src.Descricao))
                .ForMember(dest => dest.Cor, opt => opt.MapFrom(src => src.Cor))
                .ForMember(dest => dest.Ordem, opt => opt.MapFrom(src => src.Ordem))
                .ForMember(dest => dest.Ativo, opt => opt.MapFrom(src => src.Ativo))
                .ForMember(dest => dest.EventoId, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.Ignore())
                .ForMember(dest => dest.Evento, opt => opt.Ignore())
                .ForMember(dest => dest.Produtos, opt => opt.Ignore());
        }
    }
}

