# Licences for shared files

The files in [`files/`](files/) **don't share one licence. Each document has its own**, chosen by the person who wrote it. The website code is separate: it is under the MIT licence in [`LICENSE`](LICENSE).

## How a file's licence is set

The website checks these in order and uses the first one it finds:

1. **A licence code in the file name.** Put it in the [ID](README.md#file-ids-recommended) after any tags:
   `01140086_HWS_2627W_01_CCBY_231000001 Waves Homework 1 Solution.pdf`
2. **A rule in [`licenses.json`](licenses.json).** This sets a licence for one file, a whole folder, or every file whose ID starts a certain way, without renaming anything:
   ```json
   { "rules": [
     { "path": "files/Lab-Reports/", "license": "CCBY" },
     { "path": "files/Electromagnetism/Maxwell Summary.pdf", "license": "CCBYNC" },
     { "id": "01140086_LP_2627W", "license": "STUDY" }
   ] }
   ```
   The most specific rule wins: an exact file beats an ID, and an ID beats a folder.
3. **A notice inside the file.** In a text file (`.tex`, `.md`, `.py`, `.ipynb` …), put an [SPDX](https://spdx.org/licenses/) line near the top, e.g. `% SPDX-License-Identifier: CC-BY-4.0`.

With none of these, the file has **no licence stated**. Copyright law then gives the author all rights: others can read it on this site but must ask before copying, adapting or resharing. The site says so on the file's page.

## Licence codes

| Code | Licence | Share | Adapt | Commercial | Typical use |
| --- | --- | :-: | :-: | :-: | --- |
| `CC0` | [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/): no rights reserved | ✓ | ✓ | ✓ | You want no conditions at all |
| `PD` | Public domain | ✓ | ✓ | ✓ | Very old works, no longer under copyright |
| `CCBY` | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | ✓ | ✓ | ✓ | Your notes and solutions, reusable with credit |
| `CCBYSA` | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) | ✓ | ✓ | ✓ | As CC BY, and adaptations must stay open |
| `CCBYNC` | [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) | ✓ | ✓ | ✕ | Reusable with credit, but not for profit |
| `CCBYNCSA` | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) | ✓ | ✓ | ✕ | Non-commercial, adaptations stay open |
| `CCBYND` | [CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0/) | ✓ | ✕ | ✓ | Share unchanged copies only |
| `CCBYNCND` | [CC BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/) | ✓ | ✕ | ✕ | Most restrictive Creative Commons licence |
| `MIT` | [MIT](https://opensource.org/license/mit) | ✓ | ✓ | ✓ | Code you share |
| `GPL3` | [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html) | ✓ | ✓ | ✓ | Code, where changed versions must stay GPL |
| `STUDY` | Shared with permission, for study only | ✕ | ✕ | ✕ | Course material you may share here but don't own |
| `ARR` | All rights reserved | ✕ | ✕ | ✕ | Your work, readable here but not reusable |

All Creative Commons licences require crediting the author. The list lives in [`assets/naming.json`](assets/naming.json); other SPDX identifiers found inside files are shown as they are.

## Whose licence it is

**Only the person who owns a work can choose its licence.**

- **Your own work** (solutions, notes, reports, data, code): pick any code you like. If you're unsure, `CCBY` (reusable with credit) or `CCBYNC` (not for profit) are common choices.
- **Someone else's work** (homework and exam questions, official answers, handouts, tutorial sheets, lab guides, board photos, textbooks): you can't license it. Upload it only with the owner's permission, and mark it
  - `STUDY` when the instructor or university allows sharing for study, or
  - the licence it was **published under**, e.g. `CCBY` for an OpenStax textbook.
- **Mixed work**, such as an annotated printout (`_AN`): your notes are yours, but the page underneath still belongs to its owner. Use the more restrictive of the two, usually `STUDY`.

Paid textbooks, solution manuals and exams that aren't meant to be public must not be uploaded, whatever licence code they carry.

Once you've shared something under an open licence (CC, MIT, GPL), copies people already made stay usable under that licence, even if you later change or remove it.

## Taking material down

If you own something shared here and want it removed or relicensed, or you find personal information in a file:

1. [Open an issue](../../issues/new), or contact a maintainer, with the file's name or ID.
2. A maintainer updates or removes the file promptly, usually within a few days.

Removed files disappear from the website and the current repository. Old copies remain in Git history unless a maintainer rewrites it.

## When you contribute

By submitting a file, you confirm that you wrote it or have permission to share it, and that any licence you state for it is one you're entitled to give.

---

*A plain-language guide for a student project, not legal advice. Each licence's full terms are at the links above.*
