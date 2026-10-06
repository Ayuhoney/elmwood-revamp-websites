#!/bin/bash
set -e

BASE="https://html.awaikenthemes.com/reliva"
ROOT="$HOME/Desktop/reliva"

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

mkdir -p "$ROOT"

echo "=== Downloading all HTML pages ==="
for page in "${pages[@]}"; do
    wget -q --show-progress \
      "$BASE/$page" \
      -P "$ROOT/html.awaikenthemes.com/reliva/" || true
done

echo "=== Extracting all CSS/JS/images/assets URLs ==="
find "$ROOT/html.awaikenthemes.com/reliva" -type f -name "*.html" -print0 |
while IFS= read -r -d '' file; do
    grep -Eo 'https://html\.awaikenthemes\.com/reliva/[^"'\''<>() ]+' "$file" || true
done | sed 's/[?#].*$//' | sort -u > "$ROOT/assets-urls.txt"

echo "=== Downloading assets ==="
wget -i "$ROOT/assets-urls.txt" \
  --force-directories \
  --no-host-directories \
  -P "$ROOT" || true

echo "=== Downloading Google fonts ==="
wget -q --page-requisites \
  --convert-links \
  "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Sora:wght@100..800&display=swap" \
  -P "$ROOT/fonts.googleapis.com/" || true

echo "=== Downloading hero video ==="
mkdir -p "$ROOT/demo.awaikenthemes.com/assets/videos"
curl -L --retry 3 \
  "https://demo.awaikenthemes.com/assets/videos/reliva-hero-video-prime.mp4" \
  -o "$ROOT/demo.awaikenthemes.com/assets/videos/reliva-hero-video-prime.mp4" || true

echo
echo "=== COMPLETE ==="
echo "Total files:"
find "$ROOT" -type f | wc -l
