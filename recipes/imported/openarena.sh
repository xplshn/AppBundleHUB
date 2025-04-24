#!/bin/sh -x
curl -LO https://github.com/pkgforge-dev/openArena/releases/latest/download/openarena-quake3e.dwfs.AppBundle
curl -LO https://github.com/pkgforge-dev/openArena/releases/latest/download/quake3e.dwfs.AppBundle
chmod +x *.dwfs.AppBundle
time sh -c "./quake3e.dwfs.AppBundle --pbundle_appstream | base64 -d"
time sh -c "./openarena-quake3e.dwfs.AppBundle --pbundle_appstream | base64 -d"
