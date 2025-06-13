#!/bin/sh -u

NAME="steam"
MAINTAINER="xplshn"
DATE="$(date +%d_%m_%Y)"
APPBUNDLE_ID="${NAME}-${DATE}-${MAINTAINER}"
ARCH="$(uname -m)"

URL="$(curl -Ls https://api.github.com/repos/ivan-hc/Steam-appimage/releases/latest | sed 's/[()",{} ]/\n/g' | grep -o "https.*Steam-.*-anylinux-${ARCH}\.AppImage$" | tr '\n' ' ')"
FNAME="$(basename "$URL")"

# Download and extract
curl -LOs $URL
chmod +x $FNAME
./$FNAME --appimage-extract && {
  pelf --add-appdir "./squashfs-root" \
       --output-to "${APPBUNDLE_ID}.dwfs.AppBundle"  \
       --appbundle-id "${APPBUNDLE_ID}"
}

rm -rf "$FNAME" "./squashfs-root" "./AppDir"
