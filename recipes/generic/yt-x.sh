COMPRESSION_OPTS="-l7 -C pcmaudio/waveform::flac:level=8:exhaustive --categorize=pcmaudio --metadata-compression null -S 25 -B 16 --order nilsimsa -W 12 -w 4" \
  pelfCreator  -m "xplshn" -n "yt-x" -p "bash" -e "yt-x" -z && {
    APPDIR="$(echo yt-x*.AppDir)"
    DBIN_INSTALL_DIR="./$APPDIR/proto/usr/local/bin" sh -c "dbin list | grep 'jq\|curl\|yt-dlp\|ffmpeg\|fzf\|gum\|chafa\|icat\|imgcat' | xargs dbin add"
    wget -qO "./$APPDIR/proto/usr/local/bin/yt-x" "https://github.com/Benexl/yt-x/raw/refs/heads/master/yt-x"
    "$APPDIR/.gen"
  }
