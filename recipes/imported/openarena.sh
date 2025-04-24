#!/bin/sh -x
curl -LO https://github.com/pkgforge-dev/openArena/releases/latest/download/openarena-quake3e.dwfs.AppBundle
curl -LO https://github.com/pkgforge-dev/openArena/releases/latest/download/quake3e.dwfs.AppBundle
chmod +x *.dwfs.AppBundle
./quake3e.dwfs.AppBundle --pbundle_appstream | base64 -d
./openarena-quake3e.dwfs.AppBundle --pbundle_appstream | base64 -d
