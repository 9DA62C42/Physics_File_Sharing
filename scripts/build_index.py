#!/usr/bin/env python3
"""Build files.json, the list of shared files the website displays.

Run from anywhere:  python3 scripts/build_index.py
Upload dates and uploaders come from git history, so run it inside a full
clone (the GitHub Actions workflow does this for you).

For each file it records who uploaded it (the author of the commit that
added it). In GitHub Actions the commit is looked up through the GitHub API
to get the uploader's GitHub username, which the website compares with the
GitHub account registered for the student number in the file name (if any). It also stores a SHA-256 hash so the site
can spot duplicate files, and any licence notice
("SPDX-License-Identifier: CC-BY-4.0") found near the top of a text file.
"""
import hashlib
import json
import os
import re
import subprocess
import urllib.request
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES_DIR = os.path.join(ROOT, "files")
OUTPUT = os.path.join(ROOT, "files.json")
SPDX = re.compile(rb"SPDX-License-Identifier:\s*([A-Za-z0-9.+-]+)")
TEXT_EXT = {".txt", ".md", ".tex", ".bib", ".py", ".m", ".jl", ".c", ".cpp", ".h", ".f90", ".js", ".r", ".sh", ".csv", ".dat", ".json", ".ipynb"}
NOREPLY = re.compile(r"^(?:\d+\+)?([A-Za-z0-9-]+)@users\.noreply\.github\.com$", re.I)

# Commits by automation (the AI assistant that maintains the site, GitHub bots) are never
# credited as an uploader or editor. Files they add on someone's behalf are attributed
# in uploads.json instead.
BOT_EMAILS = {"noreply@anthropic.com"}


def is_bot(name, email):
    return email.lower() in BOT_EMAILS or name.endswith("[bot]") or email.lower().endswith("[bot]@users.noreply.github.com")


REPO = os.environ.get("GITHUB_REPOSITORY")
TOKEN = os.environ.get("GITHUB_TOKEN")
_login_cache = {}


def hidden(name):
    return name.startswith((".", "_"))


def git_history(rel_path):
    """Return [(sha, name, email, iso_date), ...] for a file, newest first.

    Follows renames, but stops at the commit that created the file: git's
    --follow also treats an identical copy (status C) as the same file, which
    would credit a duplicate to whoever uploaded the original.
    """
    try:
        out = subprocess.run(
            ["git", "log", "--follow", "--name-status", "-z",
             "--format=%x01%H%x09%aN%x09%aE%x09%aI", "--", rel_path],
            cwd=ROOT, capture_output=True, text=True, check=True,
        ).stdout
    except (OSError, subprocess.CalledProcessError):
        return []
    commits = []
    for record in out.split("\x01")[1:]:
        header, _, changes = record.partition("\0")
        fields = header.strip().split("\t", 3)
        if len(fields) != 4:
            continue
        commits.append(tuple(fields))
        status = changes.lstrip("\n").split("\0", 1)[0]
        if status[:1] in ("A", "C"):
            break
    return commits


def github_login(sha, email):
    """GitHub username of a commit's author, or None if it can't be told."""
    m = NOREPLY.match(email)
    if m:
        return m.group(1)
    if email in _login_cache:
        return _login_cache[email]
    login = None
    if REPO and TOKEN:
        req = urllib.request.Request(
            f"https://api.github.com/repos/{REPO}/commits/{sha}",
            headers={"Authorization": f"Bearer {TOKEN}", "Accept": "application/vnd.github+json"})
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                login = (json.load(resp).get("author") or {}).get("login")
        except (OSError, ValueError):
            login = None
    _login_cache[email] = login  # emails are only used here, never published
    return login


def sha256(path):
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def spdx_license(path):
    """Licence identifier declared near the top of a text file, if any."""
    if os.path.splitext(path)[1].lower() not in TEXT_EXT:
        return None
    with open(path, "rb") as fh:
        m = SPDX.search(fh.read(8192))
    return m.group(1).decode() if m else None


def main():
    subjects = sorted(
        d for d in os.listdir(FILES_DIR)
        if os.path.isdir(os.path.join(FILES_DIR, d)) and not hidden(d)
    )

    files = []
    for dirpath, dirnames, filenames in os.walk(FILES_DIR):
        dirnames[:] = sorted(d for d in dirnames if not hidden(d))
        for name in sorted(filenames):
            if hidden(name):
                continue
            full = os.path.join(dirpath, name)
            rel = os.path.relpath(full, ROOT).replace(os.sep, "/")
            entry = {"path": rel, "size": os.path.getsize(full), "sha256": sha256(full)}
            spdx = spdx_license(full)
            if spdx:
                entry["spdx"] = spdx

            history = git_history(rel)
            if history:
                contributors = []
                for _, author, email, _ in reversed(history):  # first uploader first
                    if author not in contributors and not is_bot(author, email):
                        contributors.append(author)
                first_sha, first_name, first_email, added = history[-1]
                entry.update(added=added, updated=history[0][3], contributors=contributors)
                if not is_bot(first_name, first_email):
                    uploader = {"name": first_name}
                    login = github_login(first_sha, first_email)
                    if login:
                        uploader["login"] = login
                    entry["uploader"] = uploader
            files.append(entry)

    data = {
        "generated": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "subjects": subjects,
        "files": files,
    }
    with open(OUTPUT, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=1)
    print(f"Indexed {len(files)} files in {len(subjects)} subjects -> files.json")


if __name__ == "__main__":
    main()
