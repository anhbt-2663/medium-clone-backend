# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./
COPY prisma ./prisma/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma Client và Build dự án
RUN yarn prisma generate
RUN yarn build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Chỉ copy những file cần thiết từ stage builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src/i18n ./dist/i18n

# Thiết lập giá trị mặc định cho PORT nếu không được truyền từ ngoài vào
ENV PORT=3003

# Thông báo port sẽ sử dụng
EXPOSE ${PORT}

# Lệnh chạy ứng dụng
CMD ["node", "dist/main"]