#!/bin/sh
# Curium Linux installer
# Usage:
#   curl -fsSL https://curium.design/install.sh | sh -s --
#   ./install.sh -s -- --file ./curium_0.6.4_linux-x86_64.tar.gz
#   curl -fsSL …/install.sh | sh -s --
#   ./install.sh --uninstall
#
# Environment variables:
#   CIUM_VERSION  - Install a specific version (e.g., "0.6.4")
#   CIUM_BIN_DIR  - Custom binary directory (default: ~/.local/bin)
#   CIUM_APP_DIR  - Custom app directory (default: ~/.local/share/curium)

set -eu

REPO="nylxar/curium"
GITHUB="https://github.com"

RELEASE_SIGNING_KEY='-----BEGIN PGP PUBLIC KEY BLOCK-----
Comment: C7EB 5A5C 2949 2428 E465  8CD9 8A83 6CEB 0E21 C555
Comment: <nylxar@curium.design>
Comment: Curium Release Signing Key

xjMEampMUxYJKwYBBAHaRw8BAQdAlkdPcO2tj+JinaDGcbYBPTyU88EobwpCQS0q
KxLIT4/CwBEEHxYKAIMFgmpqTFMFiQWkj70DCwkHCRCKg2zrDiHFVUcUAAAAAAAe
ACBzYWx0QG5vdGF0aW9ucy5zZXF1b2lhLXBncC5vcmfBasJRUjImgzPgqOfmU2DP
QchyAiKeBJZISvyLj7DCOAMVCggCmwECHgkWIQTH61pcKUkkKORljNmKg2zrDiHF
VQAAkgEA/3D9oXbSuet/nG68G96WzJXAHBYlVLvyR0YRLnSIpxbtAPwL33ID73hR
N2FkwQwk3qmMUBSBuq276V/t7UQZ1aJqB80WPG55bHhhckBjdXJpdW0uZGVzaWdu
PsLAEQQTFgoAgwWCampMUwWJBaSPvQMLCQcJEIqDbOsOIcVVRxQAAAAAAB4AIHNh
bHRAbm90YXRpb25zLnNlcXVvaWEtcGdwLm9yZ7bgVjYgzNy2WgaNYZFSkb2yz7EV
bUE/GHnIehM13IJaAxUKCAKbAQIeCRYhBMfrWlwpSSQo5GWM2YqDbOsOIcVVAABW
qAEAi/quA3Ld99n11Ca9LPWF5aCnW1bASqhU/JyiDR4FeDoBANkJLYbUo5sGAZsa
gZUuOgWyG87+D9iD/DxOgDCnLf4LzRpDdXJpdW0gUmVsZWFzZSBTaWduaW5nIEtl
ecLAFAQTFgoAhgWCampMUwWJBaSPvQMLCQcJEIqDbOsOIcVVRxQAAAAAAB4AIHNh
bHRAbm90YXRpb25zLnNlcXVvaWEtcGdwLm9yZwJwcKtw/U5FfDR5Vtt+nXNqUbyC
AU5ikufESQuFRkdfAxUKCAKZAQKbAQIeCRYhBMfrWlwpSSQo5GWM2YqDbOsOIcVV
AAAagEAkDbqop9fDrHv2ghDqt/9go5Z8O1J568vxRmd8wER1nYA/RSumBdLpEqU
JUjHeGHeR/voz0MFu3Nb5SFeK1VEAvYNzjMEampMUxYJKwYBBAHaRw8BAQdAHHUI
QneYWsSxUxgdiE8+iiWinbn7BmqdxaFt8kMKkhTCwMUEGBYKATcFgmpqTFMFiQWk
j70JEIqDbOsOIcVVRxQAAAAAAB4AIHNhbHRAbm90YXRpb25zLnNlcXVvaWEtcGdw
Lm9yZ1sELxP6vwyrmQWiqVWRBsdW+vMJYSCdHIzZROZF6dfmApsCvqAEGRYKAG8F
gmpqTFMJENNpiVODerR5RxQAAAAAAB4AIHNhbHRAbm90YXRpb25zLnNlcXVvaWEt
cGdwLm9yZ/zvJukNZ2Tm8ixviecZ2VVvoS45RwEqtm4jMnNQ8yG2FiEE9pTcIzAb
hos7/YbR02mJU4N6tHkAAGl2AQDX9vyb2TlmWe91kWIKdaeKW98hV/43v+edRnCt
JfDJsQD/eX/uvR5UYXn977qH7Aelx5qyidFR/u7ZWaJAFQvetQUWIQTH61pcKUkk
KORljNmKg2zrDiHFVQAAlKkBAP/KDymCJ6sjbnx7CwPzmF/7V0U5Ul7evscjy87v
RFb7AQDko97N94JCLL0gwcN8cHQJFIpxMlwU+JKAKa24xo7yAs4zBGpqTFMWCSsG
AQQB2kcPAQEHQN0uQEYJlYMaxspjRP+BTsry7W/e1vaRwot868jRYddtwsDFBBgW
CgE3BYJqakxTBYkFpI+9CRCKg2zrDiHFVUcUAAAAAAAeACBzYWx0QG5vdGF0aW9u
cy5zZXF1b2lhLXBncC5vcmf+7cVqekiRtmCNu51YQq66k30u1ljRT544OAFOXW2Y
QwKbIL6gBBkWCgBvBYJqakxTCRBrY6K/WFaiwEcUAAAAAAAeACBzYWx0QG5vdGF0
aW9ucy5zZXF1b2lhLXBncC5vcme4gPrPme5tpkX7X4HfMC7qFW/2bXWhinR3IBRA
4rNeGxYhBCIurK+DadcfVSD0Nmtjor9YVqLAAAD39AD+M80HEwaCTlgIjd5RGe0Z
rfA8lYxqRi6kArHJ38uF6YoBAOveDHiHJo9C6Ehq1I5imVvw6Uhzbo2bNMP9VlhZ
Hk8CFiEEx+taXClJJCjkZYzZioNs6w4hxVUAAKmXAP4xkWkSSGYZV3DB6F3Tu+Bm
orlzcZ6fhvRX/GZW2CfUowEA1vb+TAxRQoZnKJkjxAdQFWBMG7SGKK4UX2KHdtQe
DA/OOARqakxTEgorBgEEAZdVAQUBAQdAG7vK6QHmr8R7XFOeACZVLoO1meJu2Lpy
AEjqPTemfVIDAQgHwsAGBBgWCgB4BYJqakxTBYkFpI+9CRCKg2zrDiHFVUcUAAAA
AAAeACBzYWx0QG5vdGF0aW9ucy5zZXF1b2lhLXBncC5vcme0rfc84lsyz4/PeZT0
+a2UKklwUzFDD8XiZ2LpY772RwKbDBYhBMfrWlwpSSQo5GWM2YqDbOsOIcVVAAC5
fwD9EeKQn2jabam70QBTrW9bg4bIfRSVMlsrGqvEyg+H9IIA/jzFZefp5HisX2Bv
IPFZHZorw1FBsgtKf5bktMYh9kYF
=/nRy
-----END PGP PUBLIC KEY BLOCK-----'

info() { printf '  \033[1;34m>\033[0m %s\n' "$@"; }
success() { printf '  \033[1;32m>\033[0m %s\n' "$@"; }
error() { printf '  \033[1;31merror:\033[0m %s\n' "$@" >&2; exit 1; }
warn() { printf '  \033[1;33mwarn:\033[0m %s\n' "$@" >&2; }

cleanup() {
  [ -n "${TMPDIR_INSTALL:-}" ] && [ -d "$TMPDIR_INSTALL" ] && rm -rf "$TMPDIR_INSTALL"
  [ -n "${GPG_HOME_INSTALL:-}" ] && [ -d "$GPG_HOME_INSTALL" ] && rm -rf "$GPG_HOME_INSTALL"
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

detect_distro() {
  DISTRO_ID=""
  DISTRO_ID_LIKE=""
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    DISTRO_ID="${ID:-}"
    DISTRO_ID_LIKE="${ID_LIKE:-}"
  elif command -v lsb_release > /dev/null 2>&1; then
    DISTRO_ID="$(lsb_release -is 2>/dev/null | tr '[:upper:]' '[:lower:]')"
  fi
}

detect_shell_profile() {
  SHELL_TYPE=""
  SHELL_PROFILE=""
  config_home="${XDG_CONFIG_HOME:-$HOME/.config}"
  case "${SHELL:-}" in
    */zsh|zsh)           SHELL_TYPE="posix";   SHELL_PROFILE="$HOME/.zshrc" ;;
    */bash|bash)         SHELL_TYPE="posix";   SHELL_PROFILE="$HOME/.bashrc" ;;
    */dash|dash)         SHELL_TYPE="posix";   SHELL_PROFILE="$HOME/.profile" ;;
    */ash|ash)           SHELL_TYPE="posix";   SHELL_PROFILE="$HOME/.profile" ;;
    */ksh|ksh)           SHELL_TYPE="posix";   SHELL_PROFILE="$HOME/.profile" ;;
    */mksh|mksh)         SHELL_TYPE="posix";   SHELL_PROFILE="$HOME/.mkshrc" ;;
    */fish|fish)         SHELL_TYPE="fish";    SHELL_PROFILE="$config_home/fish/conf.d/curium.fish" ;;
    */nu|nu)             SHELL_TYPE="nushell"; SHELL_PROFILE="$config_home/nushell/env.nu" ;;
    */elvish|elvish)     SHELL_TYPE="elvish";  SHELL_PROFILE="$config_home/elvish/rc.elv" ;;
    */tcsh|tcsh)
      SHELL_TYPE="tcsh"
      if [ -f "$HOME/.tcshrc" ]; then SHELL_PROFILE="$HOME/.tcshrc"; else SHELL_PROFILE="$HOME/.cshrc"; fi
      ;;
    */csh|csh)           SHELL_TYPE="tcsh";    SHELL_PROFILE="$HOME/.cshrc" ;;
    *)                   return 1 ;;
  esac
}

validate_install_path() {
  path="$1"
  [ -n "$path" ] || error "install paths cannot be empty"
  case "$path" in
    /*) ;;
    *) error "install paths must be absolute: $path" ;;
  esac
  case "$path" in
    *'/../'*|*'/..'|../*|..|*'/./'*|*'/.'|./*)
      error "install paths cannot contain . or .. components: $path"
      ;;
  esac

  normalized="$path"
  while [ "$normalized" != "/" ] && [ "$normalized" != "${normalized%/}" ]; do
    normalized="${normalized%/}"
  done
  [ "$normalized" != "/" ] || error "refusing to use / as an install path"
  [ "$normalized" != "$HOME" ] || error "refusing to use HOME as an install path"
}

check_webkitgtk() {
  # Check for webkit2gtk-4.1 runtime library
  if command -v ldconfig > /dev/null 2>&1 &&
    ldconfig -p 2>/dev/null | grep -q 'libwebkit2gtk-4\.1'; then
    return 0
  fi
  # Fallback: check common and multiarch library paths.
  for dir in /lib /lib64 /usr/lib /usr/lib64 /usr/local/lib /usr/lib/*-linux-gnu; do
    if [ -d "$dir" ] && find "$dir" -name 'libwebkit2gtk-4.1.so*' 2>/dev/null | grep -q .; then
      return 0
    fi
  done
  return 1
}

suggest_dependencies() {
  detect_distro

  case "$DISTRO_ID" in
    arch|manjaro|endeavouros|garuda)
      PKG_CMD="sudo pacman -S --needed webkit2gtk-4.1 gtk3"
      ;;
    ubuntu|debian|linuxmint|pop|zorin|elementary|kali|raspbian)
      PKG_CMD="sudo apt-get install -y libwebkit2gtk-4.1-0 libgtk-3-0"
      ;;
    fedora)
      PKG_CMD="sudo dnf install -y webkit2gtk4.1 gtk3"
      ;;
    rhel|centos|rocky|alma|ol)
      PKG_CMD="sudo dnf install -y webkit2gtk3 gtk3"
      ;;
    opensuse*|suse|sles)
      PKG_CMD="sudo zypper install -y webkit2gtk-4_1-0 gtk3"
      ;;
    void)
      PKG_CMD="sudo xbps-install -S webkit2gtk-4.1 gtk3"
      ;;
    alpine)
      PKG_CMD="sudo apk add webkit2gtk gtk+3.0"
      ;;
    nixos)
      warn "NixOS detected — add webkitgtk_4_1 to environment.systemPackages"
      return
      ;;
    *)
      if command -v apt-get > /dev/null 2>&1; then
        PKG_CMD="sudo apt-get install -y libwebkit2gtk-4.1-0 libgtk-3-0"
      elif command -v dnf > /dev/null 2>&1; then
        PKG_CMD="sudo dnf install -y webkit2gtk4.1 gtk3"
      elif command -v pacman > /dev/null 2>&1; then
        PKG_CMD="sudo pacman -S --needed webkit2gtk-4.1 gtk3"
      elif command -v zypper > /dev/null 2>&1; then
        PKG_CMD="sudo zypper install -y webkit2gtk-4_1-0 gtk3"
      else
        warn "Could not detect package manager — install webkit2gtk-4.1 manually"
        return
      fi
      ;;
  esac

  warn "WebKitGTK runtime not found — Curium needs it to run"
  info "Install with: $PKG_CMD"
}

get_version() {
  VERSION="${CIUM_VERSION:-}"
  if [ -n "$VERSION" ]; then
    VERSION="$(printf '%s' "$VERSION" | sed 's/^v//')"
    info "Using specified version: $VERSION"
  else
    info "Fetching latest version..."
    if command -v curl > /dev/null 2>&1; then
      redirect_url=$(curl -Ls -o /dev/null -w '%{url_effective}' "$GITHUB/$REPO/releases/latest" 2>/dev/null) || true
    elif command -v wget > /dev/null 2>&1; then
      redirect_url=$(wget --max-redirect=20 --server-response -qO /dev/null "$GITHUB/$REPO/releases/latest" 2>&1 | awk '/[Ll]ocation:/ { url=$2 } END { print url }') || true
    else
      error "need 'curl' or 'wget'"
    fi
    [ -n "$redirect_url" ] || error "failed to determine latest version"
    VERSION="$(printf '%s' "$redirect_url" | sed 's|.*/v||')"
    [ -n "$VERSION" ] || error "failed to parse version"
    info "Latest version: $VERSION"
  fi
}

verify_checksum() {
  file="$1"; checksums_file="$2"
  [ -f "$checksums_file" ] || error "checksums file not available"
  expected=$(awk -v file="$(basename "$file")" '$2 == file { print $1; exit }' "$checksums_file")
  [ -n "$expected" ] || error "no checksum found for $(basename "$file")"
  if command -v sha256sum > /dev/null 2>&1; then
    actual=$(sha256sum "$file" | awk '{print $1}')
  elif command -v shasum > /dev/null 2>&1; then
    actual=$(shasum -a 256 "$file" | awk '{print $1}')
  else
    error "no SHA-256 tool found; refusing to install unverified file"
  fi
  [ "$expected" = "$actual" ] || error "checksum mismatch\n  Expected: $expected\n  Actual:   $actual"
  success "Checksum verified"
}

verify_signature() {
  file="$1"; sig_file="$2"
  command -v gpg > /dev/null 2>&1 || error "gpg is required for release verification — install gnupg"
  [ -f "$sig_file" ] || error "signature file not found: $sig_file"
  GPG_HOME_INSTALL=$(mktemp -d)
  if ! printf '%s\n' "$RELEASE_SIGNING_KEY" |
    gpg --homedir "$GPG_HOME_INSTALL" --no-options --no-tty --batch --import
  then
    error "could not import the embedded release signing key"
  fi
  if gpg --homedir "$GPG_HOME_INSTALL" --no-options --no-tty --batch \
    --verify "$sig_file" "$file"; then
    rm -rf "$GPG_HOME_INSTALL"
    GPG_HOME_INSTALL=""
    success "Release signature verified"
  else
    error "release signature verification failed — release may be tampered with"
  fi
}

update_icon_cache() {
  icons_base="${XDG_DATA_HOME:-$HOME/.local/share}/icons/hicolor"
  if command -v gtk-update-icon-cache > /dev/null 2>&1; then
    gtk-update-icon-cache -f -t "$icons_base" 2>/dev/null || true
  fi
}

update_desktop_database() {
  applications_dir="${XDG_DATA_HOME:-$HOME/.local/share}/applications"
  if command -v update-desktop-database > /dev/null 2>&1; then
    update-desktop-database "$applications_dir" 2>/dev/null || true
  fi
}

add_to_path() {
  bin_dir="$1"

  if ! detect_shell_profile; then
    warn "Unknown shell: ${SHELL:-}"
    info "Add to your PATH manually: export PATH=\"$bin_dir:\$PATH\""
    return 0
  fi

  mkdir -p "$(dirname "$SHELL_PROFILE")"

  case "$SHELL_TYPE" in
    posix)
      path_entry="export PATH=\"$bin_dir:\$PATH\""
      ;;
    fish)
      path_entry="fish_add_path -g \"$bin_dir\""
      ;;
    nushell)
      path_entry='$env.path = ($env.path | prepend "'"$bin_dir"'")'
      ;;
    elvish)
      path_entry="set paths = [\"$bin_dir\" \$@paths]"
      ;;
    tcsh)
      path_entry="setenv PATH \"$bin_dir:\$PATH\""
      ;;
  esac

  if [ -f "$SHELL_PROFILE" ] && grep -qF "$path_entry" "$SHELL_PROFILE" 2>/dev/null; then
    info "$SHELL_PROFILE already has Curium PATH entry"
    return 0
  fi

  printf '\n# >>> Curium PATH >>>\n%s\n# <<< Curium PATH <<<\n' "$path_entry" >> "$SHELL_PROFILE"
  info "Added $bin_dir to $SHELL_PROFILE"
}

remove_path_block() {
  profile="$1"
  temporary="${profile}.curium.$$"
  awk '
    $0 == "# >>> Curium PATH >>>" { skipping = 1; next }
    $0 == "# <<< Curium PATH <<<" { skipping = 0; next }
    !skipping { print }
  ' "$profile" > "$temporary" && mv "$temporary" "$profile" || rm -f "$temporary"
}

do_install() {
  bin_dir="${CIUM_BIN_DIR:-$HOME/.local/bin}"
  data_home="${XDG_DATA_HOME:-$HOME/.local/share}"
  app_dir="${CIUM_APP_DIR:-$data_home/curium}"
  LOCAL_FILE=""
  SKIP_DEPENDENCY_CHECK=0

  validate_install_path "$bin_dir"
  validate_install_path "$app_dir"

  while [ "$#" -gt 0 ]; do
    case "$1" in
      --file|-f)
        shift
        [ -n "${1:-}" ] || error "--file requires a path"
        LOCAL_FILE="$1"
        ;;
      --skip-dependency-check)
        SKIP_DEPENDENCY_CHECK=1
        ;;
      --help|-h)
        printf 'Curium Installer\n\n'
        printf 'Usage:\n'
        printf '  install.sh                          Install latest from GitHub\n'
        printf '  install.sh --file ./curium.tar.gz   Install from local file\n'
        printf '  install.sh --uninstall              Remove Curium\n'
        printf '  install.sh --skip-dependency-check  Skip WebKitGTK check\n'
        printf '  CIUM_VERSION=0.6.4 install.sh       Install specific version\n'
        printf '\nWhen piping:\n'
        printf '  curl -fsSL …/install.sh | sh -s --\n'
        printf '  curl -fsSL …/install.sh | sh -s -- --file ./curium.tar.gz\n'
        exit 0
        ;;
      *) error "unknown option: $1" ;;
    esac
    shift
  done

  detect_platform

  if [ "$SKIP_DEPENDENCY_CHECK" -eq 0 ] && ! check_webkitgtk; then
    suggest_dependencies
    error "WebKitGTK 4.1 was not found; install the package above or use --skip-dependency-check"
  fi

  TMPDIR_INSTALL=$(mktemp -d)

  if [ -n "$LOCAL_FILE" ]; then
    [ -f "$LOCAL_FILE" ] || error "file not found: $LOCAL_FILE"
    TARBALL_PATH="$LOCAL_FILE"
    if [ -z "${VERSION:-}" ]; then
      VERSION="$(basename "$LOCAL_FILE" | sed 's/^curium_//;s/_linux-.*//')"
      [ -n "$VERSION" ] || error "cannot determine version from filename"
      info "Detected version: $VERSION"
    fi
  else
    get_version
    TARBALL="curium_${VERSION}_linux-${ARCH}.tar.gz"
    CHECKSUMS="curium_${VERSION}_linux-${ARCH}.sha256"
    BASE_URL="$GITHUB/$REPO/releases/download/v${VERSION}"

    TARBALL_PATH="$TMPDIR_INSTALL/$TARBALL"
    info "Downloading ${TARBALL}..."
    download "${BASE_URL}/${TARBALL}" "$TARBALL_PATH"

    info "Downloading checksums and signature..."
    download "${BASE_URL}/${CHECKSUMS}" "$TMPDIR_INSTALL/${CHECKSUMS}"
    download "${BASE_URL}/${CHECKSUMS}.asc" "$TMPDIR_INSTALL/${CHECKSUMS}.asc"
    verify_signature "$TMPDIR_INSTALL/${CHECKSUMS}" "$TMPDIR_INSTALL/${CHECKSUMS}.asc"
    verify_checksum "$TARBALL_PATH" "$TMPDIR_INSTALL/${CHECKSUMS}"
  fi

  info "Installing to ${app_dir}..."
  mkdir -p "$bin_dir" "$app_dir"

  tar -xzf "$TARBALL_PATH" -C "$TMPDIR_INSTALL"
  EXTRACTED=$(find "$TMPDIR_INSTALL" -maxdepth 2 -type d -name 'curium-*' | head -n 1)
  [ -n "$EXTRACTED" ] || error "tarball does not contain expected directory"

  rm -rf "$app_dir"
  mv "$EXTRACTED" "$app_dir"
  chmod +x "$app_dir/bin/curium"
  ln -sf "$app_dir/bin/curium" "$bin_dir/curium"

  icons_dir="${XDG_DATA_HOME:-$HOME/.local/share}/icons/hicolor/512x512/apps"
  if [ -f "$app_dir/share/icons/hicolor/512x512/apps/curium.png" ]; then
    mkdir -p "$icons_dir"
    cp "$app_dir/share/icons/hicolor/512x512/apps/curium.png" \
      "$icons_dir/curium.png"
  fi

  applications_dir="${XDG_DATA_HOME:-$HOME/.local/share}/applications"
  if [ -f "$app_dir/share/applications/curium.desktop" ]; then
    mkdir -p "$applications_dir"
    sed "s|^Exec=.*|Exec=$bin_dir/curium %U|" \
      "$app_dir/share/applications/curium.desktop" \
      > "$applications_dir/curium.desktop"
  fi

  update_icon_cache
  update_desktop_database
  add_to_path "$bin_dir"

  success "Installed Curium $VERSION to $app_dir"
  info "Launch with: curium"
  info "Log out and back in if the icon doesn't appear immediately"
}

do_uninstall() {
  bin_dir="${CIUM_BIN_DIR:-$HOME/.local/bin}"
  data_home="${XDG_DATA_HOME:-$HOME/.local/share}"
  app_dir="${CIUM_APP_DIR:-$data_home/curium}"
  icons_dir="$data_home/icons/hicolor/512x512/apps"
  applications_dir="$data_home/applications"

  validate_install_path "$bin_dir"
  validate_install_path "$app_dir"

  info "Removing Curium..."

  rm -rf "$app_dir"
  rm -rf "$data_home/com.curium.desktop"
  rm -f "$bin_dir/curium"
  rm -f "$icons_dir/curium.png"
  rm -f "$applications_dir/curium.desktop"

  update_icon_cache
  update_desktop_database

  if detect_shell_profile && [ -n "$SHELL_PROFILE" ] && [ -f "$SHELL_PROFILE" ]; then
    remove_path_block "$SHELL_PROFILE"
    info "Cleaned $SHELL_PROFILE"
  fi

  success "Curium has been removed"
}

main() {
  printf '\n  \033[1mCurium Installer\033[0m\n\n'
  case "${1:-}" in
    --uninstall|-u) do_uninstall ;;
    *) do_install "$@" ;;
  esac
  printf '\n'
}

main "$@"
