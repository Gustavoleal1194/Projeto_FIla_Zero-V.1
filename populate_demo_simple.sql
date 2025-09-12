-- Script simplificado para popular eventos demo
-- Primeiro, inserir usuários gestores

-- 1. Inserir Usuários Gestores
INSERT INTO Usuarios (Id, Nome, Email, Telefone, Cpf, Tipo, SenhaHash, Salt, EmailConfirmado, UltimoLogin, CreatedAt, UpdatedAt, IsActive)
VALUES 
('11111111-1111-1111-1111-111111111111', 'Gestor Rock', 'rock@filazero.com', '(11) 99999-9999', '11111111111', 1, 'demo_hash', 'demo_salt', 1, GETDATE(), GETDATE(), GETDATE(), 1),
('22222222-2222-2222-2222-222222222222', 'Gestor Gourmet', 'gourmet@filazero.com', '(11) 99999-9999', '22222222222', 1, 'demo_hash', 'demo_salt', 1, GETDATE(), GETDATE(), GETDATE(), 1),
('33333333-3333-3333-3333-333333333333', 'Gestor Junina', 'junina@filazero.com', '(11) 99999-9999', '33333333333', 1, 'demo_hash', 'demo_salt', 1, GETDATE(), GETDATE(), GETDATE(), 1),
('44444444-4444-4444-4444-444444444444', 'Gestor Arte', 'arte@filazero.com', '(11) 99999-9999', '44444444444', 1, 'demo_hash', 'demo_salt', 1, GETDATE(), GETDATE(), GETDATE(), 1);

-- 2. Inserir Eventos Demo
INSERT INTO Eventos (Id, Nome, Descricao, Endereco, Cidade, Estado, CEP, Telefone, Email, LogoUrl, CorPrimaria, CorSecundaria, DataInicio, DataFim, Ativo, GestorId, CreatedAt, UpdatedAt, IsActive)
VALUES 
('11111111-1111-1111-1111-111111111111', '🎸 Festival Rock Underground', 'Demo público - Festival de Rock', 'Arena Rock', 'São Paulo', 'SP', '01234-567', '(11) 99999-9999', 'rock@filazero.com', '', '#FF6B35', '#E55A2B', '2024-12-31', '2025-01-01', 1, '11111111-1111-1111-1111-111111111111', GETDATE(), GETDATE(), 1),
('22222222-2222-2222-2222-222222222222', '🍷 Feira Gourmet Premium', 'Demo público - Feira Gourmet', 'Centro Gourmet', 'São Paulo', 'SP', '01234-567', '(11) 99999-9999', 'gourmet@filazero.com', '', '#8B4513', '#6B3410', '2024-12-31', '2025-01-01', 1, '22222222-2222-2222-2222-222222222222', GETDATE(), GETDATE(), 1),
('33333333-3333-3333-3333-333333333333', '🎪 Festa Junina Tradicional', 'Demo público - Festa Junina', 'Quadra da Escola', 'São Paulo', 'SP', '01234-567', '(11) 99999-9999', 'junina@filazero.com', '', '#FFD700', '#FFA500', '2024-12-31', '2025-01-01', 1, '33333333-3333-3333-3333-333333333333', GETDATE(), GETDATE(), 1),
('44444444-4444-4444-4444-444444444444', '🎨 Festival de Arte & Cultura', 'Demo público - Festival de Arte', 'Centro Cultural', 'São Paulo', 'SP', '01234-567', '(11) 99999-9999', 'arte@filazero.com', '', '#9B59B6', '#8E44AD', '2024-12-31', '2025-01-01', 1, '44444444-4444-4444-4444-444444444444', GETDATE(), GETDATE(), 1);

PRINT 'Eventos demo criados com sucesso!';
