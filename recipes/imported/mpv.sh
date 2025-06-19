#!/bin/sh -u

NAME="mpv"
MAINTAINER="xplshn"
DATE="$(date +%d_%m_%Y)"
APPBUNDLE_ID="${NAME}-${DATE}-${MAINTAINER}"
ARCH="$(uname -m)"

URL="$(curl -Ls https://api.github.com/repos/pkgforge-dev/mpv-AppImage/releases/latest | sed 's/[()",{} ]/\n/g' | grep -o "https.*mpv.*-anylinux-${ARCH}\.dwfs.AppBundle$" | tr '\n' ' ')" #'
FNAME="$APPBUNDLE_ID.dwfs.AppBundle" #FNAME="$(basename "$URL")"

# Download and extract
curl -Ls "$URL" -o "$FNAME"
chmod +x $FNAME

#/$FNAME --appimage-extract && {
#  pelf --add-appdir "./squashfs-root" \
#       --output-to "${APPBUNDLE_ID}.dwfs.AppBundle"  \
#       --appbundle-id "${APPBUNDLE_ID}"
#}
#rm -rf "$FNAME" "./squashfs-root" "./AppDir"
