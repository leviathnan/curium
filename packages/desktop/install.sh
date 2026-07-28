#!/bin/sh
# Curium Linux installer
# Usage: curl -fsSL https://raw.githubusercontent.com/nylxar/curium/main/packages/desktop/install.sh | sh
#
# Environment variables:
#   CIUM_VERSION  - Install a specific version (e.g., "0.6.4")
#   CIUM_BIN_DIR  - Custom binary directory (default: ~/.local/bin)
#   CIUM_APP_DIR  - Custom app directory (default: ~/.local/share/curium)

set -eu

REPO="nylxar/curium"
GITHUB="https://github.com"

info() { printf '  \033[1;34m>\033[0m %s\n' "$@"; }
success() { printf '  \033[1;32m>\033[0m %s\n' "$@"; }
error() { printf '  \033[1;31merror:\033[0m %s\n' "$@" >&2; exit 1; }
warn() { printf '  \033[1;33mwarn:\033[0m %s\n' "$@" >&2; }

cleanup() {
  [ -n "${TMPDIR_INSTALL:-}" ] && [ -d "$TMPDIR_INSTALL" ] && rm -rf "$TMPDIR_INSTALL"
}
trap cleanup EXIT INT TERM

download() {
  url="$1"; output="$2"
  if command -v curl > /dev/null 2>&1; then
    curl -fL --retry 3 -o "$output" "$url"
  elif command -v wget > /dev/null 2>&1; then
    wget -qO "$output" "$url"
  else
    error "need 'curl' or 'wget'"
  fi
}

detect_platform() {
  OS="$(uname -s)"
  ARCH="$(uname -m)"
  [ "$OS" = "Linux" ] || error "unsupported OS: $OS (this script is for Linux only)"
  case "$ARCH" in
    x86_64|amd64) ARCH="x86_64" ;;
    aarch64|arm64) ARCH="aarch64" ;;
    *) error "unsupported architecture: $ARCH" ;;
  esac
}

get_version() {
  VERSION="${CIUM_VERSION:-}"
  if [ -n "$VERSION" ]; then
    VERSION="$(printf '%s' "$VERSION" | sed 's/^v//')"
    info "Using specified version: $VERSION"
  else
    info "Fetching latest version..."
    redirect_url=$(curl -Ls -o /dev/null -w '%{url_effective}' "$GITHUB/$REPO/releases/latest" 2>/dev/null) || true
    [ -n "$redirect_url" ] || error "failed to determine latest version"
    VERSION="$(printf '%s' "$redirect_url" | sed 's|.*/v||')"
    [ -n "$VERSION" ] || error "failed to parse version"
    info "Latest version: $VERSION"
  fi
}

verify_checksum() {
  file="$1"; checksums_file="$2"
  [ -f "$checksums_file" ] || { warn "checksums file not available, skipping verification"; return 0; }
  expected=$(grep "$(basename "$file")" "$checksums_file" | awk '{print $1}')
  [ -n "$expected" ] || { warn "no checksum found for $(basename "$file"), skipping"; return 0; }
  if command -v sha256sum > /dev/null 2>&1; then
    actual=$(sha256sum "$file" | awk '{print $1}')
  elif command -v shasum > /dev/null 2>&1; then
    actual=$(shasum -a 256 "$file" | awk '{print $1}')
  else
    warn "no sha256 tool found, skipping verification"; return 0
  fi
  [ "$expected" = "$actual" ] || error "checksum mismatch\n  Expected: $expected\n  Actual:   $actual"
  success "Checksum verified"
}

install_linux() {
  bin_dir="${CIUM_BIN_DIR:-$HOME/.local/bin}"
  app_dir="${CIUM_APP_DIR:-$HOME/.local/share/curium}"

  detect_platform
  get_version

  TARBALL="curium_${VERSION}_linux-${ARCH}.tar.gz"
  CHECKSUMS="SHA256SUMS-linux-${ARCH}.txt"
  BASE_URL="$GITHUB/$REPO/releases/download/v${VERSION}"

  TMPDIR_INSTALL=$(mktemp -d)

  info "Downloading ${TARBALL}..."
  download "${BASE_URL}/${TARBALL}" "$TMPDIR_INSTALL/$TARBALL"

  download "${BASE_URL}/${CHECKSUMS}" "$TMPDIR_INSTALL/${CHECKSUMS}" 2>/dev/null || true
  verify_checksum "$TMPDIR_INSTALL/$TARBALL" "$TMPDIR_INSTALL/${CHECKSUMS}"

  info "Installing to ${app_dir}..."
  mkdir -p "$bin_dir" "$app_dir"

  tar -xzf "$TMPDIR_INSTALL/$TARBALL" -C "$TMPDIR_INSTALL"
  EXTRACTED=$(find "$TMPDIR_INSTALL" -maxdepth 2 -type d -name 'curium-*' | head -n 1)
  [ -n "$EXTRACTED" ] || error "tarball does not contain expected directory"

  rm -rf "$app_dir"
  mv "$EXTRACTED" "$app_dir"
  chmod +x "$app_dir/bin/curium"
  ln -sf "$app_dir/bin/curium" "$bin_dir/curium"

  if [ -d "$app_dir/share/icons" ]; then
    mkdir -p "$HOME/.local/share/icons"
    cp -R "$app_dir/share/icons/." "$HOME/.local/share/icons/" 2>/dev/null || true
  fi

  if [ -f "$app_dir/share/applications/curium.desktop" ]; then
    mkdir -p "$HOME/.local/share/applications"
    sed "s|^Exec=.*|Exec=$bin_dir/curium %U|" \
      "$app_dir/share/applications/curium.desktop" \
      > "$HOME/.local/share/applications/curium.desktop"
  fi

  success "Installed Curium $VERSION to $app_dir"

  case ":$PATH:" in
    *":$bin_dir:"*) ;;
    *) warn "$bin_dir is not in your PATH"; info "Add: export PATH=\"$bin_dir:\$PATH\"" ;;
  esac

  info "Launch with: curium"
}

main() {
  printf '\n  \033[1mCurium Installer\033[0m\n\n'
  install_linux
  printf '\n'
}

main "$@"
