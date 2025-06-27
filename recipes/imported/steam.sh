#!/bin/sh -u

NAME="Steam"
OWNER="ivan-hc"
REPO="github.com/${OWNER}/${NAME}-appimage"
DATE="$(date +%d_%m_%Y)"
ARCH="$(uname -m)"

URL="$(curl -Ls https://api.github.com/repos/${OWNER}/"$(basename "$REPO")"/releases/latest \
  | sed 's/[()",{} ]/\n/g' \
  | grep -i "^http.*${NAME}.*${ARCH}.*\\.AppImage$" \
  | head -n1)"

# reference: mpv-0.38.0-anylinux-x86_64.dwfs.AppBundle
VERSION="$(basename "$URL" | awk -F- '{print $2}' | tr '[:upper:]' '[:lower:]')"

NAME="$(echo "$NAME" | tr '[:upper:]' '[:lower:]')"
REPO="$(echo "$REPO" | tr '/' '.' | tr '[:upper:]' '[:lower:]')"

APPBUNDLE_ID="${NAME}#${REPO}:${VERSION}@${DATE}"

FNAME="$APPBUNDLE_ID.AppImage"

# Download and extract
curl -Ls "$URL" -o "$FNAME"
chmod +x "$FNAME"
"./$FNAME" --appimage-extract && {
  pelf --add-appdir "./squashfs-root" \
       --output-to "${APPBUNDLE_ID}.dwfs.AppBundle"  \
       --appbundle-id "${APPBUNDLE_ID}"
}
rm -rf "$FNAME" "./squashfs-root" "./AppDir"
