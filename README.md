# ⚛️ Physics File Sharing

A simple website where physics students share notes, problem-set solutions, formula sheets, lab reports and code. It runs for free on **GitHub Pages**: every file you put in the `files/` folder shows up on the website automatically. You don't need to edit any HTML.

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
| ⚛️ **Physical constants** | CODATA 2022 values with one-click copy |
| 🔁 **Unit converter** | Energy (J, eV, cm⁻¹, Hz, K, nm…), length, mass, time, temperature, pressure, power, magnetic field and angle |
| 🔭 **Resources** | Hand-picked links: HyperPhysics, PhET, MIT OCW, NIST, arXiv and more |
| 🌙 **Dark mode** | Follows your system, or pick light or dark at the bottom of the sidebar |

---

## Contents

- [How the site works](#how-the-site-works)
- [Add a file from your browser (easiest)](#add-a-file-from-your-browser-easiest)
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

## Add a file from your browser (easiest)

You only need a free [GitHub account](https://github.com/signup).

1. **Open the subject folder.** Go to the repository, click `files/`, then open your subject (e.g. `Waves`).
   Or use the **Upload** button on the website. The **How to contribute** page has a subject picker that takes you straight to the right folder.
2. **Upload.** Click **Add file → Upload files**, then drag your file(s) into the page.
   - **New subject?** Upload from inside `files/` and drag in a whole folder (e.g. `Astrophysics/` containing your files). The folder becomes a new subject.
3. **Describe your change.** At the bottom, under *Commit changes*, write a short message such as
   `Add Griffiths ch. 4 solutions`.
4. **Submit.**
   - **No write access** (most students): GitHub makes a copy of the repository (a *fork*) for you and opens a **pull request**. Click **Propose changes**, then **Create pull request**. A maintainer will review it and merge it.
   - **Write access** (you were added as a collaborator): choose **Commit directly to the `main` branch**, or create a branch and open a pull request if you'd like someone to check it first.
5. **Wait a few minutes**, then refresh the website. Your file is there! 🎉

> 💡 Uploading in the browser works for files up to **25 MB**. For bigger files, see the [FAQ](#faq).

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
| **version** | Optional | `V01`, `V02` |
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
| **Verified** (optional) | Also add your GitHub username | Your name with ✔, on files you upload from that account |

To register, open **ID system → Uploader IDs** on the website, fill in your number and name, then either:
- use the **🆔 Register your student number** issue form, and a maintainer adds you, or
- edit [`uploaders.json`](uploaders.json) on GitHub, add your line, and propose the change:
  ```json
  { "id": "123456789", "name": "Alice Wang" }
  ```
  or, for the verified badge, `{ "id": "123456789", "name": "Alice Wang", "github": "your-github-username" }`.

---

## Rules for sharing

1. **Share your own work**, or material that is clearly free to share (e.g. Creative Commons). Don't upload textbooks, paid content, or lecture slides your instructor hasn't allowed you to share.
2. **Follow your university's academic-integrity rules.** Don't upload solutions to assignments that are still open, or exam papers that aren't meant to be public.
3. **No other personal information.** Remove phone numbers, grades, ID photos, etc. before uploading. Your student number appears only if you choose to put it in a file's ID.
4. **Everything here is public.** Anyone on the internet can see and download it, and Git keeps old versions even after a file is deleted.
5. **Choose a licence for each file.** Every document can have its own; without one, others can only read it here. See [Licence](#licence).
6. Be kind and helpful in pull-request discussions. 🙂

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

- **Update:** upload a file with *exactly the same name* into the same folder. GitHub will replace the old version.
- **Remove:** open the file on GitHub, click the **⋯** menu (or the 🗑️ icon), choose **Delete file**, and commit or open a pull request.
- **Rename / move:** open the file, click ✏️ **Edit**, and change the name in the box at the top. Typing a `/` creates a folder; pressing Backspace at the start of the box moves the file up one folder. (This works for text files. For PDFs and other binary files, upload the file again under the new name and delete the old one.)

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
No. The browser upload method only takes clicking and dragging.

---

## For maintainers

### Turn on GitHub Pages (one time)

1. In the repository, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Go to the **Actions** tab, open **Deploy website**, and click **Run workflow** (or just push any change to `main`).
4. After about a minute the site is live at `https://<owner>.github.io/<repo>/`. Put that link in the repository's **About** box so students can find it.

From then on, every push to `main` runs `.github/workflows/pages.yml`. It builds `files.json` (file sizes, upload dates, uploaders and content hashes from git history) and deploys the site.

> If Pages is left on **Deploy from a branch**, the site still works. It lists files through the GitHub API instead, and IDs still work, but upload dates, uploader verification, duplicate detection and **Recently added** are not available.

### Set up file requests and student registrations

Create two labels (**Issues → Labels → New label**): **`file-request`** and **`uploader-code`**. The issue forms add them automatically. The website lists open issues labelled `file-request` (or whose title starts with `[Request]`).

When a student registers with the issue form, check the number has 9 digits and isn't listed yet, then add `{ "id": "…", "name": "…" }` to `uploaders.json`. If they chose to link their GitHub account, add `"github": "<the issue author's username>"`. Only link the account that opened the issue, so nobody can claim someone else's number.

### Course names

Add course names to [`courses.json`](courses.json) so the sidebar shows `01140086 · Waves` instead of just the number:

```json
{ "courses": { "01140086": "Waves" } }
```

### How uploaders are identified

Two people can be involved in a file: the **student it belongs to** (the student number in its ID) and the **person who uploaded it**.

- **Normally** the uploader is the GitHub account that added the file. If that account is registered with the student number in the ID, the file shows **✔ verified**.
- **Uploading for someone else?** Record it in [`uploads.json`](uploads.json), keyed by file ID (or path / folder), with the uploader's student number. The site then shows "Uploaded by Xiangjun Liu on behalf of Shang Wu":
  ```json
  { "rules": [ { "id": "01140086_LN_2627W_FULL_800012999", "uploadedBy": "800015240" } ] }
  ```
- **Automation accounts are never credited.** Commits by the AI assistant that helps maintain the site, and by GitHub bots, don't count as an uploader or editor. Files they add on someone's behalf need an `uploads.json` entry.
- The Actions build looks at the commit that **added** each file (renames are followed, copies are not) and asks the GitHub API for the author's username. Email addresses are never published.

### Let students upload directly (optional)

- **Settings → Collaborators → Add people** gives a student write access, so they can commit without a pull request.
- To protect `main` but still allow easy contributions, add a branch protection rule (**Settings → Branches**) that requires a pull request before merging.

### Add or rename a subject

Create a new folder under `files/`. Git can't store empty folders, so put at least one file in it (an empty `.gitkeep` is fine). Empty subjects show in the sidebar with a count of 0.

### Customise

| To change… | Edit |
| --- | --- |
| Site title, description, repository, branch | `assets/js/config.js` |
| Constants, units in the converter, resource links | `assets/js/data.js` |
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
| `courses.json` | Optional course names |
| `assets/js/data.js` | Physical constants, unit definitions and the resources list |
| `assets/js/config.js` | Site settings |
| `assets/css/style.css` | Styling (light and dark) |
| `scripts/build_index.py` | Builds `files.json` from the `files/` folder and git history: sizes, dates, uploaders, content hashes |
| `.github/workflows/pages.yml` | Builds and deploys the site on every push to `main` |
| `.github/ISSUE_TEMPLATE/file-request.yml` | The "File request" issue form |
| `.github/ISSUE_TEMPLATE/uploader-code.yml` | The "Register your student number" issue form |
| `files/` | All shared files, organised by subject |
| `LICENSE` | MIT licence for the website code |
| `CONTENT-LICENSE.md` | How each shared file's licence is set, and what each licence code means |
| `licenses.json` | The licence of each shared file (by file, folder or ID) |
| `.github/pull_request_template.md` | Checklist contributors confirm when proposing files |
