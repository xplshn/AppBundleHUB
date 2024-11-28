eget2 github.com/Samueru-sama/cromite-AppImage --asset=".AppImage" --asset="^zsync" --download-only && {
    COMPRESSION_OPTS="-l7 -C pcmaudio/waveform::flac:level=8:exhaustive --categorize=pcmaudio --metadata-compression null -S 25 -B 16 --order nilsimsa -W 12 -w 4" BS2AppBundle ./*romite*.AppImage && \
    mv *romite*.AppBundle "org.cromite.cromite-$(date +%d_%m_%Y).dwfs.AppBundle" # org.cromite.cromite = their Android app identifier. I suppose if they were to publish to Flatpak, they'd use this one. So, in order to prepare us for when they do and metadata becomes available... (you know.., since I'm scrapping Flathub's APPSTREAM XML database...)
}
