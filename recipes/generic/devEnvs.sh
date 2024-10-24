#!/bin/sh

COMPRESSION_OPTS="-l 9 -B5" pelfCreator -m xplshn -n musl_C_Go_Fyne_DevEnv -p "fuse3 build-base libxcursor-dev libxrandr-dev libxinerama-dev libxi-dev linux-headers mesa-dev go git fuse bash" -c
