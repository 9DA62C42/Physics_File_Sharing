// The Help page: a guide to every part of the site, in several languages.
// Text uses **bold** for the site's (English) button and menu names and `code` for codes and file names.
// Each section is { id, icon, title, blocks }, a block is { p }, { ul: [...] }, { ol: [...] }, { tip } or { code }.
window.HELP = (function () {
  var EXAMPLE = "01140086_LN_2627W_FULL_800012999 Waves Complete Learning Notes.pdf";

  var languages = [
    { code: "en", name: "English", dir: "ltr" },
    { code: "he", name: "עברית", dir: "rtl" },
    { code: "zh", name: "中文", dir: "ltr" },
    { code: "es", name: "Español", dir: "ltr" },
    { code: "fr", name: "Français", dir: "ltr" },
    { code: "de", name: "Deutsch", dir: "ltr" }
  ];

  var text = {};

  // ---------------------------------------------------------------- English
  text.en = {
    title: "Help & guide",
    subtitle: "Everything on this website and how to use it.",
    note: null,
    contents: "Contents",
    sections: [
      { id: "start", icon: "home", title: "Getting started", blocks: [
        { p: "Course File Sharing is a library of notes, problem-set solutions, formula sheets and lab reports shared by students, for any course. Everything is free to read." },
        { ul: [
          "**Sidebar** (left): everything you can open. On a phone, tap **☰** at the top to show it.",
          "**Search bar** (top): finds files by name, course, ID, uploader or licence. Press **/** to jump to it.",
          "**Upload** (top right): share a file through GitHub."
        ] }
      ] },
      { id: "find", icon: "files", title: "Finding files", blocks: [
        { ul: [
          "**Library**: **Home**, **All files**, **Recently added**, **Favorites** and the **ID system**.",
          "**Subjects**, **Courses** and **Material**: click the heading to open an overview page, then click an entry to see its files.",
          "Click the small arrow next to a sidebar heading to fold that section. The site remembers what you folded.",
          "In a file list you can filter by material, term, licence, verification and format, sort by name, ID, date or size, and switch between grid and list view.",
          "Click **☆** on a file to add it to **Favorites**. Favorites are saved in your browser only."
        ] },
        { tip: "Search understands IDs: type `01140086_HWS`, or the 6-digit short form of a course code such as `114086`." }
      ] },
      { id: "open", icon: "eye", title: "Opening a file", blocks: [
        { p: "Click a file's title or **Preview**. PDFs, images, text, LaTeX and code are shown on the page; Word, PowerPoint and Excel files open in Microsoft's viewer; notebooks open in nbviewer or Colab." },
        { p: "The panel on the right shows:" },
        { ul: [
          "**Download**, **New tab**, **Link** (copies a link to this file), **GitHub** and **History** (every change to the file).",
          "**Files in this item**: formats that belong together, such as a PDF and its LaTeX source.",
          "**Verification**: whether the owner or a collaborator has checked the file's course code, uploader and name (not its content).",
          "**ID**: the file's ID, explained field by field.",
          "**Uploader**: who shared the file, for example “Uploaded by A on behalf of B”.",
          "**Licence**: what you may do with the file (share, adapt, commercial use)."
        ] }
      ] },
      { id: "ids", icon: "id", title: "File IDs", blocks: [
        { p: "A file's ID is the start of its name. IDs are recommended, not required." },
        { code: EXAMPLE },
        { ul: [
          "`01140086`: the course code (8 digits).",
          "`LN`: the type, here a lecture note. Others: `HWS` homework solution, `HWQ` homework question, `PEQ` past exam question, `LBR` lab report…",
          "`2627W`: the term, here Winter 2026–27.",
          "`FULL`: the item, usually a number such as `01`.",
          "`800012999`: the student number of the person the file belongs to.",
          "After one space: a short title."
        ] },
        { p: "The **ID system** page has five tabs: **Look up** (decode or search an ID), **Build a name** (fill in a form and copy the file name), **Uploader IDs** (register your name), **Reference** (every code) and **Check files** (mistakes, duplicates, missing licences, unverified files)." }
      ] },
      { id: "upload", icon: "upload", title: "Uploading a file", blocks: [
        { ol: [
          "Click **Upload** at the top. The **How to contribute** page opens: first enter your **student number** (your uploader ID), then build the file's **ID** with the course code, kind of material, term, item, title and licence. When everything is ticked, click **Open the upload form**: it opens on GitHub with your answers filled in (sign in or create a free account first).",
          "**In the form, the only thing you need to do is attach your file**: drag it into the **Files** box and wait until it shows as a link. **Do not change the title** or the other answers. PDF is best; put LaTeX or other sources in one `.zip`, because GitHub doesn't accept `.tex` files. Up to 25 MB per file.",
          "Choose the subject and check the answers filled in from the website. The course name appears by itself for known course codes, and the subject is picked from the course. New course or subject? Give its name on the same page. You don't need to rename the file: the bot names it for you.",
          "Submit. Within a minute a bot replies on the issue. If something is missing, it says what; edit the issue (**···** → **Edit**) and it checks again. Otherwise it opens a pull request.",
          "A maintainer reviews the pull request. Once it's merged, the file appears on the site within a few minutes, credited to your GitHub account."
        ] },
        { tip: "Collaborators with write access can also add files directly (**Add file → Upload files** in a subject folder), naming them with **ID system → Build a name** and adding the licence to `licenses.json`." }
      ] },
      { id: "people", icon: "users", title: "Student numbers and uploaders", blocks: [
        { ul: [
          "The last part of an ID is your 9-digit student number. **It is public**, so leave it out if you prefer.",
          "Register your name in **ID system → Uploader IDs**, so your files show your name instead of “Student 123456789”.",
          "Add your GitHub username too: files you upload from that account show **✔ Uploader confirmed**.",
          "Uploading for a classmate? A maintainer records it in `uploads.json`, and the file shows “Uploaded by … on behalf of …”.",
          "The **Uploaders** page lists everyone who shares files."
        ] }
      ] },
      { id: "licence", icon: "book", title: "Licences", blocks: [
        { p: "Every file has its own licence. The licence is never part of the file name." },
        { ul: [
          "Set it in `licenses.json` (the name builder writes the line for you), or put `SPDX-License-Identifier: CC-BY-4.0` at the top of a text file.",
          "No licence stated means the author keeps all rights: read it here, but ask before copying or reusing it.",
          "Only license your own work. Course material keeps its owner's terms."
        ] },
        { p: "The Creative Commons codes are built from these parts:" },
        { ul: [
          "`CC` = Creative Commons",
          "`BY` = attribution: credit the author",
          "`SA` = share alike: adaptations must use the same licence",
          "`NC` = non-commercial: no commercial use",
          "`ND` = no derivatives: share only unchanged copies",
          "the `0` in `CC0` = no rights reserved"
        ] },
        { p: "All licence codes:" },
        { licences: { head: ["Code", "Licence", "Meaning", "Share", "Adapt", "Commercial"], meaning: {"CC0": "No conditions: use it for anything.", "PD": "Public domain: no longer under copyright.", "CCBY": "Share and adapt, even commercially, with credit.", "CCBYSA": "As CC BY; adaptations must use the same licence.", "CCBYNC": "Share and adapt with credit, but not commercially.", "CCBYNCSA": "Non-commercial, with credit; adaptations use the same licence.", "CCBYND": "Share unchanged copies with credit; no adaptations.", "CCBYNCND": "Share unchanged copies with credit, non-commercially.", "MIT": "Software licence: reuse freely, keep the copyright notice.", "GPL3": "Software licence: changed versions must also be GPL.", "STUDY": "Course material shared with permission: read it here for study only.", "ARR": "All rights reserved: read it here; ask the author for anything else."} } }
      ] },
      { id: "copyright", icon: "alert", title: "Copyright and what you may upload", blocks: [
        { ul: [
          "**OK to upload**: your own notes, summaries and solutions; material under a licence that allows sharing (for example CC BY or CC BY-NC-SA, like MIT OpenCourseWare); course files the lecturer allowed you to share.",
          "**Don't upload** without the owner's permission: textbooks, solution manuals, official exams, homework sheets or lecture slides. Never upload solutions to assignments that are still open.",
          "**Mixed work** (notes written on a printout): your notes are yours, but the page underneath belongs to its owner.",
          "**Using files**: everything here is for study. A file's licence says what else you may do; with no licence, ask the author before copying, adapting or resharing.",
          "**Removal**: if you own something posted here, or a file contains personal information, open the file and click **Report this file** (or **Report a file** at the bottom of every page). A maintainer reviews it, usually within a few days."
        ] },
        { tip: "Uploading confirms that you wrote the file or have permission to share it under the licence you chose. Maintainers can refuse or remove any file." }
      ] },
      { id: "verify", icon: "shield", title: "Verification (owner and collaborators)", blocks: [
        { tip: "**What it means:** a maintainer checked that the course code, the uploader (student number) and the file name are correct. It does **not** check or guarantee the content: notes may still contain mistakes, and verification is not a promise or endorsement." },
        { ol: [
          "Open a file and click **Verify this item**. GitHub opens a pre-filled issue; submit it.",
          "A workflow checks that you're the owner or a collaborator, records the verification and closes the issue. Requests from anyone else are refused.",
          "Verified items show **Verified** with who checked them and when. If a file changes afterwards, it shows **Changed** until it's checked again."
        ] },
        { p: "**Unverify** works the same way." }
      ] },
      { id: "requests", icon: "inbox", title: "File requests", blocks: [
        { ul: [
          "Looking for something? Open **File requests** and click **Request a file**.",
          "Have a requested file? Upload it with the form, then comment on the request with a link to your upload."
        ] }
      ] },
      { id: "tools", icon: "atom", title: "Physics tools", blocks: [
        { ul: [
          "**Physical constants**: CODATA 2022 values. The copy button copies a calculator-ready number.",
          "**Unit converter**: energy, length, mass, time, temperature, pressure, power, magnetic field and angle.",
          "**Resources**: useful free websites such as HyperPhysics, PhET, MIT OpenCourseWare, NIST and arXiv."
        ] }
      ] },
      { id: "look", icon: "sun", title: "Appearance", blocks: [
        { ul: [
          "At the bottom of the sidebar: **Theme** (system, light or dark) and **Accent** (orange or red).",
          "The site works on phones: tap **☰** to open the sidebar.",
          "Choose this guide's language with the buttons at the top of this page."
        ] }
      ] },
      { id: "rules", icon: "alert", title: "Rules and privacy", blocks: [
        { ul: [
          "Share only your own work, or material you have permission to share.",
          "Follow your university's academic-integrity rules: no solutions to open assignments, no private exams.",
          "Remove personal information such as phone numbers and grades. Everything here is public, and Git keeps old versions."
        ] }
      ] },
      { id: "delete", icon: "close", title: "Removing or replacing a file", blocks: [
        { p: "**Students** can't delete files. To have a file removed, open it and click **Report this file** (or **Report a file** at the bottom of any page). To replace it, upload the new version with the upload form, with a version after the item (e.g. `01_V02`), and ask in your upload for the old one to be removed." },
        { p: "**Maintainers** (owner and collaborators):" },
        { ol: [
          "Open the repository on GitHub and go to the file, e.g. `files/Waves/Notes/`.",
          "Click the file, then the **⋯** menu at the top right, then **Delete file**.",
          "Write a short message (e.g. `Remove Waves HW1 (copyright request)`), choose **Commit directly to the main branch** (tick the bypass-rules box if it appears) and click **Commit changes**.",
          "About a minute later the deploy finishes and the file is gone from the site."
        ] },
        { p: "**Then tidy up:**" },
        { ul: [
          "**The rest of the item**: a PDF and its source zip are one item; delete the zip too if the whole item should go.",
          "`licenses.json` and `uploads.json`: remove the file's rule (matched by `id` or `path`), keeping the commas between entries right.",
          "**Folders**: GitHub can't delete a folder in one step. Delete the files in it and the folder disappears; keep a `.gitkeep` file if the subject should stay with 0 files.",
          "**Verification** needs nothing: a deleted file simply stops showing."
        ] },
        { tip: "Deleting removes the file from the website and the current repository, but old copies stay in the Git history. If a file must vanish completely (for example personal information), the history has to be rewritten; ask a maintainer." }
      ] },
      { id: "setup", icon: "github", title: "Repository setup (owner)", blocks: [
        { ol: [
          "**Pages**: **Settings → Pages → Source** must be **GitHub Actions**. Otherwise the site shows no upload dates, uploaders or verification.",
          "**Labels**: create `file-request`, `uploader-code`, `upload` and `report` under **Issues → Labels**. The request, registration, upload and report forms add them automatically. Handle reports quickly: remove the file first, then reply.",
          "**Upload form**: under **Settings → Actions → General → Workflow permissions**, tick **Allow GitHub Actions to create and approve pull requests**. Merge uploads with **Create a merge commit** or **Rebase and merge**, not squash, so the student stays credited. New subjects and course names from the form arrive in the same pull request; check their spelling before merging.",
          "**Rules** (**Settings → Rules → Rulesets**): target **Include default branch** only, not **All branches**. Turn on **Restrict deletions**, **Block force pushes** and **Require a pull request before merging** (0 or 1 approvals). Keep **Repository admin** in the bypass list, and do not add **Write**, so collaborators also send pull requests.",
          "**Verification and rules**: the Verify button saves its records on a separate `verifications` branch, so rules on `main` don't block it. Don't target **All branches** or that branch, and don't delete it.",
          "**Registering students**: when someone opens a registration issue, check the 9-digit number, then add it to `uploaders.json`."
        ] }
      ] },
      { id: "trouble", icon: "help", title: "Problems?", blocks: [
        { ul: [
          "**My file doesn't appear**: check that your pull request was merged, wait a few minutes, then refresh with Ctrl+Shift+R (Cmd+Shift+R on a Mac).",
          "**“Couldn't load the file list”**: the site may be updating. Maintainers: check that **Settings → Pages → Source** is set to **GitHub Actions**.",
          "Anything else: open an issue on GitHub or ask a maintainer."
        ] }
      ] }
    ]
  };

  // ---------------------------------------------------------------- Hebrew
  text.he = {
    title: "עזרה ומדריך",
    subtitle: "כל מה שיש באתר ואיך משתמשים בו.",
    note: "הכפתורים והתפריטים באתר כתובים באנגלית; במדריך הזה השמות שלהם מופיעים ב**הדגשה**.",
    contents: "תוכן עניינים",
    sections: [
      { id: "start", icon: "home", title: "צעדים ראשונים", blocks: [
        { p: "Course File Sharing הוא ספרייה של סיכומים, פתרונות לתרגילים, דפי נוסחאות ודוחות מעבדה שסטודנטים משתפים, לכל קורס. הקריאה חופשית לכולם." },
        { ul: [
          "**סרגל צד** (משמאל): כל מה שאפשר לפתוח. בטלפון, הקישו על **☰** למעלה כדי להציג אותו.",
          "**שורת חיפוש** (למעלה): מוצאת קבצים לפי שם, קורס, מזהה, מעלה או רישיון. לחיצה על **/** קופצת אליה.",
          "**Upload** (למעלה מימין): שיתוף קובץ דרך GitHub."
        ] }
      ] },
      { id: "find", icon: "files", title: "מציאת קבצים", blocks: [
        { ul: [
          "**Library**: ‏**Home**, ‏**All files**, ‏**Recently added**, ‏**Favorites** ו-**ID system**.",
          "**Subjects**, ‏**Courses** ו-**Material**: לחיצה על הכותרת פותחת עמוד סקירה; לחיצה על פריט מציגה את הקבצים שלו.",
          "לחיצה על החץ הקטן ליד כותרת בסרגל הצד מקפלת את החלק. האתר זוכר מה קיפלתם.",
          "ברשימת קבצים אפשר לסנן לפי סוג חומר, סמסטר, רישיון, אימות ופורמט, למיין לפי שם, מזהה, תאריך או גודל, ולעבור בין תצוגת רשת לרשימה.",
          "לחיצה על **☆** מוסיפה קובץ ל-**Favorites**. המועדפים נשמרים רק בדפדפן שלכם."
        ] },
        { tip: "החיפוש מבין מזהים: הקלידו `01140086_HWS`, או את הצורה המקוצרת בת 6 הספרות של קוד קורס, למשל `114086`." }
      ] },
      { id: "open", icon: "eye", title: "פתיחת קובץ", blocks: [
        { p: "לחצו על שם הקובץ או על **Preview**. קובצי PDF, תמונות, טקסט, LaTeX וקוד מוצגים בעמוד; קובצי Word, ‏PowerPoint ו-Excel נפתחים במציג של Microsoft; מחברות נפתחות ב-nbviewer או ב-Colab." },
        { p: "בחלונית הצד מוצגים:" },
        { ul: [
          "**Download**, ‏**New tab**, ‏**Link** (מעתיק קישור לקובץ), ‏**GitHub** ו-**History** (כל השינויים בקובץ).",
          "**Files in this item**: פורמטים ששייכים יחד, למשל PDF וקוד המקור שלו ב-LaTeX.",
          "**Verification**: האם הבעלים או משתף פעולה בדקו את קוד הקורס, המעלה ושם הקובץ (לא את התוכן).",
          "**ID**: מזהה הקובץ, מוסבר שדה אחר שדה.",
          "**Uploader**: מי שיתף את הקובץ, למשל “Uploaded by A on behalf of B” (הועלה על ידי A בשם B).",
          "**Licence**: מה מותר לעשות בקובץ (לשתף, לעבד, שימוש מסחרי)."
        ] }
      ] },
      { id: "ids", icon: "id", title: "מזהי קבצים", blocks: [
        { p: "מזהה הקובץ הוא תחילת שמו. מומלץ להשתמש במזהה, אבל זה לא חובה." },
        { code: EXAMPLE },
        { ul: [
          "`01140086`: קוד הקורס (8 ספרות).",
          "`LN`: סוג הקובץ, כאן סיכום הרצאה. סוגים נוספים: `HWS` פתרון תרגיל בית, `HWQ` שאלות תרגיל בית, `PEQ` שאלות ממבחן קודם, `LBR` דוח מעבדה…",
          "`2627W`: הסמסטר, כאן חורף 2026–27.",
          "`FULL`: הפריט, בדרך כלל מספר כמו `01`.",
          "`800012999`: מספר הסטודנט של מי שהקובץ שייך לו.",
          "אחרי רווח אחד: כותרת קצרה."
        ] },
        { p: "בעמוד **ID system** יש חמש לשוניות: **Look up** (פענוח או חיפוש מזהה), ‏**Build a name** (ממלאים טופס ומעתיקים את שם הקובץ), ‏**Uploader IDs** (רישום השם שלכם), ‏**Reference** (כל הקודים) ו-**Check files** (שגיאות, כפילויות, קבצים בלי רישיון או בלי אימות)." }
      ] },
      { id: "upload", icon: "upload", title: "העלאת קובץ", blocks: [
        { ol: [
          "לחצו על **Upload** למעלה. נפתח העמוד **How to contribute**: קודם הזינו את **מספר הסטודנט** (מזהה המעלה), ואז בנו את **מזהה** הקובץ עם קוד הקורס, סוג החומר, הסמסטר, הפריט, הכותרת והרישיון. כשהכול מסומן, לחצו על **Open the upload form**: הטופס נפתח ב-GitHub עם התשובות שלכם (התחברו או צרו חשבון חינמי קודם).",
          "**בטופס, הדבר היחיד שצריך לעשות הוא לצרף את הקובץ**: גררו אותו לתיבה **Files** וחכו עד שהוא מופיע כקישור. **אל תשנו את הכותרת** או את שאר התשובות. עדיף PDF; קבצי LaTeX או מקור אחר שימו בקובץ `.zip` אחד, כי GitHub לא מקבל קבצי `.tex`. עד ‎25 MB לקובץ.",
          "בחרו מקצוע ובדקו את התשובות שמולאו מהאתר. שם הקורס מופיע מעצמו לקודי קורס מוכרים, והמקצוע נבחר לפי הקורס. קורס או מקצוע חדש? כתבו את שמו באותו עמוד. אין צורך לשנות את שם הקובץ: הבוט נותן לו שם.",
          "שלחו. תוך דקה בוט עונה ב-issue. אם חסר משהו, הוא כותב מה; ערכו את ה-issue (**···** → **Edit**) והבדיקה תרוץ שוב. אחרת הוא פותח pull request.",
          "מתחזק בודק את ה-pull request. אחרי המיזוג הקובץ מופיע באתר תוך כמה דקות, בשם חשבון ה-GitHub שלכם."
        ] },
        { tip: "משתפי פעולה עם הרשאת כתיבה יכולים גם להוסיף קבצים ישירות (**Add file → Upload files** בתיקיית המקצוע), לתת שם בעזרת **ID system → Build a name** ולהוסיף את הרישיון ל-`licenses.json`." }
      ] },
      { id: "people", icon: "users", title: "מספרי סטודנט ומעלים", blocks: [
        { ul: [
          "החלק האחרון של המזהה הוא מספר הסטודנט שלכם בן 9 הספרות. **הוא גלוי לכולם**, אז אפשר להשמיט אותו אם תעדיפו.",
          "רשמו את שמכם ב-**ID system → Uploader IDs** כדי שהקבצים יציגו את שמכם במקום “Student 123456789”.",
          "הוסיפו גם את שם המשתמש שלכם ב-GitHub: קבצים שתעלו מהחשבון הזה יסומנו **✔ Uploader confirmed** (המעלה אומת).",
          "מעלים בשביל חבר לכיתה? מנהל רושם זאת ב-`uploads.json`, והקובץ יציג “Uploaded by … on behalf of …”.",
          "בעמוד **Uploaders** מופיעים כל מי שמשתפים קבצים."
        ] }
      ] },
      { id: "licence", icon: "book", title: "רישיונות", blocks: [
        { p: "לכל קובץ יש רישיון משלו. הרישיון אף פעם אינו חלק משם הקובץ." },
        { ul: [
          "קובעים אותו ב-`licenses.json` (בונה השמות כותב את השורה בשבילכם), או כותבים `SPDX-License-Identifier: CC-BY-4.0` בראש קובץ טקסט.",
          "אם לא צוין רישיון, כל הזכויות שמורות למחבר: אפשר לקרוא כאן, אבל צריך לבקש רשות לפני העתקה או שימוש חוזר.",
          "תנו רישיון רק לעבודה שלכם. חומרי קורס נשארים בתנאים של בעליהם."
        ] },
        { p: "קודי Creative Commons בנויים מהחלקים האלה:" },
        { ul: [
          "`CC` = Creative Commons",
          "`BY` = ייחוס: יש לציין את שם המחבר",
          "`SA` = שיתוף זהה: עיבודים חייבים להיות תחת אותו רישיון",
          "`NC` = לא מסחרי: אסור שימוש מסחרי",
          "`ND` = ללא יצירות נגזרות: מותר לשתף רק עותקים ללא שינוי",
          "ה-`0` ב-`CC0` = ללא שמירת זכויות"
        ] },
        { p: "כל קודי הרישיונות:" },
        { licences: { head: ["קוד", "רישיון", "משמעות", "שיתוף", "עיבוד", "מסחרי"], meaning: {"CC0": "ללא תנאים: מותר כל שימוש.", "PD": "נחלת הכלל: כבר לא מוגן בזכויות יוצרים.", "CCBY": "מותר לשתף ולעבד, גם מסחרית, עם ייחוס.", "CCBYSA": "כמו CC BY; עיבודים חייבים להיות תחת אותו רישיון.", "CCBYNC": "מותר לשתף ולעבד עם ייחוס, אבל לא מסחרית.", "CCBYNCSA": "לא מסחרי, עם ייחוס; עיבודים תחת אותו רישיון.", "CCBYND": "מותר לשתף עותקים ללא שינוי, עם ייחוס; בלי עיבודים.", "CCBYNCND": "מותר לשתף עותקים ללא שינוי, עם ייחוס, לא מסחרית.", "MIT": "רישיון תוכנה: שימוש חופשי, יש לשמור את הודעת זכויות היוצרים.", "GPL3": "רישיון תוכנה: גרסאות משונות חייבות להיות גם הן GPL.", "STUDY": "חומר קורס ששותף ברשות: לקריאה כאן לצורכי לימוד בלבד.", "ARR": "כל הזכויות שמורות: אפשר לקרוא כאן; לכל דבר אחר יש לבקש מהמחבר."} } }
      ] },
      { id: "copyright", icon: "alert", title: "זכויות יוצרים ומה מותר להעלות", blocks: [
        { ul: [
          "**מותר להעלות**: סיכומים, הערות ופתרונות שכתבתם בעצמכם; חומר ברישיון שמתיר שיתוף (למשל CC BY או CC BY-NC-SA, כמו MIT OpenCourseWare); קבצי קורס שהמרצה התיר לשתף.",
          "**אין להעלות** בלי אישור הבעלים: ספרי לימוד, פתרונונים, מבחנים רשמיים, דפי תרגילים או מצגות הרצאה. לעולם אל תעלו פתרונות למטלות שעדיין פתוחות.",
          "**עבודה משולבת** (הערות על דף מודפס): ההערות שלכם, אבל הדף עצמו שייך לבעליו.",
          "**שימוש בקבצים**: הכול כאן לצורכי לימוד. הרישיון של קובץ קובע מה עוד מותר; בלי רישיון, בקשו רשות מהמחבר לפני העתקה, עיבוד או שיתוף מחדש.",
          "**הסרה**: אם יש לכם זכויות על משהו שפורסם כאן, או שקובץ מכיל מידע אישי, פתחו את הקובץ ולחצו על **Report this file** (או **Report a file** בתחתית כל עמוד). מתחזק בודק את הדיווח, בדרך כלל תוך כמה ימים."
        ] },
        { tip: "העלאה מאשרת שכתבתם את הקובץ או שיש לכם רשות לשתף אותו ברישיון שבחרתם. המתחזקים רשאים לסרב לכל קובץ או להסיר אותו." }
      ] },
      { id: "verify", icon: "shield", title: "אימות (בעלים ומשתפי פעולה)", blocks: [
        { tip: "**מה זה אומר:** מתחזק בדק שקוד הקורס, המעלה (מספר הסטודנט) ושם הקובץ נכונים. האימות **אינו** בודק את התוכן ואינו מבטיח אותו: ייתכנו טעויות בחומר, והאימות אינו התחייבות או המלצה." },
        { ol: [
          "פתחו קובץ ולחצו על **Verify this item**. ‏GitHub פותח issue ממולא מראש; שלחו אותו.",
          "תהליך אוטומטי בודק שאתם הבעלים או משתפי פעולה, רושם את האימות וסוגר את ה-issue. בקשות של אחרים נדחות.",
          "פריטים מאומתים מסומנים **Verified**, עם מי שבדק ומתי. אם הקובץ משתנה אחר כך, הוא מסומן **Changed** עד שייבדק שוב."
        ] },
        { p: "**Unverify** (ביטול אימות) עובד באותה דרך." }
      ] },
      { id: "requests", icon: "inbox", title: "בקשות לקבצים", blocks: [
        { ul: [
          "מחפשים משהו? פתחו את **File requests** ולחצו על **Request a file**.",
          "יש לכם קובץ שביקשו? העלו אותו בטופס, ואז הגיבו על הבקשה עם קישור להעלאה שלכם."
        ] }
      ] },
      { id: "tools", icon: "atom", title: "כלים לפיזיקה", blocks: [
        { ul: [
          "**Physical constants**: קבועים פיזיקליים לפי CODATA 2022. כפתור ההעתקה מעתיק מספר מוכן למחשבון.",
          "**Unit converter**: המרת יחידות של אנרגיה, אורך, מסה, זמן, טמפרטורה, לחץ, הספק, שדה מגנטי וזווית.",
          "**Resources**: אתרים חינמיים שימושיים, כמו HyperPhysics, ‏PhET, ‏MIT OpenCourseWare, ‏NIST ו-arXiv."
        ] }
      ] },
      { id: "look", icon: "sun", title: "מראה", blocks: [
        { ul: [
          "בתחתית סרגל הצד: **Theme** (מערכת, בהיר או כהה) ו-**Accent** (כתום או אדום).",
          "האתר עובד גם בטלפון: הקישו על **☰** כדי לפתוח את סרגל הצד.",
          "את שפת המדריך בוחרים בכפתורים בראש העמוד."
        ] }
      ] },
      { id: "rules", icon: "alert", title: "כללים ופרטיות", blocks: [
        { ul: [
          "שתפו רק עבודה שלכם, או חומר שיש לכם רשות לשתף.",
          "הקפידו על כללי היושר האקדמי של האוניברסיטה: בלי פתרונות לתרגילים פתוחים ובלי מבחנים פרטיים.",
          "הסירו מידע אישי כמו מספרי טלפון וציונים. כל מה שכאן גלוי לכולם, ו-Git שומר גרסאות קודמות."
        ] }
      ] },
      { id: "delete", icon: "close", title: "הסרה או החלפה של קובץ", blocks: [
        { p: "**סטודנטים** לא יכולים למחוק קבצים. כדי שקובץ יוסר, פתחו אותו ולחצו על **Report this file** (או **Report a file** בתחתית כל עמוד). כדי להחליף אותו, העלו את הגרסה החדשה בטופס ההעלאה עם גרסה אחרי הפריט (למשל `01_V02`), ובקשו בהעלאה שהישנה תוסר." },
        { p: "**מתחזקים** (בעלים ומשתפי פעולה):" },
        { ol: [
          "פתחו את המאגר ב-GitHub ועברו לקובץ, למשל `files/Waves/Notes/`.",
          "לחצו על הקובץ, אחר כך על התפריט **⋯** למעלה מימין, ואז **Delete file**.",
          "כתבו הודעה קצרה (למשל `Remove Waves HW1 (copyright request)`), בחרו **Commit directly to the main branch** (סמנו את תיבת עקיפת הכללים אם היא מופיעה) ולחצו **Commit changes**.",
          "כעבור כדקה הפריסה מסתיימת והקובץ נעלם מהאתר."
        ] },
        { p: "**אחר כך סדרו:**" },
        { ul: [
          "**שאר הפריט**: PDF וקובץ ה-zip של המקור הם פריט אחד; מחקו גם את ה-zip אם כל הפריט צריך לרדת.",
          "`licenses.json` ו-`uploads.json`: הסירו את הכלל של הקובץ (לפי `id` או `path`), ושמרו על הפסיקים בין הרשומות.",
          "**תיקיות**: ‏GitHub לא מוחק תיקייה בצעד אחד. מחקו את הקבצים שבה והתיקייה תיעלם; השאירו קובץ `.gitkeep` אם המקצוע צריך להישאר עם 0 קבצים.",
          "**אימות** לא דורש דבר: קובץ שנמחק פשוט מפסיק להופיע."
        ] },
        { tip: "המחיקה מסירה את הקובץ מהאתר ומהמאגר הנוכחי, אבל עותקים ישנים נשארים בהיסטוריית Git. אם קובץ חייב להיעלם לגמרי (למשל מידע אישי), צריך לשכתב את ההיסטוריה; פנו למתחזק." }
      ] },
      { id: "setup", icon: "github", title: "הגדרת המאגר (בעלים)", blocks: [
        { ol: [
          "**Pages**: ב-**Settings → Pages → Source** יש לבחור **GitHub Actions**. אחרת האתר לא יציג תאריכי העלאה, מעלים ואימות.",
          "**תוויות**: צרו `file-request`, `uploader-code`, `upload` ו-`report` תחת **Issues → Labels**. טופסי הבקשה, ההרשמה, ההעלאה והדיווח מוסיפים אותן אוטומטית. טפלו בדיווחים מהר: קודם הסירו את הקובץ, אחר כך ענו.",
          "**טופס ההעלאה**: ב-**Settings → Actions → General → Workflow permissions** סמנו **Allow GitHub Actions to create and approve pull requests**. מזגו העלאות עם **Create a merge commit** או **Rebase and merge**, לא squash, כדי שהסטודנט יישאר מקבל הקרדיט. מקצועות ושמות קורסים חדשים מהטופס מגיעים באותו pull request; בדקו את האיות לפני המיזוג.",
          "**כללים** (**Settings → Rules → Rulesets**): בחרו יעד **Include default branch** בלבד, לא **All branches**. הפעילו **Restrict deletions**, **Block force pushes** ו-**Require a pull request before merging** (0 או 1 אישורים). השאירו **Repository admin** ברשימת העקיפה, ואל תוסיפו **Write**, כדי שגם משתפי פעולה ישלחו pull request.",
          "**אימות וכללים**: כפתור האימות שומר את הרשומות בענף נפרד בשם `verifications`, כך שכללים על `main` לא חוסמים אותו. אל תכוונו כללים ל-**All branches** או לענף הזה, ואל תמחקו אותו.",
          "**רישום סטודנטים**: כשמישהו פותח issue הרשמה, בדקו את המספר בן 9 הספרות והוסיפו אותו ל-`uploaders.json`."
        ] }
      ] },
      { id: "trouble", icon: "help", title: "בעיות?", blocks: [
        { ul: [
          "**הקובץ שלי לא מופיע**: ודאו שבקשת המשיכה מוזגה, חכו כמה דקות ורעננו עם Ctrl+Shift+R ‏(Cmd+Shift+R במק).",
          "**“Couldn't load the file list”** (לא ניתן לטעון את רשימת הקבצים): ייתכן שהאתר מתעדכן. מנהלים: ודאו ש-**Settings → Pages → Source** מוגדר ל-**GitHub Actions**.",
          "לכל דבר אחר: פתחו issue ב-GitHub או פנו למנהל."
        ] }
      ] }
    ]
  };

  // ---------------------------------------------------------------- Chinese (Simplified)
  text.zh = {
    title: "帮助与指南",
    subtitle: "本网站的全部功能及使用方法。",
    note: "网站上的按钮和菜单是英文的；本指南中用**粗体**标出它们的英文名称。",
    contents: "目录",
    sections: [
      { id: "start", icon: "home", title: "快速入门", blocks: [
        { p: "Course File Sharing 是一个由学生分享的资料库，涵盖任何课程，包括笔记、习题解答、公式表和实验报告。所有内容都可以免费阅读。" },
        { ul: [
          "**侧边栏**（左侧）：可以打开的所有页面。在手机上，点击顶部的 **☰** 显示侧边栏。",
          "**搜索栏**（顶部）：按文件名、课程、编号（ID）、上传者或许可证查找文件。按 **/** 可直接跳到搜索栏。",
          "**Upload**（右上角）：通过 GitHub 分享文件。"
        ] }
      ] },
      { id: "find", icon: "files", title: "查找文件", blocks: [
        { ul: [
          "**Library**（资料库）：**Home**、**All files**、**Recently added**、**Favorites** 和 **ID system**。",
          "**Subjects**、**Courses** 和 **Material**：点击标题打开概览页面，再点击某一项查看其中的文件。",
          "点击侧边栏标题旁的小箭头可以折叠该部分，网站会记住你的折叠状态。",
          "在文件列表中，可以按资料类型、学期、许可证、审核状态和格式筛选，按名称、编号、日期或大小排序，并在网格视图和列表视图之间切换。",
          "点击文件上的 **☆** 可加入 **Favorites**（收藏）。收藏只保存在你的浏览器中。"
        ] },
        { tip: "搜索支持编号：输入 `01140086_HWS`，或课程代码的 6 位简写，例如 `114086`。" }
      ] },
      { id: "open", icon: "eye", title: "打开文件", blocks: [
        { p: "点击文件标题或 **Preview**。PDF、图片、文本、LaTeX 和代码会直接显示在页面上；Word、PowerPoint 和 Excel 文件用微软的在线查看器打开；Jupyter 笔记本可在 nbviewer 或 Colab 中打开。" },
        { p: "右侧面板显示：" },
        { ul: [
          "**Download**、**New tab**、**Link**（复制此文件的链接）、**GitHub** 和 **History**（文件的全部修改记录）。",
          "**Files in this item**：属于同一份资料的不同格式，例如 PDF 及其 LaTeX 源文件。",
          "**Verification**：仓库所有者或协作者是否已核对此文件的课程代码、上传者和文件名（不含内容）。",
          "**ID**：文件编号，逐项解释。",
          "**Uploader**：谁分享了这个文件，例如 “Uploaded by A on behalf of B”（由 A 代 B 上传）。",
          "**Licence**：你可以如何使用此文件（分享、修改、商用）。"
        ] }
      ] },
      { id: "ids", icon: "id", title: "文件编号（ID）", blocks: [
        { p: "文件编号是文件名的开头部分。建议使用，但不是必须的。" },
        { code: EXAMPLE },
        { ul: [
          "`01140086`：课程代码（8 位数字）。",
          "`LN`：类型，这里是课堂笔记。其他类型：`HWS` 作业解答、`HWQ` 作业题目、`PEQ` 往年考题、`LBR` 实验报告……",
          "`2627W`：学期，这里是 2026–27 学年冬季学期。",
          "`FULL`：条目，通常是一个编号，例如 `01`。",
          "`800012999`：文件所属学生的学号。",
          "空一格之后：简短的标题。"
        ] },
        { p: "**ID system** 页面有五个标签页：**Look up**（解读或搜索编号）、**Build a name**（填写表单并复制文件名）、**Uploader IDs**（登记你的姓名）、**Reference**（全部代码说明）和 **Check files**（错误、重复、缺少许可证或未审核的文件）。" }
      ] },
      { id: "upload", icon: "upload", title: "上传文件", blocks: [
        { ol: [
          "点击顶部的 **Upload**，会打开 **How to contribute** 页面：先输入你的 **学号**（上传者 ID），再用课程代码、资料类型、学期、条目、标题和许可证生成文件 **ID**。全部打勾后点击 **Open the upload form**：GitHub 上的表单会自动填好你的答案（需先登录或注册免费账号）。",
          "**在表单里，你唯一需要做的就是附上文件**：把文件拖进 **Files** 框，等它显示为链接。**不要修改标题**或其他答案。最好上传 PDF；LaTeX 等源文件请打包成一个 `.zip`，因为 GitHub 不接受 `.tex` 文件。每个文件最大 25 MB。",
          "选择学科，并检查从网站自动填入的答案。已知课程代码会自动显示课程名称，并按课程选好学科。新课程或新学科？在同一页面填写名称即可。不用自己改文件名，机器人会替你命名。",
          "提交。一分钟内机器人会在 issue 中回复。如果缺少信息，它会说明缺什么；编辑该 issue（**···** → **Edit**）后会重新检查。否则它会创建一个拉取请求（pull request）。",
          "维护者审核这个拉取请求。合并后，文件会在几分钟内出现在网站上，并署名你的 GitHub 账号。"
        ] },
        { tip: "有写入权限的协作者也可以直接添加文件（在学科文件夹中选择 **Add file → Upload files**），用 **ID system → Build a name** 命名，并在 `licenses.json` 中添加许可证。" }
      ] },
      { id: "people", icon: "users", title: "学号与上传者", blocks: [
        { ul: [
          "编号的最后一部分是你的 9 位学号。**学号是公开的**，如果不想公开可以不写。",
          "在 **ID system → Uploader IDs** 登记姓名后，你的文件会显示你的名字，而不是 “Student 123456789”。",
          "再登记你的 GitHub 用户名：从该账号上传的文件会显示 **✔ Uploader confirmed**（上传者已确认）。",
          "替同学上传？由管理员在 `uploads.json` 中记录，文件会显示 “Uploaded by … on behalf of …”。",
          "**Uploaders** 页面列出所有分享文件的人。"
        ] }
      ] },
      { id: "licence", icon: "book", title: "许可证", blocks: [
        { p: "每个文件都有自己的许可证。许可证永远不写在文件名里。" },
        { ul: [
          "在 `licenses.json` 中设置（命名工具会帮你生成这一行），或在文本文件开头写上 `SPDX-License-Identifier: CC-BY-4.0`。",
          "未注明许可证，表示作者保留所有权利：可以在这里阅读，但复制或再使用前需征得同意。",
          "只能为你自己的作品选择许可证。课程资料沿用其所有者的条款。"
        ] },
        { p: "Creative Commons 代码由以下部分组成：" },
        { ul: [
          "`CC` = 知识共享（Creative Commons）",
          "`BY` = 署名：须注明作者",
          "`SA` = 相同方式共享：改编作品须使用相同许可证",
          "`NC` = 非商业性使用：不得商用",
          "`ND` = 禁止演绎：只能分享未经修改的副本",
          "`CC0` 中的 `0` = 不保留任何权利"
        ] },
        { p: "全部许可证代码：" },
        { licences: { head: ["代码", "许可证", "含义", "分享", "改编", "商用"], meaning: {"CC0": "无任何条件：可用于任何用途。", "PD": "公有领域：已不受版权保护。", "CCBY": "可分享和改编，包括商用，但须署名。", "CCBYSA": "同 CC BY；改编作品须使用相同许可证。", "CCBYNC": "可分享和改编，须署名，但不得商用。", "CCBYNCSA": "非商业、须署名；改编作品使用相同许可证。", "CCBYND": "可分享未经修改的副本，须署名；不得改编。", "CCBYNCND": "可分享未经修改的副本，须署名，不得商用。", "MIT": "软件许可证：可自由使用，须保留版权声明。", "GPL3": "软件许可证：修改后的版本也必须使用 GPL。", "STUDY": "经许可分享的课程资料：仅限在此阅读学习。", "ARR": "保留所有权利：可在此阅读；其他用途须征得作者同意。"} } }
      ] },
      { id: "copyright", icon: "alert", title: "版权与可上传内容", blocks: [
        { ul: [
          "**可以上传**：你自己写的笔记、总结和解答；许可证允许分享的资料（例如 CC BY 或 CC BY-NC-SA，如 MIT OpenCourseWare）；任课老师允许分享的课程文件。",
          "**未经所有者许可不要上传**：教科书、习题解答手册、正式考试、作业题或课件。绝不要上传仍在进行中的作业的解答。",
          "**混合作品**（在打印件上写的笔记）：笔记归你，但底下的页面归原作者所有。",
          "**使用文件**：这里的一切仅供学习。文件的许可证说明你还能做什么；没有许可证时，复制、改编或再次分享前请先征得作者同意。",
          "**删除**：如果你拥有这里某个文件的版权，或文件中含有个人信息，请打开该文件并点击 **Report this file**（或每页底部的 **Report a file**）。维护者会审核，通常在几天内处理。"
        ] },
        { tip: "上传即表示你确认文件是你写的，或你有权以所选许可证分享它。维护者可以拒绝或删除任何文件。" }
      ] },
      { id: "verify", icon: "shield", title: "审核（所有者和协作者）", blocks: [
        { tip: "**含义：**维护者核对了课程代码、上传者（学号）和文件名是否正确。审核**不**检查也不保证内容：资料中仍可能有错误，审核不代表任何承诺或认可。" },
        { ol: [
          "打开文件，点击 **Verify this item**。GitHub 会打开一个已填好的 issue，提交即可。",
          "自动流程会检查你是否为所有者或协作者，记录审核结果并关闭该 issue。其他人的请求会被拒绝。",
          "已审核的条目显示 **Verified**，并注明审核人和时间。如果文件之后被修改，会显示 **Changed**，直到再次审核。"
        ] },
        { p: "**Unverify**（取消审核）的操作方式相同。" }
      ] },
      { id: "requests", icon: "inbox", title: "文件请求", blocks: [
        { ul: [
          "在找资料？打开 **File requests**，点击 **Request a file**。",
          "你有别人请求的文件？用上传表单上传，然后在该请求下留言并附上你的上传链接。"
        ] }
      ] },
      { id: "tools", icon: "atom", title: "物理工具", blocks: [
        { ul: [
          "**Physical constants**：CODATA 2022 物理常数。复制按钮会复制可直接用于计算器的数值。",
          "**Unit converter**：能量、长度、质量、时间、温度、压强、功率、磁场和角度的单位换算。",
          "**Resources**：实用的免费网站，例如 HyperPhysics、PhET、MIT OpenCourseWare、NIST 和 arXiv。"
        ] }
      ] },
      { id: "look", icon: "sun", title: "外观", blocks: [
        { ul: [
          "侧边栏底部：**Theme**（跟随系统、浅色或深色）和 **Accent**（橙色或红色）。",
          "网站支持手机：点击 **☰** 打开侧边栏。",
          "本指南的语言可以用页面顶部的按钮切换。"
        ] }
      ] },
      { id: "rules", icon: "alert", title: "规则与隐私", blocks: [
        { ul: [
          "只分享你自己的作品，或你有权分享的资料。",
          "遵守学校的学术诚信规定：不要上传尚未截止作业的答案或不公开的考试。",
          "删除个人信息，例如电话号码和成绩。这里的一切都是公开的，而且 Git 会保留旧版本。"
        ] }
      ] },
      { id: "delete", icon: "close", title: "删除或替换文件", blocks: [
        { p: "**学生**不能删除文件。如需删除某个文件，请打开它并点击 **Report this file**（或每页底部的 **Report a file**）。如需替换，请用上传表单上传新版本，并在条目后加上版本号（例如 `01_V02`），同时在上传中说明需要删除旧版本。" },
        { p: "**维护者**（所有者和协作者）：" },
        { ol: [
          "在 GitHub 上打开仓库，进入文件所在位置，例如 `files/Waves/Notes/`。",
          "点击该文件，再点右上角的 **⋯** 菜单，选择 **Delete file**。",
          "写一句简短说明（例如 `Remove Waves HW1 (copyright request)`），选择 **Commit directly to the main branch**（如出现绕过规则的勾选框请勾选），然后点击 **Commit changes**。",
          "大约一分钟后部署完成，文件就会从网站上消失。"
        ] },
        { p: "**然后整理：**" },
        { ul: [
          "**同一条目的其他文件**：PDF 和它的源文件 zip 是同一个条目；如果整个条目都要删除，也请删除 zip。",
          "`licenses.json` 和 `uploads.json`：删除该文件的规则（按 `id` 或 `path` 匹配），注意条目之间的逗号。",
          "**文件夹**：GitHub 不能一步删除文件夹。删除其中的文件后文件夹会自动消失；如果学科需要保留（显示 0 个文件），请保留一个 `.gitkeep` 文件。",
          "**审核**无需处理：被删除的文件会自动不再显示。"
        ] },
        { tip: "删除会把文件从网站和当前仓库中移除，但旧副本仍保留在 Git 历史中。如果文件必须彻底消失（例如含有个人信息），需要重写历史；请联系维护者。" }
      ] },
      { id: "setup", icon: "github", title: "仓库设置（所有者）", blocks: [
        { ol: [
          "**Pages**：**Settings → Pages → Source** 必须设为 **GitHub Actions**，否则网站不会显示上传日期、上传者和审核信息。",
          "**标签**：在 **Issues → Labels** 中创建 `file-request`、`uploader-code`、`upload` 和 `report`。请求、注册、上传和举报表单会自动添加这些标签。请尽快处理举报：先删除文件，再回复。",
          "**上传表单**：在 **Settings → Actions → General → Workflow permissions** 中勾选 **Allow GitHub Actions to create and approve pull requests**。合并上传时用 **Create a merge commit** 或 **Rebase and merge**，不要用 squash，这样上传者的署名才会保留。表单中新增的学科和课程名称会包含在同一个拉取请求里；合并前请检查拼写。",
          "**规则**（**Settings → Rules → Rulesets**）：目标只选 **Include default branch**，不要选 **All branches**。开启 **Restrict deletions**、**Block force pushes** 和 **Require a pull request before merging**（0 或 1 个批准）。绕过列表保留 **Repository admin**，不要添加 **Write**，这样协作者也要通过 pull request 提交。",
          "**审核与规则**：审核按钮把记录保存在单独的 `verifications` 分支上，因此 `main` 上的规则不会阻止它。规则不要以 **All branches** 或该分支为目标，也不要删除该分支。",
          "**登记学生**：有人提交注册 issue 时，核对 9 位学号，然后把它加入 `uploaders.json`。"
        ] }
      ] },
      { id: "trouble", icon: "help", title: "遇到问题？", blocks: [
        { ul: [
          "**我的文件没有显示**：确认拉取请求已合并，等几分钟，然后按 Ctrl+Shift+R（Mac 上按 Cmd+Shift+R）刷新。",
          "**“Couldn't load the file list”**（无法加载文件列表）：网站可能正在更新。管理员请检查 **Settings → Pages → Source** 是否设置为 **GitHub Actions**。",
          "其他问题：在 GitHub 上提交 issue，或联系管理员。"
        ] }
      ] }
    ]
  };

  // ---------------------------------------------------------------- Spanish
  text.es = {
    title: "Ayuda y guía",
    subtitle: "Todo lo que hay en este sitio y cómo usarlo.",
    note: "Los botones y menús del sitio están en inglés; en esta guía sus nombres aparecen en **negrita**.",
    contents: "Contenido",
    sections: [
      { id: "start", icon: "home", title: "Primeros pasos", blocks: [
        { p: "Course File Sharing es una biblioteca de apuntes, soluciones de ejercicios, formularios e informes de laboratorio compartidos por estudiantes, de cualquier curso. Todo se puede leer gratis." },
        { ul: [
          "**Barra lateral** (izquierda): todo lo que puedes abrir. En el móvil, toca **☰** arriba para mostrarla.",
          "**Barra de búsqueda** (arriba): encuentra archivos por nombre, curso, ID, quién los subió o licencia. Pulsa **/** para ir a ella.",
          "**Upload** (arriba a la derecha): comparte un archivo a través de GitHub."
        ] }
      ] },
      { id: "find", icon: "files", title: "Buscar archivos", blocks: [
        { ul: [
          "**Library**: **Home**, **All files**, **Recently added**, **Favorites** y el **ID system**.",
          "**Subjects**, **Courses** y **Material**: haz clic en el título para abrir una página de resumen y luego en un elemento para ver sus archivos.",
          "Haz clic en la flechita junto a un título de la barra lateral para plegar esa sección. El sitio recuerda lo que has plegado.",
          "En una lista de archivos puedes filtrar por tipo de material, cuatrimestre, licencia, verificación y formato, ordenar por nombre, ID, fecha o tamaño, y cambiar entre vista de cuadrícula y de lista.",
          "Haz clic en **☆** para añadir un archivo a **Favorites**. Los favoritos solo se guardan en tu navegador."
        ] },
        { tip: "La búsqueda entiende IDs: escribe `01140086_HWS`, o la forma corta de 6 dígitos de un código de curso, como `114086`." }
      ] },
      { id: "open", icon: "eye", title: "Abrir un archivo", blocks: [
        { p: "Haz clic en el título de un archivo o en **Preview**. Los PDF, imágenes, textos, LaTeX y código se muestran en la página; los archivos de Word, PowerPoint y Excel se abren en el visor de Microsoft; los cuadernos se abren en nbviewer o Colab." },
        { p: "El panel de la derecha muestra:" },
        { ul: [
          "**Download**, **New tab**, **Link** (copia un enlace a este archivo), **GitHub** y **History** (todos los cambios del archivo).",
          "**Files in this item**: formatos que van juntos, como un PDF y su código fuente LaTeX.",
          "**Verification**: si el propietario o un colaborador ha comprobado el código del curso, quién lo subió y el nombre del archivo (no su contenido).",
          "**ID**: el ID del archivo, explicado campo por campo.",
          "**Uploader**: quién compartió el archivo, por ejemplo “Uploaded by A on behalf of B” (subido por A en nombre de B).",
          "**Licence**: lo que puedes hacer con el archivo (compartir, adaptar, uso comercial)."
        ] }
      ] },
      { id: "ids", icon: "id", title: "IDs de archivo", blocks: [
        { p: "El ID de un archivo es el comienzo de su nombre. Se recomienda usarlo, pero no es obligatorio." },
        { code: EXAMPLE },
        { ul: [
          "`01140086`: el código del curso (8 dígitos).",
          "`LN`: el tipo, aquí apuntes de clase. Otros: `HWS` solución de tarea, `HWQ` enunciado de tarea, `PEQ` pregunta de examen anterior, `LBR` informe de laboratorio…",
          "`2627W`: el período, aquí invierno 2026–27.",
          "`FULL`: el elemento, normalmente un número como `01`.",
          "`800012999`: el número de estudiante de la persona a quien pertenece el archivo.",
          "Tras un espacio: un título corto."
        ] },
        { p: "La página **ID system** tiene cinco pestañas: **Look up** (descifrar o buscar un ID), **Build a name** (rellenar un formulario y copiar el nombre del archivo), **Uploader IDs** (registrar tu nombre), **Reference** (todos los códigos) y **Check files** (errores, duplicados, archivos sin licencia o sin verificar)." }
      ] },
      { id: "upload", icon: "upload", title: "Subir un archivo", blocks: [
        { ol: [
          "Haz clic en **Upload** arriba. Se abre la página **How to contribute**: primero escribe tu **número de estudiante** (tu ID de quien sube) y luego crea el **ID** del archivo con el código del curso, el tipo de material, el cuatrimestre, el elemento, el título y la licencia. Cuando todo esté marcado, haz clic en **Open the upload form**: se abre en GitHub con tus respuestas ya puestas (antes inicia sesión o crea una cuenta gratuita).",
          "**En el formulario, lo único que tienes que hacer es adjuntar tu archivo**: arrástralo al cuadro **Files** y espera a que aparezca como enlace. **No cambies el título** ni las demás respuestas. Mejor en PDF; pon LaTeX u otras fuentes en un solo `.zip`, porque GitHub no acepta archivos `.tex`. Hasta 25 MB por archivo.",
          "Elige la asignatura y revisa las respuestas que vienen del sitio. Con un código de curso conocido, el nombre del curso aparece solo y la asignatura se elige según el curso. ¿Curso o asignatura nuevos? Escribe su nombre en la misma página. No hace falta renombrar el archivo: el bot le pone nombre.",
          "Envíalo. En un minuto un bot responde en la incidencia. Si falta algo, dice qué; edita la incidencia (**···** → **Edit**) y vuelve a comprobarla. Si todo está bien, abre una solicitud de cambios (pull request).",
          "Un responsable revisa la solicitud. Cuando se fusiona, el archivo aparece en el sitio en pocos minutos, atribuido a tu cuenta de GitHub."
        ] },
        { tip: "Los colaboradores con permiso de escritura también pueden añadir archivos directamente (**Add file → Upload files** en la carpeta de la asignatura), ponerles nombre con **ID system → Build a name** y añadir la licencia en `licenses.json`." }
      ] },
      { id: "people", icon: "users", title: "Números de estudiante y quién sube", blocks: [
        { ul: [
          "La última parte de un ID es tu número de estudiante de 9 dígitos. **Es público**, así que puedes omitirlo si lo prefieres.",
          "Registra tu nombre en **ID system → Uploader IDs** para que tus archivos muestren tu nombre en lugar de “Student 123456789”.",
          "Añade también tu usuario de GitHub: los archivos que subas desde esa cuenta muestran **✔ Uploader confirmed** (autor de la subida confirmado).",
          "¿Subes algo por un compañero? Un administrador lo registra en `uploads.json` y el archivo muestra “Uploaded by … on behalf of …”.",
          "La página **Uploaders** muestra a todas las personas que comparten archivos."
        ] }
      ] },
      { id: "licence", icon: "book", title: "Licencias", blocks: [
        { p: "Cada archivo tiene su propia licencia. La licencia nunca forma parte del nombre del archivo." },
        { ul: [
          "Se define en `licenses.json` (el generador de nombres te escribe la línea), o con `SPDX-License-Identifier: CC-BY-4.0` al principio de un archivo de texto.",
          "Si no se indica licencia, el autor conserva todos los derechos: puedes leerlo aquí, pero debes pedir permiso antes de copiarlo o reutilizarlo.",
          "Pon licencia solo a tu propio trabajo. El material del curso mantiene las condiciones de su propietario."
        ] },
        { p: "Los códigos de Creative Commons se forman con estas partes:" },
        { ul: [
          "`CC` = Creative Commons",
          "`BY` = reconocimiento: hay que citar al autor",
          "`SA` = compartir igual: las adaptaciones deben usar la misma licencia",
          "`NC` = no comercial: sin uso comercial",
          "`ND` = sin obras derivadas: solo se comparten copias sin cambios",
          "el `0` de `CC0` = ningún derecho reservado"
        ] },
        { p: "Todos los códigos de licencia:" },
        { licences: { head: ["Código", "Licencia", "Significado", "Compartir", "Adaptar", "Uso comercial"], meaning: {"CC0": "Sin condiciones: se puede usar para cualquier fin.", "PD": "Dominio público: ya no tiene derechos de autor.", "CCBY": "Compartir y adaptar, incluso comercialmente, citando al autor.", "CCBYSA": "Como CC BY; las adaptaciones deben usar la misma licencia.", "CCBYNC": "Compartir y adaptar citando al autor, pero sin uso comercial.", "CCBYNCSA": "Sin uso comercial y citando al autor; las adaptaciones usan la misma licencia.", "CCBYND": "Compartir copias sin cambios citando al autor; sin adaptaciones.", "CCBYNCND": "Compartir copias sin cambios citando al autor, sin uso comercial.", "MIT": "Licencia de software: uso libre manteniendo el aviso de copyright.", "GPL3": "Licencia de software: las versiones modificadas también deben ser GPL.", "STUDY": "Material del curso compartido con permiso: solo para leer y estudiar aquí.", "ARR": "Todos los derechos reservados: se puede leer aquí; para lo demás, pide permiso al autor."} } }
      ] },
      { id: "copyright", icon: "alert", title: "Derechos de autor y qué puedes subir", blocks: [
        { ul: [
          "**Se puede subir**: tus propios apuntes, resúmenes y soluciones; material con una licencia que permita compartirlo (por ejemplo CC BY o CC BY-NC-SA, como MIT OpenCourseWare); archivos del curso que el profesor te permitió compartir.",
          "**No subas** sin permiso del propietario: libros de texto, solucionarios, exámenes oficiales, hojas de ejercicios ni diapositivas de clase. Nunca subas soluciones de tareas que siguen abiertas.",
          "**Trabajo mixto** (apuntes sobre una copia impresa): tus apuntes son tuyos, pero la página de debajo pertenece a su propietario.",
          "**Uso de los archivos**: todo aquí es para estudiar. La licencia de cada archivo indica qué más puedes hacer; si no tiene, pide permiso al autor antes de copiarlo, adaptarlo o volver a compartirlo.",
          "**Retirada**: si eres propietario de algo publicado aquí, o un archivo contiene datos personales, abre el archivo y haz clic en **Report this file** (o en **Report a file** al pie de cada página). Un responsable lo revisa, normalmente en pocos días."
        ] },
        { tip: "Al subir un archivo confirmas que lo escribiste o que tienes permiso para compartirlo con la licencia elegida. Los responsables pueden rechazar o retirar cualquier archivo." }
      ] },
      { id: "verify", icon: "shield", title: "Verificación (propietario y colaboradores)", blocks: [
        { tip: "**Qué significa:** un responsable comprobó que el código del curso, quien lo subió (número de estudiante) y el nombre del archivo son correctos. **No** revisa ni garantiza el contenido: puede haber errores, y la verificación no es una promesa ni un aval." },
        { ol: [
          "Abre un archivo y haz clic en **Verify this item**. GitHub abre una incidencia (issue) ya rellenada; envíala.",
          "Un proceso automático comprueba que eres el propietario o un colaborador, registra la verificación y cierra la incidencia. Las solicitudes de cualquier otra persona se rechazan.",
          "Los elementos verificados muestran **Verified**, con quién y cuándo los revisó. Si un archivo cambia después, muestra **Changed** hasta que se revise de nuevo."
        ] },
        { p: "**Unverify** (quitar la verificación) funciona igual." }
      ] },
      { id: "requests", icon: "inbox", title: "Solicitudes de archivos", blocks: [
        { ul: [
          "¿Buscas algo? Abre **File requests** y haz clic en **Request a file**.",
          "¿Tienes un archivo que alguien pidió? Súbelo con el formulario y luego comenta en la solicitud con un enlace a tu subida."
        ] }
      ] },
      { id: "tools", icon: "atom", title: "Herramientas de física", blocks: [
        { ul: [
          "**Physical constants**: constantes físicas CODATA 2022. El botón de copiar copia un número listo para la calculadora.",
          "**Unit converter**: conversión de energía, longitud, masa, tiempo, temperatura, presión, potencia, campo magnético y ángulo.",
          "**Resources**: sitios web gratuitos útiles, como HyperPhysics, PhET, MIT OpenCourseWare, NIST y arXiv."
        ] }
      ] },
      { id: "look", icon: "sun", title: "Apariencia", blocks: [
        { ul: [
          "Abajo en la barra lateral: **Theme** (sistema, claro u oscuro) y **Accent** (naranja o rojo).",
          "El sitio funciona en el móvil: toca **☰** para abrir la barra lateral.",
          "Elige el idioma de esta guía con los botones de la parte superior de esta página."
        ] }
      ] },
      { id: "rules", icon: "alert", title: "Normas y privacidad", blocks: [
        { ul: [
          "Comparte solo tu propio trabajo o material que tengas permiso para compartir.",
          "Respeta las normas de integridad académica de tu universidad: nada de soluciones de tareas abiertas ni exámenes privados.",
          "Elimina datos personales como números de teléfono y notas. Todo aquí es público y Git guarda las versiones anteriores."
        ] }
      ] },
      { id: "delete", icon: "close", title: "Retirar o sustituir un archivo", blocks: [
        { p: "**Los estudiantes** no pueden borrar archivos. Para que se retire un archivo, ábrelo y haz clic en **Report this file** (o en **Report a file** al pie de cada página). Para sustituirlo, sube la nueva versión con el formulario de subida, con una versión tras el elemento (por ejemplo `01_V02`), y pide en tu subida que se retire la antigua." },
        { p: "**Responsables** (propietario y colaboradores):" },
        { ol: [
          "Abre el repositorio en GitHub y ve al archivo, por ejemplo `files/Waves/Notes/`.",
          "Haz clic en el archivo, luego en el menú **⋯** arriba a la derecha y después en **Delete file**.",
          "Escribe un mensaje corto (por ejemplo `Remove Waves HW1 (copyright request)`), elige **Commit directly to the main branch** (marca la casilla para saltar las reglas si aparece) y haz clic en **Commit changes**.",
          "Un minuto después termina la publicación y el archivo desaparece del sitio."
        ] },
        { p: "**Después, ordena:**" },
        { ul: [
          "**El resto del elemento**: un PDF y su zip de fuentes son un solo elemento; borra también el zip si debe desaparecer todo.",
          "`licenses.json` y `uploads.json`: elimina la regla del archivo (por `id` o `path`) y revisa las comas entre entradas.",
          "**Carpetas**: GitHub no borra una carpeta de una vez. Borra sus archivos y la carpeta desaparece; deja un archivo `.gitkeep` si la asignatura debe seguir con 0 archivos.",
          "**La verificación** no requiere nada: un archivo borrado simplemente deja de mostrarse."
        ] },
        { tip: "Borrar retira el archivo del sitio y del repositorio actual, pero las copias antiguas quedan en el historial de Git. Si un archivo debe desaparecer por completo (por ejemplo, datos personales), hay que reescribir el historial; pídeselo a un responsable." }
      ] },
      { id: "setup", icon: "github", title: "Configuración del repositorio (propietario)", blocks: [
        { ol: [
          "**Pages**: en **Settings → Pages → Source** elige **GitHub Actions**. Si no, el sitio no muestra fechas de subida, quién subió los archivos ni la verificación.",
          "**Etiquetas**: crea `file-request`, `uploader-code`, `upload` y `report` en **Issues → Labels**. Los formularios de solicitud, registro, subida y denuncia las añaden automáticamente. Atiende las denuncias rápido: primero retira el archivo y luego responde.",
          "**Formulario de subida**: en **Settings → Actions → General → Workflow permissions**, marca **Allow GitHub Actions to create and approve pull requests**. Fusiona las subidas con **Create a merge commit** o **Rebase and merge**, no con squash, para que el estudiante siga figurando como autor de la subida. Las asignaturas y nombres de curso nuevos del formulario llegan en la misma solicitud; revisa la ortografía antes de fusionar.",
          "**Reglas** (**Settings → Rules → Rulesets**): como destino elige solo **Include default branch**, no **All branches**. Activa **Restrict deletions**, **Block force pushes** y **Require a pull request before merging** (0 o 1 aprobaciones). Deja **Repository admin** en la lista de excepciones y no añadas **Write**, para que los colaboradores también envíen pull requests.",
          "**Verificación y reglas**: el botón de verificar guarda los registros en una rama aparte, `verifications`, así que las reglas de `main` no lo bloquean. No apliques reglas a **All branches** ni a esa rama, y no la borres.",
          "**Registrar estudiantes**: cuando alguien abra una incidencia de registro, comprueba el número de 9 cifras y añádelo a `uploaders.json`."
        ] }
      ] },
      { id: "trouble", icon: "help", title: "¿Problemas?", blocks: [
        { ul: [
          "**Mi archivo no aparece**: comprueba que tu solicitud de cambios se fusionó, espera unos minutos y recarga con Ctrl+Shift+R (Cmd+Shift+R en Mac).",
          "**“Couldn't load the file list”** (no se pudo cargar la lista de archivos): puede que el sitio se esté actualizando. Administradores: comprobad que **Settings → Pages → Source** está en **GitHub Actions**.",
          "Para cualquier otra cosa: abre una incidencia en GitHub o pregunta a un administrador."
        ] }
      ] }
    ]
  };

  // ---------------------------------------------------------------- French
  text.fr = {
    title: "Aide et guide",
    subtitle: "Tout ce que contient ce site et comment l’utiliser.",
    note: "Les boutons et menus du site sont en anglais ; dans ce guide, leurs noms apparaissent en **gras**.",
    contents: "Sommaire",
    sections: [
      { id: "start", icon: "home", title: "Premiers pas", blocks: [
        { p: "Course File Sharing est une bibliothèque de notes de cours, de corrigés d’exercices, de formulaires et de comptes rendus de TP partagés par des étudiants, pour tous les cours. Tout est en lecture libre." },
        { ul: [
          "**Barre latérale** (à gauche) : tout ce que vous pouvez ouvrir. Sur téléphone, touchez **☰** en haut pour l’afficher.",
          "**Barre de recherche** (en haut) : trouve des fichiers par nom, cours, identifiant, auteur de l’envoi ou licence. Appuyez sur **/** pour y accéder.",
          "**Upload** (en haut à droite) : partager un fichier via GitHub."
        ] }
      ] },
      { id: "find", icon: "files", title: "Trouver des fichiers", blocks: [
        { ul: [
          "**Library** : **Home**, **All files**, **Recently added**, **Favorites** et l’**ID system**.",
          "**Subjects**, **Courses** et **Material** : cliquez sur le titre pour ouvrir une page de synthèse, puis sur un élément pour voir ses fichiers.",
          "Cliquez sur la petite flèche à côté d’un titre de la barre latérale pour replier cette section. Le site s’en souvient.",
          "Dans une liste de fichiers, vous pouvez filtrer par type de document, semestre, licence, vérification et format, trier par nom, identifiant, date ou taille, et passer de la vue grille à la vue liste.",
          "Cliquez sur **☆** pour ajouter un fichier aux **Favorites**. Les favoris sont enregistrés uniquement dans votre navigateur."
        ] },
        { tip: "La recherche comprend les identifiants : tapez `01140086_HWS`, ou la forme courte à 6 chiffres d’un code de cours, comme `114086`." }
      ] },
      { id: "open", icon: "eye", title: "Ouvrir un fichier", blocks: [
        { p: "Cliquez sur le titre d’un fichier ou sur **Preview**. Les PDF, images, textes, fichiers LaTeX et le code s’affichent dans la page ; les fichiers Word, PowerPoint et Excel s’ouvrent dans la visionneuse de Microsoft ; les notebooks s’ouvrent dans nbviewer ou Colab." },
        { p: "Le panneau de droite affiche :" },
        { ul: [
          "**Download**, **New tab**, **Link** (copie un lien vers ce fichier), **GitHub** et **History** (toutes les modifications du fichier).",
          "**Files in this item** : les formats qui vont ensemble, par exemple un PDF et sa source LaTeX.",
          "**Verification** : si le propriétaire ou un collaborateur a vérifié le code du cours, l’auteur de l’envoi et le nom du fichier (pas son contenu).",
          "**ID** : l’identifiant du fichier, expliqué champ par champ.",
          "**Uploader** : qui a partagé le fichier, par exemple « Uploaded by A on behalf of B » (envoyé par A pour le compte de B).",
          "**Licence** : ce que vous pouvez faire du fichier (partager, adapter, usage commercial)."
        ] }
      ] },
      { id: "ids", icon: "id", title: "Identifiants de fichier", blocks: [
        { p: "L’identifiant d’un fichier est le début de son nom. Il est recommandé, mais pas obligatoire." },
        { code: EXAMPLE },
        { ul: [
          "`01140086` : le code du cours (8 chiffres).",
          "`LN` : le type, ici des notes de cours. Autres : `HWS` corrigé de devoir, `HWQ` énoncé de devoir, `PEQ` sujet d’examen passé, `LBR` compte rendu de TP…",
          "`2627W` : le semestre, ici l’hiver 2026–27.",
          "`FULL` : l’élément, en général un numéro comme `01`.",
          "`800012999` : le numéro d’étudiant de la personne à qui appartient le fichier.",
          "Après une espace : un titre court."
        ] },
        { p: "La page **ID system** comporte cinq onglets : **Look up** (décoder ou rechercher un identifiant), **Build a name** (remplir un formulaire et copier le nom du fichier), **Uploader IDs** (enregistrer votre nom), **Reference** (tous les codes) et **Check files** (erreurs, doublons, fichiers sans licence ou non vérifiés)." }
      ] },
      { id: "upload", icon: "upload", title: "Envoyer un fichier", blocks: [
        { ol: [
          "Cliquez sur **Upload** en haut. La page **How to contribute** s’ouvre : saisissez d’abord votre **numéro d’étudiant** (votre identifiant d’envoi), puis construisez l’**identifiant** du fichier avec le code du cours, le type de document, le semestre, l’élément, le titre et la licence. Quand tout est coché, cliquez sur **Open the upload form** : il s’ouvre sur GitHub avec vos réponses déjà remplies (connectez-vous ou créez d’abord un compte gratuit).",
          "**Dans le formulaire, la seule chose à faire est de joindre votre fichier** : glissez-le dans la zone **Files** et attendez qu’il apparaisse sous forme de lien. **Ne modifiez pas le titre** ni les autres réponses. Le PDF est préférable ; mettez les sources LaTeX ou autres dans un seul `.zip`, car GitHub n’accepte pas les fichiers `.tex`. 25 Mo maximum par fichier.",
          "Choisissez la matière et vérifiez les réponses reprises du site. Pour un code de cours connu, le nom du cours s’affiche tout seul et la matière est choisie d’après le cours. Nouveau cours ou nouvelle matière ? Indiquez son nom sur la même page. Inutile de renommer le fichier : le bot le nomme pour vous.",
          "Envoyez. En une minute, un bot répond sur le ticket. S’il manque quelque chose, il l’indique ; modifiez le ticket (**···** → **Edit**) et la vérification recommence. Sinon, il ouvre une demande de fusion (pull request).",
          "Un responsable examine la demande. Une fois fusionnée, le fichier apparaît sur le site en quelques minutes, crédité à votre compte GitHub."
        ] },
        { tip: "Les collaborateurs ayant un accès en écriture peuvent aussi ajouter des fichiers directement (**Add file → Upload files** dans le dossier de la matière), les nommer avec **ID system → Build a name** et ajouter leur licence dans `licenses.json`." }
      ] },
      { id: "people", icon: "users", title: "Numéros d’étudiant et auteurs des envois", blocks: [
        { ul: [
          "La dernière partie d’un identifiant est votre numéro d’étudiant à 9 chiffres. **Il est public** : vous pouvez l’omettre si vous préférez.",
          "Enregistrez votre nom dans **ID system → Uploader IDs** pour que vos fichiers affichent votre nom au lieu de « Student 123456789 ».",
          "Ajoutez aussi votre nom d’utilisateur GitHub : les fichiers envoyés depuis ce compte affichent **✔ Uploader confirmed** (auteur de l’envoi confirmé).",
          "Vous envoyez un fichier pour un camarade ? Un administrateur l’indique dans `uploads.json`, et le fichier affiche « Uploaded by … on behalf of … ».",
          "La page **Uploaders** liste toutes les personnes qui partagent des fichiers."
        ] }
      ] },
      { id: "licence", icon: "book", title: "Licences", blocks: [
        { p: "Chaque fichier a sa propre licence. La licence ne figure jamais dans le nom du fichier." },
        { ul: [
          "Elle se définit dans `licenses.json` (le générateur de noms écrit la ligne pour vous), ou avec `SPDX-License-Identifier: CC-BY-4.0` en tête d’un fichier texte.",
          "Sans licence indiquée, l’auteur conserve tous ses droits : vous pouvez le lire ici, mais il faut demander avant de le copier ou de le réutiliser.",
          "Ne mettez une licence que sur votre propre travail. Les documents de cours restent soumis aux conditions de leur propriétaire."
        ] },
        { p: "Les codes Creative Commons sont formés de ces éléments :" },
        { ul: [
          "`CC` = Creative Commons",
          "`BY` = attribution : citer l’auteur",
          "`SA` = partage dans les mêmes conditions : les adaptations doivent utiliser la même licence",
          "`NC` = pas d’utilisation commerciale",
          "`ND` = pas de modification : seules des copies inchangées peuvent être partagées",
          "le `0` de `CC0` = aucun droit réservé"
        ] },
        { p: "Tous les codes de licence :" },
        { licences: { head: ["Code", "Licence", "Signification", "Partager", "Adapter", "Usage commercial"], meaning: {"CC0": "Aucune condition : utilisable pour tout.", "PD": "Domaine public : n’est plus protégé par le droit d’auteur.", "CCBY": "Partager et adapter, même commercialement, en citant l’auteur.", "CCBYSA": "Comme CC BY ; les adaptations doivent utiliser la même licence.", "CCBYNC": "Partager et adapter en citant l’auteur, mais pas commercialement.", "CCBYNCSA": "Non commercial, en citant l’auteur ; les adaptations utilisent la même licence.", "CCBYND": "Partager des copies inchangées en citant l’auteur ; pas d’adaptation.", "CCBYNCND": "Partager des copies inchangées en citant l’auteur, sans usage commercial.", "MIT": "Licence logicielle : réutilisation libre en conservant la mention de copyright.", "GPL3": "Licence logicielle : les versions modifiées doivent aussi être sous GPL.", "STUDY": "Document de cours partagé avec autorisation : à lire ici, pour étudier uniquement.", "ARR": "Tous droits réservés : lecture ici ; pour le reste, demandez à l’auteur."} } }
      ] },
      { id: "copyright", icon: "alert", title: "Droit d’auteur et ce que vous pouvez envoyer", blocks: [
        { ul: [
          "**Autorisé** : vos propres notes, résumés et solutions ; les documents sous une licence qui permet le partage (par exemple CC BY ou CC BY-NC-SA, comme MIT OpenCourseWare) ; les fichiers de cours que l’enseignant vous a permis de partager.",
          "**À ne pas envoyer** sans l’accord du titulaire : manuels, recueils de corrigés, examens officiels, feuilles d’exercices ou diapositives de cours. N’envoyez jamais de solutions à des devoirs encore en cours.",
          "**Travail mixte** (notes sur un document imprimé) : vos notes vous appartiennent, mais la page en dessous appartient à son titulaire.",
          "**Utiliser les fichiers** : tout ici sert à étudier. La licence d’un fichier indique ce que vous pouvez faire d’autre ; sans licence, demandez à l’auteur avant de copier, d’adapter ou de repartager.",
          "**Retrait** : si vous êtes titulaire des droits sur un fichier publié ici, ou si un fichier contient des données personnelles, ouvrez-le et cliquez sur **Report this file** (ou sur **Report a file** en bas de chaque page). Un responsable l’examine, généralement en quelques jours."
        ] },
        { tip: "Envoyer un fichier confirme que vous l’avez écrit ou que vous avez le droit de le partager sous la licence choisie. Les responsables peuvent refuser ou retirer n’importe quel fichier." }
      ] },
      { id: "verify", icon: "shield", title: "Vérification (propriétaire et collaborateurs)", blocks: [
        { tip: "**Ce que cela signifie :** un responsable a vérifié que le code du cours, l’auteur de l’envoi (numéro d’étudiant) et le nom du fichier sont corrects. Cela ne vérifie **pas** et ne garantit pas le contenu : il peut contenir des erreurs, et la vérification n’est ni une promesse ni une approbation." },
        { ol: [
          "Ouvrez un fichier et cliquez sur **Verify this item**. GitHub ouvre un ticket (issue) prérempli ; envoyez-le.",
          "Un processus automatique vérifie que vous êtes le propriétaire ou un collaborateur, enregistre la vérification et ferme le ticket. Les demandes de toute autre personne sont refusées.",
          "Les éléments vérifiés affichent **Verified**, avec qui les a vérifiés et quand. Si un fichier est modifié ensuite, il affiche **Changed** jusqu’à une nouvelle vérification."
        ] },
        { p: "**Unverify** (retirer la vérification) fonctionne de la même façon." }
      ] },
      { id: "requests", icon: "inbox", title: "Demandes de fichiers", blocks: [
        { ul: [
          "Vous cherchez quelque chose ? Ouvrez **File requests** et cliquez sur **Request a file**.",
          "Vous avez un fichier demandé ? Envoyez-le avec le formulaire, puis commentez la demande avec un lien vers votre envoi."
        ] }
      ] },
      { id: "tools", icon: "atom", title: "Outils de physique", blocks: [
        { ul: [
          "**Physical constants** : les constantes physiques CODATA 2022. Le bouton de copie copie un nombre prêt pour la calculatrice.",
          "**Unit converter** : conversion d’énergie, longueur, masse, temps, température, pression, puissance, champ magnétique et angle.",
          "**Resources** : des sites gratuits utiles comme HyperPhysics, PhET, MIT OpenCourseWare, NIST et arXiv."
        ] }
      ] },
      { id: "look", icon: "sun", title: "Apparence", blocks: [
        { ul: [
          "En bas de la barre latérale : **Theme** (système, clair ou sombre) et **Accent** (orange ou rouge).",
          "Le site fonctionne sur téléphone : touchez **☰** pour ouvrir la barre latérale.",
          "Choisissez la langue de ce guide avec les boutons en haut de cette page."
        ] }
      ] },
      { id: "rules", icon: "alert", title: "Règles et confidentialité", blocks: [
        { ul: [
          "Ne partagez que votre propre travail, ou des documents que vous avez le droit de partager.",
          "Respectez les règles d’intégrité académique de votre université : pas de corrigés de devoirs en cours, pas d’examens non publics.",
          "Retirez les informations personnelles comme les numéros de téléphone et les notes. Tout ici est public, et Git conserve les anciennes versions."
        ] }
      ] },
      { id: "delete", icon: "close", title: "Retirer ou remplacer un fichier", blocks: [
        { p: "**Les étudiants** ne peuvent pas supprimer de fichiers. Pour faire retirer un fichier, ouvrez-le et cliquez sur **Report this file** (ou sur **Report a file** en bas de chaque page). Pour le remplacer, envoyez la nouvelle version avec le formulaire d’envoi, avec une version après l’élément (par exemple `01_V02`), et demandez dans votre envoi que l’ancienne soit retirée." },
        { p: "**Responsables** (propriétaire et collaborateurs) :" },
        { ol: [
          "Ouvrez le dépôt sur GitHub et allez au fichier, par exemple `files/Waves/Notes/`.",
          "Cliquez sur le fichier, puis sur le menu **⋯** en haut à droite, puis sur **Delete file**.",
          "Écrivez un court message (par exemple `Remove Waves HW1 (copyright request)`), choisissez **Commit directly to the main branch** (cochez la case de contournement des règles si elle apparaît) et cliquez sur **Commit changes**.",
          "Environ une minute plus tard, la publication est terminée et le fichier a disparu du site."
        ] },
        { p: "**Ensuite, faites le ménage :**" },
        { ul: [
          "**Le reste de l’élément** : un PDF et son zip source forment un seul élément ; supprimez aussi le zip si tout l’élément doit partir.",
          "`licenses.json` et `uploads.json` : retirez la règle du fichier (par `id` ou `path`) en gardant des virgules correctes entre les entrées.",
          "**Dossiers** : GitHub ne supprime pas un dossier en une fois. Supprimez ses fichiers et le dossier disparaît ; gardez un fichier `.gitkeep` si la matière doit rester avec 0 fichier.",
          "**La vérification** ne demande rien : un fichier supprimé cesse simplement de s’afficher."
        ] },
        { tip: "La suppression retire le fichier du site et du dépôt actuel, mais d’anciennes copies restent dans l’historique Git. Si un fichier doit disparaître complètement (par exemple des données personnelles), il faut réécrire l’historique ; demandez à un responsable." }
      ] },
      { id: "setup", icon: "github", title: "Configuration du dépôt (propriétaire)", blocks: [
        { ol: [
          "**Pages** : dans **Settings → Pages → Source**, choisissez **GitHub Actions**. Sinon, le site n’affiche ni les dates d’envoi, ni les auteurs des envois, ni la vérification.",
          "**Étiquettes** : créez `file-request`, `uploader-code`, `upload` et `report` dans **Issues → Labels**. Les formulaires de demande, d’inscription, d’envoi et de signalement les ajoutent automatiquement. Traitez vite les signalements : retirez d’abord le fichier, puis répondez.",
          "**Formulaire d’envoi** : dans **Settings → Actions → General → Workflow permissions**, cochez **Allow GitHub Actions to create and approve pull requests**. Fusionnez les envois avec **Create a merge commit** ou **Rebase and merge**, pas squash, pour que l’étudiant reste crédité. Les nouvelles matières et les noms de cours du formulaire arrivent dans la même demande ; vérifiez l’orthographe avant de fusionner.",
          "**Règles** (**Settings → Rules → Rulesets**) : comme cible, choisissez seulement **Include default branch**, pas **All branches**. Activez **Restrict deletions**, **Block force pushes** et **Require a pull request before merging** (0 ou 1 approbation). Gardez **Repository admin** dans la liste de contournement et n’ajoutez pas **Write**, pour que les collaborateurs passent aussi par des pull requests.",
          "**Vérification et règles** : le bouton de vérification enregistre les données sur une branche à part, `verifications`, donc les règles de `main` ne le bloquent pas. Ne ciblez ni **All branches** ni cette branche, et ne la supprimez pas.",
          "**Inscrire des étudiants** : quand quelqu’un ouvre un ticket d’inscription, vérifiez le numéro à 9 chiffres, puis ajoutez-le à `uploaders.json`."
        ] }
      ] },
      { id: "trouble", icon: "help", title: "Un problème ?", blocks: [
        { ul: [
          "**Mon fichier n’apparaît pas** : vérifiez que votre demande de fusion a été acceptée, attendez quelques minutes, puis actualisez avec Ctrl+Maj+R (Cmd+Maj+R sur Mac).",
          "**« Couldn't load the file list »** (impossible de charger la liste des fichiers) : le site est peut-être en cours de mise à jour. Administrateurs : vérifiez que **Settings → Pages → Source** est réglé sur **GitHub Actions**.",
          "Pour tout le reste : ouvrez un ticket sur GitHub ou demandez à un administrateur."
        ] }
      ] }
    ]
  };

  // ---------------------------------------------------------------- German
  text.de = {
    title: "Hilfe & Anleitung",
    subtitle: "Alles auf dieser Website und wie man es benutzt.",
    note: "Die Schaltflächen und Menüs der Website sind auf Englisch; in dieser Anleitung stehen ihre Namen **fett**.",
    contents: "Inhalt",
    sections: [
      { id: "start", icon: "home", title: "Erste Schritte", blocks: [
        { p: "Course File Sharing ist eine Sammlung von Mitschriften, Übungslösungen, Formelsammlungen und Laborberichten, die Studierende teilen, für jeden Kurs. Alles ist kostenlos lesbar." },
        { ul: [
          "**Seitenleiste** (links): alles, was du öffnen kannst. Auf dem Handy tippst du oben auf **☰**, um sie anzuzeigen.",
          "**Suchleiste** (oben): findet Dateien nach Name, Kurs, ID, Hochladendem oder Lizenz. Mit **/** springst du direkt hinein.",
          "**Upload** (oben rechts): eine Datei über GitHub teilen."
        ] }
      ] },
      { id: "find", icon: "files", title: "Dateien finden", blocks: [
        { ul: [
          "**Library**: **Home**, **All files**, **Recently added**, **Favorites** und das **ID system**.",
          "**Subjects**, **Courses** und **Material**: Ein Klick auf die Überschrift öffnet eine Übersichtsseite, ein Klick auf einen Eintrag zeigt seine Dateien.",
          "Mit dem kleinen Pfeil neben einer Überschrift in der Seitenleiste klappst du den Abschnitt ein. Die Website merkt sich das.",
          "In einer Dateiliste kannst du nach Materialart, Semester, Lizenz, Prüfstatus und Format filtern, nach Name, ID, Datum oder Größe sortieren und zwischen Kachel- und Listenansicht wechseln.",
          "Mit **☆** fügst du eine Datei zu den **Favorites** hinzu. Favoriten werden nur in deinem Browser gespeichert."
        ] },
        { tip: "Die Suche versteht IDs: Gib `01140086_HWS` ein oder die 6-stellige Kurzform eines Kurscodes, z. B. `114086`." }
      ] },
      { id: "open", icon: "eye", title: "Eine Datei öffnen", blocks: [
        { p: "Klicke auf den Titel einer Datei oder auf **Preview**. PDFs, Bilder, Texte, LaTeX und Code werden direkt angezeigt; Word-, PowerPoint- und Excel-Dateien öffnen sich im Viewer von Microsoft; Notebooks öffnen sich in nbviewer oder Colab." },
        { p: "Der Bereich rechts zeigt:" },
        { ul: [
          "**Download**, **New tab**, **Link** (kopiert einen Link zu dieser Datei), **GitHub** und **History** (alle Änderungen an der Datei).",
          "**Files in this item**: Formate, die zusammengehören, z. B. ein PDF und sein LaTeX-Quelltext.",
          "**Verification**: ob der Eigentümer oder ein Mitwirkender Kurscode, Hochladende(n) und Dateinamen geprüft hat (nicht den Inhalt).",
          "**ID**: die ID der Datei, Feld für Feld erklärt.",
          "**Uploader**: wer die Datei geteilt hat, z. B. „Uploaded by A on behalf of B“ (hochgeladen von A im Namen von B).",
          "**Licence**: was du mit der Datei tun darfst (teilen, bearbeiten, kommerziell nutzen)."
        ] }
      ] },
      { id: "ids", icon: "id", title: "Datei-IDs", blocks: [
        { p: "Die ID einer Datei ist der Anfang ihres Namens. IDs sind empfohlen, aber nicht Pflicht." },
        { code: EXAMPLE },
        { ul: [
          "`01140086`: der Kurscode (8 Ziffern).",
          "`LN`: der Typ, hier eine Vorlesungsmitschrift. Weitere: `HWS` Hausaufgabenlösung, `HWQ` Hausaufgabenblatt, `PEQ` Altklausur-Aufgabe, `LBR` Laborbericht …",
          "`2627W`: das Semester, hier Winter 2026–27.",
          "`FULL`: der Eintrag, meist eine Nummer wie `01`.",
          "`800012999`: die Matrikelnummer der Person, der die Datei gehört.",
          "Nach einem Leerzeichen: ein kurzer Titel."
        ] },
        { p: "Die Seite **ID system** hat fünf Reiter: **Look up** (eine ID entschlüsseln oder suchen), **Build a name** (Formular ausfüllen und Dateinamen kopieren), **Uploader IDs** (deinen Namen eintragen), **Reference** (alle Codes) und **Check files** (Fehler, Duplikate, Dateien ohne Lizenz oder Prüfung)." }
      ] },
      { id: "upload", icon: "upload", title: "Eine Datei hochladen", blocks: [
        { ol: [
          "Klicke oben auf **Upload**. Die Seite **How to contribute** öffnet sich: Gib zuerst deine **Matrikelnummer** (deine Uploader-ID) ein und erstelle dann die **ID** der Datei mit Kurscode, Art des Materials, Semester, Eintrag, Titel und Lizenz. Wenn alles abgehakt ist, klicke auf **Open the upload form**: Es öffnet sich auf GitHub mit deinen Angaben ausgefüllt (vorher anmelden oder ein kostenloses Konto anlegen).",
          "**Im Formular musst du nur deine Datei anhängen**: Ziehe sie in das Feld **Files** und warte, bis sie als Link erscheint. **Ändere den Titel nicht** und auch nicht die anderen Angaben. Am besten PDF; LaTeX- oder andere Quelldateien kommen in eine einzige `.zip`, weil GitHub keine `.tex`-Dateien annimmt. Bis 25 MB pro Datei.",
          "Wähle das Fach und prüfe die von der Website übernommenen Angaben. Bei bekannten Kurscodes erscheint der Kursname von selbst, und das Fach wird nach dem Kurs gewählt. Neuer Kurs oder neues Fach? Gib den Namen auf derselben Seite an. Du musst die Datei nicht umbenennen: Der Bot benennt sie für dich.",
          "Absenden. Innerhalb einer Minute antwortet ein Bot im Issue. Fehlt etwas, sagt er was; bearbeite das Issue (**···** → **Edit**), dann prüft er erneut. Sonst öffnet er einen Pull Request.",
          "Ein Betreuer prüft den Pull Request. Nach dem Zusammenführen erscheint die Datei innerhalb weniger Minuten auf der Website, deinem GitHub-Konto zugeordnet."
        ] },
        { tip: "Mitwirkende mit Schreibrechten können Dateien auch direkt hinzufügen (**Add file → Upload files** im Fachordner), sie mit **ID system → Build a name** benennen und die Lizenz in `licenses.json` eintragen." }
      ] },
      { id: "people", icon: "users", title: "Matrikelnummern und Hochladende", blocks: [
        { ul: [
          "Der letzte Teil einer ID ist deine 9-stellige Matrikelnummer. **Sie ist öffentlich**, du kannst sie also weglassen.",
          "Trage deinen Namen unter **ID system → Uploader IDs** ein, damit deine Dateien deinen Namen statt „Student 123456789“ zeigen.",
          "Gib auch deinen GitHub-Benutzernamen an: Dateien, die du von diesem Konto hochlädst, zeigen **✔ Uploader confirmed** (Hochladende Person bestätigt).",
          "Du lädst etwas für eine Kommilitonin oder einen Kommilitonen hoch? Ein Admin vermerkt das in `uploads.json`, und die Datei zeigt „Uploaded by … on behalf of …“.",
          "Die Seite **Uploaders** listet alle, die Dateien teilen."
        ] }
      ] },
      { id: "licence", icon: "book", title: "Lizenzen", blocks: [
        { p: "Jede Datei hat ihre eigene Lizenz. Die Lizenz ist nie Teil des Dateinamens." },
        { ul: [
          "Sie wird in `licenses.json` festgelegt (der Namensgenerator schreibt die Zeile für dich) oder mit `SPDX-License-Identifier: CC-BY-4.0` am Anfang einer Textdatei.",
          "Ohne angegebene Lizenz behält der Autor alle Rechte: Du darfst sie hier lesen, musst aber vor dem Kopieren oder Weiterverwenden fragen.",
          "Vergib Lizenzen nur für deine eigene Arbeit. Kursmaterial unterliegt weiter den Bedingungen seines Eigentümers."
        ] },
        { p: "Die Creative-Commons-Codes setzen sich aus diesen Teilen zusammen:" },
        { ul: [
          "`CC` = Creative Commons",
          "`BY` = Namensnennung: den Autor nennen",
          "`SA` = Weitergabe unter gleichen Bedingungen: Bearbeitungen müssen dieselbe Lizenz verwenden",
          "`NC` = nicht kommerziell: keine kommerzielle Nutzung",
          "`ND` = keine Bearbeitungen: nur unveränderte Kopien weitergeben",
          "die `0` in `CC0` = keine Rechte vorbehalten"
        ] },
        { p: "Alle Lizenzcodes:" },
        { licences: { head: ["Code", "Lizenz", "Bedeutung", "Teilen", "Bearbeiten", "Kommerziell"], meaning: {"CC0": "Keine Bedingungen: für alles nutzbar.", "PD": "Gemeinfrei: nicht mehr urheberrechtlich geschützt.", "CCBY": "Teilen und bearbeiten, auch kommerziell, mit Namensnennung.", "CCBYSA": "Wie CC BY; Bearbeitungen müssen dieselbe Lizenz verwenden.", "CCBYNC": "Teilen und bearbeiten mit Namensnennung, aber nicht kommerziell.", "CCBYNCSA": "Nicht kommerziell, mit Namensnennung; Bearbeitungen unter derselben Lizenz.", "CCBYND": "Unveränderte Kopien mit Namensnennung teilen; keine Bearbeitungen.", "CCBYNCND": "Unveränderte Kopien mit Namensnennung teilen, nicht kommerziell.", "MIT": "Softwarelizenz: freie Nutzung, Copyright-Hinweis behalten.", "GPL3": "Softwarelizenz: geänderte Versionen müssen ebenfalls GPL sein.", "STUDY": "Kursmaterial, mit Erlaubnis geteilt: nur hier lesen und damit lernen.", "ARR": "Alle Rechte vorbehalten: hier lesen; für alles andere den Autor fragen."} } }
      ] },
      { id: "copyright", icon: "alert", title: "Urheberrecht und was du hochladen darfst", blocks: [
        { ul: [
          "**Erlaubt**: eigene Mitschriften, Zusammenfassungen und Lösungen; Material unter einer Lizenz, die das Teilen erlaubt (z. B. CC BY oder CC BY-NC-SA, wie MIT OpenCourseWare); Kursdateien, deren Weitergabe die Lehrperson erlaubt hat.",
          "**Nicht hochladen** ohne Erlaubnis der Rechteinhaber: Lehrbücher, Lösungsbücher, offizielle Prüfungen, Übungsblätter oder Vorlesungsfolien. Lade nie Lösungen zu Aufgaben hoch, die noch laufen.",
          "**Gemischte Werke** (Notizen auf einem Ausdruck): Deine Notizen gehören dir, die Seite darunter gehört ihren Rechteinhabern.",
          "**Dateien nutzen**: Alles hier dient dem Lernen. Die Lizenz einer Datei sagt, was du sonst noch darfst; ohne Lizenz frag die Autorin oder den Autor, bevor du kopierst, bearbeitest oder weitergibst.",
          "**Entfernen**: Gehört dir etwas, das hier veröffentlicht ist, oder enthält eine Datei persönliche Daten, öffne die Datei und klicke auf **Report this file** (oder **Report a file** unten auf jeder Seite). Ein Betreuer prüft die Meldung, meist innerhalb weniger Tage."
        ] },
        { tip: "Mit dem Hochladen bestätigst du, dass du die Datei geschrieben hast oder sie unter der gewählten Lizenz teilen darfst. Betreuer können jede Datei ablehnen oder entfernen." }
      ] },
      { id: "verify", icon: "shield", title: "Prüfung (Eigentümer und Mitwirkende)", blocks: [
        { tip: "**Was das bedeutet:** Ein Betreuer hat geprüft, dass Kurscode, Hochladende(r) (Matrikelnummer) und Dateiname stimmen. Der **Inhalt** wird dabei **nicht** geprüft oder garantiert: Er kann Fehler enthalten, und die Prüfung ist kein Versprechen und keine Empfehlung." },
        { ol: [
          "Öffne eine Datei und klicke auf **Verify this item**. GitHub öffnet ein vorausgefülltes Issue; sende es ab.",
          "Ein automatischer Ablauf prüft, ob du Eigentümer oder Mitwirkender bist, speichert die Prüfung und schließt das Issue. Anfragen anderer Personen werden abgelehnt.",
          "Geprüfte Einträge zeigen **Verified**, mit Prüfer und Datum. Ändert sich eine Datei danach, zeigt sie **Changed**, bis sie erneut geprüft wird."
        ] },
        { p: "**Unverify** (Prüfung zurücknehmen) funktioniert genauso." }
      ] },
      { id: "requests", icon: "inbox", title: "Dateiwünsche", blocks: [
        { ul: [
          "Du suchst etwas? Öffne **File requests** und klicke auf **Request a file**.",
          "Du hast eine gewünschte Datei? Lade sie mit dem Formular hoch und kommentiere die Anfrage mit einem Link zu deinem Upload."
        ] }
      ] },
      { id: "tools", icon: "atom", title: "Physik-Werkzeuge", blocks: [
        { ul: [
          "**Physical constants**: Naturkonstanten nach CODATA 2022. Der Kopierknopf kopiert eine taschenrechnerfertige Zahl.",
          "**Unit converter**: Umrechnung von Energie, Länge, Masse, Zeit, Temperatur, Druck, Leistung, Magnetfeld und Winkel.",
          "**Resources**: nützliche kostenlose Websites wie HyperPhysics, PhET, MIT OpenCourseWare, NIST und arXiv."
        ] }
      ] },
      { id: "look", icon: "sun", title: "Darstellung", blocks: [
        { ul: [
          "Unten in der Seitenleiste: **Theme** (System, hell oder dunkel) und **Accent** (Orange oder Rot).",
          "Die Website funktioniert auf dem Handy: Tippe auf **☰**, um die Seitenleiste zu öffnen.",
          "Die Sprache dieser Anleitung wählst du mit den Schaltflächen oben auf dieser Seite."
        ] }
      ] },
      { id: "rules", icon: "alert", title: "Regeln und Datenschutz", blocks: [
        { ul: [
          "Teile nur deine eigene Arbeit oder Material, das du teilen darfst.",
          "Halte dich an die Regeln deiner Universität zur wissenschaftlichen Redlichkeit: keine Lösungen zu laufenden Aufgaben, keine nicht öffentlichen Prüfungen.",
          "Entferne persönliche Daten wie Telefonnummern und Noten. Alles hier ist öffentlich, und Git behält alte Versionen."
        ] }
      ] },
      { id: "delete", icon: "close", title: "Dateien entfernen oder ersetzen", blocks: [
        { p: "**Studierende** können keine Dateien löschen. Um eine Datei entfernen zu lassen, öffne sie und klicke auf **Report this file** (oder **Report a file** unten auf jeder Seite). Zum Ersetzen lade die neue Version mit dem Upload-Formular hoch, mit einer Version hinter dem Eintrag (z. B. `01_V02`), und bitte in deinem Upload darum, die alte zu entfernen." },
        { p: "**Betreuer** (Eigentümer und Mitwirkende):" },
        { ol: [
          "Öffne das Repository auf GitHub und gehe zur Datei, z. B. `files/Waves/Notes/`.",
          "Klicke auf die Datei, dann oben rechts auf das Menü **⋯** und dann auf **Delete file**.",
          "Schreibe eine kurze Nachricht (z. B. `Remove Waves HW1 (copyright request)`), wähle **Commit directly to the main branch** (setze das Häkchen zum Umgehen der Regeln, falls es erscheint) und klicke auf **Commit changes**.",
          "Etwa eine Minute später ist die Veröffentlichung fertig und die Datei ist von der Website verschwunden."
        ] },
        { p: "**Danach aufräumen:**" },
        { ul: [
          "**Der Rest des Eintrags**: Ein PDF und seine Quell-ZIP sind ein Eintrag; lösche auch die ZIP, wenn der ganze Eintrag weg soll.",
          "`licenses.json` und `uploads.json`: Entferne die Regel der Datei (über `id` oder `path`) und achte auf die Kommas zwischen den Einträgen.",
          "**Ordner**: GitHub kann einen Ordner nicht in einem Schritt löschen. Lösche die Dateien darin, dann verschwindet der Ordner; behalte eine `.gitkeep`-Datei, wenn das Fach mit 0 Dateien bleiben soll.",
          "**Prüfung** braucht nichts: Eine gelöschte Datei wird einfach nicht mehr angezeigt."
        ] },
        { tip: "Löschen entfernt die Datei von der Website und aus dem aktuellen Repository, alte Kopien bleiben aber im Git-Verlauf. Muss eine Datei ganz verschwinden (z. B. persönliche Daten), muss der Verlauf umgeschrieben werden; wende dich an einen Betreuer." }
      ] },
      { id: "setup", icon: "github", title: "Repository einrichten (Eigentümer)", blocks: [
        { ol: [
          "**Pages**: Unter **Settings → Pages → Source** muss **GitHub Actions** stehen. Sonst zeigt die Seite keine Upload-Daten, Hochladenden und Prüfungen.",
          "**Labels**: Lege unter **Issues → Labels** `file-request`, `uploader-code`, `upload` und `report` an. Die Anfrage-, Registrierungs-, Upload- und Meldeformulare setzen sie automatisch. Bearbeite Meldungen schnell: zuerst die Datei entfernen, dann antworten.",
          "**Upload-Formular**: Unter **Settings → Actions → General → Workflow permissions** **Allow GitHub Actions to create and approve pull requests** anhaken. Uploads mit **Create a merge commit** oder **Rebase and merge** zusammenführen, nicht mit Squash, damit die Studierenden als Hochladende genannt bleiben. Neue Fächer und Kursnamen aus dem Formular kommen im selben Pull Request; prüfe die Schreibweise vor dem Zusammenführen.",
          "**Regeln** (**Settings → Rules → Rulesets**): Als Ziel nur **Include default branch** wählen, nicht **All branches**. Aktiviere **Restrict deletions**, **Block force pushes** und **Require a pull request before merging** (0 oder 1 Freigaben). Behalte **Repository admin** in der Bypass-Liste und füge **Write** nicht hinzu, damit auch Mitwirkende Pull Requests stellen.",
          "**Prüfung und Regeln**: Der Prüfen-Button speichert die Einträge auf einem eigenen Branch `verifications`, daher blockieren Regeln für `main` ihn nicht. Ziele nicht auf **All branches** oder diesen Branch und lösche ihn nicht.",
          "**Studierende registrieren**: Wenn jemand ein Registrierungs-Issue öffnet, prüfe die 9-stellige Nummer und trage sie in `uploaders.json` ein."
        ] }
      ] },
      { id: "trouble", icon: "help", title: "Probleme?", blocks: [
        { ul: [
          "**Meine Datei erscheint nicht**: Prüfe, ob dein Pull Request zusammengeführt wurde, warte ein paar Minuten und lade dann mit Strg+Umschalt+R neu (Cmd+Umschalt+R auf dem Mac).",
          "**„Couldn't load the file list“** (Dateiliste konnte nicht geladen werden): Die Website wird vielleicht gerade aktualisiert. Admins: Prüft, ob **Settings → Pages → Source** auf **GitHub Actions** steht.",
          "Alles andere: Öffne ein Issue auf GitHub oder frage einen Admin."
        ] }
      ] }
    ]
  };

  return { languages: languages, text: text };
})();
