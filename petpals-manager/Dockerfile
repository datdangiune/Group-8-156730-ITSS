FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Mở cổng 5173 (mặc định Vite dev server chạy trên cổng này)
EXPOSE 8080

# Chạy Vite dev server
CMD ["npm", "run", "dev"]
