# Usar una imagen ligera de Node.js
FROM node:18-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias e instalar
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de la API
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]