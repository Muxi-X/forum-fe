# 第一阶段：构建前端
FROM node:20 AS builder

WORKDIR /app
COPY package.json pnpm-lock.yaml ./

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate
RUN HUSKY=0 pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# 第二阶段：最终镜像
FROM nginx:1.27.3-alpine

# 使用多行字符串来写入 nginx 配置
RUN printf '\
    server {\n\
    listen 80;\n\
    server_name localhost;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
    try_files $uri $uri/ /index.html;\n\
    }\n\
    }' > /etc/nginx/conf.d/default.conf

# 复制构建完成的静态文件到 Nginx 的公共目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露 Nginx 的默认端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
