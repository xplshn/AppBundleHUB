eget2 github.com/pkgforge-dev/mpv-AppImage --asset=".AppImage" --asset="^zsync" --download-only && {
    BS2AppBundle ./mpv-*.AppImage
    mv ./mpv-*dwfs.AppBundle "io.mpv.Mpv-$(date +%d_%m_%Y).$APPBUNDLE_FS.AppBundle"
}
