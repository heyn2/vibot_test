#!/usr/bin/env bash
set -euo pipefail

# === 디렉토리 ===
mkdir -p "src/app/(public)/login" "src/app/(public)/register" "src/app/(public)/wait-approval"
mkdir -p "src/app/(protected)/dashboard" "src/app/(protected)/admin/docs" "src/app/(protected)/admin/permissions"
mkdir -p src/app/api/auth/{register,verify-email,refresh}
mkdir -p src/shared/{ui,lib,config,styles,types}
mkdir -p src/features/auth/{login-form,register-form}
mkdir -p src/features/docs/filter-bar
mkdir -p src/entities/{user,document}/{api,model}

# 확인 로그
echo "✅ 폴더 생성 완료"
