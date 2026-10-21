# ⚛️ Physics File Sharing

A simple website where physics students share notes, problem-set solutions, formula sheets, lab reports and code. It runs for free on **GitHub Pages**: every file you put in the `files/` folder shows up on the website automatically. You don't need to edit any HTML.

**Website:** `https://9da62c42.github.io/physics_file_sharing/` (live once GitHub Pages is turned on, see [For maintainers](#for-maintainers))

### What's on the site

| | |
| --- | --- |
| 📚 **Library** | Sidebar navigation by subject, search (press <kbd>/</kbd>), filter by file type, sort by name, date or size, grid or list view |
| 👁️ **Preview** | Read PDFs, images, text, LaTeX and code right on the site. Word, PowerPoint and Excel files open in an Office viewer, and notebooks open in nbviewer or Colab |
| ⭐ **Favorites** | Star files to find them again later (saved in your browser) |
| 🕒 **Recently added** | Newest uploads, with upload date and uploader name |
| 🔗 **Share links** | Copy a link that opens a specific file directly |
| 🏆 **Contributors** | Leaderboard of who has shared the most |
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
- [Naming your files](#naming-your-files)
- [Rules for sharing](#rules-for-sharing)
- [Updating or removing a file](#updating-or-removing-a-file)
- [Requesting a file](#requesting-a-file)
- [FAQ](#faq)
- [For maintainers](#for-maintainers)

---

## How the site works

```
files/
├── Classical-Mechanics/
├── Electromagnetism/
├── Quantum-Mechanics/
├── Thermodynamics-and-Statistical-Physics/
├── Waves-and-Optics/
├── Mathematical-Methods/
├── Lab-Reports/
└── Other/
```

- Each folder inside `files/` is a **subject**. It appears in the left sidebar of the website.
- You can make sub-folders for a course or topic, e.g. `files/Quantum-Mechanics/PHYS301-Spring-2026/`. The sub-folder name is shown on the file's card.
- The upload date and your name (from your GitHub account) are shown on each file, and you'll appear on the **Contributors** page.
- In folder and file names, `-` and `_` are shown as spaces, so `Hydrogen_Atom-Notes.pdf` is displayed as "Hydrogen Atom Notes".
- When a change reaches the `main` branch, GitHub rebuilds the site. The new file usually shows up within 1–5 minutes.

---

## Add a file from your browser (easiest)

You only need a free [GitHub account](https://github.com/signup).

1. **Open the subject folder.** Go to the repository, click `files/`, then open your subject (e.g. `Electromagnetism`).
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

Use this if you're comfortable with the command line or want to upload many files at once.

```bash
# 1. Fork the repo on GitHub (button in the top-right corner), then clone your fork
git clone https://github.com/<your-username>/physics_file_sharing.git
cd physics_file_sharing

# 2. Make a branch
git checkout -b add-em-notes

# 3. Copy your files into the right subject folder
cp ~/Downloads/Maxwell-Equations-Summary_AliceW.pdf files/Electromagnetism/

# 4. Commit and push
git add files/
git commit -m "Add Maxwell equations summary"
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

## Naming your files

A good name helps other people find your file with the search box. Suggested pattern:

```
<Topic>-<What-it-is>_<YourName-or-Initials>.<ext>
```

| ✅ Good | ❌ Avoid |
| --- | --- |
| `Griffiths-QM-Ch2-Solutions_AliceW.pdf` | `scan001.pdf` |
| `Rigid-Body-Rotation-Lecture-Notes.pdf` | `notes final FINAL (2).pdf` |
| `Pendulum-Lab-Report_Group3.pdf` | `lab.docx` |
| `Fourier-Series-Cheat-Sheet.tex` | `asdf.tex` |

Tips:
- Use letters, numbers, `-` and `_`. Avoid spaces and special characters (`# ? % & '`).
- Include the course code or textbook if it helps, e.g. `PHYS201` or `Griffiths`.
- **PDF is the best format** because it opens in any browser. If you share LaTeX, Jupyter notebooks or code, consider adding a PDF version too.

---

## Rules for sharing

1. **Share your own work**, or material that is clearly free to share (e.g. Creative Commons). Don't upload textbooks, paid content, or lecture slides your instructor hasn't allowed you to share.
2. **Follow your university's academic-integrity rules.** Don't upload solutions to assignments that are still open, or exam papers that aren't meant to be public.
3. **No personal information.** Remove student ID numbers, phone numbers, grades, etc. before uploading.
4. **Everything here is public.** Anyone on the internet can see and download it, and Git keeps old versions even after a file is deleted.
5. Be kind and helpful in pull-request discussions. 🙂

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

From then on, every push to `main` runs `.github/workflows/pages.yml`. It builds `files.json` (file sizes, upload dates and contributors from git history) and deploys the site.

> If Pages is left on **Deploy from a branch**, the site still works. It lists files through the GitHub API instead, but upload dates, **Recently added** and the **Contributors** page are not available.

### Set up file requests

Create a label named **`file-request`** (**Issues → Labels → New label**). The 📄 File request issue form adds it automatically, and the website lists open issues that have it (or whose title starts with `[Request]`).

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
| Colours, layout, dark mode | `assets/css/style.css` |
| Pages, sidebar, search, preview | `assets/js/app.js` |

### Project structure

| Path | What it is |
| --- | --- |
| `index.html` | Page shell: sidebar, top bar and the main view |
| `assets/js/app.js` | The app: routing, file library, preview, favorites and every page |
| `assets/js/data.js` | Physical constants, unit definitions and the resources list |
| `assets/js/config.js` | Site settings |
| `assets/css/style.css` | Styling (light and dark) |
| `scripts/build_index.py` | Builds `files.json` from the `files/` folder and git history |
| `.github/workflows/pages.yml` | Builds and deploys the site on every push to `main` |
| `.github/ISSUE_TEMPLATE/file-request.yml` | The "File request" issue form |
| `files/` | All shared files, organised by subject |
