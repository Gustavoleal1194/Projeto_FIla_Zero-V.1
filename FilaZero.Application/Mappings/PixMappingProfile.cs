using AutoMapper;
using FilaZero.Application.DTOs;
using FilaZero.Domain.Entities;

namespace FilaZero.Application.Mappings
{
    public class PixMappingProfile : Profile
    {
        public PixMappingProfile()
        {
            CreateMap<PixCobranca, PixCobrancaDto>();
            CreateMap<CriarPixCobrancaDto, PixCobranca>();
        }
    }
}
