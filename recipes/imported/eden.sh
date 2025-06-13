#!/bin/sh -u

NAME="eden"
MAINTAINER="xplshn"
DATE="$(date +%d_%m_%Y)"
APPBUNDLE_ID="${NAME}-${DATE}-${MAINTAINER}"
ARCH="$(uname -m)"

URL="$(curl -Ls https://api.github.com/repos/pflyly/eden-nightly/releases/latest | sed 's/[()",{} ]/\n/g' | grep -o "https.*Eden-[0-9]\+-Legacy-${ARCH}\\.dwfs\\.AppBundle$" | head -n1)"
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
