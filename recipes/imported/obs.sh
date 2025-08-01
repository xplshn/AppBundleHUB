#!/bin/sh -u

NAME="OBS-Studio"
OWNER="pkgforge-dev"
REPO="github.com/${OWNER}/${NAME}-AppImage"
DATE="$(date +%Y%m%d)"
ARCH="$(uname -m)"

URL="$(curl -Ls https://api.github.com/repos/${OWNER}/"$(basename "$REPO")"/releases/latest \
  | sed 's/[()",{} ]/\n/g' \
  | grep -i "^http.*${NAME}.*${ARCH}.*\\.dwfs\\.AppBundle$" \
  | head -n1)"


## reference: mpv-0.38.0-anylinux-x86_64.dwfs.AppBundle
##VERSION="$(basename "$URL" | awk -F- '{print $2}' | tr '[:upper:]' '[:lower:]')"
# Get version from URL
VERSION=$(echo "$URL" | sed 's:.*/::' | sed 's/[^0-9]*\([0-9][0-9.]*\).*/\1/')

NAME="$(echo "$NAME" | tr '[:upper:]' '[:lower:]')"
REPO="$(echo "$REPO" | tr '/' '.' | tr '[:upper:]' '[:lower:]')"

APPBUNDLE_ID="${NAME}-${VERSION}-${REPO}"

if [ "$VERSION" = "studio" ]; then
    VERSION="$DATE"
fi

FNAME="$APPBUNDLE_ID.dwfs.AppBundle"

# Download and extract
curl -Ls "$URL" -o "$FNAME"
chmod +x "$FNAME"
