# 📚 Course File Sharing

A simple website where students share notes, problem-set solutions, formula sheets, lab reports and code. It runs for free on **GitHub Pages**: every file you put in the `files/` folder shows up on the website automatically. You don't need to edit any HTML.

It started with physics but is for **any course**: each subject is a folder under `files/`, and students can add new subjects and courses from the upload form.

**Website:** `https://9da62c42.github.io/Physics_File_Sharing/` (live once GitHub Pages is turned on, see [For maintainers](#for-maintainers))

### What's on the site

| | |
| --- | --- |
| 🆔 **ID system** | Optional file IDs like `01140086_HWS_2627W_01_123456789` that say the course, type, term, item and uploader. Decode, search and build them on the **ID system** page |
| 👤 **Student numbers** | Your 9-digit student number is your uploader ID. No GitHub details needed; register your name (optional) to have it shown |
| 📚 **Library** | Sidebar navigation by subject, course and material type, search (press <kbd>/</kbd>), filter by file type, sort by name, date or size, grid or list view |
| 👁️ **Preview** | Read PDFs, images, text, LaTeX and code right on the site. Word, PowerPoint and Excel files open in an Office viewer, and notebooks open in nbviewer or Colab |
| ⭐ **Favorites** | Star files to find them again later (saved in your browser) |
| 🕒 **Recently added** | Newest uploads, with upload date and uploader name |
| 🔗 **Share links** | Copy a link that opens a specific file directly |
| 🏆 **Uploaders** | Everyone who shares files, with a profile page each |
| 📨 **File requests** | Ask for files you need; requests are GitHub Issues |
| ⚛️ **Physics tools: constants** | CODATA 2022 values with one-click copy |
| 🔁 **Physics tools: unit converter** | Energy (J, eV, cm⁻¹, Hz, K, nm…), length, mass, time, temperature, pressure, power, magnetic field and angle |
| 🔭 **Physics tools: resources** | Hand-picked physics links: HyperPhysics, PhET, MIT OCW, NIST, arXiv and more |
| 🌙 **Dark mode** | Follows your system, or pick light or dark at the bottom of the sidebar |

---

## Contents

- [How the site works](#how-the-site-works)
- [Upload a file with the form (easiest)](#upload-a-file-with-the-form-easiest)
- [Add files with Git (for many files)](#add-files-with-git-for-many-files)
- [File IDs (recommended)](#file-ids-recommended)
- [Your student number as uploader ID](#your-student-number-as-uploader-id)
- [Rules for sharing](#rules-for-sharing)
- [Licence](#licence)
- [Updating or removing a file](#updating-or-removing-a-file)
- [Requesting a file](#requesting-a-file)
- [FAQ](#faq)
- [For maintainers](#for-maintainers)

---

## How the site works

```
files/
└── Waves/
    └── Notes/
```

- Each folder inside `files/` is a **subject**. It appears in the left sidebar of the website.
- You can make sub-folders for a course or topic, e.g. `files/Waves/Notes/`. The sub-folder name is shown on the file's card.
- The upload date and the uploader (from the GitHub account that uploaded the file) are shown on each file, and you'll appear on the **Uploaders** page.
- If the file name starts with an [ID](#file-ids-recommended), the file also appears under its **course** and **material type** in the sidebar.
- In folder and file names, `-` and `_` are shown as spaces, so `Hydrogen_Atom-Notes.pdf` is displayed as "Hydrogen Atom Notes".
- When a change reaches the `main` branch, GitHub rebuilds the site. The new file usually shows up within 1–5 minutes.

---

## Upload a file with the form (easiest)

You only need a free [GitHub account](https://github.com/signup). No Git, and you don't have to name the file yourself.

1. **Get your IDs ready.** Click **Upload** on the website. The **How to contribute** page opens:
   - **Step 1, uploader ID:** enter your 9-digit student number.
   - **Step 2, file ID:** fill in the course code, subject, kind of material, term, item, title and licence. For a known course code the course name appears by itself and the subject is picked for you; a new course or subject asks for its name. The page shows the file's ID, e.g. `01140086_HWS_2627W_01_800015240`.
   - **Step 3:** when everything is ticked, click **Open the upload form**. It opens on GitHub with your answers filled in. (No ID possible, e.g. for outside material? Use the page's *Upload without an ID* link, or [open the blank form](https://github.com/9DA62C42/Physics_File_Sharing/issues/new?template=upload.yml).)
2. **Attach your file: that's the only thing to do in the form.** Drag it into the **Files** box and wait until it shows as a link. **Don't change the title** or the other answers; they were filled in from the website.
   - PDF is best. Put LaTeX or other source files in **one `.zip`**: GitHub doesn't accept `.tex` attachments.
   - Up to 25 MB per file and 10 files per upload. Accepted: pdf, zip, txt, md, csv, png, jpg, docx, pptx, xlsx, ipynb.
3. **Check the answers.** Choose the subject and check the answers filled in from the website. (Filling in the form by hand works too: leave all four ID boxes empty to upload without an ID.)
   - In the form, **Subject**, **Kind of material** (a type code such as `LN`) and **Licence** (a code such as `ARR`) are text boxes, so the website can fill them in. A subject name that doesn't exist yet creates a new subject; **Course name** adds a new course.
4. **Submit.** Within a minute the **Prepare upload** bot replies on the issue:
   - **Something wrong?** It lists what to fix. Edit the issue (**···** → **Edit**) and it checks again.
   - **All good?** It saves the file under the right name in `files/<Subject>/<Material>/`, adds its licence to `licenses.json`, and opens a **pull request** committed under your GitHub account. A new subject is added to the forms' subject lists, and a new course name to `courses.json`, in the same pull request.
5. **Review.** A maintainer checks the pull request and merges it. The issue closes, and a few minutes later your file is on the website, credited to you.

### Collaborators: add files directly

With write access you can also open a subject folder on GitHub and use **Add file → Upload files**. Name the file yourself with the website's **ID system → Build a name** page and add its licence to `licenses.json`. If `main` requires pull requests, choose **Create a new branch** and open one.

> 💡 For files over 25 MB, see the [FAQ](#faq).

---

## Add files with Git (for many files)

Use this if you're comfortable with the command line or want to upload many files at once. Your commits are credited to the GitHub account linked to your commit email.

```bash
# 1. Fork the repo on GitHub (button in the top-right corner), then clone your fork
git clone https://github.com/<your-username>/physics_file_sharing.git
cd physics_file_sharing

# 2. Make a branch
git checkout -b add-em-notes

# 3. Copy your files into the right subject folder
cp "01140086_HWS_2627W_01_123456789 Waves Homework 1 Solution.pdf" files/Waves/

# 4. Commit and push
git add files/
git commit -m "Add Waves HW1 solution"
git push -u origin add-em-notes
```

Then open your fork on GitHub and click **Compare & pull request**.

**Preview the site on your own computer (optional, needs Python 3):**

```bash
python3 scripts/build_index.py   # writes files.json
python3 -m http.server 8000
# open http://localhost:8000
```

---

## File IDs (recommended)

A file's **ID** is the start of its name. IDs are **recommended, not required**: a file without one is still published and shown normally. With an ID, the site can sort your file into the right course and material type, link question, solution and answer files together, and credit you.

```
<course>_<TYPE>_<term>_<item>_<TAG>_<student number> <title>.ext

01140086_HWS_2627W_01_123456789 Waves Homework 1 Solution.pdf
└──┬───┘ └┬┘ └─┬─┘ └┤ └───┬───┘ └──────────┬───────────────┘
 course  type term item student no.    title (after one space)
```

| Field | Rule | Examples |
| --- | --- | --- |
| **course** | 8 digits, zero-padded. 6-digit shorthand pads each half: `104131` → `01040131` | `01140086` |
| **TYPE** | What it is, and who wrote it (School = official, Student = your own work) | `HWQ` homework question · `HWS` homework solution · `HWA` homework answer · `LP` lecture paper · `LN` lecture note · `TP`/`TN`/`TS` tutorial · `PEQ`/`PES`/`PEA` past exam · `LBR` lab report · `SY` syllabus · `XT` textbook |
| **term** | `<start yy><end yy><letter>`, academic year. `W` Winter, `S` Spring, `A` Summer, `F` Fall. Or `LEGACY` / `Undated`. Left out for `XT` | `2627W` = Winter 2026–27 · `2526S` = Spring 2026 |
| **item** | Serial (at least 2 digits) or a pattern. Optional for handouts and readings | `01` · `01b` supplement · `A` exam paper · `Q01` quiz · `PS01` problem set · `C01` chapter · `FULL` |
| **version** | Optional | `V` + any number: `V1`, `V02`, `V4.1`, `V2.0.3` |
| **TAG** | Optional | `AN` annotated · `DR` draft · `GR` graded |
| **student number** | Your 9-digit student number. Recommended for your own work. **It will be public** | `123456789` |
| **title** | Short English title after **one space**. Use `_` between ID fields, never `-` | `Waves Homework 1 Solution` |

The **ID system** page on the website has the full reference (all type codes and patterns), a **lookup** that decodes any ID, a **name builder** that writes the file name for you, and a **check** that lists IDs with mistakes and identical files.

Tips:
- Not sure whether something is yours or the school's? Ask: *who wrote the content?* Your tutorial work is `TN`; the official tutorial solution is `TS`.
- A `.tex` and its `.pdf` of the same item share one base name.
- Once a file is published, keep its ID: links and references depend on it.
- **PDF is the best format** because it opens in any browser.

---

## Your student number as uploader ID

The last part of an ID is your **9-digit student number**. It tells everyone who shared the file. (If someone else wrote it, credit them in the title.) You don't need to give any GitHub details, and you don't need to register first: the number works as soon as you put it in the ID.

> ⚠️ **Your student number will be public.** Anyone can see it in file names and on the website, and Git keeps it even after a file is deleted. If you'd rather not share it, leave it out; the ID still works without it.

| | What you do | What the site shows |
| --- | --- | --- |
| **Not registered** | Just put your number in the ID | "Student 123456789" |
| **Registered** (optional) | Add your number and name to [`uploaders.json`](uploaders.json) | Your name |
| **Uploader confirmed** (optional) | Also add your GitHub username | Your name with ✔, on files you upload from that account |

To register, open **ID system → Uploader IDs** on the website and fill in your number and name. Then either:
- click **Open the registration form**: it opens on GitHub with your answers filled in. **Just click Create; don't change the title or the answers.** The form links the GitHub account you submit it with (choose *No* if that isn't your own account). A maintainer adds you, or
- edit [`uploaders.json`](uploaders.json) on GitHub, add your line, and propose the change:
  ```json
  { "id": "123456789", "name": "Alice Wang" }
  ```
  or, to have your uploads confirmed, `{ "id": "123456789", "name": "Alice Wang", "github": "your-github-username" }`.

---

## Rules for sharing

1. **Share your own work**, or material that is clearly free to share (e.g. Creative Commons). Don't upload textbooks, paid content, or lecture slides your instructor hasn't allowed you to share.
2. **Follow your university's academic-integrity rules.** Don't upload solutions to assignments that are still open, or exam papers that aren't meant to be public.
3. **No other personal information.** Remove phone numbers, grades, ID photos, etc. before uploading. Your student number appears only if you choose to put it in a file's ID.
4. **Everything here is public.** Anyone on the internet can see and download it, and Git keeps old versions even after a file is deleted.
5. **Choose a licence for each file.** Every document can have its own; without one, others can only read it here. See [Licence](#licence).
6. Be kind and helpful in pull-request discussions. 🙂

> **Copyright and takedown:** if you own something shared here, or a file contains personal information, click **Report this file** in its preview on the website (or **Report a file** at the bottom of any page). A maintainer reviews every report and removes or fixes the file, usually within a few days. See [CONTENT-LICENSE.md](CONTENT-LICENSE.md#taking-material-down).

---

## Licence

**The website code** (`index.html`, `assets/`, `scripts/`, `.github/`, config files) is under the [MIT licence](LICENSE). Reuse it freely, for example to run the same site for another class.

**Shared files don't share one licence. Each document has its own**, chosen by whoever wrote it. The licence is **never part of the file name**. Set it in one of two ways:

1. **In [`licenses.json`](licenses.json)**, for one file, a folder, or a file ID:
   ```json
   { "rules": [
     { "id": "01140086_HWS_2627W_01_123456789", "license": "CCBY" },
     { "path": "files/Waves/Notes/", "license": "CCBYNC" }
   ] }
   ```
   The **ID system → Build a name** page writes this line for you. You can also just name the licence in your pull request, and a maintainer adds it.
2. **Inside a text file**, with a line like `% SPDX-License-Identifier: CC-BY-4.0` near the top. A matching rule in `licenses.json` takes priority over this.

If none of these is set, the file has **no licence stated**: the author keeps all rights, and others may only read it here.

| Code | Licence | Others may… |
| --- | --- | --- |
| `CC0` / `PD` | No rights reserved / public domain | do anything |
| `CCBY` | CC BY 4.0 | share and adapt, with credit |
| `CCBYSA` | CC BY-SA 4.0 | share and adapt with credit; adaptations stay CC BY-SA |
| `CCBYNC` | CC BY-NC 4.0 | share and adapt with credit, not commercially |
| `CCBYNCSA` | CC BY-NC-SA 4.0 | as CC BY-NC; adaptations stay the same |
| `CCBYND` / `CCBYNCND` | CC BY-ND / BY-NC-ND 4.0 | share unchanged copies, with credit (ND-NC: also not commercially) |
| `MIT` / `GPL3` | Software licences | use the code (GPL: changes stay GPL) |
| `STUDY` | Shared with permission, for study only | read it here for personal study |
| `ARR` | All rights reserved | read it here; ask the author for anything else |

- **Only the owner can choose a licence.** For course material that isn't yours (question sheets, handouts, official answers, textbooks), use `STUDY`, or the licence it was published under.
- **Each file's page** on the website shows its licence in plain terms (✓ share, ✓ adapt, ✕ commercial…) and where it was set. **All files** has a licence filter, and **ID system → Check files** lists files with no licence stated.
- **Want something removed or relicensed?** If you own material shared here, open an issue.

Full details: [CONTENT-LICENSE.md](CONTENT-LICENSE.md). This is a plain-language summary, not legal advice.

---

## Updating or removing a file

**Students** can't delete files. To have one removed, click **Report this file** in its preview on the website. To replace one, upload the new version with the upload form, adding a version after the item (e.g. `01_V02`), and say in the upload that the old one should go.

**Maintainers** (owner and collaborators) delete files on GitHub:

1. Open the file in the repository (e.g. `files/Waves/Notes/…`).
2. Click the **⋯** menu at the top right, then **Delete file**.
3. Write a short message (e.g. `Remove Waves HW1 (copyright request)`), choose **Commit directly to the main branch** (tick the bypass-rules box if it appears) and click **Commit changes**. About a minute later the file is gone from the site.

Then tidy up:

- **The rest of the item:** a PDF and its source zip are one item; delete the zip too if the whole item should go.
- **`licenses.json` and `uploads.json`:** remove the file's rule (matched by `id` or `path`), keeping the commas between entries right.
- **Folders:** GitHub can't delete a folder in one step. Delete the files in it and the folder disappears; keep a `.gitkeep` if the subject should stay with 0 files.
- **Verification** needs nothing: a deleted file simply stops showing.

> Deleting removes the file from the website and the current repository, but old copies stay in the Git history. If a file must vanish completely (for example personal information), the history has to be rewritten.

**Rename / move:** for text files, open the file, click ✏️ **Edit**, and change the name in the box at the top (a `/` creates a folder). For PDFs and other binary files, upload the file again under the new name and delete the old one.

---

## Requesting a file

Looking for something that isn't here yet?

1. On the website, open **File requests** and click **Request a file**. Or go to the repository's **Issues → New issue → 📄 File request**.
2. Pick the subject and describe what you need.
3. Your request shows up on the **File requests** page. When someone uploads it, they mention the request number (e.g. `Add ch. 5 solutions, closes #12`) and the request is closed automatically when the change is merged.

---

## FAQ

**My file isn't showing up on the website.**
- Was your pull request **merged**? Files only appear once they're on `main`.
- Wait up to ~5 minutes, then do a hard refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`).
- Is the file inside `files/`? Files outside it are not listed.
- File names starting with `.` or `_` are hidden from the website. Rename the file.
- Maintainers: check the **Actions** tab to see if the Pages build failed.

**The website says "Couldn't load the file list" or shows 0 files.**
The file list (`files.json`) is only built by the **Deploy website** workflow. In **Settings → Pages**, the **Source** must be **GitHub Actions**. If it's "Deploy from a branch", GitHub publishes the bare branch over the workflow's site after every push, without `files.json`. The site then tries GitHub's public API instead, which doesn't work for a **private** repository.

**My file is larger than 25 MB.**
Upload it with Git (see above). GitHub rejects single files over **100 MB**. For very large files, compress them, split them, or upload them to a cloud drive and share a `.txt` file containing the link.

**Can I upload Word / PowerPoint / Jupyter files?**
Yes, any file type works. Word, PowerPoint and Excel files are previewed with Microsoft's online viewer. Notebooks get **Open in nbviewer** and **Open in Colab** buttons. Everything else can be downloaded.

**Where are my favorites stored?**
In your browser only. They are not shared, and you won't see them on another device or after clearing site data.

**Do I need to know how to code?**
No. The upload form only takes filling in a few boxes and dragging your file in.

---

## For maintainers

### Turn on GitHub Pages (one time)

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Go to the **Actions** tab, open **Deploy website**, and click **Run workflow** (or just push any change to `main`).
4. After about a minute the site is live at `https://<owner>.github.io/<repo>/`. Put that link in the repository's **About** box so students can find it.

From then on, every push to `main` runs `.github/workflows/pages.yml`. It builds `files.json` (file sizes, upload dates, uploaders and content hashes from git history) and deploys the site.

The shared files are **not copied into the published site**: the website loads them straight from the repository (`raw.githubusercontent.com`). Downloads go there directly; previews and *New tab* fetch the file and show it with the right type. So GitHub Pages' 1 GB site limit doesn't apply to them; only the repository's limits do (about 1 GB recommended, 5 GB strongly recommended, 100 MB per file). When testing locally, previews show files that are already on `main` on GitHub.

> If Pages is left on **Deploy from a branch**, the site still works. It lists files through the GitHub API instead, and IDs still work, but upload dates, uploader verification, duplicate detection and **Recently added** are not available.

### Set up file requests and student registrations

Create six labels (**Issues → Labels → New label**): **`file-request`**, **`uploader-code`**, **`upload`**, **`report`**, **`verify`** and **`unverify`**. The bots start from the labels (`upload`, `verify`, `unverify`), not from the issue titles. The issue forms add them automatically. The website lists open issues labelled `file-request` (or whose title starts with `[Request]`).

When a student registers with the issue form, check the number has 9 digits and isn't listed yet, then add `{ "id": "…", "name": "…" }` to `uploaders.json`. If they chose to link their GitHub account, add `"github": "<the issue author's username>"`. Only link the account that opened the issue, so nobody can claim someone else's number.

### Course names

Add course names to [`courses.json`](courses.json) so the sidebar shows `01140086 · Waves` instead of just the number:

```json
{ "courses": { "01140086": "Waves" } }
```

### How uploaders are identified

Two people can be involved in a file: the **student it belongs to** (the student number in its ID) and the **person who uploaded it**.

- **Normally** the uploader is the GitHub account that added the file. If that account is registered with the student number in the ID, the file shows the uploader as **✔ confirmed** (this is separate from maintainer verification below).
- **Uploading for someone else?** Record it in [`uploads.json`](uploads.json), keyed by file ID (or path / folder), with the uploader's student number. The site then shows "Uploaded by Xiangjun Liu on behalf of Shang Wu":
  ```json
  { "rules": [ { "id": "01140086_LN_2627W_FULL_800012999", "uploadedBy": "800015240" } ] }
  ```
- **Automation accounts are never credited.** Commits by the AI assistant that helps maintain the site, and by GitHub bots, don't count as an uploader or editor. Files they add on someone's behalf need an `uploads.json` entry.
- The Actions build looks at the commit that **added** each file (renames are followed, copies are not) and asks the GitHub API for the author's username. Email addresses are never published.

### Verify files (owner and collaborators)

Maintainers can mark files as checked. Verified items get a **🛡 Verified** badge, and the preview shows who verified them and when.

> **What verification means:** the maintainer checked that the **course code, the uploader (student number) and the file name** are correct. It does **not** check or guarantee the content, which may still contain mistakes, and it is not a promise or endorsement.

1. On the website, open a file and click **Verify this item** in the *Verification* section. GitHub opens a new issue labelled `verify`, already listing the item's files. Add an optional note, then submit it.
2. The **Verify files** workflow (`.github/workflows/verify.yml`) checks that you're the **owner or a collaborator with write access**. It then records the files' paths and SHA-256 hashes in `verifications.json` on the **`verifications` branch**, redeploys the site and closes the issue with a reply. Anyone else's request is refused, and nothing changes.
3. **Unverify** works the same way (label `unverify`). Only people with triage access or more can set labels on a new issue, so nobody else can even start it.

If a verified file's content changes later, the site shows **Changed** instead of Verified, and lists it under *ID system → Check files* for re-checking. A verification stays valid if a file is only renamed or moved.

### Handle reports

Reports from the **Report a file** form are labelled `report`. For a copyright claim or personal information, remove the file first (delete it on GitHub, and its rule in `licenses.json`), then reply and close the issue. Deleted files stay in Git history; if the owner needs them gone entirely, the history has to be rewritten.

### Set up the upload form (one time)

1. **Settings → Actions → General → Workflow permissions**: tick **Allow GitHub Actions to create and approve pull requests**, then **Save**. Without it, the bot can't open the pull request and asks a maintainer to open it from the link it posts.
2. Make sure the **`upload`** label exists (see above).
3. **Reviewing an upload:** open the pull request, check the file (permission, privacy, academic integrity), its name and its licence, then merge with **Create a merge commit** or **Rebase and merge**. Avoid *Squash and merge*: it credits the bot instead of the student.
4. **New subjects and courses** from the form arrive in the same pull request (a new folder, a line in the forms' *Subject* lists, a line in `courses.json`). Check the spelling before merging. To add a subject yourself, create its folder and add it to the *Subject* list in `.github/ISSUE_TEMPLATE/upload.yml` and `file-request.yml`.

### Protect `main` with a ruleset

Go to **Settings → Rules → Rulesets** and create (or edit) a branch ruleset:

1. **Enforcement status**: Active.
2. **Target branches**: **Add target → Include default branch**. Don't use *All branches*: that also blocks upload branches.
3. **Rules**: turn on **Restrict deletions**, **Block force pushes** and **Require a pull request before merging** (0 required approvals, or 1 if a second person should review). Leave the other rules off.
4. **Bypass list**: keep **Repository admin** (and **Maintain** if you have maintainers). Don't add *Write*, so collaborators also send pull requests. *Deploy keys* isn't needed.

> **Verification and rules:** the Verify files workflow saves its records to its own **`verifications`** branch, not to `main`, so the ruleset doesn't block it (`github-actions[bot]` can't be added to a ruleset's bypass list). Don't target *All branches* or `verifications`, and don't delete that branch: it holds every verification. The deploy reads it on each build.

### Let students upload directly (optional)

**Settings → Collaborators → Add people** gives a student write access. With the ruleset above they still go through a pull request, but they can create branches in this repository instead of a fork.

### Add or rename a subject

Students can add one with the upload form (**New subject**). To do it yourself, create a new folder under `files/` (use hyphens for spaces: `Quantum-Mechanics`). Git can't store empty folders, so put at least one file in it (an empty `.gitkeep` is fine). Empty subjects show in the sidebar with a count of 0. Also add it to the *Subject* list in `.github/ISSUE_TEMPLATE/upload.yml` and `file-request.yml`.

### Customise

| To change… | Edit |
| --- | --- |
| Site title, description, repository, branch | `assets/js/config.js` |
| Constants, units in the converter, resource links | `assets/js/changelog.js` | The Changelog page (under Help & guide): add an entry at the top when you change the site |
| `assets/js/data.js` |
| ID rules: type codes, terms, tags, item patterns, licence codes | `assets/naming.json` |
| Licence of each shared file | `licenses.json` |
| Registered students (number, name, optional GitHub) | `uploaders.json` |
| Uploads made on someone else's behalf | `uploads.json` |
| Course names | `courses.json` |
| Colours, layout, dark mode | `assets/css/style.css` |
| Pages, sidebar, search, preview | `assets/js/app.js` |

### Project structure

| Path | What it is |
| --- | --- |
| `index.html` | Page shell: sidebar, top bar and the main view |
| `assets/js/app.js` | The app: routing, file library, ID parsing, preview, favorites and every page |
| `assets/naming.json` | The ID rules |
| `uploaders.json` | Registered student numbers → names (and optional GitHub accounts) |
| `uploads.json` | Who uploaded a file on another student's behalf |
| `verifications.json` (on the `verifications` branch) | Files verified by the owner or collaborators (written by the Verify files workflow) |
| `scripts/verify.py`, `.github/workflows/verify.yml` | Check the author permission of an issue labelled `verify` or `unverify` and record the verification |
| `scripts/upload.py`, `.github/workflows/upload.yml` | Turn an upload-form issue into a pull request with the file named and licensed |
| `courses.json` | Optional course names |
| `assets/js/data.js` | Physical constants, unit definitions and the resources list |
| `assets/js/config.js` | Site settings |
| `assets/css/style.css` | Styling (light and dark) |
| `scripts/build_index.py` | Builds `files.json` from the `files/` folder and git history: sizes, dates, uploaders, content hashes |
| `.github/workflows/pages.yml` | Builds and deploys the site on every push to `main` |
| `.github/ISSUE_TEMPLATE/upload.yml` | The "Upload a file" issue form |
| `.github/ISSUE_TEMPLATE/report.yml` | The "Report a file" issue form (copyright, privacy, mistakes) |
| `.github/ISSUE_TEMPLATE/file-request.yml` | The "File request" issue form |
| `.github/ISSUE_TEMPLATE/uploader-code.yml` | The "Register your student number" issue form |
| `files/` | All shared files, organised by subject |
| `LICENSE` | MIT licence for the website code |
| `CONTENT-LICENSE.md` | How each shared file's licence is set, and what each licence code means |
| `licenses.json` | The licence of each shared file (by file, folder or ID) |
| `.github/pull_request_template.md` | Checklist contributors confirm when proposing files |
