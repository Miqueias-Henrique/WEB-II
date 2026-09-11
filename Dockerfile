# 1. Imagem base com Node.js
FROM node:22-alpine

# 2. Pasta de trabalho dentro do container
WORKDIR /app

# 3. Copia as listas de dependências e instala
COPY package*.json ./
RUN npm install

# 4. Copia o restante do código da sua aplicação
COPY . .

# 5. Porta que sua aplicação escuta (ajuste se seu projeto usar 3000, 5000, etc.)
EXPOSE 3000

# 6. Comando para iniciar o servidor (definido no "scripts" do seu package.json)
CMD ["npm", "start"]