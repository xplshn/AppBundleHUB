URL="$(curl -Ls https://api.github.com/repos/ivan-hc/Steam-appimage/releases/latest | sed 's/[()",{} ]/\n/g' | grep -o "https.*AppBundle$" | tr '\n' ' ')"
curl -LOs $URL
chmod +x *.AppBundle
