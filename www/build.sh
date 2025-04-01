#!/bin/sh
curl -LlO https://github.com/xplshn/dbin-metadata/raw/refs/heads/master/misc/cmd/modMetadata/METADATA_amd64_linux.json
curl -LlO https://github.com/xplshn/dbin-metadata/raw/refs/heads/master/misc/cmd/modMetadata/METADATA_arm64_linux.json
rm -rf ./dist && esbuild --bundle --outdir=dist --minify --sourcemap *.js ./*/*.js
