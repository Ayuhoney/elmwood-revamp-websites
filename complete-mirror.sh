#!/bin/bash
set -e

BASE="https://html.awaikenthemes.com/reliva"
ROOT="$(cd "$(dirname "$0")" && pwd)"
SITE="$ROOT/elemwood"

pages=(
index.html
index-2.html
index-3.html
about.html
services.html
service-single.html
blog.html
blog-single.html
case-study.html
case-study-single.html
team.html
team-single.html
pricing.html
testimonials.html
image-gallery.html
video-gallery.html
faqs.html
404.html
contact.html
book-appointment.html
)

mkdir -p "$SITE"

echo "=== Downloading all HTML pages ==="
for page in "${pages[@]}"; do
    wget -q --show-progress \
      "$BASE/$page" \
      -P "$SITE/" || true
done

echo "=== Extracting all CSS/JS/images/assets URLs ==="
find "$SITE" -type f -name "*.html" -print0 |
while IFS= read -r -d '' file; do
    grep -Eo 'https://html\.awaikenthemes\.com/reliva/[^"'\''<>() ]+' "$file" || true
done | sed 's/[?#].*$//' | sort -u > "$ROOT/assets-urls.txt"

echo "=== Downloading assets into elemwood ==="
wget -i "$ROOT/assets-urls.txt" \
  --force-directories \
  --no-host-directories \
  -nH --cut-dirs=1 \
  -P "$SITE" || true

echo "=== Downloading Google fonts into elemwood/fonts ==="
mkdir -p "$SITE/fonts"
wget -q --page-requisites \
  --convert-links \
  "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Sora:wght@100..800&display=swap" \
  -P "$SITE/fonts/" || true

echo "=== Downloading hero video ==="
mkdir -p "$SITE/images"
curl -L --retry 3 \
  "https://demo.awaikenthemes.com/assets/videos/reliva-hero-video-prime.mp4" \
  -o "$SITE/images/hero-bg-video.mp4" || true

echo
echo "=== COMPLETE ==="
echo "Total files:"
find "$SITE" -type f | wc -l
