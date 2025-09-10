# 🎯 Fila Zero - Sistema de Gestão de Pedidos para Eventos

Sistema completo de gestão de pedidos para eventos com sistema de whitelabel, permitindo que cada evento tenha sua própria identidade visual e experiência personalizada.

## 🚀 Funcionalidades

### 🎨 Sistema de Whitelabel
- **Temas personalizados** por evento (cores, logos, identidade visual)
- **Páginas personalizadas** para cada evento
- **Experiência única** para cada cliente

### 📱 Interface Moderna
- **PWA (Progressive Web App)** - Funciona offline
- **Design responsivo** - Mobile-first
- **Interface intuitiva** - Fácil de usar

### 🛒 Gestão de Pedidos
- **Cardápio dinâmico** por evento
- **Carrinho de compras** funcional
- **Sistema de categorias** organizadas
- **Tempo de preparo** estimado

### ⚡ Tempo Real
- **SignalR** para notificações em tempo real
- **Atualizações automáticas** de status
- **Notificações push** no navegador

### 🔐 Autenticação
- **Sistema de login** seguro
- **Diferentes tipos de usuário** (Gestor, Cliente)
- **Redirecionamento automático** para evento específico

## 🏗️ Arquitetura

### Backend (.NET Core)
- **FilaZero.Domain** - Entidades e regras de negócio
- **FilaZero.Application** - Casos de uso e DTOs
- **FilaZero.Infrastructure** - Acesso a dados e repositórios
- **FilaZero.Web** - API REST e SignalR

### Frontend (React + TypeScript)
- **React 18** com TypeScript
- **Tailwind CSS** para estilização
- **React Query** para gerenciamento de estado
- **React Router** para navegação
- **Context API** para estado global

## 🚀 Como Executar

### Pré-requisitos
- .NET 8.0 SDK
- Node.js 18+
- SQL Server (ou SQLite para desenvolvimento)

### Backend
```bash
# Navegar para o diretório do backend
cd FilaZero.Web

# Restaurar dependências
dotnet restore

# Executar migrações
dotnet ef database update

# Executar o projeto
dotnet run
```

### Frontend
```bash
# Navegar para o diretório do frontend
cd front-end

# Instalar dependências
npm install

# Executar o projeto
npm start
```

## 🎯 Demonstração

Acesse `http://localhost:3000` e clique em "Testar Sistema" para ver a demonstração com dados fictícios.

### Contas de Teste

| Usuário | Email | Senha | Evento | Tipo |
|---------|-------|-------|--------|------|
| João Silva | joao@festivalrock.com | 123456 | Festival Rock | Gestor |
| Maria Santos | maria@feiragourmet.com | 123456 | Feira Gourmet | Gestora |
| Pedro Costa | pedro@cliente.com | 123456 | Festival Rock | Cliente |
| Ana Oliveira | ana@cliente.com | 123456 | Feira Gourmet | Cliente |

## 📁 Estrutura do Projeto

```
FilaZero/
├── FilaZero.Domain/          # Entidades e regras de negócio
├── FilaZero.Application/     # Casos de uso e DTOs
├── FilaZero.Infrastructure/  # Acesso a dados
├── FilaZero.Web/            # API REST
├── FilaZero.Tests/          # Testes unitários
├── front-end/               # Aplicação React
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── contexts/        # Contextos (Auth, Cart, Event, Theme)
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   └── types/          # Tipos TypeScript
│   └── public/             # Arquivos estáticos
└── README.md
```

## 🎨 Sistema de Whitelabel

Cada evento possui:
- **Cores personalizadas** (primária e secundária)
- **Logo personalizada**
- **Nome e descrição** únicos
- **Cardápio específico** com produtos e categorias
- **Tema visual** aplicado em toda a interface

## 🔧 Tecnologias Utilizadas

### Backend
- .NET 8.0
- Entity Framework Core
- SignalR
- JWT Authentication
- AutoMapper
- FluentValidation

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Query
- React Router
- React Hook Form
- React Hot Toast
- Lucide React

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através dos issues do GitHub.

---

Desenvolvido com ❤️ para revolucionar a experiência de pedidos em eventos!