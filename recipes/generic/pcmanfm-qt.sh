pelfCreator -m "xplshn" -n "pcmanfm-qt" -p "pcmanfm-qt" -x "usr/bin/pcmanfm-qt"  -e "pcmanfm-qt.desktop" -z
APPDIR="$(echo pcmanfm-qt*.AppDir)"
# Add the .DirIcon
if ! wget -qO "$APPDIR/.DirIcon" "https://i.ibb.co/CtNbwVk/lxqt-logo.png"; then
	echo "Unable to add .DirIcon (png, 128x128) to the AppDir"
	exit 1
fi
echo "pcmanfm-qt" > "$APPDIR/entrypoint"
"$APPDIR"/.gen
