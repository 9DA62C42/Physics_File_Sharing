# ⚛️ Physics File Sharing

A simple website where physics students share notes, problem-set solutions, formula sheets, lab reports and code. It runs for free on **GitHub Pages**: every file you put in the `files/` folder shows up on the website automatically. You don't need to edit any HTML.

**Website:** `https://9da62c42.github.io/physics_file_sharing/` (live once GitHub Pages is turned on, see [For maintainers](#for-maintainers))

---

## Contents

- [How the site works](#how-the-site-works)
- [Add a file from your browser (easiest)](#add-a-file-from-your-browser-easiest)
- [Add files with Git (for many files)](#add-files-with-git-for-many-files)
- [Naming your files](#naming-your-files)
- [Rules for sharing](#rules-for-sharing)
- [Updating or removing a file](#updating-or-removing-a-file)
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

- Each folder inside `files/` is a **subject**. It becomes a filter button on the website.
- You can make sub-folders for a course or topic, e.g. `files/Quantum-Mechanics/PHYS301-Spring-2026/`. The sub-folder name is shown on the file's card.
- In folder and file names, `-` and `_` are shown as spaces, so `Hydrogen_Atom-Notes.pdf` is displayed as "Hydrogen Atom Notes".
- When a change reaches the `main` branch, GitHub rebuilds the site. The new file usually shows up within 1–5 minutes.

---

## Add a file from your browser (easiest)

You only need a free [GitHub account](https://github.com/signup).

1. **Open the subject folder.** Go to the repository, click `files/`, then open your subject (e.g. `Electromagnetism`).
   Or use the **Upload a file** button on the website.
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

**Preview the site on your own computer (optional):**

```bash
gem install jekyll
jekyll serve
# open http://localhost:4000
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

## FAQ

**My file isn't showing up on the website.**
- Was your pull request **merged**? Files only appear once they're on `main`.
- Wait up to ~5 minutes, then do a hard refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`).
- Is the file inside `files/`? Files outside it are not listed.
- File names starting with `.` or `_` are hidden by GitHub Pages. Rename the file.
- Maintainers: check the **Actions** tab to see if the Pages build failed.

**My file is larger than 25 MB.**
Upload it with Git (see above). GitHub rejects single files over **100 MB**. For very large files, compress them, split them, or upload them to a cloud drive and share a `.txt` file containing the link.

**Can I upload Word / PowerPoint / Jupyter files?**
Yes, any file type works. Browsers can't preview them, so the **Open** button will download them instead.

**Do I need to know how to code?**
No. The browser upload method only takes clicking and dragging.

---

## For maintainers

### Turn on GitHub Pages (one time)

1. Merge this branch into **`main`**.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose **`main`** and **`/ (root)`**, then click **Save**.
4. After about a minute the site is live at `https://<owner>.github.io/<repo>/`. Put that link in the **About** box of the repository so students can find it.

### Let students upload directly (optional)

- **Settings → Collaborators → Add people** gives a student write access, so they can commit without a pull request.
- To protect `main` but still allow easy contributions, add a branch protection rule (**Settings → Branches**) that requires a pull request before merging.

### Add or rename a subject

Create a new folder under `files/` (it needs at least one file in it, e.g. an empty `.gitkeep`). Empty subjects don't appear on the website until they contain a real file.

### Project structure

| Path | What it is |
| --- | --- |
| `index.html` | The website page. Jekyll puts the list of everything in `files/` into it at build time. |
| `assets/app.js` | Search, subject filters and file cards. |
| `assets/style.css` | Styling (light and dark mode). |
| `_config.yml` | Site title, description, repository link and branch name. |
| `files/` | All shared files, organised by subject. |

If you rename the repository or change the default branch, update `repository_url` and `branch` in `_config.yml`.
