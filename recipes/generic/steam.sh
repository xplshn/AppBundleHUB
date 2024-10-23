if ! wget -qO "/tmp/steam.AppImage" "https://github.com/ivan-hc/Steam-appimage/releases/download/continuous/Steam-1.0.0.81-2-3-x86_64.AppImage"; then
	echo "Couldn't download Steam AppImage"
	exit 1
fi
BS2AppBundle /tmp/steam.AppImage
