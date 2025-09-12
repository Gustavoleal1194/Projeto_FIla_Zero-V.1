-- Script funcional para popular eventos demo usando NEWID()

-- 1. Inserir Categorias Rock
INSERT INTO Categorias (Id, Nome, Descricao, Cor, Ativo, EventoId, CreatedAt, UpdatedAt, IsActive)
VALUES 
(NEWID(), '🍔 Lanches', 'Hambúrgueres e lanches', '#FF6B35', 1, '11111111-1111-1111-1111-111111111111', GETDATE(), GETDATE(), 1),
(NEWID(), '🍟 Acompanhamentos', 'Batatas e petiscos', '#E55A2B', 1, '11111111-1111-1111-1111-111111111111', GETDATE(), GETDATE(), 1),
(NEWID(), '🍺 Bebidas', 'Cervejas e refrigerantes', '#D44A1F', 1, '11111111-1111-1111-1111-111111111111', GETDATE(), GETDATE(), 1);

-- 2. Inserir Produtos Rock
INSERT INTO Produtos (Id, Nome, Descricao, Preco, ImagemUrl, Disponivel, CategoriaId, EventoId, TempoPreparoMinutos, CreatedAt, UpdatedAt, IsActive)
SELECT 
    NEWID(),
    'Hambúrguer Rock',
    'Hambúrguer com carne grelhada, queijo, alface, tomate e molho especial',
    25.90,
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    1,
    (SELECT TOP 1 Id FROM Categorias WHERE Nome = '🍔 Lanches' AND EventoId = '11111111-1111-1111-1111-111111111111'),
    '11111111-1111-1111-1111-111111111111',
    15,
    GETDATE(),
    GETDATE(),
    1;

INSERT INTO Produtos (Id, Nome, Descricao, Preco, ImagemUrl, Disponivel, CategoriaId, EventoId, TempoPreparoMinutos, CreatedAt, UpdatedAt, IsActive)
SELECT 
    NEWID(),
    'X-Bacon Explosivo',
    'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue',
    32.90,
    'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    1,
    (SELECT TOP 1 Id FROM Categorias WHERE Nome = '🍔 Lanches' AND EventoId = '11111111-1111-1111-1111-111111111111'),
    '11111111-1111-1111-1111-111111111111',
    18,
    GETDATE(),
    GETDATE(),
    1;

INSERT INTO Produtos (Id, Nome, Descricao, Preco, ImagemUrl, Disponivel, CategoriaId, EventoId, TempoPreparoMinutos, CreatedAt, UpdatedAt, IsActive)
SELECT 
    NEWID(),
    'Chicken Rock',
    'Sanduíche de frango grelhado com molho picante',
    22.90,
    'https://images.unsplash.com/photo-1606755962773-d324e9f8b257?w=400&h=300&fit=crop',
    1,
    (SELECT TOP 1 Id FROM Categorias WHERE Nome = '🍔 Lanches' AND EventoId = '11111111-1111-1111-1111-111111111111'),
    '11111111-1111-1111-1111-111111111111',
    12,
    GETDATE(),
    GETDATE(),
    1;

INSERT INTO Produtos (Id, Nome, Descricao, Preco, ImagemUrl, Disponivel, CategoriaId, EventoId, TempoPreparoMinutos, CreatedAt, UpdatedAt, IsActive)
SELECT 
    NEWID(),
    'Batata Frita Crocante',
    'Batata frita temperada com sal e pimenta',
    12.90,
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop',
    1,
    (SELECT TOP 1 Id FROM Categorias WHERE Nome = '🍟 Acompanhamentos' AND EventoId = '11111111-1111-1111-1111-111111111111'),
    '11111111-1111-1111-1111-111111111111',
    8,
    GETDATE(),
    GETDATE(),
    1;

INSERT INTO Produtos (Id, Nome, Descricao, Preco, ImagemUrl, Disponivel, CategoriaId, EventoId, TempoPreparoMinutos, CreatedAt, UpdatedAt, IsActive)
SELECT 
    NEWID(),
    'Cerveja Artesanal',
    'Cerveja gelada 350ml',
    8.90,
    'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop',
    1,
    (SELECT TOP 1 Id FROM Categorias WHERE Nome = '🍺 Bebidas' AND EventoId = '11111111-1111-1111-1111-111111111111'),
    '11111111-1111-1111-1111-111111111111',
    2,
    GETDATE(),
    GETDATE(),
    1;

INSERT INTO Produtos (Id, Nome, Descricao, Preco, ImagemUrl, Disponivel, CategoriaId, EventoId, TempoPreparoMinutos, CreatedAt, UpdatedAt, IsActive)
SELECT 
    NEWID(),
    'Refrigerante',
    'Coca-Cola, Pepsi ou Guaraná 350ml',
    6.90,
    'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop',
    1,
    (SELECT TOP 1 Id FROM Categorias WHERE Nome = '🍺 Bebidas' AND EventoId = '11111111-1111-1111-1111-111111111111'),
    '11111111-1111-1111-1111-111111111111',
    1,
    GETDATE(),
    GETDATE(),
    1;

PRINT 'Produtos Rock inseridos com sucesso!';
