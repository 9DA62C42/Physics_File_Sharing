#!/usr/bin/env python3
"""Build files.json, the list of shared files the website displays.

Run from anywhere:  python3 scripts/build_index.py
Upload dates and contributor names come from git history, so run it
inside a full clone (the GitHub Actions workflow does this for you).
"""
import json
import os
import subprocess
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES_DIR = os.path.join(ROOT, "files")
OUTPUT = os.path.join(ROOT, "files.json")


def hidden(name):
    return name.startswith((".", "_"))


def git_history(rel_path):
    """Return [(author, iso_date), ...] for a file, newest first."""
    try:
        out = subprocess.run(
            ["git", "log", "--follow", "--format=%aN%x09%aI", "--", rel_path],
            cwd=ROOT, capture_output=True, text=True, check=True,
        ).stdout
    except (OSError, subprocess.CalledProcessError):
        return []
    return [tuple(line.split("\t", 1)) for line in out.splitlines() if "\t" in line]


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
            entry = {"path": rel, "size": os.path.getsize(full)}

            history = git_history(rel)
            if history:
                contributors = []
                for author, _ in reversed(history):  # first uploader first
                    if author not in contributors:
                        contributors.append(author)
                entry.update(added=history[-1][1], updated=history[0][1],
                             contributors=contributors)
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
