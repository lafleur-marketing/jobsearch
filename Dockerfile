# ---- Build ----
FROM node:20-bookworm AS build
WORKDIR /app

# Add build args for environment variables needed during build
ARG NEXT_PUBLIC_CLERKER_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_CHATKIT_WORKFLOW_ID

# Set environment variables for build
ENV NEXT_PUBLIC_CLERKER_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERKER_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=$NEXT_PUBLIC_CHATKIT_WORKFLOW_ID

# Install pnpm
RUN npm install -g pnpm

COPY package*.json ./
RUN pnpm install
COPY . .
RUN find . -name "._*" -type f -delete || true
RUN pnpm run build

# ---- Runtime ----
FROM node:20-bookworm
ENV NODE_ENV=production
WORKDIR /app

# Install pnpm in runtime image
RUN npm install -g pnpm

COPY --from=build /app ./
# CapRover routes traffic to the internal container port you configure below.
# Use PORT=3000 convention for Next.js
ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "run", "start"]