pelfCreator -m "xplshn" -n "org.wezfurlong.wezterm" -p "wezterm" -e "wezterm-gui" -x "usr/bin/wezterm-gui" -z && {
    APPDIR="$(echo org.wezfurlong.wezterm*.AppDir)"
    if ! wget -qO "$APPDIR/.DirIcon" "https://i.ibb.co/0MfXRdq/icon.png"; then
    	echo "Failed to 128x128 icon"
    	exit 1
    fi
    ID="$(basename "$APPDIR")"
    pelf --add-appdir "$APPDIR" --appbundle-id "$ID" --output-to "$ID.dwfs.AppBundle"
}
