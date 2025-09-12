-- Script final para popular categorias e produtos dos eventos demo

-- 1. Inserir Categorias para os eventos demo
INSERT INTO Categorias (Id, Nome, Descricao, Cor, Ativo, EventoId, CreatedAt, UpdatedAt, IsActive)
VALUES 
-- Categorias Rock
('cat-rock-1', '🍔 Lanches', 'Hambúrgueres e lanches', '#FF6B35', 1, '11111111-1111-1111-1111-111111111111', GETDATE(), GETDATE(), 1),
('cat-rock-2', '🍟 Acompanhamentos', 'Batatas e petiscos', '#E55A2B', 1, '11111111-1111-1111-1111-111111111111', GETDATE(), GETDATE(), 1),
('cat-rock-3', '🍺 Bebidas', 'Cervejas e refrigerantes', '#D44A1F', 1, '11111111-1111-1111-1111-111111111111', GETDATE(), GETDATE(), 1),

-- Categorias Gourmet
('cat-gourmet-1', '🍽️ Pratos Principais', 'Especialidades gourmet', '#8B4513', 1, '22222222-2222-2222-2222-222222222222', GETDATE(), GETDATE(), 1),
('cat-gourmet-2', '🥗 Entradas', 'Saladas e aperitivos', '#6B3410', 1, '22222222-2222-2222-2222-222222222222', GETDATE(), GETDATE(), 1),
('cat-gourmet-3', '🍷 Bebidas', 'Vinhos e bebidas especiais', '#5A2D0D', 1, '22222222-2222-2222-2222-222222222222', GETDATE(), GETDATE(), 1),
('cat-gourmet-4', '🍰 Sobremesas', 'Doces e sobremesas', '#4A250A', 1, '22222222-2222-2222-2222-222222222222', GETDATE(), GETDATE(), 1),

-- Categorias Junina
('cat-junina-1', '🌽 Comidas Típicas', 'Pé de moleque, pamonha e mais', '#FFD700', 1, '33333333-3333-3333-3333-333333333333', GETDATE(), GETDATE(), 1),
('cat-junina-2', '🍿 Petiscos', 'Pipoca e guloseimas', '#FFA500', 1, '33333333-3333-3333-3333-333333333333', GETDATE(), GETDATE(), 1),
('cat-junina-3', '🍹 Bebidas', 'Quentão e bebidas quentes', '#FF8C00', 1, '33333333-3333-3333-3333-333333333333', GETDATE(), GETDATE(), 1),

-- Categorias Arte
('cat-arte-1', '🎨 Tapas Artísticos', 'Petiscos criativos', '#9B59B6', 1, '44444444-4444-4444-4444-444444444444', GETDATE(), GETDATE(), 1),
('cat-arte-2', '🥤 Bebidas Coloridas', 'Smoothies e chás', '#8E44AD', 1, '44444444-4444-4444-4444-444444444444', GETDATE(), GETDATE(), 1),
('cat-arte-3', '🍪 Doces Decorados', 'Biscoitos e doces especiais', '#7D3C98', 1, '44444444-4444-4444-4444-444444444444', GETDATE(), GETDATE(), 1);

-- 2. Inserir Produtos Rock
INSERT INTO Produtos (Id, Nome, Descricao, Preco, ImagemUrl, Disponivel, CategoriaId, EventoId, TempoPreparoMinutos, CreatedAt, UpdatedAt, IsActive)
VALUES 
('prod-rock-1', 'Hambúrguer Rock', 'Hambúrguer com carne grelhada, queijo, alface, tomate e molho especial', 25.90, 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop', 1, 'cat-rock-1', '11111111-1111-1111-1111-111111111111', 15, GETDATE(), GETDATE(), 1),
('prod-rock-2', 'X-Bacon Explosivo', 'Hambúrguer com bacon crocante, queijo cheddar e molho barbecue', 32.90, 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop', 1, 'cat-rock-1', '11111111-1111-1111-1111-111111111111', 18, GETDATE(), GETDATE(), 1),
('prod-rock-3', 'Chicken Rock', 'Sanduíche de frango grelhado com molho picante', 22.90, 'https://images.unsplash.com/photo-1606755962773-d324e9f8b257?w=400&h=300&fit=crop', 1, 'cat-rock-1', '11111111-1111-1111-1111-111111111111', 12, GETDATE(), GETDATE(), 1),
('prod-rock-4', 'Batata Frita Crocante', 'Batata frita temperada com sal e pimenta', 12.90, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop', 1, 'cat-rock-2', '11111111-1111-1111-1111-111111111111', 8, GETDATE(), GETDATE(), 1),
('prod-rock-5', 'Onion Rings', 'Anéis de cebola empanados e fritos', 15.90, 'https://images.unsplash.com/photo-1571091655789-405eb7a3a3a8?w=400&h=300&fit=crop', 1, 'cat-rock-2', '11111111-1111-1111-1111-111111111111', 10, GETDATE(), GETDATE(), 1),
('prod-rock-6', 'Cerveja Artesanal', 'Cerveja gelada 350ml', 8.90, 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop', 1, 'cat-rock-3', '11111111-1111-1111-1111-111111111111', 2, GETDATE(), GETDATE(), 1),
('prod-rock-7', 'Refrigerante', 'Coca-Cola, Pepsi ou Guaraná 350ml', 6.90, 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=400&h=300&fit=crop', 1, 'cat-rock-3', '11111111-1111-1111-1111-111111111111', 1, GETDATE(), GETDATE(), 1),
('prod-rock-8', 'Água', 'Água mineral 500ml', 3.90, 'https://images.unsplash.com/photo-1548839140-5b7c4b0b0b0b?w=400&h=300&fit=crop', 1, 'cat-rock-3', '11111111-1111-1111-1111-111111111111', 1, GETDATE(), GETDATE(), 1);

-- 3. Inserir Produtos Gourmet
INSERT INTO Produtos (Id, Nome, Descricao, Preco, ImagemUrl, Disponivel, CategoriaId, EventoId, TempoPreparoMinutos, CreatedAt, UpdatedAt, IsActive)
VALUES 
('prod-gourmet-1', 'Risotto de Trufas', 'Risotto cremoso com trufas negras e parmesão', 89.90, 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop', 1, 'cat-gourmet-1', '22222222-2222-2222-2222-222222222222', 25, GETDATE(), GETDATE(), 1),
('prod-gourmet-2', 'Salmão Grelhado', 'Salmão grelhado com legumes e molho de ervas', 95.90, 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop', 1, 'cat-gourmet-1', '22222222-2222-2222-2222-222222222222', 20, GETDATE(), GETDATE(), 1),
('prod-gourmet-3', 'Salada Caesar Premium', 'Salada Caesar com alface romana, croutons e molho especial', 35.90, 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop', 1, 'cat-gourmet-2', '22222222-2222-2222-2222-222222222222', 10, GETDATE(), GETDATE(), 1),
('prod-gourmet-4', 'Carpaccio de Salmão', 'Carpaccio de salmão com rúcula e parmesão', 42.90, 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop', 1, 'cat-gourmet-2', '22222222-2222-2222-2222-222222222222', 8, GETDATE(), GETDATE(), 1),
('prod-gourmet-5', 'Vinho Tinto Reserva', 'Copa de vinho tinto reserva 150ml', 28.90, 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop', 1, 'cat-gourmet-3', '22222222-2222-2222-2222-222222222222', 2, GETDATE(), GETDATE(), 1),
('prod-gourmet-6', 'Café Especial', 'Café especial da casa', 12.90, 'https://images.unsplash.com/photo-1495474472287-4d71bcdc2085?w=400&h=300&fit=crop', 1, 'cat-gourmet-3', '22222222-2222-2222-2222-222222222222', 5, GETDATE(), GETDATE(), 1),
('prod-gourmet-7', 'Sobremesa de Chocolate', 'Mousse de chocolate com frutas vermelhas', 24.90, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop', 1, 'cat-gourmet-4', '22222222-2222-2222-2222-222222222222', 8, GETDATE(), GETDATE(), 1);

-- 4. Inserir Produtos Junina
INSERT INTO Produtos (Id, Nome, Descricao, Preco, ImagemUrl, Disponivel, CategoriaId, EventoId, TempoPreparoMinutos, CreatedAt, UpdatedAt, IsActive)
VALUES 
('prod-junina-1', 'Pé de Moleque', 'Pé de moleque tradicional', 8.90, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 1, 'cat-junina-1', '33333333-3333-3333-3333-333333333333', 5, GETDATE(), GETDATE(), 1),
('prod-junina-2', 'Pamonha', 'Pamonha doce com milho verde', 12.90, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 1, 'cat-junina-1', '33333333-3333-3333-3333-333333333333', 10, GETDATE(), GETDATE(), 1),
('prod-junina-3', 'Cocada', 'Cocada branca tradicional', 6.90, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 1, 'cat-junina-1', '33333333-3333-3333-3333-333333333333', 3, GETDATE(), GETDATE(), 1),
('prod-junina-4', 'Pipoca Doce', 'Pipoca doce caramelizada', 5.90, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 1, 'cat-junina-2', '33333333-3333-3333-3333-333333333333', 3, GETDATE(), GETDATE(), 1),
('prod-junina-5', 'Pipoca Salgada', 'Pipoca salgada tradicional', 4.90, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 1, 'cat-junina-2', '33333333-3333-3333-3333-333333333333', 3, GETDATE(), GETDATE(), 1),
('prod-junina-6', 'Quentão', 'Quentão tradicional com canela e cravo', 8.90, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 1, 'cat-junina-3', '33333333-3333-3333-3333-333333333333', 5, GETDATE(), GETDATE(), 1),
('prod-junina-7', 'Chá de Ervas', 'Chá de ervas aromáticas', 6.90, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', 1, 'cat-junina-3', '33333333-3333-3333-3333-333333333333', 3, GETDATE(), GETDATE(), 1);

-- 5. Inserir Produtos Arte
INSERT INTO Produtos (Id, Nome, Descricao, Preco, ImagemUrl, Disponivel, CategoriaId, EventoId, TempoPreparoMinutos, CreatedAt, UpdatedAt, IsActive)
VALUES 
('prod-arte-1', 'Tapas Artesanais', 'Seleção de tapas coloridos e criativos', 28.90, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop', 1, 'cat-arte-1', '44444444-4444-4444-4444-444444444444', 12, GETDATE(), GETDATE(), 1),
('prod-arte-2', 'Bruschetta Colorida', 'Bruschetta com ingredientes coloridos', 22.90, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop', 1, 'cat-arte-1', '44444444-4444-4444-4444-444444444444', 10, GETDATE(), GETDATE(), 1),
('prod-arte-3', 'Smoothie Colorido', 'Smoothie com frutas coloridas', 18.90, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop', 1, 'cat-arte-2', '44444444-4444-4444-4444-444444444444', 5, GETDATE(), GETDATE(), 1),
('prod-arte-4', 'Chá de Ervas', 'Chá de ervas aromáticas', 12.90, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop', 1, 'cat-arte-2', '44444444-4444-4444-4444-444444444444', 3, GETDATE(), GETDATE(), 1),
('prod-arte-5', 'Água Infusada', 'Água com frutas e ervas', 8.90, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop', 1, 'cat-arte-2', '44444444-4444-4444-4444-444444444444', 2, GETDATE(), GETDATE(), 1),
('prod-arte-6', 'Biscoito Decorado', 'Biscoitos com decoração artística', 15.90, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop', 1, 'cat-arte-3', '44444444-4444-4444-4444-444444444444', 8, GETDATE(), GETDATE(), 1);

PRINT 'Categorias e produtos dos eventos demo inseridos com sucesso!';
