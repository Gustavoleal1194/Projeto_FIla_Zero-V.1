using System;
using System.ComponentModel.DataAnnotations;

namespace FilaZero.Application.DTOs
{
    /// <summary>
    /// DTO para exibição de categorias
    /// </summary>
    public class CategoriaDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public string Descricao { get; set; }
        public string Cor { get; set; }
        public int Ordem { get; set; }
        public bool Ativo { get; set; }
        public Guid EventoId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// DTO para criação de categorias
    /// </summary>
    public class CriarCategoriaDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; }

        [StringLength(500, ErrorMessage = "Descrição deve ter no máximo 500 caracteres")]
        public string Descricao { get; set; }

        [StringLength(7, ErrorMessage = "Cor deve ter 7 caracteres")]
        public string Cor { get; set; } = "#007bff";

        [Required(ErrorMessage = "Ordem é obrigatória")]
        public int Ordem { get; set; }

        public bool Ativo { get; set; } = true;

        [Required(ErrorMessage = "Evento é obrigatório")]
        public Guid EventoId { get; set; }
    }

    /// <summary>
    /// DTO para atualização de categorias
    /// </summary>
    public class AtualizarCategoriaDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; }

        [StringLength(500, ErrorMessage = "Descrição deve ter no máximo 500 caracteres")]
        public string Descricao { get; set; }

        [StringLength(7, ErrorMessage = "Cor deve ter 7 caracteres")]
        public string Cor { get; set; }

        [Required(ErrorMessage = "Ordem é obrigatória")]
        public int Ordem { get; set; }

        public bool Ativo { get; set; }
    }
}
