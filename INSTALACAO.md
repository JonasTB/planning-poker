# 📋 Guia de Instalação - Planning Poker

## 🚀 Início Rápido (Recomendado)

### 1. Pré-requisitos
- Docker Desktop instalado e rodando
- Git instalado

### 2. Clone e Execute
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd planning-poker

# Execute o script de inicialização
./start.sh
```

### 3. Acesse a Aplicação
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Swagger**: http://localhost:3001/api

---

## 🔧 Instalação Manual

### Opção 1: Docker Compose

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd planning-poker
   ```

2. **Inicie os serviços**
   ```bash
   docker-compose up -d
   ```

3. **Verifique o status**
   ```bash
   docker-compose ps
   ```

### Opção 2: Desenvolvimento Local

#### Backend (NestJS)

1. **Navegue para o diretório do backend**
   ```bash
   cd backend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o banco de dados**
   - Instale PostgreSQL
   - Crie um banco chamado `planning_poker`
   - Copie `env.example` para `.env` e configure

4. **Execute o backend**
   ```bash
   npm run start:dev
   ```

#### Frontend (Next.js)

1. **Navegue para o diretório do frontend**
   ```bash
   cd frontend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o frontend**
   ```bash
   npm run dev
   ```

---

## 🗄️ Configuração do Banco de Dados

### PostgreSQL Local

1. **Instale o PostgreSQL**
   ```bash
   # macOS (Homebrew)
   brew install postgresql
   brew services start postgresql

   # Ubuntu/Debian
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   sudo systemctl start postgresql
   sudo systemctl enable postgresql
   ```

2. **Crie o banco de dados**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE planning_poker;
   CREATE USER planning_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE planning_poker TO planning_user;
   \q
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cd backend
   cp env.example .env
   # Edite o arquivo .env com suas configurações
   ```

---

## 🔍 Verificação da Instalação

### 1. Verificar Backend
```bash
curl http://localhost:3001/api
# Deve retornar informações da API
```

### 2. Verificar Frontend
- Acesse http://localhost:3000
- Deve mostrar a página inicial do Planning Poker

### 3. Verificar Banco de Dados
```bash
# Se usando Docker
docker exec -it planning-poker-db psql -U postgres -d planning_poker

# Se usando PostgreSQL local
psql -h localhost -U planning_user -d planning_poker
```

---

## 🐛 Solução de Problemas

### Erro: "Port already in use"
```bash
# Encontre o processo usando a porta
lsof -i :3000
lsof -i :3001

# Mate o processo
kill -9 <PID>
```

### Erro: "Database connection failed"
1. Verifique se o PostgreSQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Teste a conexão manualmente

### Erro: "Docker daemon not running"
1. Inicie o Docker Desktop
2. Aguarde o Docker estar completamente iniciado
3. Execute novamente o comando

### Erro: "Permission denied" no script start.sh
```bash
chmod +x start.sh
```

---

## 📱 Primeiro Uso

1. **Acesse** http://localhost:3000
2. **Crie uma sala** com seu nome
3. **Copie o ID da sala** gerado
4. **Compartilhe o ID** com sua equipe
5. **Entre na sala** usando o ID compartilhado
6. **Inicie a votação** (apenas o dono da sala)
7. **Vote** escolhendo uma carta
8. **Revele os votos** quando todos votarem
9. **Discuta** os resultados com a equipe

---

## 🔄 Comandos Úteis

### Docker Compose
```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs em tempo real
docker-compose logs -f

# Parar todos os serviços
docker-compose down

# Reiniciar um serviço específico
docker-compose restart backend

# Ver status dos serviços
docker-compose ps

# Reconstruir e iniciar
docker-compose up -d --build
```

### Desenvolvimento
```bash
# Instalar todas as dependências
npm run install:all

# Executar backend e frontend simultaneamente
npm run dev

# Apenas backend
npm run dev:backend

# Apenas frontend
npm run dev:frontend

# Build de produção
npm run build
```

---

## 📚 Próximos Passos

Após a instalação bem-sucedida:

1. **Leia o README.md** para entender melhor o projeto
2. **Explore a API** em http://localhost:3001/api
3. **Teste as funcionalidades** criando uma sala e convidando colegas
4. **Personalize** o sistema conforme suas necessidades
5. **Contribua** com melhorias e correções

---

## 🆘 Suporte

Se você encontrar problemas:

1. **Verifique os logs** do Docker
2. **Consulte a documentação** da API
3. **Abra uma issue** no repositório
4. **Verifique** se todos os pré-requisitos estão atendidos

**Boa sorte com sua instalação! 🎉**
