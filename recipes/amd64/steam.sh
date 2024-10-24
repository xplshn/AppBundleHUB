if ! wget -qO "./steam.AppImage" "https://github.com/ivan-hc/Steam-appimage/releases/download/continuous/Steam-1.0.0.81-2-3-x86_64.AppImage"; then
	echo "Couldn't download Steam AppImage"
	exit 1
fi
COMPRESSION_OPTS="-l7 -C zstd:level=22 --metadata-compression null -S 25 -B 8 --order nilsimsa -W 12 -w 4" BS2AppBundle ./steam.AppImage
