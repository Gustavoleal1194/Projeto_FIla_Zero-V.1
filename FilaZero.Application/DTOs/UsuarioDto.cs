using System;
using System.ComponentModel.DataAnnotations;
using FilaZero.Domain.Entities;

namespace FilaZero.Application.DTOs
{
    /// <summary>
    /// DTO para operações com usuários
    /// </summary>
    public class UsuarioDto
    {
        public Guid Id { get; set; }
        public string Nome { get; set; }
        public string Email { get; set; }
        public string Telefone { get; set; }
        public TipoUsuario Tipo { get; set; }
        public bool EmailConfirmado { get; set; }
        public DateTime? UltimoLogin { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    /// <summary>
    /// DTO para criação de usuário
    /// </summary>
    public class CriarUsuarioDto
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        [StringLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres")]
        public string Nome { get; set; }

        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        [StringLength(100, ErrorMessage = "Email deve ter no máximo 100 caracteres")]
        public string Email { get; set; }

        [Phone(ErrorMessage = "Telefone inválido")]
        [StringLength(20, ErrorMessage = "Telefone deve ter no máximo 20 caracteres")]
        public string Telefone { get; set; }

        [Required(ErrorMessage = "Senha é obrigatória")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Senha deve ter entre 6 e 100 caracteres")]
        public string Senha { get; set; }

        [Required(ErrorMessage = "Confirmação de senha é obrigatória")]
        [Compare("Senha", ErrorMessage = "Senhas não coincidem")]
        public string ConfirmarSenha { get; set; }

        public TipoUsuario Tipo { get; set; } = TipoUsuario.Consumidor;
    }

    /// <summary>
    /// DTO para login
    /// </summary>
    public class LoginDto
    {
        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Senha é obrigatória")]
        public string Senha { get; set; }
    }

    /// <summary>
    /// DTO para alteração de senha
    /// </summary>
    public class AlterarSenhaDto
    {
        [Required(ErrorMessage = "Senha atual é obrigatória")]
        public string SenhaAtual { get; set; }

        [Required(ErrorMessage = "Nova senha é obrigatória")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Nova senha deve ter entre 6 e 100 caracteres")]
        public string NovaSenha { get; set; }

        [Required(ErrorMessage = "Confirmação de senha é obrigatória")]
        [Compare("NovaSenha", ErrorMessage = "Senhas não coincidem")]
        public string ConfirmarNovaSenha { get; set; }
    }
}
