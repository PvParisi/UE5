#!/bin/zsh
# Genera le foto delle bottiglie dell'hero, una per gusto, dalle versioni scontornate (PNG con alfa).
# Uso: zsh docs/genera-bouteilles-photo.sh bouteilles-originales assets/img
# Nella cartella di origine: <gusto>.png (es. pink-bloom.png) → produce bouteille-<gusto>.webp.
# Originali: foto generate con Gemini dal disegno del gruppo, scontornate; quella di Mango con
# lo slogan « GOÛTS » ricopiato da un'altra bottiglia (Gemini aveva scritto « GOĜTS »).
set -e
O=$1; D=$2
for f in "$O"/*.png; do
  # Ritaglio sulla bottiglia (alfa > 10 %), poi stessa altezza e stessa tela per tutti i gusti:
  # cambiando gusto la bottiglia non si sposta. 1020 px = 3 × i 340 px dell'hero (iPhone)
  G=$(magick "$f" -alpha extract -threshold 10% -format %@ info:)
  magick "$f" -crop "$G" +repage -resize x1020 -background none -gravity center -extent 320x1020 \
    -quality 80 -define webp:alpha-quality=90 "$D/bouteille-${f:t:r}.webp"
done
