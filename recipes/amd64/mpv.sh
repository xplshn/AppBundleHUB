eget2 Samueru-sama/mpv-AppImage --asset=".AppImage" --asset="^zsync" --download-only && {
    COMPRESSION_OPTS="-l7 -C pcmaudio/waveform::flac:level=8:exhaustive --categorize=pcmaudio --metadata-compression null -S 25 -B 16 --order nilsimsa -W 12 -w 4" BS2AppBundle ./mpv-*
}
