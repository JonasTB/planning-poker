# 🃏 Planning Poker - Sistema de Votação de Tarefas

Um sistema completo de Planning Poker para equipes ágeis, desenvolvido com NestJS (backend) e Next.js (frontend), incluindo comunicação em tempo real via WebSockets.

## ✨ Funcionalidades

- **Criação de Salas**: Crie salas de planejamento com limite de até 10 participantes
- **Votação Secreta**: Sistema de votação anônima até que todos os votos sejam revelados
- **Tempo Real**: Comunicação instantânea via WebSockets
- **Cartas de Votação**: Sistema de pontos Fibonacci (1, 2, 3, 5, 8, 13)
- **Gestão de Perfis**: Cada jogador tem seu perfil com nome e avatar
- **Controle de Acesso**: Apenas o dono da sala pode iniciar/revelar/reiniciar votação
- **Interface Responsiva**: Design moderno e adaptável a diferentes dispositivos

## 🏗️ Arquitetura

### Backend (NestJS)
- **Framework**: NestJS com TypeScript
- **Banco de Dados**: PostgreSQL com TypeORM
- **WebSockets**: Socket.io para comunicação em tempo real
- **Documentação**: Swagger/OpenAPI automática
- **Logging**: Logger integrado do NestJS
- **Validação**: Class-validator para validação de dados

### Frontend (Next.js)
- **Framework**: Next.js 14 com App Router
- **Estilização**: Tailwind CSS
- **Estado**: React Hooks para gerenciamento de estado
- **WebSockets**: Socket.io-client para conexão com backend
- **Responsividade**: Design mobile-first

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+
- Docker e Docker Compose
- PostgreSQL (se não usar Docker)

### Opção 1: Docker (Recomendado)

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd planning-poker
   ```

2. **Execute com Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Acesse as aplicações**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
   - Swagger: http://localhost:3001/api
   - Banco: localhost:5432

### Opção 2: Desenvolvimento Local

1. **Instale as dependências**
   ```bash
   npm run install:all
   ```

2. **Configure o banco de dados**
   - Crie um banco PostgreSQL chamado `planning_poker`
   - Configure as variáveis de ambiente no backend

3. **Execute o backend**
   ```bash
   npm run dev:backend
   ```

4. **Execute o frontend**
   ```bash
   npm run dev:frontend
   ```

## 📚 API Endpoints

### Salas
- `POST /rooms` - Criar nova sala
- `GET /rooms/:roomId` - Obter informações da sala
- `POST /rooms/:roomId/players` - Adicionar jogador à sala

### Votação
- `POST /rooms/:roomId/start` - Iniciar votação
- `POST /rooms/:roomId/vote` - Registrar voto
- `POST /rooms/:roomId/reveal` - Revelar votos
- `POST /rooms/:roomId/reset` - Reiniciar votação
- `GET /rooms/:roomId/votes` - Obter votos da sala

## 🔌 Eventos WebSocket

### Cliente → Servidor
- `joinRoom` - Entrar em uma sala
- `startVoting` - Iniciar votação (apenas dono)
- `submitVote` - Enviar voto
- `revealVotes` - Revelar votos (apenas dono)
- `resetVoting` - Reiniciar votação (apenas dono)
- `leaveRoom` - Sair da sala

### Servidor → Cliente
- `joinedRoom` - Confirmação de entrada na sala
- `playerJoined` - Novo jogador entrou
- `playerLeft` - Jogador saiu
- `votingStarted` - Votação iniciada
- `votesRevealed` - Votos revelados
- `votingReset` - Votação reiniciada

## 🎯 Fluxo de Uso

1. **Criar Sala**: Um jogador cria uma sala e recebe um ID único
2. **Entrar na Sala**: Outros jogadores entram usando o ID da sala
3. **Iniciar Votação**: O dono da sala inicia o processo de votação
4. **Votar**: Cada jogador escolhe uma carta de forma secreta
5. **Revelar Votos**: O dono revela todos os votos simultaneamente
6. **Discutir**: A equipe analisa os resultados e discute as diferenças
7. **Reiniciar**: O dono pode reiniciar para uma nova votação

## 🎨 Cartas de Votação

| Valor | Descrição |
|-------|-----------|
| 1     | 4 horas   |
| 2     | 1 dia     |
| 3     | 1 dia + 4 horas |
| 5     | 2 dias + 4 horas |
| 8     | 3 dias + 4 horas |
| 13    | 1 semana  |

## 🔧 Configuração

### Variáveis de Ambiente (Backend)

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=planning_poker
NODE_ENV=development
PORT=3001
```

### Variáveis de Ambiente (Frontend)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📱 Interface

- **Página Inicial**: Formulários para criar ou entrar em salas
- **Sala de Votação**: Mesa virtual com jogadores e cartas
- **Responsivo**: Funciona em desktop, tablet e mobile
- **Tema**: Design limpo e moderno com Tailwind CSS

## 🧪 Testes

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

## 📦 Scripts Disponíveis

```bash
# Instalar todas as dependências
npm run install:all

# Desenvolvimento (backend + frontend)
npm run dev

# Apenas backend
npm run dev:backend

# Apenas frontend
npm run dev:frontend

# Build de produção
npm run build

# Iniciar produção
npm run start
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique a documentação da API em `/api`
2. Consulte os logs do backend
3. Abra uma issue no repositório

## 🚀 Roadmap

- [ ] Autenticação JWT
- [ ] Histórico de votações
- [ ] Múltiplas salas simultâneas
- [ ] Exportação de resultados
- [ ] Integração com ferramentas de gestão de projetos
- [ ] Modo offline
- [ ] Notificações push

---

**Desenvolvido com ❤️ para equipes ágeis**
