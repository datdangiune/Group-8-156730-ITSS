# Sử dụng Node.js phiên bản 18
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /app

# Copy file package.json và package-lock.json để cài dependencies
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Copy toàn bộ source code vào thư mục làm việc trong container
COPY . .

# Expose cổng 3000 (ExpressJS thường chạy ở cổng này)
EXPOSE 3000

# Lệnh chạy khi container khởi động
CMD ["npm", "start"]
