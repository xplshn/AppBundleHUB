pelfCreator -m "xplshn" -n "wezterm" -p "wezterm" -e "wezterm-gui" -x "usr/bin/wezterm-gui" -z && {
    APPDIR="$(echo wezterm*.AppDir)"
    if ! wget -qO "$APPDIR/.DirIcon" "https://i.ibb.co/0MfXRdq/icon.png"; then
    	echo "Failed to 128x128 icon"
    	exit 1
    fi
    "$APPDIR/.gen"
}
