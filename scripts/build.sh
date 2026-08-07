#!/usr/bin/env bash
set -euo pipefail

# Build script for CoderX

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[INFO] Starting CoderX build pipeline..."

echo "[STEP 1/3] Running TypeScript type check..."
pnpm run typecheck

echo "[STEP 2/3] Running ESLint..."
pnpm run lint

echo "[STEP 3/3] Compiling Remix Vite production build..."
remix vite:build

echo "[INFO] CoderX build completed successfully."
