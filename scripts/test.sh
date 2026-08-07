#!/usr/bin/env bash
set -euo pipefail

# Test runner script for CoderX

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[INFO] Running CoderX test and verification suite..."

echo "[STEP 1/2] Checking TypeScript compilation..."
pnpm run typecheck

echo "[STEP 2/2] Running Vitest unit tests..."
pnpm test

echo "[INFO] All tests passed successfully."
