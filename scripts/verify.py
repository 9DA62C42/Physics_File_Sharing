#!/usr/bin/env python3
"""Record or remove a maintainer verification from a GitHub issue.

Run by .github/workflows/verify.yml when an issue titled "[Verify] ..." or
"[Unverify] ..." is opened (the website's Verify button pre-fills one).
Only the repository owner and collaborators with write access may verify;
everyone else gets a polite refusal.

Reads the issue from environment variables (never from the command line, so
issue text can't inject shell commands):
  ISSUE_TITLE, ISSUE_BODY, ISSUE_USER, ISSUE_NUMBER, GITHUB_REPOSITORY, GITHUB_TOKEN
Writes verifications.json, and the reply text to the file in REPLY_FILE.
Prints "changed=true|false" to GITHUB_OUTPUT.
"""
import hashlib
import json
import os
import re
import sys
import urllib.request
from datetime import datetime, timezone

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RECORDS = os.path.join(ROOT, "verifications.json")
ALLOWED = {"admin", "maintain", "write"}


def permission(repo, user, token):
    """The user's permission on the repository: admin, maintain, write, triage, read or none."""
    req = urllib.request.Request(
        f"https://api.github.com/repos/{repo}/collaborators/{user}/permission",
        headers={"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.load(resp)
    except OSError:
        return "none"
    role = (data.get("user") or {}).get("role_name") or data.get("permission") or "none"
    return role if role in ALLOWED else data.get("permission", "none")


def requested_paths(body):
    """File paths listed in the issue body, one per line (optionally in a code block or bullet list)."""
    paths = []
    for line in (body or "").splitlines():
        line = line.strip().strip("`").lstrip("-* ").strip()
        if line.startswith("files/") and line not in paths:
            paths.append(line)
    return paths


def valid_path(rel):
    full = os.path.normpath(os.path.join(ROOT, rel))
    inside = full.startswith(os.path.join(ROOT, "files") + os.sep)
    hidden = any(p.startswith((".", "_")) for p in rel.split("/"))
    return inside and not hidden and os.path.isfile(full)


def sha256(rel):
    h = hashlib.sha256()
    with open(os.path.join(ROOT, rel), "rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def note_from(body):
    m = re.search(r"^\s*note\s*(?:\(optional\))?\s*:\s*(.+)$", body or "", re.I | re.M)
    note = m.group(1).strip() if m else ""
    return note[:300]


def load():
    try:
        with open(RECORDS, encoding="utf-8") as fh:
            return json.load(fh)
    except (OSError, ValueError):
        return {"records": []}


def save(data):
    with open(RECORDS, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.write("\n")


def main():
    title = os.environ.get("ISSUE_TITLE", "")
    body = os.environ.get("ISSUE_BODY", "")
    user = os.environ.get("ISSUE_USER", "")
    number = int(os.environ.get("ISSUE_NUMBER", "0") or 0)
    repo = os.environ.get("GITHUB_REPOSITORY", "")
    token = os.environ.get("GITHUB_TOKEN", "")
    unverify = title.strip().lower().startswith("[unverify]")

    changed, reply = run(title, body, user, number, repo, token, unverify)

    with open(os.environ.get("REPLY_FILE", "reply.md"), "w", encoding="utf-8") as fh:
        fh.write(reply + "\n")
    out = os.environ.get("GITHUB_OUTPUT")
    if out:
        with open(out, "a", encoding="utf-8") as fh:
            fh.write(f"changed={'true' if changed else 'false'}\n")
    print(reply)


def run(title, body, user, number, repo, token, unverify, perm=None):
    perm = perm or permission(repo, user, token)
    if perm not in ALLOWED:
        return False, (f"Sorry @{user}, only the repository owner and collaborators with write access can "
                       f"verify files (your access: {perm}). Nothing was changed.")

    paths = requested_paths(body)
    good = [p for p in paths if valid_path(p)]
    bad = [p for p in paths if p not in good]
    if not good:
        return False, ("No shared files were found in this issue. List the files to "
                       + ("unverify" if unverify else "verify") + " one per line, each starting with `files/`."
                       + (f"\n\nNot found: " + ", ".join(f"`{p}`" for p in bad) if bad else ""))

    data = load()
    records = data.setdefault("records", [])
    if unverify:
        before = len(records)
        records[:] = [r for r in records if r.get("path") not in good]
        changed = len(records) != before
        lines = [f"- `{p}`" for p in good]
        reply = (f"Removed the verification of {len(good)} file(s) by @{user}:\n" + "\n".join(lines)) if changed \
            else "None of these files were verified, so nothing changed."
    else:
        now = datetime.now(timezone.utc).isoformat(timespec="seconds")
        note = note_from(body)
        lines = []
        for p in good:
            digest = sha256(p)
            records[:] = [r for r in records if r.get("path") != p]
            rec = {"path": p, "sha256": digest, "by": user, "date": now, "issue": number}
            if note:
                rec["note"] = note
            records.append(rec)
            lines.append(f"- `{p}` (SHA-256 `{digest[:12]}…`)")
        records.sort(key=lambda r: r["path"])
        changed = True
        reply = (f"✔ Verified by @{user} ({perm}):\n" + "\n".join(lines)
                 + "\n\nThis confirms the course code, uploader and file name only; it does not check or guarantee the content."
                 + "\n\nThe website shows the badge after the next deploy (about a minute). "
                   "If a file's content changes later, the site flags it for re-checking.")
    if bad:
        reply += "\n\nSkipped (not found): " + ", ".join(f"`{p}`" for p in bad)
    save(data)
    return changed, reply


if __name__ == "__main__":
    sys.exit(main())
