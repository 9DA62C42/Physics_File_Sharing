// What's new on the site, newest first. Shown on the Changelog page (under Help & guide).
// Add an entry at the top when you change the site. type: "new", "improved" or "fixed".
// **bold** and `code` work as in the Help guide.
window.CHANGELOG = [
  {
    version: "1.0", date: "2026-10-21", title: "Course File Sharing",
    changes: [
      { type: "new", text: "The site is now **Course File Sharing**: open to any course, not only physics." },
      { type: "new", text: "**Changelog** page under Help & guide." },
      { type: "improved", text: "The constants, unit converter and resources are grouped as **Physics tools**." }
    ]
  },
  {
    version: "0.6", date: "2026-10-21", title: "Upload form and copyright",
    changes: [
      { type: "new", text: "**Upload form**: anyone with a GitHub account can upload by filling in a form. A bot names the file, sets its licence and opens a pull request for review." },
      { type: "new", text: "Students can add a **new subject** or **course** from the upload form." },
      { type: "new", text: "**Report this file** button in every preview, and a report form for copyright, personal information and mistakes." },
      { type: "new", text: "Copyright reminders on Home, the contribute page, the upload form and in Help." },
      { type: "improved", text: "Uploads are committed by the bot and authored by the student, so history shows how each file was added." }
    ]
  },
  {
    version: "0.5", date: "2026-10-21", title: "Verification and Help",
    changes: [
      { type: "new", text: "Maintainers can **verify** files from the preview. Verification confirms the course code, uploader and file name, not the content." },
      { type: "new", text: "**Help & guide** in English, Hebrew, Chinese, Spanish, French and German, including every licence code." },
      { type: "new", text: "Overview pages for **Subjects**, **Courses** and **Material**." },
      { type: "improved", text: "The page is centred on wide screens; table text stays on one line and secondary columns hide on small screens." },
      { type: "fixed", text: "Long IDs break only after an underscore, never inside a student number." },
      { type: "fixed", text: "Card badges no longer run under the favourite star." }
    ]
  },
  {
    version: "0.4", date: "2026-10-21", title: "First notes",
    changes: [
      { type: "new", text: "First files: “Waves Complete Learning Notes” by Shang Wu and “Vibrations and Waves Lecture Notes”." },
      { type: "new", text: "A PDF and its source (for example a LaTeX zip) show as **one item**." },
      { type: "new", text: "Uploads made **on behalf of** someone show both people: \"uploaded by … on behalf of …\"." },
      { type: "improved", text: "Sidebar sections fold." }
    ]
  },
  {
    version: "0.3", date: "2026-10-21", title: "Student numbers and licences",
    changes: [
      { type: "new", text: "Your 9-digit **student number** is your uploader ID; a GitHub account is optional." },
      { type: "new", text: "Each file has **its own licence** (CC, MIT, STUDY, all rights reserved, …), shown in plain words in its preview. Licences are never part of file names." }
    ]
  },
  {
    version: "0.2", date: "2026-10-21", title: "New design and file IDs",
    changes: [
      { type: "new", text: "Sidebar navigation, search, filters, favourites, previews and dark mode." },
      { type: "new", text: "**ID system**: optional IDs such as `01140086_HWS_2627W_01_123456789` that say the course, type, term, item and uploader." },
      { type: "new", text: "Physical constants, unit converter and resources." },
      { type: "improved", text: "Orange accent (or red), with even spacing throughout." }
    ]
  },
  {
    version: "0.1", date: "2026-10-21", title: "First version",
    changes: [
      { type: "new", text: "A GitHub Pages website that lists every file in the `files/` folder." }
    ]
  }
];
