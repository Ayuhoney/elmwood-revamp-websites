#!/usr/bin/env python3
import os
import re
import subprocess
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote

ROOT = Path.cwd()
BASE = "https://html.awaikenthemes.com/reliva/"

EXTS = (
    ".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico",
    ".css", ".js", ".woff", ".woff2", ".ttf", ".otf", ".mp4", ".webm"
)

def refs_from_text(text):
    refs = set()

    # src/href/data-src/poster/etc.
    for m in re.finditer(
        r'''(?:src|href|data-src|data-lazy-src|poster|data-background-image)\s*=\s*["']([^"']+)["']''',
        text,
        re.I,
    ):
        refs.add(m.group(1).strip())

    # CSS url(...)
    for m in re.finditer(r'''url\(\s*["']?([^"')]+)["']?\s*\)''', text, re.I):
        refs.add(m.group(1).strip())

    # Any absolute URLs in source
    for m in re.finditer(r'''https?://[^"' <>)]+''', text, re.I):
        refs.add(m.group(0).strip())

    return refs

def local_source_url(file_path):
    rel = file_path.relative_to(ROOT).as_posix()
    return urljoin(BASE, rel)

def should_download(url):
    p = urlparse(url)
    return (
        p.netloc == "html.awaikenthemes.com"
        and p.path.startswith("/reliva/")
        and p.path.lower().endswith(EXTS)
    )

downloaded = 0
skipped = 0
failed = 0
seen = set()

files = list(ROOT.rglob("*.html")) + list(ROOT.rglob("*.css")) + list(ROOT.rglob("*.js"))

for file_path in files:
    try:
        text = file_path.read_text(errors="ignore")
    except Exception:
        continue

    source_url = local_source_url(file_path)

    for ref in refs_from_text(text):
        if not ref or ref.startswith(("#", "data:", "mailto:", "tel:", "javascript:")):
            continue

        url = urljoin(source_url, ref)

        if not should_download(url):
            continue

        if url in seen:
            continue
        seen.add(url)

        parsed = urlparse(url)
        rel = unquote(parsed.path[len("/reliva/"):])
        dest = ROOT / rel

        if dest.exists() and dest.stat().st_size > 0:
            skipped += 1
            continue

        dest.parent.mkdir(parents=True, exist_ok=True)

        print(f"DOWNLOADING: {url}")
        result = subprocess.run(
            [
                "curl", "-L", "--fail",
                "--retry", "3",
                "--connect-timeout", "15",
                "--max-time", "90",
                url,
                "-o", str(dest),
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )

        if result.returncode == 0 and dest.exists() and dest.stat().st_size > 0:
            downloaded += 1
        else:
            failed += 1
            if dest.exists():
                dest.unlink()

print()
print("================================")
print(f"Downloaded : {downloaded}")
print(f"Already OK : {skipped}")
print(f"Failed     : {failed}")
print("================================")
