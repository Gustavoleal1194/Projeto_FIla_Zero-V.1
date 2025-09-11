using System;
using System.ComponentModel.DataAnnotations;

namespace FilaZero.Application.DTOs
{
    /// <summary>
    /// DTO para exibição de produtos
    /// </summary>
    public class ProdutoDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public decimal Preco { get; set; }
        public string ImagemUrl { get; set; } = string.Empty;
        public int TempoPreparoMinutos { get; set; }
        public int Ordem { get; set; }
        public bool Ativo { get; set; }
        public bool Destaque { get; set; }
        public Guid EventoId { get; set; }
        public Guid CategoriaId { get; set; }
        public string CategoriaNome { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// DTO para criação de produtos
    /// </summary>
    public class CriarProdutoDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Descrição deve ter no máximo 500 caracteres")]
        public string Descricao { get; set; } = string.Empty;

        [Required(ErrorMessage = "Preço é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Preço deve ser maior que zero")]
        public decimal Preco { get; set; }

        [StringLength(500, ErrorMessage = "URL da imagem deve ter no máximo 500 caracteres")]
        public string ImagemUrl { get; set; } = string.Empty;

        [Range(1, 300, ErrorMessage = "Tempo de preparo deve ser entre 1 e 300 minutos")]
        public int TempoPreparoMinutos { get; set; } = 15;

        [Required(ErrorMessage = "Ordem é obrigatória")]
        public int Ordem { get; set; }

        public bool Ativo { get; set; } = true;
        public bool Destaque { get; set; } = false;

        [Required(ErrorMessage = "Evento é obrigatório")]
        public Guid EventoId { get; set; }

        [Required(ErrorMessage = "Categoria é obrigatória")]
        public Guid CategoriaId { get; set; }
    }

    /// <summary>
    /// DTO para atualização de produtos
    /// </summary>
    public class AtualizarProdutoDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage = "Descrição deve ter no máximo 500 caracteres")]
        public string Descricao { get; set; } = string.Empty;

        [Required(ErrorMessage = "Preço é obrigatório")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Preço deve ser maior que zero")]
        public decimal Preco { get; set; }

        [StringLength(500, ErrorMessage = "URL da imagem deve ter no máximo 500 caracteres")]
        public string ImagemUrl { get; set; } = string.Empty;

        [Range(1, 300, ErrorMessage = "Tempo de preparo deve ser entre 1 e 300 minutos")]
        public int TempoPreparoMinutos { get; set; }

        [Required(ErrorMessage = "Ordem é obrigatória")]
        public int Ordem { get; set; }

        public bool Ativo { get; set; }
        public bool Destaque { get; set; }

        [Required(ErrorMessage = "Categoria é obrigatória")]
        public Guid CategoriaId { get; set; }
    }
}