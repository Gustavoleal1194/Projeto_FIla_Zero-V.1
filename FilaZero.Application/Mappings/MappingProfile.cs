using AutoMapper;

namespace FilaZero.Application.Mappings
{
    /// <summary>
    /// Profile principal que registra todos os profiles de mapeamento
    /// </summary>
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Este profile será usado apenas para registrar os outros profiles
            // Os mapeamentos específicos estão nos profiles individuais
        }
    }
}

