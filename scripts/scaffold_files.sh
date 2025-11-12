#!/usr/bin/env bash
set -euo pipefail

cat <<'MSG'
⚠️  scaffold_files.sh has been retired.

This repository now relies on the handwritten templates that already live under src/.
Please follow the instructions in README.md (Project Structure + Quick Start) when you
need to add new routes/components instead of generating files from this script.

If you need automation again, create a new script that mirrors the current architecture
(Tailwind v4 globals, shared/ui primitives, Vitest setup, etc.) before re-enabling it.
MSG
