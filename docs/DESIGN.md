# Course File Sharing: design

A complete description of how the website, its data and its automation work, for anyone (person or AI agent) who maintains it or prepares files for it.

- **Live site:** https://9da62c42.github.io/Physics_File_Sharing/
- **Repository:** https://github.com/9DA62C42/Physics_File_Sharing (public, default branch `main`)
- **Owner:** GitHub `9DA62C42` (Xiangjun Liu, student number 800015240)
- **Version:** see `assets/js/changelog.js` (shown on the site's Changelog page)

---

## 1. What it is

A free, static website on **GitHub Pages** where students share notes, solutions, past exams and other course files, for **any course** (it started with physics). Everything lives in one public GitHub repository:

- the shared files, under `files/`;
- a few small JSON registries (uploaders, courses, licences, on-behalf uploads);
- the website code (plain HTML, CSS and JavaScript, no build step, no framework);
- GitHub Actions workflows that build the file index, deploy the site, and turn GitHub issues into uploads and verifications.

There is **no server and no database**. Anything "dynamic" is either computed in the browser or done by GitHub Actions.

---

## 2. Repository layout

```
files/<Subject>/<Material>/<file>     shared files (the library)
index.html                            page shell: sidebar, top bar, main view, footer
assets/css/style.css                  all styles: tokens, themes, accents, components
assets/js/config.js                   site title, description, owner/repo/branch
assets/js/app.js                      the single-page app (routing, views, logic)
assets/js/help.js                     Help & guide text in 6 languages
assets/js/changelog.js                Changelog page entries (newest first)
assets/js/data.js                     Resources list (Study tools)
assets/naming.json                    the ID system: types, terms, items, tags, licences
uploaders.json                        registered students (number, name, GitHub)
courses.json                          course names for 8-digit course codes
licenses.json                         licence of each file (by ID or path)
uploads.json                          "uploaded on behalf of" rules
scripts/build_index.py                builds files.json from files/ and git history
scripts/upload.py                     upload-form bot: checks the form, names and files uploads
scripts/verify.py                     verify bot: records maintainer verifications
.github/workflows/pages.yml           build + deploy the site on every push to main
.github/workflows/upload.yml          upload form issue -> pull request
.github/workflows/verify.yml          verify/unverify issue -> verifications branch
.github/ISSUE_TEMPLATE/*.yml          issue forms: upload, register, request, report
README.md, CONTENT-LICENSE.md, LICENSE
docs/DESIGN.md                        this document
```

Generated, not committed: `files.json` (built at deploy time).
On its own branch: `verifications.json` lives on the **`verifications`** branch (see §7.3).

---

## 3. The library: folders and file names

### 3.1 Folders

```
files/<Subject>/<Material>/<file name>
```

- **Subject**: a folder directly under `files/`, e.g. `Waves`, `Mathematics`, `Physical-Mathematics`, `Quantum-Physics`. Use hyphens for spaces; the site shows `Physical-Mathematics` as "Physical Mathematics". A subject appears in the sidebar as soon as its folder exists (keep an empty `.gitkeep` to show an empty subject).
- **Material**: a folder named after the material *category* of the file's type (see §4.2): `Notes`, `Homework`, `Past Exams`, `Review Material`, `Lecture`, `Tutorial`, `Workshop`, `Lab`, `Syllabus`, `Textbook`. The upload bot picks this from the type code.
- Hidden names (starting with `.` or `_`) are ignored by the site.

Current library (example):

```
files/Mathematics/Notes/01040016_LN_2526W_FULL_V1_800015240 Mono-color Note for Algebra 1E.pdf
files/Physical-Mathematics/Notes/01040034_LN_2627W_FULL_V4.1_800012999 Introduction to Probability H.pdf
files/Physical-Mathematics/Notes/01040215_LN_2627W_FULL_V4.1_800012999 Complex Functions A LN.pdf
files/Quantum-Physics/Notes/01270004_LN_2526A_FULL_V1.0_999028434 Recap and Simulation Results.pdf
files/Waves/Notes/01140086_LN_1617F_FULL_800015240 Vibrations and Waves Lecture Notes.pdf
files/Waves/Notes/01140086_LN_2627W_FULL_V4.1_800012999 Waves.pdf
```

### 3.2 File name = ID + space + title + extension

```
<ID> <Title>.<ext>
01140086_HWS_2627W_01_123456789 Waves Homework 1 Solution.pdf
```

- Everything **before the first space** is the ID; everything after it (minus the extension) is the human-readable title.
- IDs are **recommended, not required**. A file without an ID (just `Title.pdf`) still works; it simply has no course, term or uploader fields.
- The **licence is never part of the file name** (it lives in `licenses.json`).
- Files with the **same folder and same ID** (or the same base name) are **one item** on the site: e.g. `ID Title.pdf` plus `ID Title Source.zip`. The PDF leads; other formats appear as "Also:" downloads.

---

## 4. The ID system

Defined in `assets/naming.json` (the single source of truth; the site, the bot and Help read it). Based on the GTIIT course-file convention.

```
<course>_<TYPE>_<term>_<item>[_<version>][_<TAG>…]_<student number>
01140086 _ HWS  _ 2627W _ 01  [_V2]       [_AN]     _ 123456789
```

### 4.1 Course

8 digits, e.g. `01140086`. A 6-digit shorthand (`114086`) is expanded to 8 digits by the website. Names come from `courses.json`:

```json
{ "courses": { "01040016": "Algebra 1 Extended", "01040034": "Introduction to Probability H",
               "01040215": "Complex Functions A", "01140086": "Waves" } }
```

### 4.2 Type (24 codes)

| Code | Meaning | Category (folder) | Written by |
|---|---|---|---|
| HWQ / HWS / HWA | Homework question / solution / answer | Homework | School / Student / School |
| PEQ / PES / PEA | Past exam question / solution / answer | Past Exams | School / Student / School |
| MEQ / MES / MEA | Mock exam question / solution / answer | Review Material | School / Student / School |
| SY | Syllabus | Syllabus | School |
| XT | Textbook | Textbook | Published |
| LP | Lecture paper / handout | Lecture | School |
| LN | Lecture note | Notes | Student |
| LS | Lecture scan / board photo | Lecture | Scan |
| TP / TN / TS / TSS | Tutorial paper / note / solution / scan | Tutorial | School / Student / School / Scan |
| WSP / WSN / WSS | Workshop paper / note / scan | Workshop | School / Student / Scan |
| LBP / LBD / LBR | Lab paper / data / report | Lab | School / Student / Student |

### 4.3 Term

`YYYY` academic-year pair plus a season letter:

| Letter | Season | Year rule | Example |
|---|---|---|---|
| W | Winter | start year | `2627W` = Winter 2026–27 |
| S | Spring | end year | `2526S` = Spring 2026 |
| A | Summer (Addition) | end year | `2526A` = Summer 2026 |
| F | Fall (external courses only) | start year | `1617F` = Fall 2016 |

Placeholders: `LEGACY` (old mixed-year material), `Undated`. Textbooks (`XT`) have no term.

### 4.4 Item

| Pattern | Kind | Example |
|---|---|---|
| `\d{2,}` | serial | `01` |
| `\d{2,}b` | supplement | `01b` |
| `[A-Z]` | exam paper | `A` |
| `Q\d{2,}b?` | quiz | `Q01` |
| `CA\d{2,}b?` | class assignment | `CA01` |
| `PS\d{2,}b?` | problem set | `PS01` |
| `P\d{2,}b?` | project | `P02` |
| `C\d{2,}b?` | chapter | `C01` |
| `FULL` | complete notes for the course | `FULL` |

### 4.5 Version (optional)

`V` followed by numbers, optionally dotted: `V1`, `V02`, `V4.1`, `V2.0.3` (pattern `^V\d+(?:\.\d+)*$`). A dot in the version is part of the ID, not the extension.

### 4.6 Tags (optional, any order after the version)

`AN` annotated (a printout you wrote on), `DR` draft, `GR` graded (has grader marks).

### 4.7 Student number (uploader ID)

9 digits, always **last** in the ID. It says who shared/credits the file. It is **public**. It works without registering; registering (`uploaders.json`) shows a name instead of "Student 123456789".

### 4.8 Examples

```
01140086_LN_2627W_FULL_V4.1_800012999 Waves.pdf               complete lecture notes, version 4.1
01140086_HWS_2627W_01_123456789 Waves Homework 1 Solution.pdf  homework 1 solution
01140086_PEQ_2526W_A_123456789 Waves Exam A.pdf                past exam paper A
01140086_HWS_2627W_01_V2_AN_123456789 Waves HW1 annotated.pdf  version 2, annotated
```

Two files must not share the same ID unless they are the same item in different formats (PDF + source).

---

## 5. Data registries

All are JSON in the repository root, edited by hand or by the upload bot (through a pull request).

| File | Shape | Purpose |
|---|---|---|
| `uploaders.json` | `{"uploaders":[{"id":"800012999","name":"Shang Wu","github":"wu2934105597-collab"}]}` | Registered students. `github` (optional) links an account: uploads from it show "✔ confirmed". |
| `courses.json` | `{"courses":{"01140086":"Waves"}}` | Course names. |
| `licenses.json` | `{"rules":[{"id":"01140086_LN_2627W_FULL_V4.1_800012999","license":"ARR"}, {"path":"files/X/Y/name.pdf","license":"CCBY"}]}` | Licence per file. `id` (a full ID or its start), or `path` (a file, or a folder ending in `/`). Most specific match wins. No rule = "no licence stated". |
| `uploads.json` | `{"rules":[{"id":"…","uploadedBy":"800015240"}]}` | When someone uploads on another student's behalf: shows "uploaded by X on behalf of Y". |
| `verifications.json` (branch `verifications`) | `{"records":[{"path":"files/…","sha256":"…","by":"9DA62C42","date":"…","issue":27}]}` | Maintainer verifications. Written by the verify bot only. |
| `files.json` (generated) | `{"generated":…,"subjects":[…],"files":[{"path","size","sha256","added","updated","contributors","uploader":{"name","login"}}]}` | File index built at deploy time. |

### 5.1 Licence codes

`CC0`, `PD` (public domain), `CCBY`, `CCBYSA`, `CCBYNC`, `CCBYNCSA`, `CCBYND`, `CCBYNCND`, `MIT`, `GPL3` (software), `STUDY` (shared with permission, for study only), `ARR` (all rights reserved). Only the author may choose an open licence; course material keeps its owner's terms. The site explains each code in plain words (share / adapt / commercial / credit / share-alike).

---

## 6. The website

### 6.1 Technology

- One page (`index.html`) plus scripts loaded in order: `config.js`, `data.js`, `help.js`, `changelog.js`, `app.js`.
- **Hash routing**: `#/route/arg?params`. Views are functions in `VIEWS` that return DOM, built with a small `h(tag, attrs, ...children)` helper (no `innerHTML` except trusted icon SVGs).
- **Data loading** at start: `files.json`, `assets/naming.json`, `uploaders.json`, `courses.json`, `licenses.json`, `uploads.json`, `verifications.json`. If `files.json` is missing (Pages not deployed by Actions), it falls back to the GitHub API listing.
- **Files are not copied into the site.** Downloads link straight to `https://raw.githubusercontent.com/<owner>/<repo>/main/<path>`. Because that server sends everything as a plain download, previews and "New tab" fetch the file into a blob with the right type. So GitHub Pages' 1 GB site limit does not apply to the library (only repository limits: ~1 GB recommended, 100 MB per file, 25 MB through the upload form).
- Per-browser settings in `localStorage` (prefix `pfs:`): theme, accent, layout, favourites, Help language, builder answers, grade calculator, timer settings.
- The deploy appends `?v=<commit>` to CSS/JS links so browsers never use stale copies.

### 6.2 Layout

- **Sidebar** (left, collapses to a ☰ drawer on phones). Sections fold; state remembered.
  - Help & guide · Maintainer guide · Changelog (with latest version badge)
  - **Library:** Home, All files, Recently added, Favorites, ID system
  - **Subjects** (heading opens the Subjects overview), **Courses**, **Material** (same)
  - **Community:** Uploaders, File requests, How to contribute
  - **Study tools:** Grade calculator, Study timer, Resources
  - GitHub repository link
  - Bottom: **Theme** list and **Accent** list
- **Top bar:** search (press `/`), **Upload** button (goes to How to contribute).
- **Main view**, centred, max 1280 px wide. **Footer:** licence links, Copyright and takedown, Report a file.

### 6.3 Pages (routes)

| Route | Page |
|---|---|
| `#/` | Home: "New here? Read Help" + short copyright reminder (one row), hero with search, stats, Recently added, Browse by subject, Study tools tiles |
| `#/browse`, `#/recent`, `#/favorites` | File lists with filters (material, term, licence, verification, format), sort, grid/list view |
| `#/subjects`, `#/subject/<name>` | Subjects overview / one subject |
| `#/courses`, `#/course/<code>` | Courses overview (with an items-per-course dot chart) / one course |
| `#/materials`, `#/material/<category>` | Material overview / one category |
| `#/file/<path>` | Opens a file preview directly (shareable link) |
| `#/uploaders`, `#/u/<number or @login>` | Uploaders table / one person's files |
| `#/requests` | Open file requests (issues labelled `file-request`) |
| `#/contribute` | How to contribute: the guided upload (§7.1) |
| `#/ids?tab=…` | ID system tabs, in order: **Uploader IDs** (`codes`, default), **Look up**, **Build a name**, **Reference** (`rules`), **Check files** |
| `#/grades`, `#/timer`, `#/resources` | Study tools |
| `#/help/<lang>[?part=admin]` | Help & guide: Student guide / Maintainer guide, in en, he (right-to-left), zh, es, fr, de |
| `#/changelog` | What's new |

### 6.4 File card and preview

- **Card:** type badge (PDF…), material code (LN…), licence badge, Verified badge; title; "Lecture note · 01140086 · Waves"; coloured ID; uploader line ("✓ Shang Wu · 800012999", or "uploaded by X on behalf of Y"); term · size · date (pieces wrap between each other, never inside); "Also:" source files; Preview, Download, copy link; favourite star.
- **List view:** a fixed badge column, then title / ID and subject / details on single lines (cut with "…" if long), then the buttons.
- **Preview** (modal): PDF, image, video, text and code inside the site; Office files via Office's online viewer; notebooks via nbviewer/Colab. Side panel: Download, New tab, Link, GitHub, History; Files in this item; **Verification**; ID breakdown; Uploader; **Licence** in plain words; **Problem with this file? → Report this file**; same-item and identical-copy lists; file info.

### 6.5 Uploader identity

- The **student number in the ID** is whom the file belongs to.
- The **uploader** is the GitHub account that added the file (from git history, the commit *author*). If that account is registered with the ID's student number, the site shows "✔ confirmed".
- `uploads.json` overrides it for on-behalf uploads. Bot accounts (`[bot]`, `noreply@anthropic.com`) are never credited.

### 6.6 Visual design

- **Spacing scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 px (`--s1` … `--s7`); radius 12 px (8 px small).
- **Type:** system sans-serif; IDs and numbers in monospace with tabular figures. Each ID part has its own colour (course blue, type pink, term green, item amber, tags violet, student number teal).
- **Themes** (`data-theme` on `<html>`): System (follows the device), Light, Dark, Paper (warm paper, navy ink), Sage (green-gray, brown ink), Newsprint (gray, crisp), Midnight (deep navy).
- **Accents** (`data-accent`): orange (default), red, rose, amber, green, teal, blue, indigo, purple, graphite. Each accent has a light shade (for light themes) and a dark shade (for dark themes); soft and line tints are mixed from it with `color-mix`, so every accent works with every theme.
- **Warnings** (`.notice-danger`): solid red `#c81e1e`, white bold capitals, in every theme. Used for "DO NOT CHANGE THE TITLE IN THE FORM. ONLY ATTACH YOUR FILE." and "DO NOT CHANGE THE TITLE OR THE ANSWERS. ONLY CLICK CREATE."
- **Forms:** every field label has a red `*` (required) or "(optional)"; example text always starts with "e.g."; text boxes and drop-downs are all 40 px tall.
- **Layout rules:** no horizontal page scroll at any width (checked at 1440 down to 390 px); short labels and badges never wrap; long text wraps between words; nothing sticks out of cards.
- The chart and palette ideas (whole-palette themes, countable dots) were inspired by `larashero3-dotcom/lieflat-charts`; no code or values were copied (that repo is PolyForm Noncommercial, this site is MIT).

---

## 7. Workflows (automation)

### 7.1 Uploading (students)

1. **Upload** → **How to contribute** page:
   1. **Your uploader ID**: the student number (shows "Registered as …" if known).
   2. **Build the file's ID**: course code (its name appears; the subject is picked from the course's existing files; a new course asks for its name), subject (or "New subject…"), type, academic year, term, item, version (optional), tags (optional), title, licence.
   3. **Upload**: a checklist (uploader ID, file ID, subject, title, licence). **Open the upload form** stays locked until all are ticked, then opens the GitHub issue form **pre-filled** (title, subject, kind, licence, course, course name, term, item, student number). A red block says not to change the title.
2. In the GitHub form the student **only attaches the file** (PDF best; sources in one `.zip`, since GitHub refuses `.tex`; ≤ 25 MB; ≤ 10 files) and clicks **Create**.
3. **`upload.yml`** runs on issues labelled **`upload`** (the label, not the title, triggers it; opened or edited, while open). `scripts/upload.py`:
   - parses the form (by question label), validates codes (any case), the ID parts, the subject (existing, or new: creates the folder and adds it to the file-request form's list), the course name (adds to `courses.json` if new);
   - accepts only GitHub attachment links, types pdf/zip/txt/md/csv/png/jpg/docx/pptx/xlsx/ipynb, checks PDF/ZIP signatures, refuses duplicate IDs and existing files;
   - writes the file(s) to `files/<Subject>/<Material>/<ID> <Title>.<ext>` (extra files get " Source" or a suffix) and the licence rule to `licenses.json`;
   - commits on branch `upload/issue-<n>`: **author = the student's GitHub account**, committer = `github-actions[bot]`; opens a pull request "Add <title>" that closes the issue;
   - replies on the issue with the result or a list of problems (edit the issue to re-run).
4. A maintainer reviews and merges with **Create a merge commit** or **Rebase and merge** (not Squash, which would credit the bot). The site redeploys.

Without an ID ("Upload without an ID"): the blank form is filled by hand; the four ID boxes are left empty.

### 7.2 Registering a name

ID system → **Uploader IDs**: enter student number and name → **Open the registration form** (pre-filled; "Yes, link the account" is the default) → just click **Create**. A maintainer then adds the line to `uploaders.json` (no bot yet).

### 7.3 Verification (maintainers)

- Meaning: a maintainer checked that the **course code, uploader and file name** are correct. It does **not** check or guarantee the content.
- In a file's preview: **Verify this item** opens a pre-filled issue labelled **`verify`** (or **`unverify`**). Only people with triage access or more can set labels on a new issue.
- **`verify.yml`** runs on those labels. `scripts/verify.py` checks the author has admin/maintain/write permission, records path + SHA-256 + who + when + issue in `verifications.json` **on the `verifications` branch** (so `main`'s ruleset doesn't block the bot), dispatches a redeploy, replies and closes the issue.
- If a verified file's content changes, the site shows **Changed** until it's verified again. Renames keep the verification (matched by hash).

### 7.4 Deploy

`pages.yml` on every push to `main` (and on dispatch): checkout with full history → load `verifications.json` from its branch → `build_index.py` writes `files.json` (sizes, SHA-256, upload dates and uploader from the commit that **added** each file, renames followed, copies not, bots skipped) → assemble `_site` (code + JSON, **not** `files/`) → add `?v=<commit>` to asset links → deploy to Pages.

### 7.5 Reports and takedown

**Report this file** (in every preview) or **Report a file** (footer) opens the `report` form: file, reason (I own the copyright / personal information / breaks course rules / wrong details / other), details. Maintainers remove the file first, then reply. Deleted files stay in Git history unless history is rewritten.

### 7.6 File requests

The **File request** form (label `file-request`); open requests are listed on the site's File requests page.

### 7.7 Labels the repository needs

`upload`, `verify`, `unverify`, `report`, `uploader-code`, `file-request` (all exist).

### 7.8 Repository settings

- Pages source: **GitHub Actions**.
- Actions → Workflow permissions: **Allow GitHub Actions to create and approve pull requests**.
- Ruleset on the **default branch only**: restrict deletions, block force pushes, require a pull request (0–1 approvals); bypass: Repository admin (and Maintain). Do not target "All branches" or the `verifications` branch.

---

## 8. Rules for content

- Share only your own work, or material you have permission to share. No textbooks, solution manuals, official exams, homework sheets or lecture slides without the owner's permission; no solutions to open assignments.
- No personal information (phone numbers, grades). Student numbers in IDs are public by design.
- Everything is public; Git keeps old versions.
- Licence per file, never in the name; without one, others may only read it on the site.

---

## 9. Preparing files for this site (checklist for helpers and agents)

When organising a local archive so its files can be uploaded here:

1. **Name each file** `<ID> <Title>.<ext>` following §4, using the course's 8-digit code, the right type code, the term, the item, an optional version (`V…`) and tags, and the student number last. Title: short, English, letters/numbers/spaces and `. , - ( ) &` only.
2. **Group by subject and material** as `<Subject>/<Material>/` (§3.1); the material folder is the type's category.
3. **Pair formats**: a PDF and its source share the same ID; put LaTeX/other sources in one `.zip` named `<ID> <Title> Source.zip`.
4. **Decide the licence** for each file (§5.1); record it (in a list or in the upload form), not in the name.
5. **Check copyright** (§8) before marking anything for upload.
6. **Avoid duplicate IDs**: if an ID already exists on the site, bump the item or add a version.
7. **Size**: ≤ 25 MB per file for the upload form (≤ 100 MB absolute in Git).
8. Do not upload anything yourself unless asked; uploads go through the How to contribute page (or a maintainer with write access).

---

## 10. Known limits and open ideas

- Registrations are added to `uploaders.json` by hand (a bot like the upload bot could open a pull request).
- **File locking:** real protection is impossible on a public static site with TOTP alone (the secret would be public, and files are public in the repo). Options discussed: (A) password-encrypted files decrypted in the browser; (B) real TOTP through a small server (e.g. a Cloudflare Worker) with private storage. Not built yet.
- Previews download the whole file first (fine for a few MB, slow for very large files).
- Help translations (especially Hebrew and Chinese) would benefit from a native-speaker review.
