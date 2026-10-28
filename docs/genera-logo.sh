#!/bin/zsh
# Genera i file del logo per il sito a partire dal PNG originale (618 × 520).
# Uso: zsh docs/genera-logo.sh logo-originale.png assets/img
# Le coordinate dei ritagli valgono per quel file: con un originale diverso vanno rimisurate.
set -e
O=$1; D=$2
# Monogramma P su bianco puro
magick "$O" -crop 368x403+152+12 +repage -alpha off -level 0,98% -resize x300 -quality 85 "$D/logo-p.webp"
# Icone: P centrata su quadrato bianco
magick "$O" -crop 368x403+152+12 +repage -alpha off -level 0,98% -resize 150x150 -background white -gravity center -extent 180x180 "$D/apple-touch-icon.png"
magick "$O" -crop 368x403+152+12 +repage -alpha off -level 0,98% -resize 44x44 -background white -gravity center -extent 48x48 "$D/favicon-48.png"
T=$(mktemp -d)
# Logo dell'intestazione: P decorata (base allineata a ÉTILLE) + « ÉTILLE », trasparente
# Monogramma con il bianco reso trasparente (« color to alpha »: alfa = 1 - min(r,g,b), colore ricalcolato)
magick "$O" -crop 368x403+152+12 +repage -alpha off -level 0,98% "$T/mono.png"
magick "$T/mono.png" -fx "max(max(1-r,1-g),1-b)" -colorspace gray "$T/alfa.png"
magick "$T/mono.png" "$T/alfa.png" -fx "v.r<0.004 ? 1 : 1-(1-u)/v.r" "$T/colore.png"
magick "$T/colore.png" "$T/alfa.png" -alpha off -compose CopyOpacity -composite -resize 29.18% "$T/mono-t.png"
# « ÉTILLE » dalla scritta (alfa dalla luminosità, colore #2B1730)
magick -size 360x84 xc:'#2B1730' \
  \( "$O" -crop 360x84+161+414 +repage -alpha off -colorspace gray -negate -level 4%,80% -fill black -draw "rectangle 74,0 360,9" \) \
  -alpha off -compose CopyOpacity -composite "$T/etille.png"
# Composizione: base della P (y 392 nel ritaglio → 114 scalato) sulla base di ÉTILLE (y 80), entrambe a y 118
magick -size 459x122 xc:none "$T/mono-t.png" -geometry +0+4 -composite "$T/etille.png" -geometry +99+38 -composite \
  -define webp:lossless=true "$D/logo-entete.webp"
rm -rf "$T"
