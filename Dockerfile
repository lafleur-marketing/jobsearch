# ---- Build ----
FROM node:20-bookworm AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --quiet
COPY . .
# If you need environment at build time, add ARG/ENV carefully
RUN npm run build

# ---- Runtime ----
FROM node:20-bookworm
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app ./
# CapRover routes traffic to the internal container port you configure below.
# Use PORT=3000 convention for Next.js
ENV PORT=3000
EXPOSE 3000
CMD ["npm", "run", "start"]