FROM node:18.16.0-alpine as base
# Enable pnpm using corepack
RUN corepack enable
# Set working directory
WORKDIR /app

####################

FROM base as development
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

####################

FROM base as production
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package.json /app/pnpm-lock.yaml ./
RUN pnpm prune --prod

####################

FROM base as build
# Copy all dependencies from development
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package.json /app/pnpm-lock.yaml ./
# Copy source code
COPY . .
# Build the app
RUN pnpm build

####################

FROM base as deploy
# Copy all dependencies from production
COPY --from=production /app/node_modules ./node_modules
COPY --from=production /app/package.json /app/pnpm-lock.yaml ./
# Copy built app
COPY --from=build /app/dist ./dist
# Start the app
ENTRYPOINT ["node", "dist/index.js"]