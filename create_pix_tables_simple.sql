-- Script simplificado para criar as tabelas PIX
USE FilaZeroDb;
GO

-- Criar tabela PixCobrancas
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PixCobrancas' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[PixCobrancas] (
        [Id] uniqueidentifier NOT NULL DEFAULT (newid()),
        [PedidoId] uniqueidentifier NOT NULL,
        [TxId] nvarchar(100) NOT NULL,
        [PspId] nvarchar(100) NULL,
        [Valor] decimal(18,2) NOT NULL,
        [Descricao] nvarchar(500) NOT NULL,
        [ChavePix] nvarchar(100) NOT NULL,
        [QrCode] nvarchar(max) NULL,
        [QrCodeBase64] nvarchar(max) NULL,
        [Status] nvarchar(50) NOT NULL DEFAULT 'ATIVA',
        [DataCriacao] datetime2 NOT NULL DEFAULT (getutcdate()),
        [DataExpiracao] datetime2 NOT NULL,
        [DataPagamento] datetime2 NULL,
        [DataAtualizacao] datetime2 NULL,
        [DadosWebhook] nvarchar(max) NULL,
        [IdPagamento] uniqueidentifier NULL,
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAt] datetime2 NOT NULL DEFAULT (getutcdate()),
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_PixCobrancas] PRIMARY KEY ([Id])
    );
    
    CREATE INDEX [IX_PixCobrancas_PedidoId] ON [PixCobrancas] ([PedidoId]);
    CREATE INDEX [IX_PixCobrancas_TxId] ON [PixCobrancas] ([TxId]);
    CREATE INDEX [IX_PixCobrancas_Status] ON [PixCobrancas] ([Status]);
    
    PRINT 'Tabela PixCobrancas criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela PixCobrancas já existe.';
END
GO

-- Criar tabela PixWebhooks
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='PixWebhooks' AND xtype='U')
BEGIN
    CREATE TABLE [dbo].[PixWebhooks] (
        [Id] uniqueidentifier NOT NULL DEFAULT (newid()),
        [TxId] nvarchar(100) NOT NULL,
        [PspId] nvarchar(100) NULL,
        [Status] nvarchar(50) NOT NULL,
        [DadosWebhook] nvarchar(max) NOT NULL,
        [DataRecebimento] datetime2 NOT NULL DEFAULT (getutcdate()),
        [Processado] bit NOT NULL DEFAULT 0,
        [DataProcessamento] datetime2 NULL,
        [IsActive] bit NOT NULL DEFAULT 1,
        [CreatedAt] datetime2 NOT NULL DEFAULT (getutcdate()),
        [UpdatedAt] datetime2 NULL,
        CONSTRAINT [PK_PixWebhooks] PRIMARY KEY ([Id])
    );
    
    CREATE INDEX [IX_PixWebhooks_TxId] ON [PixWebhooks] ([TxId]);
    CREATE INDEX [IX_PixWebhooks_Status] ON [PixWebhooks] ([Status]);
    CREATE INDEX [IX_PixWebhooks_Processado] ON [PixWebhooks] ([Processado]);
    
    PRINT 'Tabela PixWebhooks criada com sucesso!';
END
ELSE
BEGIN
    PRINT 'Tabela PixWebhooks já existe.';
END
GO

-- Adicionar foreign key para PixCobrancas -> Pedidos (sem cascata)
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_PixCobrancas_Pedidos_PedidoId')
BEGIN
    ALTER TABLE [PixCobrancas] 
    ADD CONSTRAINT [FK_PixCobrancas_Pedidos_PedidoId] 
    FOREIGN KEY ([PedidoId]) REFERENCES [Pedidos] ([Id]);
    PRINT 'Foreign key FK_PixCobrancas_Pedidos_PedidoId criada.';
END
ELSE
BEGIN
    PRINT 'Foreign key FK_PixCobrancas_Pedidos_PedidoId já existe.';
END
GO

-- Adicionar foreign key para PixCobrancas -> Pagamentos (sem cascata)
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_PixCobrancas_Pagamentos_IdPagamento')
BEGIN
    ALTER TABLE [PixCobrancas] 
    ADD CONSTRAINT [FK_PixCobrancas_Pagamentos_IdPagamento] 
    FOREIGN KEY ([IdPagamento]) REFERENCES [Pagamentos] ([Id]);
    PRINT 'Foreign key FK_PixCobrancas_Pagamentos_IdPagamento criada.';
END
ELSE
BEGIN
    PRINT 'Foreign key FK_PixCobrancas_Pagamentos_IdPagamento já existe.';
END
GO

PRINT 'Script executado com sucesso!';
