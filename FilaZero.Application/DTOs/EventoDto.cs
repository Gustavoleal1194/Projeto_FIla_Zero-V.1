using System;
using System.ComponentModel.DataAnnotations;

namespace FilaZero.Application.DTOs
{
    /// <summary>
    /// DTO para exibição de eventos
    /// </summary>
    public class EventoDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public string Endereco { get; set; }
        public string Cidade { get; set; }
        public string Estado { get; set; }
        public string CEP { get; set; }
        public string Telefone { get; set; }
        public string Email { get; set; }
        public string LogoUrl { get; set; }
        public string CorPrimaria { get; set; }
        public string CorSecundaria { get; set; }
        public DateTime DataInicio { get; set; }
        public DateTime DataFim { get; set; }
        public bool Ativo { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// DTO para criação de eventos
    /// </summary>
    public class CriarEventoDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; }

        [StringLength(500, ErrorMessage = "Descrição deve ter no máximo 500 caracteres")]
        public string Descricao { get; set; }

        [Required(ErrorMessage = "Endereço é obrigatório")]
        [StringLength(200, ErrorMessage = "Endereço deve ter no máximo 200 caracteres")]
        public string Endereco { get; set; }

        [Required(ErrorMessage = "Cidade é obrigatória")]
        [StringLength(100, ErrorMessage = "Cidade deve ter no máximo 100 caracteres")]
        public string Cidade { get; set; }

        [Required(ErrorMessage = "Estado é obrigatório")]
        [StringLength(2, ErrorMessage = "Estado deve ter 2 caracteres")]
        public string Estado { get; set; }

        [Required(ErrorMessage = "CEP é obrigatório")]
        [StringLength(9, ErrorMessage = "CEP deve ter no máximo 9 caracteres")]
        public string CEP { get; set; }

        [StringLength(20, ErrorMessage = "Telefone deve ter no máximo 20 caracteres")]
        public string Telefone { get; set; }

        [EmailAddress(ErrorMessage = "Email inválido")]
        [StringLength(100, ErrorMessage = "Email deve ter no máximo 100 caracteres")]
        public string Email { get; set; }

        [StringLength(500, ErrorMessage = "URL do logo deve ter no máximo 500 caracteres")]
        public string LogoUrl { get; set; }

        [StringLength(7, ErrorMessage = "Cor primária deve ter 7 caracteres")]
        public string CorPrimaria { get; set; } = "#007bff";

        [StringLength(7, ErrorMessage = "Cor secundária deve ter 7 caracteres")]
        public string CorSecundaria { get; set; } = "#6c757d";

        [Required(ErrorMessage = "Data de início é obrigatória")]
        public DateTime DataInicio { get; set; }

        [Required(ErrorMessage = "Data de fim é obrigatória")]
        public DateTime DataFim { get; set; }
    }

    /// <summary>
    /// DTO para atualização de eventos
    /// </summary>
    public class AtualizarEventoDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; }

        [StringLength(500, ErrorMessage = "Descrição deve ter no máximo 500 caracteres")]
        public string Descricao { get; set; }

        [Required(ErrorMessage = "Endereço é obrigatório")]
        [StringLength(200, ErrorMessage = "Endereço deve ter no máximo 200 caracteres")]
        public string Endereco { get; set; }

        [Required(ErrorMessage = "Cidade é obrigatória")]
        [StringLength(100, ErrorMessage = "Cidade deve ter no máximo 100 caracteres")]
        public string Cidade { get; set; }

        [Required(ErrorMessage = "Estado é obrigatório")]
        [StringLength(2, ErrorMessage = "Estado deve ter 2 caracteres")]
        public string Estado { get; set; }

        [Required(ErrorMessage = "CEP é obrigatório")]
        [StringLength(9, ErrorMessage = "CEP deve ter no máximo 9 caracteres")]
        public string CEP { get; set; }

        [StringLength(20, ErrorMessage = "Telefone deve ter no máximo 20 caracteres")]
        public string Telefone { get; set; }

        [EmailAddress(ErrorMessage = "Email inválido")]
        [StringLength(100, ErrorMessage = "Email deve ter no máximo 100 caracteres")]
        public string Email { get; set; }

        [StringLength(500, ErrorMessage = "URL do logo deve ter no máximo 500 caracteres")]
        public string LogoUrl { get; set; }

        [StringLength(7, ErrorMessage = "Cor primária deve ter 7 caracteres")]
        public string CorPrimaria { get; set; }

        [StringLength(7, ErrorMessage = "Cor secundária deve ter 7 caracteres")]
        public string CorSecundaria { get; set; }

        [Required(ErrorMessage = "Data de início é obrigatória")]
        public DateTime DataInicio { get; set; }

        [Required(ErrorMessage = "Data de fim é obrigatória")]
        public DateTime DataFim { get; set; }

        public bool Ativo { get; set; }
    }
}