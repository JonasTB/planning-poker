#!/bin/bash

echo "🚀 Iniciando Planning Poker..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker e tente novamente."
    exit 1
fi

# Verificar se o docker-compose está disponível
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose não está instalado. Por favor, instale o docker-compose e tente novamente."
    exit 1
fi

echo "📦 Iniciando serviços com Docker Compose..."

# Parar serviços existentes
docker-compose down

# Iniciar serviços
docker-compose up -d

echo "⏳ Aguardando serviços iniciarem..."

# Aguardar o banco de dados estar pronto
echo "🗄️  Aguardando PostgreSQL..."
sleep 10

# Aguardar o backend estar pronto
echo "🔧 Aguardando Backend..."
sleep 15

# Aguardar o frontend estar pronto
echo "🎨 Aguardando Frontend..."
sleep 10

echo ""
echo "✅ Planning Poker iniciado com sucesso!"
echo ""
echo "🌐 Acesse as aplicações:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Swagger:  http://localhost:3001/api"
echo "   Banco:    localhost:5432"
echo ""
echo "📋 Comandos úteis:"
echo "   Ver logs:     docker-compose logs -f"
echo "   Parar:        docker-compose down"
echo "   Reiniciar:    docker-compose restart"
echo "   Status:       docker-compose ps"
echo ""
echo "🎯 Para parar todos os serviços, execute: docker-compose down"
