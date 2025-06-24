pelfCreator -m "xplshn" -n "caja" -p "caja" -x "usr/bin/caja" -e "caja.desktop" -z

APPDIR="$(echo $PWD/caja-*.AppDir)"
APPBUNDLE_ID="$(basename "$APPDIR" .AppDir)"

curl -Lo "$APPDIR/caja.AppStream.xml" https://github.com/snowfallorg/nixos-appstream-data/raw/refs/heads/main/free/metadata/mate.caja::caja.xml
pelf --add-appdir "$APPDIR" --appbundle-id "$APPBUNDLE_ID" --output-to "$APPBUNDLE_ID.dwfs.AppBundle"
