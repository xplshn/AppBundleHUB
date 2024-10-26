pelfCreator -m "xplshn" -n "inkscape" -p "inkscape" -e "org.inkscape.Inkscape.desktop" -z && {
  APPDIR="$(echo inkscape*.AppDir)"
  "$APPDIR/AppRun" --Xbwrap --uid "0" --gid "0" -- apk -X "http://dl-cdn.alpinelinux.org/alpine/edge/main" -U --allow-untrusted add adwaita-icon-theme
  "$APPDIR/AppRun" --Xbwrap --uid "0" --gid "0" -- gtk-update-icon-cache /usr/share/icons/Adwaita
  "$APPDIR/AppRun" --Xbwrap --uid "0" --gid "0" -- gtk-update-icon-cache /usr/share/icons/hicolor
  "$APPDIR/.gen"
}
