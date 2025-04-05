pelfCreator -m xplshn -n xfce4-multicall -p "mousepad thunar ristretto xfce4-appfinder xfce4-terminal xfce4-screenshooter xfce4-panel xfce4-taskmanager xfce4-power-manager" -x "usr/bin/mousepad usr/bin/thunar usr/bin/ristretto usr/bin/xfce4-appfinder usr/bin/xfce4-terminal usr/bin/xfce4-screenshooter usr/bin/xfce4-panel usr/bin/xfce4-taskmanager usr/bin/xfce4-power-manager" -z
APPDIR="$(echo xfce4-multicall*.AppDir)"
# Add the .DirIcon
if ! wget -qO "$APPDIR/.DirIcon" "https://i.ibb.co/qx1n74v/image.png"; then
	echo "Unable to add .DirIcon (png, 128x128) to the AppDir"
	exit 1
fi
ID="$(basename "$APPDIR")"
pelf --add-appdir "$APPDIR" --appbundle-id "$ID" --output-to "$ID.dwfs.AppBundle"
