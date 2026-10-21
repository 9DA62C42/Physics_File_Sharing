// What's new on the site, newest first. Shown on the Changelog page (under Help & guide).
// Add an entry at the top when you change the site. type: "new", "improved" or "fixed".
// **bold** and `code` work as in the Help guide.
window.CHANGELOG = [
  {
    version: "1.3", date: "2026-10-21", title: "Free version numbers",
    changes: [
      { type: "improved", text: "Version numbers in IDs can be anything after `V`: `V1`, `V02`, `V4.1`, `V2.0.3`." },
      { type: "fixed", text: "A version with a dot (such as `V4.1`) is no longer mistaken for a file extension." },
      { type: "improved", text: "The upload form and How to contribute say clearly: **only attach your file, don't change the title**." },
      { type: "fixed", text: "The upload bot also runs when the issue's title was changed and no longer starts with `[Upload]`." }
    ]
  },
  {
    version: "1.2", date: "2026-10-21", title: "Smarter upload page",
    changes: [
      { type: "new", text: "Typing a known course code shows the **course name** and picks the **subject**. A new course or subject asks for its name." },
      { type: "improved", text: "The upload form arrives completely filled in, including subject, kind of material and licence: only the file is left to attach." },
      { type: "improved", text: "Text pages (How to contribute, Help, Changelog) use the full page width." },
      { type: "new", text: "Help: **Removing or replacing a file**, for students and maintainers." },
      { type: "fixed", text: "**Kind of material** is now filled in the upload form too (GitHub used the old link name for its own setting)." },
      { type: "fixed", text: "Drop-downs and text boxes have the same height in every browser, including Safari." }
    ]
  },
  {
    version: "1.1", date: "2026-10-21", title: "Guided upload",
    changes: [
      { type: "improved", text: "**Upload** now opens the **How to contribute** page: enter your student number, build the file's ID, then open the upload form, which arrives filled in." },
      { type: "improved", text: "The upload button stays locked until the uploader ID, file ID, title and licence are complete. Material without an ID can still be uploaded with a separate link." }
    ]
  },
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
