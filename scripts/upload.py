#!/usr/bin/env python3
"""Turn an "[Upload] ..." issue (the Upload form) into files ready for a pull request.

Run by .github/workflows/upload.yml. Reads the issue form, checks the answers,
downloads the attached files into files/<Subject>/<Material>/ under a name
built from the form (with a file ID when all ID boxes are filled), and adds a
licence rule to licenses.json. A new subject gets its folder and is added to
the Subject lists of the issue forms; a new course name goes in courses.json. The workflow then commits the result as the
issue author and opens a pull request for a maintainer to review.

Reads the issue from environment variables (never from the command line, so
issue text can't inject shell commands):
  ISSUE_BODY, ISSUE_NUMBER
Writes the reply text to the file in REPLY_FILE, and to GITHUB_OUTPUT:
  ok=true|false, and when ok, title=<pull request title>.
"""
import json
import os
import re
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = os.path.join(ROOT, "files")
LICENSES = os.path.join(ROOT, "licenses.json")
COURSES = os.path.join(ROOT, "courses.json")
FORMS = os.path.join(ROOT, ".github", "ISSUE_TEMPLATE")
NEW_SUBJECT = "New subject (write it below)"
NAMING = json.load(open(os.path.join(ROOT, "assets", "naming.json"), encoding="utf-8"))

MAX_BYTES = 25 * 1024 * 1024
# Formats GitHub accepts as issue attachments that make sense to share here.
EXTENSIONS = {"pdf", "zip", "txt", "md", "csv", "png", "jpg", "jpeg", "docx", "pptx", "xlsx", "ipynb"}
IMAGE_TYPES = {"image/png": "png", "image/jpeg": "jpg"}
ATTACHMENT = re.compile(
    r"https://github\.com/(?:user-attachments/(?:files/\d+/[^\s)\"'<>]+|assets/[0-9a-f-]{36})"
    r"|[A-Za-z0-9-]+/[A-Za-z0-9._-]+/files/\d+/[^\s)\"'<>]+)")
TITLE_OK = re.compile(r"^[A-Za-z0-9][A-Za-z0-9 .,()&-]*$")
TERM_OK = re.compile(r"^(?:\d{4}[WSAF]|LEGACY|Undated)$")
SUBJECT_OK = re.compile(r"^[A-Za-z][A-Za-z0-9 &,()-]{1,49}$")


def form_fields(body):
    """Answers of an issue form, keyed by question label ("### Label" headings)."""
    fields, label = {}, None
    for line in (body or "").splitlines():
        m = re.match(r"^###\s+(.+?)\s*$", line)
        if m:
            label = m.group(1)
            fields[label] = []
        elif label:
            fields[label].append(line)
    out = {}
    for k, v in fields.items():
        text = "\n".join(v).strip()
        out[k] = "" if text == "_No response_" else text
    return out


def code_of(answer):
    """The code before " · " in a dropdown answer ("LN · Lecture note" -> "LN")."""
    return answer.split("·")[0].strip()


def build_id(course, type_code, term, item, student):
    """The file ID from the four ID boxes, or None when all are empty. Raises ValueError when incomplete or invalid."""
    parts = [course, term, item, student]
    if not any(parts):
        return None
    if not all(parts):
        raise ValueError("To give the file an ID, fill in all four ID boxes (course code, term, item, student number), or leave them all empty.")
    if not re.fullmatch(r"\d{8}", course):
        raise ValueError(f"The course code must have 8 digits (got `{course}`).")
    if not TERM_OK.match(term):
        raise ValueError(f"The term `{term}` isn't valid. Use e.g. 2627W, 2526S, 2526A, LEGACY or Undated.")
    if not re.fullmatch(r"\d{9}", student):
        raise ValueError(f"The student number must have 9 digits (got `{student}`).")
    tokens = item.replace(" ", "").split("_")
    serials = [re.compile(s["pattern"]) for s in NAMING["serials"]]
    if not any(p.match(tokens[0]) for p in serials):
        raise ValueError(f"The item `{tokens[0]}` isn't valid. Use e.g. 01, 01b, A, Q01, PS01, C01 or FULL.")
    version = re.compile(NAMING["version"]["pattern"])
    tags = {t["code"] for t in NAMING["tags"]}
    for tok in tokens[1:]:
        if not (version.match(tok) or tok in tags):
            raise ValueError(f"`{tok}` in the item box isn't a version (V01, V02, ...) or a tag ({', '.join(sorted(tags))}).")
    return "_".join([course, type_code, term, *tokens, student])


def attachments(text):
    """(url, original file name) for each file attached in the Files box, in order."""
    found = []
    for m in ATTACHMENT.finditer(text or ""):
        url = m.group(0)
        if url in (u for u, _ in found):
            continue
        name = url.rsplit("/", 1)[-1] if "/assets/" not in url else ""
        found.append((url, urllib.request.unquote(name)))
    return found


def download(url):
    """(bytes, extension) of one attachment. Raises ValueError for unsupported or oversized files."""
    req = urllib.request.Request(url, headers={"User-Agent": "physics-file-sharing-upload"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        ctype = (resp.headers.get("Content-Type") or "").split(";")[0].strip().lower()
        data = resp.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise ValueError("is larger than 25 MB")
    name = url.rsplit("/", 1)[-1]
    ext = IMAGE_TYPES.get(ctype) if "/assets/" in url else (name.rsplit(".", 1)[-1].lower() if "." in name else "")
    if ext == "jpeg":
        ext = "jpg"
    if ext not in EXTENSIONS:
        raise ValueError(f"has a file type that isn't accepted (.{ext or '?'}); accepted: {', '.join(sorted(EXTENSIONS))}")
    if ext == "pdf" and not data.startswith(b"%PDF"):
        raise ValueError("isn't a valid PDF")
    if ext in ("zip", "docx", "pptx", "xlsx") and not data.startswith(b"PK"):
        raise ValueError(f"isn't a valid .{ext} file")
    return data, ext


def clean_words(text):
    words = re.sub(r"[^A-Za-z0-9 .,()&-]+", " ", text)
    return re.sub(r"\s+", " ", words).strip(" .")


def target_names(base, exts, originals):
    """File names for the attachments: the first PDF (or the first file) gets the base name, the rest get a suffix."""
    lead = exts.index("pdf") if "pdf" in exts else 0
    names, used = [None] * len(exts), set()
    for i in [lead] + [j for j in range(len(exts)) if j != lead]:
        if i == lead:
            stem = base
        elif exts[i] == "zip":
            stem = f"{base} Source"
        else:
            extra = clean_words(os.path.splitext(originals[i])[0]) or "File"
            stem = f"{base} {extra}"
        name, n = f"{stem}.{exts[i]}", 2
        while name.lower() in used:
            name, n = f"{stem} {n}.{exts[i]}", n + 1
        used.add(name.lower())
        names[i] = name
    return names


def subjects():
    return sorted(d for d in os.listdir(FILES) if os.path.isdir(os.path.join(FILES, d)) and not d.startswith((".", "_")))


def choose_subject(answer, new_name):
    """(folder name, is new) for the Subject answers. Raises ValueError when the choice is unusable."""
    existing = subjects()
    if answer != NEW_SUBJECT:
        # The lists show folder names with spaces ("Quantum Mechanics" is files/Quantum-Mechanics).
        match = [d for d in existing if d.replace("-", " ") == answer]
        if not match:
            raise ValueError("Choose a **Subject** from the list.")
        return match[0], False
    name = clean_words(new_name)
    if not name or not SUBJECT_OK.match(name):
        raise ValueError("Write the **New subject** name (letters, numbers, spaces and & , - ( ) only, up to 50 characters).")
    folder = name.replace(" ", "-")
    same = [d for d in existing if d.replace("-", " ").lower() == name.lower()]
    return (same[0], False) if same else (folder, True)


def add_subject_to_forms(folder):
    """Add a new subject to the Subject dropdown of each issue form that has one, before its last ("other") option."""
    label = folder.replace("-", " ")
    for name in sorted(os.listdir(FORMS)):
        path = os.path.join(FORMS, name)
        if not name.endswith(".yml"):
            continue
        lines = open(path, encoding="utf-8").read().split("\n")
        try:
            start = lines.index("    id: subject")
        except ValueError:
            continue
        opts = [i for i in range(start, len(lines)) if lines[i].startswith("        - ")]
        block = []
        for i in opts:
            if block and i != block[-1] + 1:
                break
            block.append(i)
        if not block or f"        - {label}" in (lines[i] for i in block):
            continue
        lines.insert(block[-1], f"        - {label}")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write("\n".join(lines))


def add_course(code, name):
    """Add a course name to courses.json if the code has none yet. Returns True when added."""
    with open(COURSES, encoding="utf-8") as fh:
        data = json.load(fh)
    courses = data.setdefault("courses", {})
    if code in courses or not name:
        return False
    courses[code] = name
    data["courses"] = dict(sorted(courses.items()))
    with open(COURSES, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.write("\n")
    return True


def existing_ids():
    ids = set()
    for _, _, names in os.walk(FILES):
        for name in names:
            first = name.split(" ", 1)[0]
            if "_" in first:
                ids.add(os.path.splitext(first)[0])
    return ids


def add_license(file_id, paths, code):
    with open(LICENSES, encoding="utf-8") as fh:
        data = json.load(fh)
    rules = data.setdefault("rules", [])
    if file_id:
        rules.append({"id": file_id, "license": code})
    else:
        rules.extend({"path": p, "license": code} for p in paths)
    with open(LICENSES, "w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)
        fh.write("\n")


def run(body):
    """Returns (ok, reply, pull request title)."""
    f = form_fields(body)
    problems = []
    title = clean_words(f.get("Title", ""))
    if not title or not TITLE_OK.match(title):
        problems.append("Add a **Title** (letters, numbers, spaces and . , - ( ) & only).")
    subject, new_subject = None, False
    try:
        subject, new_subject = choose_subject(f.get("Subject", ""), f.get("New subject", ""))
    except ValueError as e:
        problems.append(str(e))
    course_name = clean_words(f.get("Course name", ""))[:60]
    types = {t["code"]: t for t in NAMING["types"]}
    type_code = code_of(f.get("Kind of material", ""))
    if type_code not in types:
        problems.append("Choose the **Kind of material**.")
    licences = {l["code"] for l in NAMING["licenses"]}
    lic = code_of(f.get("Licence", ""))
    if lic not in licences:
        problems.append("Choose a **Licence**.")
    file_id = None
    try:
        if type_code in types:
            file_id = build_id(f.get("Course code", "").strip(), type_code, f.get("Term", "").strip(),
                               f.get("Item", "").strip(), f.get("Student number", "").strip())
    except ValueError as e:
        problems.append(str(e))
    if file_id and file_id in existing_ids():
        problems.append(f"The ID `{file_id}` is already used by another file. Change the item number, or add a version such as `_V02`.")
    found = attachments(f.get("Files", ""))
    if not found:
        problems.append("Attach at least one file in the **Files** box (drag it in and wait until it shows as a link).")
    if len(found) > 10:
        problems.append("Attach at most 10 files per upload.")
    if problems:
        return False, problems, None

    downloads = []
    for url, original in found:
        label = original or "an image"
        try:
            data, ext = download(url)
        except ValueError as e:
            problems.append(f"`{label}` {e}.")
            continue
        except OSError:
            problems.append(f"`{label}` couldn't be downloaded. Try attaching it again.")
            continue
        downloads.append((data, ext, original))
    if problems:
        return False, problems, None

    category = types[type_code]["category"]
    base = f"{file_id} {title}" if file_id else title
    names = target_names(base, [d[1] for d in downloads], [d[2] for d in downloads])
    folder = os.path.join(FILES, subject, category)
    paths = []
    for (data, _, _), name in zip(downloads, names):
        full = os.path.join(folder, name)
        if os.path.exists(full):
            return False, [f"A file called `{name}` already exists in {subject}/{category}. Choose another title."], None
        paths.append(os.path.relpath(full, ROOT).replace(os.sep, "/"))
    os.makedirs(folder, exist_ok=True)
    for (data, _, _), path in zip(downloads, paths):
        with open(os.path.join(ROOT, path), "wb") as fh:
            fh.write(data)
    add_license(file_id, paths, lic)
    notes = []
    if new_subject:
        add_subject_to_forms(subject)
        notes.append(f"New subject: **{subject.replace('-', ' ')}**")
    if file_id:
        code = file_id[:8]
        if add_course(code, course_name):
            notes.append(f"New course: **{code} · {course_name}**")
        else:
            with open(COURSES, encoding="utf-8") as fh:
                if code not in json.load(fh).get("courses", {}):
                    notes.append(f"Course {code} has no name yet; a maintainer can add it.")

    lines = [f"- `{p}`" for p in paths]
    reply = ["Thanks! Your upload is ready for review:", *lines, "",
             f"Licence: **{lic}**" + (f" · ID: `{file_id}`" if file_id else " · no file ID"), *notes, ""]
    return True, reply, f"Add {title}"


def main():
    body = os.environ.get("ISSUE_BODY", "")
    ok, lines, pr_title = run(body)
    if ok:
        reply = "\n".join(lines)
    else:
        reply = ("Your upload couldn't be prepared yet:\n\n" + "\n".join(f"- {p}" for p in lines)
                 + "\n\nEdit this issue (··· → **Edit**) to fix it, and the check runs again.")
    with open(os.environ.get("REPLY_FILE", "reply.md"), "w", encoding="utf-8") as fh:
        fh.write(reply + "\n")
    out = os.environ.get("GITHUB_OUTPUT")
    if out:
        with open(out, "a", encoding="utf-8") as fh:
            fh.write(f"ok={'true' if ok else 'false'}\n")
            if ok:
                fh.write(f"title={pr_title}\n")
    print(reply)


if __name__ == "__main__":
    main()
