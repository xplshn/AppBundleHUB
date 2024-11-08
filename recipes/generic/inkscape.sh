pelfCreator -m "xplshn" -n "org.inkscape.Inkscape" -p "inkscape adwaita-icon-theme" -e "org.inkscape.Inkscape.desktop" -z && {
  APPDIR="$(echo org.inkscape.Inkscape*.AppDir)"
  "$APPDIR/AppRun" --Xbwrap --uid "0" --gid "0" -- gtk-update-icon-cache /usr/share/icons/Adwaita
  "$APPDIR/AppRun" --Xbwrap --uid "0" --gid "0" -- gtk-update-icon-cache /usr/share/icons/hicolor
  "$APPDIR/.gen"
}
