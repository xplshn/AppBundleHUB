pelfCreator  -m "xplshn" -n "yt-x" -p "bash" -e "yt-x" -z && {
  APPDIR="$(echo yt-x*.AppDir)"
  DBIN_INSTALL_DIR="./$APPDIR/proto/usr/local/bin" sh -c "dbin list | grep 'jq\|curl\|yt-dlp\|fzf\|gum\|chafa\|icat\|imgcat' | xargs dbin add"
  "$APPDIR/.gen"
} # FFMPEG could be pre-installed, but I don't want to fuck around and find out, you know... Shitty FFMPEG license (GPL) + binary blobs...
