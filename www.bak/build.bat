@echo off
REM Remove the dist folder
if exist dist (
    rmdir /s /q dist
)

REM Run esbuild
esbuild --bundle --outdir=dist --minify --sourcemap *.js ./**/*.js
