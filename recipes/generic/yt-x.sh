pelfCreator  -m "xplshn" -n "yt-x" -p "bash" -e "yt-x" -z && {
    APPDIR="$(echo yt-x*.AppDir)"
    ID="$(basename "$APPDIR")"
    DBIN_INSTALL_DIR="./$APPDIR/proto/usr/local/bin" sh -c "dbin list | grep 'jq\|curl\|yt-dlp\|ffmpeg\|fzf\|gum\|chafa\|icat\|imgcat' | xargs dbin add"
    wget -qO "./$APPDIR/proto/usr/local/bin/yt-x" "https://github.com/Benexl/yt-x/raw/refs/heads/master/yt-x"
    pelf --add-appdir "$APPDIR" --appbundle-id "$ID" --output-to "$ID.dwfs.AppBundle"
}
