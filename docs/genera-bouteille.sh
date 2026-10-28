#!/bin/zsh
# Genera la bottiglia dell'hero a partire dal disegno fornito dal gruppo (PNG 535 × 949, fondo bianco).
# Uso: zsh docs/genera-bouteille.sh bouteille-originale.png assets/img
# Produce: bouteille.webp (disegno, fondo trasparente) e bouteille-liquide.webp (sagoma del liquido, in alfa).
# Le coordinate valgono per quel file: con un disegno diverso vanno rimisurate.
set -e
O=$1; D=$2; T=$(mktemp -d)
ETIQ="rgb(253,252,250)"

# 1. Slogan: « vin pétillant… » → « vin frais aux goûts d'ailleurs » (Avenir Book: stessa altezza, spaziatura e larghezza
#    dell'originale, verificate riscrivendo il vecchio slogan: 163 px contro 163)
magick -background none -fill '#3A3A3A' -font Avenir-Book -pointsize 38 -kerning 18 \
  label:"VIN FRAIS AUX GOÛTS D'AILLEURS" -trim +repage -resize 12.5% "$T/slogan.png"
SW=$(magick identify -format %w "$T/slogan.png")
magick "$O" -fill "$ETIQ" -draw "rectangle 182,775 354,787" \
  "$T/slogan.png" -geometry +$(( 268 - SW / 2 ))+779 -compose Over -composite "$T/s1.png"

# 2. Interno dell'etichetta (tra i bordi curvi disegnati, misurati in 8 punti)
magick -size 535x949 xc:black -fill white -draw "polygon 132,558 150,568 180,575 220,580 267,582 310,580 350,575 385,566 403,558 403,784 385,786 350,793 310,797 267,799 220,797 180,793 150,787 132,784" "$T/etiq.png"

# 3. Contenuto dell'etichetta su trasparente (bianco → alfa), deformato su un cilindro:
#    più largo al centro, più stretto ai lati, righe che salgono fino a 10 px verso i bordi
magick "$T/s1.png" -alpha off -level 0,98.6% "$T/b.png"
magick "$T/b.png" -fx "max(max(1-r,1-g),1-b)" -colorspace gray "$T/a.png"
magick "$T/a.png" "$T/etiq.png" -compose Multiply -composite "$T/a.png"
magick "$T/b.png" "$T/a.png" -fx "v.r<0.004 ? 1 : 1-(1-u)/v.r" "$T/c.png"
magick "$T/c.png" "$T/a.png" -alpha off -compose CopyOpacity -composite "$T/contenu.png"
magick "$T/contenu.png" -virtual-pixel transparent \
  -fx "qc=267.5; qr=136; qt=0.9; qx=max(-1,min(1,(i-qc)/qr)); qa=asin(qx*sin(qt)); qs=qc+qr*qa/qt; qd=10*(1-cos(qa))/(1-cos(qt)); p{qs,j+qd}" "$T/contenu-c.png"
magick "$T/contenu-c.png" \( "$T/contenu-c.png" -alpha extract "$T/etiq.png" -compose Multiply -composite \) -alpha off -compose CopyOpacity -composite "$T/contenu-c.png"
magick "$T/s1.png" \( -size 535x949 xc:"$ETIQ" "$T/etiq.png" -alpha off -compose CopyOpacity -composite \) -compose Over -composite \
  "$T/contenu-c.png" -compose Over -composite "$T/s2.png"

# 4. Fondo attorno alla bottiglia trasparente
magick "$T/s2.png" -alpha set -fuzz 6% -fill none -draw "color 2,2 floodfill" -draw "color 532,2 floodfill" -draw "color 2,946 floodfill" -draw "color 532,946 floodfill" "$T/art.png"

# 5. Sagoma del liquido: interno del vetro sotto la linea delle bollicine (y > 300), etichetta esclusa
magick "$T/s2.png" -fuzz 10% -fill magenta -draw "color 270,450 floodfill" -draw "color 270,870 floodfill" -alpha off \
  -fx "(r>0.9 && g<0.1 && b>0.9 && j>300) ? 1 : 0" -colorspace gray "$T/liq.png"
magick -size 535x949 xc:white "$T/liq.png" -alpha off -compose CopyOpacity -composite "$T/liq-a.png"

# 6. Ritaglio sulla bottiglia (290 × 871 a +123+63, con 5 px di margine) ed export
magick "$T/art.png" -crop 300x881+118+58 +repage -quality 82 -define webp:alpha-quality=100 "$D/bouteille.webp"
magick "$T/liq-a.png" -crop 300x881+118+58 +repage -define webp:lossless=true "$D/bouteille-liquide.webp"
rm -rf "$T"
