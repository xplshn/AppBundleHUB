pelfCreator -m xplshn -n xfce4-multicall -p "mousepad thunar ristretto xfce4-appfinder xfce4-terminal xfce4-screenshooter xfce4-panel xfce4-taskmanager" -z -c
APPDIR="$(echo xfce4-multicall*.AppDir)"
# Add the .DirIcon
if ! wget -qO "$APPDIR/.DirIcon" "https://i.ibb.co/qx1n74v/image.png"; then
	echo "Unable to add .DirIcon (png, 128x128) to the AppDir"
	exit 1
fi
"$APPDIR"/.gen
