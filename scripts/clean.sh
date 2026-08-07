#!/usr/bin/env bash
set -euo pipefail

# Clean script for CoderX

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "[INFO] Cleaning CoderX workspace..."

DIRS_TO_REMOVE=(
    "node_modules/.vite"
    "node_modules/.cache"
    ".cache"
    "dist"
    "build"
)

for DIR in "${DIRS_TO_REMOVE[@]}"; do
    if [ -d "$DIR" ]; then
        echo "[INFO] Removing $DIR..."
        rm -rf "$DIR"
    fi
done

echo "[INFO] Re-installing dependencies..."
pnpm install

echo "[INFO] Workspace cleanup completed."
