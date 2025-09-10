using Xunit;
using FluentAssertions;
using FilaZero.Domain.Common;

namespace FilaZero.Tests.Domain.Common
{
    public class ResultTests
    {
        [Fact]
        public void Success_DeveCriarResultadoComSucesso()
        {
            // Act
            var result = Result.Success();

            // Assert
            result.IsSuccess.Should().BeTrue();
            result.IsFailure.Should().BeFalse();
            result.Error.Should().BeNull();
        }

        [Fact]
        public void Failure_DeveCriarResultadoComFalha()
        {
            // Arrange
            var errorMessage = "Erro de validação";

            // Act
            var result = Result.Failure(errorMessage);

            // Assert
            result.IsSuccess.Should().BeFalse();
            result.IsFailure.Should().BeTrue();
            result.Error.Should().Be(errorMessage);
        }

        [Fact]
        public void Success_ComValor_DeveCriarResultadoComSucessoEValor()
        {
            // Arrange
            var valor = "Teste";

            // Act
            var result = Result.Success(valor);

            // Assert
            result.IsSuccess.Should().BeTrue();
            result.Value.Should().Be(valor);
        }

        [Fact]
        public void Failure_ComValor_DeveCriarResultadoComFalha()
        {
            // Arrange
            var errorMessage = "Erro de validação";

            // Act
            var result = Result.Failure<string>(errorMessage);

            // Assert
            result.IsSuccess.Should().BeFalse();
            result.Value.Should().Be(default(string));
            result.Error.Should().Be(errorMessage);
        }
    }
}
