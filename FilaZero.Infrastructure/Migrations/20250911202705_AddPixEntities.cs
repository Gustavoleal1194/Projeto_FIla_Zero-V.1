using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FilaZero.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPixEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PixCobrancas",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PedidoId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TxId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PspId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Valor = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    Descricao = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ChavePix = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    QrCode = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    QrCodeBase64 = table.Column<string>(type: "nvarchar(max)", maxLength: 5000, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DataExpiracao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DataPagamento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IdPagamento = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DadosWebhook = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    DataCriacao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    DataAtualizacao = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PixCobrancas", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PixCobrancas_Pedidos_PedidoId",
                        column: x => x.PedidoId,
                        principalTable: "Pedidos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PixWebhooks",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TxId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PspId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Evento = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Payload = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DataRecebimento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Processado = table.Column<bool>(type: "bit", nullable: false),
                    DataProcessamento = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ErroProcessamento = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PixWebhooks", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PixCobrancas_PedidoId",
                table: "PixCobrancas",
                column: "PedidoId");

            migrationBuilder.CreateIndex(
                name: "IX_PixCobrancas_TxId",
                table: "PixCobrancas",
                column: "TxId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PixWebhooks_Processado",
                table: "PixWebhooks",
                column: "Processado");

            migrationBuilder.CreateIndex(
                name: "IX_PixWebhooks_TxId",
                table: "PixWebhooks",
                column: "TxId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PixCobrancas");

            migrationBuilder.DropTable(
                name: "PixWebhooks");
        }
    }
}
