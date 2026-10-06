#!/usr/bin/env python3
"""Local static server with HTTP Range support (needed for <video> playback)."""

from __future__ import annotations

import argparse
import os
import re
import socketserver
from http.server import SimpleHTTPRequestHandler
from pathlib import Path

ROOT = Path(__file__).resolve().parent
RANGE_RE = re.compile(r"bytes=(\d*)-(\d*)")


class RangeRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

    def send_head(self):
        path = Path(self.translate_path(self.path))
        if path.is_dir():
            return super().send_head()
        if not path.is_file():
            self.send_error(404, "File not found")
            return None

        file_size = path.stat().st_size
        content_type = self.guess_type(str(path))
        range_header = self.headers.get("Range")

        if not range_header:
            self.send_response(200)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(file_size))
            self.send_header("Last-Modified", self.date_time_string(path.stat().st_mtime))
            self.end_headers()
            return path.open("rb")

        match = RANGE_RE.fullmatch(range_header.strip())
        if not match:
            self.send_error(400, "Invalid Range")
            return None

        start_s, end_s = match.groups()
        start = int(start_s) if start_s else 0
        end = int(end_s) if end_s else file_size - 1
        end = min(end, file_size - 1)

        if start >= file_size or start > end:
            self.send_error(416, "Requested Range Not Satisfiable")
            self.send_header("Content-Range", f"bytes */{file_size}")
            self.end_headers()
            return None

        length = end - start + 1
        self.send_response(206)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
        self.send_header("Content-Length", str(length))
        self.send_header("Last-Modified", self.date_time_string(path.stat().st_mtime))
        self.end_headers()

        fh = path.open("rb")
        fh.seek(start)
        # Limit reads via a wrapper-ish approach in copyfile by truncating below
        self._range_length = length
        return fh

    def copyfile(self, source, outputfile):
        remaining = getattr(self, "_range_length", None)
        if remaining is None:
            return super().copyfile(source, outputfile)

        bufsize = 64 * 1024
        while remaining > 0:
            chunk = source.read(min(bufsize, remaining))
            if not chunk:
                break
            outputfile.write(chunk)
            remaining -= len(chunk)
        self._range_length = None


class ReusableTCPServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True


def main():
    parser = argparse.ArgumentParser(description="Serve Elemwood with video Range support")
    parser.add_argument("--port", type=int, default=8080)
    args = parser.parse_args()

    os.chdir(ROOT)
    with ReusableTCPServer(("", args.port), RangeRequestHandler) as httpd:
        print(f"Serving Elemwood at http://localhost:{args.port}/")
        print("Press Ctrl+C to stop")
        httpd.serve_forever()


if __name__ == "__main__":
    main()
