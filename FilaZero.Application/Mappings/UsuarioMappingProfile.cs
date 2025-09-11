using AutoMapper;
using FilaZero.Application.DTOs;
using FilaZero.Domain.Entities;

namespace FilaZero.Application.Mappings
{
    /// <summary>
    /// Profile de mapeamento para Usuario
    /// </summary>
    public class UsuarioMappingProfile : Profile
    {
        public UsuarioMappingProfile()
        {
            // Usuario -> UsuarioDto
            CreateMap<Usuario, UsuarioDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Nome, opt => opt.MapFrom(src => src.Nome))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Telefone, opt => opt.MapFrom(src => src.Telefone))
                .ForMember(dest => dest.Tipo, opt => opt.MapFrom(src => src.Tipo))
                .ForMember(dest => dest.EmailConfirmado, opt => opt.MapFrom(src => src.EmailConfirmado))
                .ForMember(dest => dest.UltimoLogin, opt => opt.MapFrom(src => src.UltimoLogin))
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));

            // CriarUsuarioDto -> Usuario
            CreateMap<CriarUsuarioDto, Usuario>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Nome, opt => opt.MapFrom(src => src.Nome))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Telefone, opt => opt.MapFrom(src => src.Telefone))
                .ForMember(dest => dest.Tipo, opt => opt.MapFrom(src => src.Tipo))
                .ForMember(dest => dest.SenhaHash, opt => opt.Ignore()) // Será preenchido pelo serviço
                .ForMember(dest => dest.Salt, opt => opt.Ignore()) // Será preenchido pelo serviço
                .ForMember(dest => dest.EmailConfirmado, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.UltimoLogin, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.MapFrom(src => true))
                .ForMember(dest => dest.Eventos, opt => opt.Ignore())
                .ForMember(dest => dest.Pedidos, opt => opt.Ignore());

            // LoginDto -> Usuario (para busca)
            CreateMap<LoginDto, Usuario>()
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.SenhaHash, opt => opt.Ignore())
                .ForMember(dest => dest.Salt, opt => opt.Ignore())
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Nome, opt => opt.Ignore())
                .ForMember(dest => dest.Telefone, opt => opt.Ignore())
                .ForMember(dest => dest.Tipo, opt => opt.Ignore())
                .ForMember(dest => dest.EmailConfirmado, opt => opt.Ignore())
                .ForMember(dest => dest.UltimoLogin, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.IsActive, opt => opt.Ignore())
                .ForMember(dest => dest.Eventos, opt => opt.Ignore())
                .ForMember(dest => dest.Pedidos, opt => opt.Ignore());
        }
    }
}

