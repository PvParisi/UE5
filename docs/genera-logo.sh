#!/bin/zsh
# Genera i file del logo per il sito a partire dal PNG originale (618 × 520).
# Uso: zsh docs/genera-logo.sh logo-originale.png assets/img
# Le coordinate dei ritagli valgono per quel file: con un originale diverso vanno rimisurate.
set -e
O=$1; D=$2
# Scritta « PÉTILLE »: alfa dalla luminosità, colore #2B1730
magick -size 426x84 xc:'#2B1730' \
  \( "$O" -crop 426x84+95+414 +repage -alpha off -colorspace gray -negate -level 4%,80% -fill black -draw "rectangle 140,0 426,9" \) \
  -alpha off -compose CopyOpacity -composite -define webp:lossless=true "$D/logo-petille.webp"
# Monogramma P su bianco puro
magick "$O" -crop 368x403+152+12 +repage -alpha off -level 0,98% -resize x300 -quality 85 "$D/logo-p.webp"
# Icone: P centrata su quadrato bianco
magick "$O" -crop 368x403+152+12 +repage -alpha off -level 0,98% -resize 150x150 -background white -gravity center -extent 180x180 "$D/apple-touch-icon.png"
magick "$O" -crop 368x403+152+12 +repage -alpha off -level 0,98% -resize 44x44 -background white -gravity center -extent 48x48 "$D/favicon-48.png"
