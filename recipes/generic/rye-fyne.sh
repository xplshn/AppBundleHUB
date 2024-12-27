#!/bin/sh

# Setup base directory
OPWD="$PWD"
BASE="$(dirname "$(realpath "$0")")"
if [ "$OPWD" != "$BASE" ]; then
    echo "... $BASE is not the same as $PWD ..."
    echo "Switching to $BASE and coming back here after."
    cd "$BASE" || exit 1
fi
trap 'cd "$OPWD"' EXIT

# Color variables for logging
_reset="\033[m"
_blue="\033[34m"
_green="\033[32m"
_red="\033[31m"
_yellow="\033[33m"

# Logging functions
log() { printf "%b->%b %s\n" "$2" "$_reset" "$1"; }
log_error() { log "$1" "$_red"; exit 1; }
log_success() { log "$1" "$_green"; }
log_action() { log "$1" "$_blue"; }
log_warning() { log "$1" "$_yellow"; }

# Suppress output and errors
unnappear() { "$@" >/dev/null 2>&1; }

# Check if command exists
available() { command -v "$1" >/dev/null 2>&1; }

# Require a command, or log error if not found
require() { available "$1" || log_error "[$1] is not installed. Please install it and try again."; }

# Clone or pull a Git repository
cloneRepo() {
    REPO_URL="$1"
    PROJECT_DIR="$2"
    PROJECT_NAME="$3"

    log_action "Cloning $PROJECT_NAME"
    if [ -d "$PROJECT_DIR" ]; then
        log_warning "$PROJECT_NAME already exists. Pulling latest changes."
        (cd "$PROJECT_DIR" && git pull) || log_error "Failed to pull latest changes for $PROJECT_NAME."
    else
        git clone --depth 1 "$REPO_URL" "$PROJECT_DIR" || log_error "Failed to clone $PROJECT_NAME."
        cd "$PROJECT_DIR" || log_error "Unable to enter $PROJECT_DIR."
        log_success "$PROJECT_NAME cloned successfully."
    fi
}

# Function to build Rye
build_rye() {
    PROJECT_NAME="rye"
    REPO_URL="https://github.com/refaktor/rye"
    PROJECT_DIR="$TEMP_DIR/$PROJECT_NAME"

    cloneRepo "$REPO_URL" "$PROJECT_DIR" "$PROJECT_NAME"

    log_action "Building $PROJECT_NAME"
    CGO_ENABLED="1" go build -ldflags "-linkmode external -extldflags -static" -v -trimpath . \
        && log_success "$PROJECT_NAME built successfully." \
        || log_error "Failed to build $PROJECT_NAME."

    mv "$PROJECT_NAME" "$GOBIN" || log_error "Failed to move $PROJECT_NAME to $GOBIN."
}

# Function to build Rye-fyne
build_rye_fyne() {
    PROJECT_NAME="rye-fyne"
    REPO_URL="https://github.com/refaktor/rye-fyne"
    PROJECT_DIR="$TEMP_DIR/$PROJECT_NAME"

    cloneRepo "$REPO_URL" "$PROJECT_DIR" "$PROJECT_NAME"

    log_action "Building $PROJECT_NAME"
    go mod tidy && \
    CGO_ENABLED="1" go build -v -trimpath . && \
        log_success "$PROJECT_NAME built successfully." \
        || log_error "Failed to build $PROJECT_NAME."

    cp "$PROJECT_NAME" "$GOBIN" || log_error "Failed to copy $PROJECT_NAME to $GOBIN."

    # Install required tools
    #log_action "Installing required tools"
    export DBIN_INSTALL_DIR="$HOME/.local/bin"
    #wget -qO- "https://raw.githubusercontent.com/xplshn/dbin/master/stubdl" | sh -s -- --install "/usr/local/bin/dbin" add sharun sharun-lib4bin || log_error "Failed to install dbin and related tools."
    export PATH="$HOME/.local/bin:$PATH"

    #git clone --depth 1 https://github.com/xplshn/pelf "$TEMP_DIR/pelf" || log_error "Failed to clone pelf."
    #cp "$TEMP_DIR/pelf/pelf"* /usr/local/bin || log_error "Failed to copy pelf binaries to /usr/local/bin."

    # Set up AppDir
    log_action "Setting up AppDir for $PROJECT_NAME"
    mkdir -p ./ryeFyne.AppDir
    echo "rye-fyne" > ./ryeFyne.AppDir/entrypoint
    wget -qO "./ryeFyne.AppDir/AppRun" "https://github.com/xplshn/pelf/raw/refs/heads/pelf-ng/assets/AppRun.sharun.ovfsProto"
    chmod +x ./ryeFyne.AppDir/AppRun || log_error "Failed to make AppRun executable."

    # Final steps
    cd ./ryeFyne.AppDir || log_error "Failed to enter ryeFyne.AppDir."
    lib4bin --dst-dir "./ryeFyne.AppDir" "$GOBIN/$PROJECT_NAME" || log_error "lib4bin failed."

    pelf-dwfs --add-appdir "./ryeFyne.AppDir" --appbundle-id "rye-$(date +%d_%m_%Y)-xplshn" --output-to "$GOBIN/ryeFyne.dwfs.AppBundle" --embed-static-tools || log_error "Failed to create AppBundle."
}

############################# MAIN SCRIPT #################################

TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

# Parse options
while getopts "p:" opt; do
    case $opt in
        p) PROJECTS="$OPTARG" ;;
        *) log_error "Usage: $0 [-p project1,project2,...]" ;;
    esac
done

# Environment setup for static binaries
export GOFLAGS="-ldflags=-static -ldflags=-s -ldflags=-w"
export CGO_ENABLED="0"
export CGO_CFLAGS="-O3 -flto=auto -static-pie -w -pipe"
export GOBIN="$OPWD"

# If no projects are specified, build everything
[ -z "$PROJECTS" ] && PROJECTS="rye-fyne"

mkdir -p "$GOBIN"

# Build specified projects
for project in $PROJECTS; do
    case $project in
        rye) build_rye ;;
        rye-fyne) build_rye_fyne ;;
        *) log_warning "Unknown project: $project" ;;
    esac
done
