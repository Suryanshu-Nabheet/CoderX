#!/usr/bin/env bash
set -euo pipefail

# Setup script for CoderX

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[INFO] Starting CoderX environment setup..."

# Check Node.js version (minimum 18.18.0)
REQUIRED_NODE_MAJOR=18
REQUIRED_NODE_MINOR=18

if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed. Please install Node.js ${REQUIRED_NODE_MAJOR}.${REQUIRED_NODE_MINOR}.0 or higher." >&2
    exit 1
fi

NODE_VERSION=$(node -v | sed 's/^v//')
NODE_MAJOR=$(echo "$NODE_VERSION" | cut -d. -f1)
NODE_MINOR=$(echo "$NODE_VERSION" | cut -d. -f2)

if [ "$NODE_MAJOR" -lt "$REQUIRED_NODE_MAJOR" ] || { [ "$NODE_MAJOR" -eq "$REQUIRED_NODE_MAJOR" ] && [ "$NODE_MINOR" -lt "$REQUIRED_NODE_MINOR" ]; }; then
    echo "[ERROR] Node.js version must be >= ${REQUIRED_NODE_MAJOR}.${REQUIRED_NODE_MINOR}.0. Found v${NODE_VERSION}." >&2
    exit 1
fi

echo "[INFO] Node.js version v${NODE_VERSION} verified."

# Check pnpm installation
if ! command -v pnpm &> /dev/null; then
    echo "[ERROR] pnpm package manager is not installed. Please install pnpm 9.x." >&2
    exit 1
fi

PNPM_VERSION=$(pnpm -v)
echo "[INFO] pnpm version v${PNPM_VERSION} verified."

# Copy .env.example to .env.local if missing
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "[INFO] Created .env.local from .env.example template."
    else
        echo "[WARN] .env.example template not found. Skipping .env.local creation."
    fi
else
    echo "[INFO] .env.local file already exists."
fi

# Install dependencies
echo "[INFO] Installing project dependencies..."
pnpm install

# Run TypeScript type check
echo "[INFO] Verifying TypeScript type compilation..."
pnpm run typecheck

echo "[INFO] CoderX setup completed successfully."
echo "[INFO] Run 'pnpm run dev' to start the development server."
