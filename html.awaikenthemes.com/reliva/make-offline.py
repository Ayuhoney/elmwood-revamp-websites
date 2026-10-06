from pathlib import Path
from urllib.parse import urlparse
import re, os

ROOT = Path.cwd()

# Backup HTML/CSS before changing anything
backup = ROOT / "_backup_before_offline"
backup.mkdir(exist_ok=True)

for f in list(ROOT.glob("*.html")) + list(ROOT.glob("*.css")):
    target = backup / f.name
    if not target.exists():
        target.write_bytes(f.read_bytes())

def local_path_for(file_path, url):
    """
    Convert known local website URLs into a relative path
    from the current HTML/CSS file.
    """
    p = urlparse(url)
    path = p.path

    # Reliva original files
    prefix = "/reliva/"
    if p.netloc == "html.awaikenthemes.com" and path.startswith(prefix):
        rel_target = path[len(prefix):]
        target = ROOT / rel_target
        if target.exists():
            return os.path.relpath(target, file_path.parent).replace(os.sep, "/")
        return None

    # Google fonts already copied into local website
    if p.netloc == "fonts.gstatic.com" and path.startswith("/s/"):
        rel_target = "fonts.gstatic.com" + path
        target = ROOT / rel_target
        if target.exists():
            return os.path.relpath(target, file_path.parent).replace(os.sep, "/")
        return None

    # Demo hero video already copied locally
    if p.netloc == "demo.awaikenthemes.com" and "/assets/videos/" in path:
        target = ROOT / "images/hero-bg-video.mp4"
        if target.exists():
            return os.path.relpath(target, file_path.parent).replace(os.sep, "/")
        return None

    return None

def process_file(file_path):
    s = file_path.read_text(errors="ignore")

    # Convert known local absolute URLs anywhere in HTML/CSS
    url_pattern = re.compile(r'https?://(?:html\.awaikenthemes\.com|fonts\.gstatic\.com|demo\.awaikenthemes\.com)[^"\'\s<>()]+')

    def replace_url(m):
        original = m.group(0)
        local = local_path_for(file_path, original)
        return local if local else original

    s = url_pattern.sub(replace_url, s)

    # Remove Google Fonts preconnects
    s = re.sub(
        r'\s*<link[^>]+rel=["\']preconnect["\'][^>]+fonts\.googleapis\.com["\'][^>]*>\s*',
        '\n',
        s,
        flags=re.I
    )
    s = re.sub(
        r'\s*<link[^>]+rel=["\']preconnect["\'][^>]+fonts\.gstatic\.com["\'][^>]*>\s*',
        '\n',
        s,
        flags=re.I
    )

    # Remove external demo theme-panel script completely
    s = re.sub(
        r'\s*<script[^>]+src=["\']https?://demo\.awaikenthemes\.com/assets/js/theme-panel-dynamic\.js["\'][^>]*>\s*</script>',
        '\n',
        s,
        flags=re.I
    )

    # Any remaining YouTube popup links -> offline/no navigation
    s = re.sub(
        r'https://www\.youtube\.com/watch\?v=[^"\']+',
        '#',
        s,
        flags=re.I
    )

    # Google Maps iframe cannot work offline
    s = re.sub(
        r'(<iframe[^>]+src=["\'])https://www\.google\.com/maps/embed\?[^"\']+(["\'])',
        r'\1about:blank\2',
        s,
        flags=re.I
    )

    file_path.write_text(s)

for f in list(ROOT.glob("*.html")) + list(ROOT.glob("*.css")):
    process_file(f)

# Ensure every HTML page uses local fonts.css
for f in ROOT.glob("*.html"):
    s = f.read_text(errors="ignore")
    s = re.sub(
        r'<link[^>]+href=["\'](?:[^"\']*fonts\.googleapis\.com[^"\']*|[^"\']*fonts\.css)["\'][^>]*>',
        '<link href="fonts.css" rel="stylesheet">',
        s,
        flags=re.I
    )
    f.write_text(s)

print("OFFLINE CONVERSION COMPLETE")
