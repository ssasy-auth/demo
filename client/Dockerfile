FROM node:24.16.0-alpine@sha256:2bdb65ed1dab192432bc31c95f94155ca5ad7fc1392fb7eb7526ab682fa5bf14

WORKDIR /app

COPY package*.json .
RUN npm install

COPY public/ public/
COPY src/ src/
COPY env.d.ts .
COPY index.html .
COPY LICENSE .
COPY README.md .
COPY tsconfig*.json .
COPY vite.config.ts .

RUN npm run build

EXPOSE 3000
