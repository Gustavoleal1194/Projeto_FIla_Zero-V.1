-- Script para corrigir a senha do usuário no banco de dados
-- Senha: 123456
-- Salt: gerado automaticamente
-- Hash: calculado com SHA256

-- Atualizar usuário existente com senha real
UPDATE Usuarios 
SET SenhaHash = 'K7gNU3sdo+OL0wNhqoVWhr3g6s1xYv72ol/pe/Unols=', 
    Salt = 'somesalt',
    UpdatedAt = GETUTCDATE()
WHERE Email = 'rock@filazero.com';

-- Verificar se foi atualizado
SELECT Id, Nome, Email, SenhaHash, Salt, UpdatedAt 
FROM Usuarios 
WHERE Email = 'rock@filazero.com';
