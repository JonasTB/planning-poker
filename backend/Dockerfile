FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Construir a aplicação
RUN npm run build

# Expor porta
EXPOSE 3001

# Comando para executar
CMD ["npm", "run", "start:prod"]
