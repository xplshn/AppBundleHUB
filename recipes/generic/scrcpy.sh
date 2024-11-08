pelfCreator -m "xplshn" -n "scrcpy" -p "scrcpy pipewire-pulse android-tools" -x "usr/bin/scrcpy usr/bin/adb usr/bin/fastboot" -k "usr/share/scrcpy usr/share/android-tools" -e "scrcpy.desktop" -z && {
    APPDIR="$(echo scrcpy*.AppDir)"
    echo "scrcpy" >"$APPDIR/entrypoint"
    "$APPDIR/.gen"
}
