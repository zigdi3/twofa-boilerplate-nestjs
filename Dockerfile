# Set base image to alpine
FROM node:20.12-alpine AS builder
RUN apk add --update nodejs npm

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY yarn.lock ./ ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install yarn
RUN yarn install
# Copy source code
COPY . .

RUN yarn run build

# Build Arguments
ARG DB_CONNECTION
ARG DB_HOST
ARG DB_PORT
ARG DB_USERNAME
ARG DB_PASSWORD
ARG DB_DATABASE
ARG DB_SYNCHRONIZE
ARG DB_LOGGING
ARG DB_ENTITIES
ARG DB_DRIVER_EXTRA
ARG APIKey
ARG PORT

# Set environment variables
ENV DATA_URI=${DATA_URI}
ENV DB_CONNECTION=${DB_CONNECTION}
ENV DB_HOST=${DB_HOST}
ENV DB_PORT=${DB_PORT}
ENV DB_USERNAME=${DB_USERNAME}
ENV DB_PASSWORD=${DB_PASSWORD}
ENV DB_DATABASE=${DB_DATABASE}
ENV DB_SYNCHRONIZE=${DB_SYNCHRONIZE}
ENV DB_LOGGING=${DB_LOGGING}
ENV DB_ENTITIES=${DB_ENTITIES}
ENV DB_DRIVER_EXTRA=${DB_DRIVER_EXTRA}
ENV APIKey=${APIKey}
ENV PORT=${PORT}

ENV PORT=3001

#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/package*.json ./
#COPY --from=builder /app/dist ./dist

# Install Prisma CLI
#RUN npm install -g prisma

# Generate Prisma client
RUN npx prisma generate

# Run Prisma migrations
#RUN npx prisma migrate deploy

EXPOSE 3001

HEALTHCHECK CMD curl --fail http://localhost:${PORT} || exit 1 
CMD ["yarn", "run", "prod"]

