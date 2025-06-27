#!/bin/sh -u

NAME="zenity"
OWNER="pkgforge-dev"
REPO="github.com/${OWNER}/Zenity-GTK3-AppImage"
DATE="$(date +%d_%m_%Y)"
ARCH="$(uname -m)"

URL="$(curl -Ls https://api.github.com/repos/${OWNER}/"$(basename "$REPO")"/releases/latest \
  | sed 's/[()",{} ]/\n/g' \
  | grep -i "^http.*${NAME}.*${ARCH}.*\\.dwfs\\.AppBundle$" \
  | head -n1)"

# reference: mpv-0.38.0-anylinux-x86_64.dwfs.AppBundle
VERSION="$(basename "$URL" | awk -F- '{print $2}' | tr '[:upper:]' '[:lower:]')"

NAME="$(echo "$NAME" | tr '[:upper:]' '[:lower:]')"
REPO="$(echo "$REPO" | tr '/' '.' | tr '[:upper:]' '[:lower:]')"

APPBUNDLE_ID="${NAME}#${REPO}:${VERSION}@${DATE}"

FNAME="$APPBUNDLE_ID.dwfs.AppBundle"

# Download and extract
curl -Ls "$URL" -o "$FNAME"
chmod +x "$FNAME"
