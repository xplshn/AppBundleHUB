pelfCreator -m "xplshn" -n "inkscape" -i "org.inkscape.Inkscape" -p "inkscape adwaita-icon-theme" -e "org.inkscape.Inkscape.desktop" -s -z && {
  APPDIR="$(echo org.inkscape.Inkscape*.AppDir)"
  "$APPDIR/AppRun" --Xbwrap --uid "0" --gid "0" -- gtk-update-icon-cache /usr/share/icons/Adwaita
  "$APPDIR/AppRun" --Xbwrap --uid "0" --gid "0" -- gtk-update-icon-cache /usr/share/icons/hicolor
  wget -qO "$APPDIR/AppRun" "https://raw.githubusercontent.com/xplshn/pelf/refs/heads/pelf-ng/assets/AppRun.sharun.ovfsProto"
  ID="$(basename "$APPDIR")"
  pelf --add-appdir "$APPDIR" --appbundle-id "$ID" --output-to "inkscape.dwfs.AppBundle"
}
