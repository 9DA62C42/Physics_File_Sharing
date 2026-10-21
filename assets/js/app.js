// Course File Sharing: a small single-page app.
// Files come from files.json (built by scripts/build_index.py in GitHub Actions);
// if that is missing, the GitHub API is used to list the files/ folder instead.
// File IDs (recommended, not required) are read from file names; the rules are
// in assets/naming.json, registered student numbers in uploaders.json, course names in courses.json,
// per-file licences in licenses.json.
(() => {
  "use strict";

  const C = window.SITE_CONFIG;
  const D = window.PHYS_DATA;
  const REPO = `https://github.com/${C.owner}/${C.repo}`;
  const API = `https://api.github.com/repos/${C.owner}/${C.repo}`;
  const SITE_BASE = location.href.split("#")[0].replace(/[^/]*$/, "");

  // ---------- small helpers ----------

  const store = {
    get(k, d) { try { const v = localStorage.getItem("pfs:" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("pfs:" + k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };

  // Build DOM nodes without innerHTML so file names can never inject markup.
  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "svg") el.innerHTML = v; // trusted static icons only
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat(Infinity)) {
      if (kid == null || kid === false) continue;
      el.append(kid.nodeType ? kid : String(kid));
    }
    return el;
  }

  const ICON_PATHS = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
    files: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
    folder: '<path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    course: '<path d="M3 8l9-4 9 4-9 4z"/><path d="M7 10v5c0 1.5 2.2 3 5 3s5-1.5 5-3v-5"/>',
    tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
    inbox: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><path d="M12 17h.01"/>',
    atom: '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
    swap: '<path d="M7 4L3 8l4 4"/><path d="M3 8h14"/><path d="M17 12l4 4-4 4"/><path d="M21 16H7"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
    id: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.5-1.5 1.6-2 3-2s2.5.5 3 2"/><path d="M14 10h4M14 13h3"/>',
    check: '<path d="M5 12l4 4 10-10"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17h.01"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    auto: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    chevron: '<path d="M6 9l6 6 6-6"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    download: '<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="4" y="13" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    list: '<path d="M8 6h12M8 12h12M8 18h12"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
    upload: '<path d="M12 20V9"/><path d="M7 14l5-5 5 5"/><path d="M5 4h14"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>'
  };
  const icon = (name) => h("span", { class: "icon", "aria-hidden": "true",
    svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name]}</svg>` });

  // replaceChildren() would print null/false as text; drop them instead.
  const fill = (el, ...kids) => el.replaceChildren(...kids.flat(Infinity).filter((k) => k != null && k !== false));

  const pretty = (s) => s.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const enc = encodeURIComponent;

  function fmtSize(b) {
    if (b == null) return "";
    const u = ["B", "KB", "MB", "GB"];
    let i = 0;
    while (b >= 1024 && i < u.length - 1) { b /= 1024; i++; }
    return (i ? b.toFixed(b < 10 ? 1 : 0) : b) + " " + u[i];
  }
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "";
  function timeAgo(iso) {
    const s = (Date.now() - new Date(iso)) / 1000;
    const steps = [[60, "second"], [60, "minute"], [24, "hour"], [7, "day"], [4.35, "week"], [12, "month"], [Infinity, "year"]];
    let v = s;
    for (const [n, unit] of steps) {
      if (v < n) { const r = Math.max(1, Math.floor(v)); return `${r} ${unit}${r > 1 ? "s" : ""} ago`; }
      v /= n;
    }
  }

  // A number as text with a real superscript exponent, e.g. 6.626 × 10⁻³⁴.
  function sciNode(x, digits) {
    if (!isFinite(x)) return document.createTextNode("—");
    const a = Math.abs(x);
    if (x === 0 || (a >= 1e-3 && a < 1e7)) {
      return document.createTextNode(String(Number(x.toPrecision(digits))));
    }
    const [m, e] = x.toExponential(digits - 1).split("e");
    return h("span", null, String(Number(m)), " × 10", h("sup", null, String(Number(e))));
  }

  function copyText(text, btn) {
    const done = () => { if (btn) { btn.classList.add("copied"); setTimeout(() => btn.classList.remove("copied"), 1200); } toast("Copied to clipboard"); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => toast("Copy failed"));
    else toast("Copy not supported in this browser");
  }

  let toastTimer;
  function toast(msg) {
    let t = document.getElementById("toast");
    if (!t) { t = h("div", { id: "toast", class: "toast", role: "status" }); document.body.append(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  async function getJson(url) {
    try { const r = await fetch(url, { cache: "no-cache" }); return r.ok ? await r.json() : null; } catch (e) { return null; }
  }

  // ---------- state ----------

  const state = {
    files: [], items: [], subjects: [], source: "", generated: null, hasDates: false, // items: files grouped (PDF + its source)
    q: "", type: "All", material: "All", term: "All", lic: "All", ver: "All",
    sort: store.get("sort", "name"), layout: store.get("layout", "grid"),
    favs: new Set(store.get("favs", [])),
    uploaders: new Map(), loginToCode: new Map(), courses: {}, licenseRules: [], uploadRules: [], verifications: [],
    refresh: null // re-renders the visible file list in place while typing
  };

  // ---------- ID system ----------
  // <course>_<TYPE>_<term>_<item>[_V..][_TAG]_<uploader> <title>.ext

  const N = { raw: null, types: {}, seasons: {}, placeholders: {}, tags: {}, licenses: {}, spdx: {}, serials: [], version: /^V\d+(?:\.\d+)*$/, uploader: /^\d{9}$/ };
  function setNaming(d) {
    if (!d) return;
    N.raw = d;
    for (const t of d.types) N.types[t.code] = t;
    for (const s of d.seasons) N.seasons[s.letter] = s;
    for (const p of d.termPlaceholders) N.placeholders[p.code] = p;
    for (const t of d.tags) N.tags[t.code] = t;
    for (const l of d.licenses || []) { N.licenses[l.code] = l; for (const id of l.spdx) N.spdx[id.toLowerCase()] = l; }
    N.serials = d.serials.map((s) => ({ ...s, re: new RegExp(s.pattern) }));
    N.version = new RegExp(d.version.pattern);
    N.uploader = new RegExp(d.uploader.pattern);
  }
  const CATEGORY_ORDER = ["Syllabus", "Lecture", "Tutorial", "Homework", "Workshop", "Lab", "Past Exams", "Review Material", "Notes", "Textbook"];

  // 6-digit shorthand pads each half to 4 digits: 104131 -> 0104|0131 -> 01040131.
  const padCourse = (s) => /^\d{6}$/.test(s) ? s.slice(0, 3).padStart(4, "0") + s.slice(3).padStart(4, "0") : s;
  const courseName = (code) => state.courses[code] || "";
  const courseLabel = (code) => courseName(code) ? `${code} · ${courseName(code)}` : code;

  function termInfo(code) {
    const ph = N.placeholders[code];
    if (ph) return { code, label: ph.name, note: ph.note, ok: true };
    const m = /^(\d{2})(\d{2})([A-Z])$/.exec(code);
    if (!m || !N.seasons[m[3]]) return null;
    const a = Number(m[1]), b = Number(m[2]), s = N.seasons[m[3]];
    const season = s.name.replace(/\s*\(.*\)$/, "");
    const start = 2000 + a, end = 2000 + b;
    const label = s.letter === "W" ? `${season} ${start}–${String(end).slice(2)}` : `${season} ${s.year === "start" ? start : end}`;
    return { code, label, note: `Academic year ${start}–${end}`, ok: (a + 1) % 100 === b, order: a * 10 + "WSAF".indexOf(s.letter) };
  }

  // Decode a file's base name. Returns null when it doesn't start like an ID.
  function parseId(base) {
    const sp = base.indexOf(" ");
    const idPart = sp < 0 ? base : base.slice(0, sp);
    const title = sp < 0 ? "" : base.slice(sp + 1).trim();
    const tokens = idPart.split("_");
    const r = { idPart, title, course: null, type: null, term: null, item: null, version: null, tags: [], uploader: null, fields: [], problems: [], hints: [] };
    const field = (part, label, value, note, cls) => r.fields.push({ part, label, value, note, cls });

    if (!/^\d{8}$/.test(tokens[0])) {
      if (/^\d{6}$/.test(tokens[0]) && tokens.length > 1) r.problems.push(`Course codes have 8 digits: write ${padCourse(tokens[0])}, not ${tokens[0]}.`);
      else return null;
    } else {
      r.course = tokens[0];
      field(tokens[0], "Course", courseName(tokens[0]) || "Course code", courseName(tokens[0]) ? "" : "Course name not listed in courses.json", "f-course");
    }

    let i = 1;
    const t = tokens[i];
    if (t && N.types[t]) { r.type = N.types[t]; field(t, "Type", r.type.name, `${r.type.category} · ${r.type.by}`, "f-type"); i++; }
    else { r.problems.push(t ? `"${t}" is not a type code (e.g. HWS, LP, PEQ).` : "Add a type code after the course, e.g. 01140086_HWS."); if (t) i++; }

    const ti = tokens[i] ? termInfo(tokens[i]) : null;
    if (ti) {
      r.term = ti; field(tokens[i], "Term", ti.label, ti.note, "f-term"); i++;
      if (!ti.ok) r.problems.push(`${ti.code}: the two years must be consecutive, e.g. 2627W.`);
      if (r.type && r.type.code === "XT") r.hints.push("Textbooks (XT) don't need a term.");
    } else if (!r.type || r.type.code !== "XT") {
      r.problems.push("Add a term code after the type, e.g. 2627W (Winter 2026–27).");
    }

    const s = tokens[i] && !N.uploader.test(tokens[i]) && N.serials.find((x) => x.re.test(tokens[i]));
    if (s) { r.item = { code: tokens[i], kind: s.kind }; field(tokens[i], "Item", s.kind, s.note, "f-item"); i++; }

    for (; i < tokens.length; i++) {
      const x = tokens[i];
      if (N.version.test(x)) { r.version = x; field(x, "Version", "Version " + x.slice(1).replace(/^0+(?=\d)/, ""), "", "f-ver"); }
      else if (N.tags[x]) { r.tags.push(N.tags[x]); field(x, "Tag", N.tags[x].name, N.tags[x].note, "f-tag"); }
      else if (N.uploader.test(x)) {
        r.uploader = x;
        const reg = state.uploaders.get(x);
        field(x, "Uploader", reg ? reg.name : "Student number", reg ? (reg.github ? "Registered · @" + reg.github : "Registered") : "Not registered, so no name is shown", "f-up");
      }
      else if (x === "") r.problems.push("Remove the empty field (double underscore).");
      else r.problems.push(`"${x}" isn't a known item number, version, tag or student number.`);
    }

    if (/-/.test(idPart)) r.problems.push("Use _ between ID fields, never -.");
    if (!title) r.hints.push("Add a short English title after one space.");
    if (r.type && r.type.by === "Student" && !r.uploader) r.hints.push("Student work: add your 9-digit student number at the end of the ID so people know who shared it.");
    r.status = r.problems.length ? "partial" : "full";
    return r;
  }

  // The ID drawn as coloured segments.
  function idNode(info, big) {
    if (!info) return null;
    const parts = [];
    info.idPart.split("_").forEach((tok, i) => {
      if (i) parts.push(h("span", { class: "id-sep" }, "_"), h("wbr"));
      const f = info.fields.find((x) => x.part === tok);
      parts.push(h("span", { class: f ? f.cls : "f-bad", title: f ? `${f.label}: ${f.value}` : "Not recognised" }, tok));
    });
    return h("span", { class: "id-code" + (big ? " big" : "") }, parts);
  }

  // Two people can be involved: the student the file belongs to (the student number in its ID)
  // and the person who uploaded it. The uploader comes from uploads.json when someone shared
  // the file on another student's behalf, otherwise from the GitHub account that added it.
  // A GitHub username registered with the student number confirms the uploader.
  function uploaderInfo(f) {
    const code = f.idInfo ? f.idInfo.uploader : null;
    const reg = code ? state.uploaders.get(code) : null;
    const login = f.uploadedBy && f.uploadedBy.login;
    const accountCode = login ? state.loginToCode.get(login.toLowerCase()) : null;
    const rec = ruleFor(state.uploadRules, f);
    const byKey = rec ? rec.uploadedBy : accountCode || (login ? "@" + login : f.uploadedBy ? "~" + f.uploadedBy.name : null);
    let status = "unknown";
    if (code && byKey && byKey !== code && (rec || login)) status = "behalf";
    else if (code && reg && reg.github && login && !rec) status = reg.github.toLowerCase() === login.toLowerCase() ? "verified" : "behalf";
    else if (code && rec) status = "recorded";
    else if (code && reg) status = reg.github && !login ? "claimed" : "registered";
    else if (code) status = "student";
    else if (byKey) status = "account";
    return { code, reg, login, byKey, recorded: !!rec, status };
  }

  // The person who uploaded: a student number, else a GitHub login ("@…"), else a commit name ("~…").
  const accountKey = (f) => f.up.byKey;
  function personLabel(key) {
    if (!key) return "";
    if (state.uploaders.has(key)) return state.uploaders.get(key).name;
    if (key.startsWith("@")) return key;
    if (N.uploader.test(key)) return "Student " + key;
    return key.startsWith("~") ? key.slice(1) : key; // "~" marks a commit name
  }
  const personHref = (key) => "#/u/" + enc(key);

  function uploaderLine(f) {
    const u = f.up, key = accountKey(f);
    switch (u.status) {
      case "verified": return h("span", { class: "up up-ok", title: `Uploader confirmed: uploaded from ${u.reg.name}'s registered GitHub account @${u.login}` }, icon("check"), `${u.reg.name} · ${u.code}`);
      case "behalf": return h("span", { class: "up", title: `Uploaded by ${personLabel(key)} on behalf of ${personLabel(u.code)}` },
        `${personLabel(u.code)} · uploaded by ${personLabel(key)}`);
      case "recorded":
      case "claimed":
      case "registered": return h("span", { class: "up" }, `${u.reg ? u.reg.name : "Student " + u.code} · ${u.code}`);
      case "student": return h("span", { class: "up", title: "Student number from the file's ID" }, `Student ${u.code}`);
      case "account": return h("span", { class: "up" }, personLabel(key));
      default: return null;
    }
  }

  // ---------- file data ----------

  const TYPES = {
    pdf: ["PDF", "pdf"],
    png: ["Image", "image"], jpg: ["Image", "image"], jpeg: ["Image", "image"], gif: ["Image", "image"], svg: ["Image", "image"], webp: ["Image", "image"],
    mp4: ["Video", "video"], webm: ["Video", "video"],
    txt: ["Text", "text"], md: ["Text", "text"],
    tex: ["LaTeX", "text"], bib: ["LaTeX", "text"],
    py: ["Code", "text"], m: ["Code", "text"], jl: ["Code", "text"], c: ["Code", "text"], cpp: ["Code", "text"],
    h: ["Code", "text"], f90: ["Code", "text"], js: ["Code", "text"], r: ["Code", "text"], sh: ["Code", "text"],
    csv: ["Data", "text"], dat: ["Data", "text"], json: ["Data", "text"],
    ipynb: ["Notebook", "notebook"],
    doc: ["Word", "office"], docx: ["Word", "office"], odt: ["Word", null],
    ppt: ["Slides", "office"], pptx: ["Slides", "office"], key: ["Slides", null],
    xls: ["Sheet", "office"], xlsx: ["Sheet", "office"],
    zip: ["Archive", null], tar: ["Archive", null], gz: ["Archive", null], "7z": ["Archive", null]
  };

  function parseFile(e) {
    const parts = e.path.split("/").filter(Boolean);
    const name = parts[parts.length - 1];
    const dot = name.lastIndexOf(".");
    const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
    const base = dot > 0 ? name.slice(0, dot) : name;
    const [type, preview] = TYPES[ext] || [ext ? ext.toUpperCase() : "File", null];
    const idInfo = parseId(base);
    const f = {
      path: parts.join("/"),
      href: parts.map(enc).join("/"),
      name, ext, type, preview, idInfo,
      title: idInfo && idInfo.title ? idInfo.title : pretty(base),
      subject: parts.length > 2 ? parts[1] : "Other",
      topic: parts.slice(2, -1).map(pretty).join(" / "),
      size: e.size == null ? null : e.size,
      sha256: e.sha256 || null,
      spdx: e.spdx || null,
      added: e.added || null,
      updated: e.updated || null,
      contributors: e.contributors || [],
      uploadedBy: e.uploader || null,
      alts: [], altOf: null // other formats of the same item, e.g. the LaTeX source of a PDF
    };
    f.course = idInfo && idInfo.course;
    f.material = idInfo && idInfo.type ? idInfo.type.code : null;
    f.category = idInfo && idInfo.type ? idInfo.type.category : null;
    f.up = uploaderInfo(f);
    f.lic = licenseOf(f);
    f.people = [...new Set([accountKey(f), f.up.code].filter(Boolean))];
    return f;
  }
  const isHidden = (path) => path.split("/").some((p) => p.startsWith(".") || p.startsWith("_"));

  // Files in the same folder with the same ID (or the same name apart from the
  // extension) are one item: shown as one card, led by the PDF, with the rest attached.
  function groupItems(files) {
    const groups = new Map();
    for (const f of files) {
      const dir = f.path.slice(0, f.path.lastIndexOf("/"));
      const key = dir + "/" + (f.idInfo && f.idInfo.status === "full" ? f.idInfo.idPart : f.name.replace(/\.[^.]*$/, ""));
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(f);
    }
    const rank = (f) => f.ext === "pdf" ? 0 : f.preview ? 1 : 2;
    for (const g of groups.values()) {
      g.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
      const [main, ...rest] = g;
      main.alts = rest;
      for (const r of rest) r.altOf = main;
    }
    return files.filter((f) => !f.altOf);
  }

  // How an attached file differs from its item's main file, e.g. "LaTeX Source".
  function altLabel(a, main) {
    let i = 0;
    while (i < a.title.length && a.title[i] === main.title[i]) i++;
    const rest = a.title.slice(i).trim();
    return rest || a.type;
  }

  async function loadFiles() {
    const d = await getJson("files.json");
    if (d) return { files: d.files, subjects: d.subjects || [], generated: d.generated, source: "index" };
    try {
      const r = await fetch(`${API}/git/trees/${enc(C.branch)}?recursive=1`);
      if (!r.ok) throw new Error(r.status);
      const t = await r.json();
      const files = [], subjects = [];
      for (const x of t.tree) {
        if (!x.path.startsWith("files/") || isHidden(x.path)) continue;
        if (x.type === "blob") files.push({ path: x.path, size: x.size });
        else if (x.type === "tree" && x.path.split("/").length === 2) subjects.push(x.path.split("/")[1]);
      }
      return { files, subjects, source: "api" };
    } catch (e) {
      return { files: [], subjects: [], source: "none" };
    }
  }

  function countBy(key) {
    const counts = {};
    for (const f of state.items) if (f[key]) counts[f[key]] = (counts[f[key]] || 0) + 1;
    return counts;
  }
  function subjectCounts() {
    const counts = {};
    for (const s of state.subjects) counts[s] = 0;
    for (const f of state.items) counts[f.subject] = (counts[f.subject] || 0) + 1;
    return counts;
  }

  // Everyone who registered, put their student number in an ID, or uploaded something.
  function peopleStats() {
    const map = new Map();
    const get = (key) => {
      if (!map.has(key)) {
        const reg = state.uploaders.get(key);
        map.set(key, { key, reg, name: personLabel(key), login: reg ? reg.github : key.startsWith("@") ? key.slice(1) : null, isNumber: N.uploader.test(key),
          uploads: 0, authored: 0, subjects: new Set(), last: null });
      }
      return map.get(key);
    };
    for (const code of state.uploaders.keys()) get(code);
    for (const f of state.items) {
      const a = accountKey(f);
      if (a) { const p = get(a); p.uploads++; p.subjects.add(f.subject); if (f.added && (!p.last || f.added > p.last)) p.last = f.added; }
      if (f.up.code) get(f.up.code).authored++;
    }
    return [...map.values()].sort((x, y) => (y.uploads + y.authored) - (x.uploads + x.authored) || x.name.localeCompare(y.name));
  }

  function toggleFav(path) {
    if (state.favs.has(path)) state.favs.delete(path); else state.favs.add(path);
    store.set("favs", [...state.favs]);
    updateNavCounts();
    return state.favs.has(path);
  }

  // Everyone uploads with the "Upload a file" issue form; a workflow turns it into a pull request.
  const uploadUrl = (v) => {
    let url = `${REPO}/issues/new?template=upload.yml`;
    if (!v) return url;
    const type = N.types[v.type], lic = N.licenses[v.license];
    // Keys are the form's field ids. ("type" would clash with GitHub's own issue-type parameter, so that field is "kind".)
    const fields = { title: "[Upload] " + v.title, file_title: v.title, subject: v.subject, kind: type ? type.code : "", license: lic ? lic.code : "",
      course: v.course, course_name: v.courseName, term: v.term, item: v.item, student: v.uploader };
    for (const [k, val] of Object.entries(fields)) if (val) url += `&${k}=${enc(val)}`;
    return url;
  };
  // Collaborators can also add files straight to the repository.
  const directUploadUrl = (subject) => `${REPO}/upload/${C.branch}/files${subject ? "/" + enc(subject) : ""}`;

  // ---------- routing ----------

  function parseRoute() {
    const raw = location.hash.replace(/^#\/?/, "");
    const [p, qs] = raw.split("?");
    const segs = p.split("/").filter(Boolean).map((s) => { try { return decodeURIComponent(s); } catch (e) { return s; } });
    return { name: segs[0] || "home", arg: segs.slice(1).join("/"), params: new URLSearchParams(qs || "") };
  }

  function render() {
    const r = parseRoute();
    const view = VIEWS[r.name] || VIEWS.notfound;
    state.refresh = null;
    fill(document.getElementById("view"), view(r));
    highlightNav();
    closeSidebar();
    window.scrollTo(0, 0);
    if (r.name === "file") {
      const f = state.files.find((x) => x.path === r.arg);
      if (f) openPreview(f); else toast("File not found");
    }
  }

  // ---------- sidebar ----------

  function navLink(href, iconName, label, count, id) {
    return h("a", { class: "nav-link", href, "data-href": href },
      icon(iconName), h("span", { class: "nav-label" }, label),
      count != null ? h("span", { class: "nav-count", id }, String(count)) : null);
  }

  // A sidebar section that folds away (remembered per browser). With an href, the heading
  // itself opens that section's overview page and a separate arrow does the folding.
  function navSection(key, title, href, ...links) {
    const folded = store.get("navFold", {});
    const body = h("div", { class: "nav-body", id: "nav-" + key }, links);
    const toggle = () => {
      const now = store.get("navFold", {});
      now[key] = !sec.classList.contains("folded");
      sec.classList.toggle("folded", now[key]);
      fold.setAttribute("aria-expanded", String(!now[key]));
      store.set("navFold", now);
    };
    const fold = href
      ? h("button", { class: "nav-fold", type: "button", "aria-expanded": String(!folded[key]), "aria-controls": "nav-" + key, "aria-label": `Fold ${title}`, title: "Fold / unfold", onclick: toggle }, icon("chevron"))
      : h("button", { class: "nav-heading nav-toggle", type: "button", "aria-expanded": String(!folded[key]), "aria-controls": "nav-" + key, onclick: toggle }, h("span", null, title), icon("chevron"));
    const head = href
      ? h("div", { class: "nav-heading nav-toggle has-page" }, h("a", { class: "nav-heading-link", href, "data-href": href, title: `All ${title.toLowerCase()}` }, title), fold)
      : fold;
    const sec = h("div", { class: "nav-section" + (folded[key] ? " folded" : "") }, head, body);
    return sec;
  }

  function buildNav() {
    const counts = subjectCounts();
    const courses = countBy("course"), cats = countBy("category");
    const nav = document.getElementById("nav");
    fill(nav, 
      h("div", { class: "nav-section nav-help" }, navLink("#/help", "help", "Help & guide"),
        navLink("#/changelog", "list", "Changelog", window.CHANGELOG && window.CHANGELOG.length ? "v" + window.CHANGELOG[0].version : null)),
      navSection("library", "Library", null,
        navLink("#/", "home", "Home"),
        navLink("#/browse", "files", "All files", state.items.length),
        navLink("#/recent", "clock", "Recently added"),
        navLink("#/favorites", "star", "Favorites", state.favs.size, "fav-count"),
        navLink("#/ids", "id", "ID system")),
      navSection("subjects", "Subjects", "#/subjects",
        Object.keys(counts).sort().map((s) => navLink("#/subject/" + enc(s), "folder", pretty(s), counts[s]))),
      Object.keys(courses).length ? navSection("courses", "Courses", "#/courses",
        Object.keys(courses).sort().map((c) => navLink("#/course/" + c, "course", courseLabel(c), courses[c]))) : null,
      Object.keys(cats).length ? navSection("material", "Material", "#/materials",
        CATEGORY_ORDER.filter((c) => cats[c]).map((c) => navLink("#/material/" + enc(c), "tag", c, cats[c]))) : null,
      navSection("community", "Community", null,
        navLink("#/uploaders", "users", "Uploaders"),
        navLink("#/requests", "inbox", "File requests"),
        navLink("#/contribute", "upload", "How to contribute")),
      navSection("tools", "Physics tools", null,
        navLink("#/constants", "atom", "Physical constants"),
        navLink("#/converter", "swap", "Unit converter"),
        navLink("#/resources", "book", "Resources")),
      h("div", { class: "nav-section" },
        h("a", { class: "nav-link", href: REPO, target: "_blank", rel: "noopener" }, icon("github"), h("span", { class: "nav-label" }, "GitHub repository")))
    );
  }

  function updateNavCounts() {
    const el = document.getElementById("fav-count");
    if (el) el.textContent = String(state.favs.size);
  }

  function highlightNav() {
    const r = parseRoute();
    let current = "#/" + (r.name === "home" ? "" : r.name);
    if (["subject", "material"].includes(r.name)) current += "/" + enc(r.arg);
    if (r.name === "course") current += "/" + r.arg;
    if (r.name === "u") current = "#/uploaders";
    if (r.name === "file") {
      const f = state.files.find((x) => x.path === r.arg);
      current = f ? "#/subject/" + enc(f.subject) : "#/browse";
    }
    document.querySelectorAll("#nav [data-href]").forEach((a) => {
      const on = a.dataset.href === current;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  const sidebar = () => document.getElementById("sidebar");
  function openSidebar() {
    sidebar().classList.add("open");
    document.getElementById("backdrop").hidden = false;
    document.getElementById("menu-btn").setAttribute("aria-expanded", "true");
  }
  function closeSidebar() {
    sidebar().classList.remove("open");
    document.getElementById("backdrop").hidden = true;
    document.getElementById("menu-btn").setAttribute("aria-expanded", "false");
  }

  // ---------- theme ----------

  const THEMES = [["auto", "auto", "Theme: system"], ["light", "sun", "Theme: light"], ["dark", "moon", "Theme: dark"]];
  function applyTheme(t) {
    if (t === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = t;
    const [, ic, label] = THEMES.find((x) => x[0] === t);
    fill(document.getElementById("theme-toggle"), icon(ic), h("span", { class: "nav-label" }, label));
  }

  // Accent colour: orange (default) or gray + red.
  const ACCENTS = [["orange", "Accent: orange", "#c2410c"], ["red", "Accent: red", "#b91c1c"]];
  function applyAccent(a) {
    if (a === "orange") delete document.documentElement.dataset.accent;
    else document.documentElement.dataset.accent = a;
    const [, label, swatch] = ACCENTS.find((x) => x[0] === a) || ACCENTS[0];
    fill(document.getElementById("accent-toggle"), 
      h("span", { class: "swatch", style: `background:${swatch}`, "aria-hidden": "true" }), h("span", { class: "nav-label" }, label));
  }

  // ---------- file cards and lists ----------

  function matchesQuery(f) {
    if (!state.q) return true;
    const q = state.q.replace(/^(\d{6})(?=_|$)/, (m) => padCourse(m));
    const u = f.up;
    const hay = [f.name, f.title, pretty(f.subject), f.topic, f.type, ...f.contributors, ...f.alts.map((a) => a.name + " " + a.type),
      f.idInfo ? f.idInfo.idPart : "", f.course ? courseName(f.course) : "", f.idInfo && f.idInfo.type ? f.idInfo.type.name : "",
      f.idInfo && f.idInfo.term ? f.idInfo.term.label : "", u.code || "", u.login || "", u.reg ? u.reg.name : "", u.name || "", f.lic.lic ? f.lic.lic.short + " " + f.lic.lic.code : ""].join(" ").toLowerCase();
    return q.split(/\s+/).every((w) => hay.includes(w));
  }

  const idSortKey = (f) => f.idInfo ? [f.course || "", f.category ? String(CATEGORY_ORDER.indexOf(f.category)).padStart(2, "0") : "99",
    f.idInfo.term && f.idInfo.term.order != null ? String(f.idInfo.term.order).padStart(4, "0") : "9999", f.idInfo.item ? f.idInfo.item.code : "", f.idInfo.idPart].join("|") : "~" + f.title;
  const SORTS = {
    name: ["Name (A–Z)", (a, b) => a.title.localeCompare(b.title)],
    id: ["ID (course, type, term)", (a, b) => idSortKey(a).localeCompare(idSortKey(b), undefined, { numeric: true })],
    newest: ["Newest first", (a, b) => (b.added || "").localeCompare(a.added || "")],
    updated: ["Recently updated", (a, b) => (b.updated || "").localeCompare(a.updated || "")],
    largest: ["Largest first", (a, b) => (b.size || 0) - (a.size || 0)],
    subject: ["Subject", (a, b) => a.subject.localeCompare(b.subject) || a.title.localeCompare(b.title)]
  };

  function fileMeta(f) {
    const bits = [];
    if (f.idInfo && f.idInfo.term) bits.push(f.idInfo.term.label);
    if (f.size != null) bits.push(fmtSize(f.size));
    if (f.added) bits.push(fmtDate(f.added));
    return bits.join(" · ");
  }

  function card(f) {
    const fav = state.favs.has(f.path);
    const star = h("button", { class: "icon-btn star" + (fav ? " on" : ""), type: "button",
      title: fav ? "Remove from favorites" : "Add to favorites", "aria-pressed": String(fav),
      onclick: () => {
        const on = toggleFav(f.path);
        star.classList.toggle("on", on);
        star.setAttribute("aria-pressed", String(on));
        star.title = on ? "Remove from favorites" : "Add to favorites";
        toast(on ? "Added to favorites" : "Removed from favorites");
        if (parseRoute().name === "favorites" && state.refresh) state.refresh();
      } }, icon("star"));
    const info = f.idInfo;
    const sub = info && info.type ? [info.type.name, f.course ? courseLabel(f.course) : null].filter(Boolean).join(" · ")
      : pretty(f.subject) + (f.topic ? " · " + f.topic : "");

    return h("article", { class: "card" },
      h("div", { class: "card-top" },
        h("div", { class: "card-tags" },
          h("span", { class: "badge t-" + slug(f.type) }, f.type),
          info && info.type ? h("span", { class: "badge mat", title: info.type.name }, info.type.code) : null,
          licBadge(f), verBadge(f)),
        star),
      h("div", { class: "card-body" },
        h("h3", null, h("button", { class: "title-link", type: "button", onclick: () => openPreview(f) }, f.title)),
        h("p", { class: "card-sub" }, sub),
        info ? h("p", { class: "card-id" }, idNode(info), info.status === "partial" ? h("span", { class: "id-flag", title: info.problems.join(" ") }, icon("alert")) : null) : null,
        h("p", { class: "card-meta" }, uploaderLine(f), fileMeta(f) ? h("span", null, fileMeta(f)) : null),
        f.alts.length ? h("p", { class: "card-alts" }, h("span", { class: "muted" }, "Also:"),
          f.alts.map((a) => h("a", { class: "alt-link", href: a.href, download: a.name, title: `Download ${a.name}` },
            icon("download"), altLabel(a, f), h("span", { class: "muted" }, ` · ${a.ext.toUpperCase()}${a.size != null ? " " + fmtSize(a.size) : ""}`)))) : null),
      h("div", { class: "card-actions" },
        h("button", { class: "btn small", type: "button", onclick: () => openPreview(f) }, icon("eye"), "Preview"),
        h("a", { class: "btn small", href: f.href, download: f.name }, icon("download"), "Download"),
        h("button", { class: "icon-btn", type: "button", title: "Copy link to this file",
          onclick: (e) => copyText(SITE_BASE + "#/file/" + f.href, e.currentTarget) }, icon("link"))));
  }

  function emptyState(title, text, action) {
    return h("div", { class: "empty" }, h("p", { class: "empty-title" }, title), text ? h("p", null, text) : null, action || null);
  }

  // A filterable, sortable list used by every file page.
  function fileListView({ title, desc, filter, sort, empty, extra }) {
    const base = state.items.filter(filter);
    const uniq = (fn) => [...new Set(base.map(fn).filter(Boolean))];
    const types = uniq((f) => f.type).sort();
    const mats = uniq((f) => f.material).sort((a, b) => CATEGORY_ORDER.indexOf(N.types[a].category) - CATEGORY_ORDER.indexOf(N.types[b].category) || a.localeCompare(b));
    const terms = [...new Map(base.filter((f) => f.idInfo && f.idInfo.term).map((f) => [f.idInfo.term.code, f.idInfo.term])).values()].sort((a, b) => (b.order || 0) - (a.order || 0));
    if (!types.includes(state.type)) state.type = "All";
    if (!mats.includes(state.material)) state.material = "All";
    if (!terms.some((t) => t.code === state.term)) state.term = "All";
    const lics = [...new Map(base.filter((f) => f.lic.lic).map((f) => [f.lic.lic.code, f.lic.lic])).values()].sort((a, b) => a.short.localeCompare(b.short));
    const anyUnstated = base.some((f) => !f.lic.lic);
    if (state.lic !== "All" && state.lic !== "none" && !lics.some((l) => l.code === state.lic)) state.lic = "All";
    let sortKey = sort || state.sort;
    if (!state.hasDates && (sortKey === "newest" || sortKey === "updated")) sortKey = "name";

    const count = h("span", { class: "result-count", "aria-live": "polite" });
    const results = h("div");
    const select = (label, all, options, value, onchange) => h("select", { "aria-label": label, onchange },
      h("option", { value: "All" }, all), options.map(([v, l]) => h("option", { value: v, selected: v === value }, l)));

    const typeSel = select("File format", "All formats", types.map((t) => [t, t]), state.type, (e) => { state.type = e.target.value; refresh(); });
    const matSel = mats.length ? select("Material type", "All material", mats.map((m) => [m, `${m} · ${N.types[m].name}`]), state.material, (e) => { state.material = e.target.value; refresh(); }) : null;
    const termSel = terms.length ? select("Term", "All terms", terms.map((t) => [t.code, `${t.code} · ${t.label}`]), state.term, (e) => { state.term = e.target.value; refresh(); }) : null;
    const verSel = select("Verification", "Any status", [["verified", "Verified"], ["changed", "Changed since verified"], ["none", "Not verified"]], state.ver,
      (e) => { state.ver = e.target.value; refresh(); });
    const licSel = lics.length ? select("Licence", "All licences", [...lics.map((l) => [l.code, l.short]), ...(anyUnstated ? [["none", "No licence stated"]] : [])], state.lic,
      (e) => { state.lic = e.target.value; refresh(); }) : null;
    const sortSel = h("select", { "aria-label": "Sort by", onchange: (e) => { sortKey = e.target.value; if (!sort) { state.sort = sortKey; store.set("sort", sortKey); } refresh(); } },
      Object.entries(SORTS).filter(([k]) => state.hasDates || (k !== "newest" && k !== "updated"))
        .map(([k, [label]]) => h("option", { value: k, selected: k === sortKey }, label)));
    const layoutBtn = (mode, ic, label) => h("button", { type: "button", class: "seg" + (state.layout === mode ? " on" : ""), title: label, "aria-pressed": String(state.layout === mode),
      onclick: (e) => {
        state.layout = mode; store.set("layout", mode);
        e.currentTarget.parentNode.querySelectorAll(".seg").forEach((b) => { const on = b === e.currentTarget; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); });
        refresh();
      } }, icon(ic));

    function refresh() {
      const list = base.filter((f) => matchesQuery(f)
        && (state.type === "All" || f.type === state.type)
        && (state.material === "All" || f.material === state.material)
        && (state.term === "All" || (f.idInfo && f.idInfo.term && f.idInfo.term.code === state.term))
        && (state.lic === "All" || (state.lic === "none" ? !f.lic.lic : f.lic.lic && f.lic.lic.code === state.lic))
        && (state.ver === "All" || (state.ver === "none" ? ["none", "partial"].includes(itemVerification(f).state) : itemVerification(f).state === state.ver))).sort(SORTS[sortKey][1]);
      count.textContent = `${list.length} ${list.length === 1 ? "file" : "files"}` + (list.length !== base.length ? ` of ${base.length}` : "");
      if (!base.length) fill(results, state.source === "none" ? loadErrorNotice() : empty);
      else if (!list.length) fill(results, emptyState("Nothing matches", "Try a different search or filter.",
        h("button", { class: "btn", type: "button", onclick: clearFilters }, "Clear filters")));
      else fill(results, h("div", { class: "files " + state.layout }, list.map(card)));
    }
    function clearFilters() {
      state.q = ""; state.type = state.material = state.term = state.lic = state.ver = "All";
      [typeSel, matSel, termSel, licSel, verSel].forEach((s) => { if (s) s.value = "All"; });
      document.getElementById("search").value = "";
      refresh();
    }
    state.refresh = refresh;
    refresh();

    return h("div", null,
      h("div", { class: "page-head" },
        h("div", null, h("h1", null, title), desc ? h("p", { class: "muted" }, desc) : null),
        extra || null),
      h("div", { class: "toolbar" }, count, h("div", { class: "toolbar-right" }, matSel, termSel, licSel, verSel, typeSel, sortSel,
        h("div", { class: "segmented", role: "group", "aria-label": "Layout" }, layoutBtn("grid", "grid", "Grid view"), layoutBtn("list", "list", "List view")))),
      results);
  }

  // Shown when neither files.json nor the GitHub API could list the files.
  const loadErrorNotice = () => h("div", { class: "notice" },
    h("p", null, h("strong", null, "Couldn't load the file list. "), "Check your connection or try again later."),
    h("p", { class: "small" }, "If you maintain this site: the file list (files.json) is built by the “Deploy website” workflow. Make sure ",
      h("strong", null, "Settings → Pages → Source"), " is set to ", h("strong", null, "GitHub Actions"),
      ". The backup listing can't read a private repository."));

  const uploadEmpty = (subject) => emptyState("No files here yet", "Be the first to share something!",
    h("a", { class: "btn primary", href: "#/contribute" }, icon("upload"), "Upload a file"));

  // ---------- licences ----------
  // Every shared file can have its own licence, kept out of the file name. Where it comes from, in order:
  //   1. a rule in licenses.json (by file, folder or ID)
  //   2. a "SPDX-License-Identifier:" line inside the file (found by the indexer)
  // Otherwise it's "not stated": the author keeps all rights. The website code is MIT.

  const licensesUrl = () => `${REPO}/blob/${C.branch}/licenses.json`;
  const contentLicenseUrl = () => `${REPO}/blob/${C.branch}/CONTENT-LICENSE.md`;
  // The "Report a file" issue form, pre-filled with the file when there is one.
  const reportUrl = (f) => `${REPO}/issues/new?template=report.yml` + (f ? `&title=${enc("[Report] " + f.name)}&file=${enc(f.path)}` : "");

  // Copyright reminder shown on Home, the contribute page and in Help.
  const copyrightNotice = () => h("div", { class: "notice notice-legal", role: "note" }, icon("alert"),
    h("div", null,
      h("p", null, h("strong", null, "Copyright. "), "Share only your own work, or material you have permission to share. Don't upload textbooks, solution manuals, official exams, homework sheets or lecture slides without the owner's permission, or solutions to assignments that are still open."),
      h("p", null, "Files here are for study. Each file's licence says what else you may do with it; without one, ask the author before copying or resharing. ",
        "Own something posted here, or found personal information? ", h("a", { href: reportUrl(), target: "_blank", rel: "noopener" }, "Report it"),
        " and a maintainer removes it. ", h("a", { class: "nowrap", href: contentLicenseUrl(), target: "_blank", rel: "noopener" }, "Copyright and takedown →"))));


  // Most specific rule for a file from licenses.json / uploads.json: exact ID > exact path > ID prefix > folder.
  function ruleFor(rules, f) {
    let best = null, bestLen = -1;
    for (const r of rules) {
      let len = -1;
      if (r.path) {
        const p = r.path.replace(/^\/+/, "");
        if (f.path === p) len = 10000 + p.length;
        else if (p.endsWith("/") && f.path.startsWith(p)) len = p.length;
      } else if (r.id && f.idInfo) {
        const id = f.idInfo.idPart;
        if (id === r.id) len = 20000;
        else if (id.startsWith(r.id + "_")) len = 5000 + r.id.length;
      }
      if (len > bestLen) { best = r; bestLen = len; }
    }
    return best;
  }

  function licenseOf(f) {
    const rule = ruleFor(state.licenseRules, f);
    if (rule) return { lic: N.licenses[rule.license], source: "licenses.json" };
    if (f.spdx) {
      const known = N.spdx[f.spdx.toLowerCase()];
      return { lic: known || { code: f.spdx, short: f.spdx, name: f.spdx, url: `https://spdx.org/licenses/${enc(f.spdx)}.html`, note: "See the licence text." },
        source: "notice inside the file" };
    }
    return { lic: null, source: null };
  }

  const licBadge = (f) => f.lic.lic
    ? h("span", { class: "badge lic", title: f.lic.lic.name }, f.lic.lic.short)
    : null;

  function licensePanel(f) {
    const { lic, source } = f.lic;
    const yes = (ok, label) => h("li", { class: ok ? "ok" : "no" }, h("span", { class: "mark", "aria-hidden": "true" }, ok ? "✓" : "✕"), label);
    if (!lic) return h("div", { class: "side-block" },
      h("p", { class: "side-title" }, "Licence"),
      h("p", { class: "side-note" }, h("strong", null, "No licence stated. "), "The author keeps all rights: read and study it here, but ask the author before copying, adapting or resharing."),
      h("p", { class: "side-note muted small" }, "Uploader: add a rule to ",
        h("a", { href: licensesUrl(), target: "_blank", rel: "noopener" }, "licenses.json"), " (the ", h("a", { href: "#/ids?tab=build" }, "name builder"), " writes it for you), or a licence notice inside the file."));
    const known = lic.share != null;
    return h("div", { class: "side-block" },
      h("p", { class: "side-title" }, "Licence"),
      h("p", { class: "side-note" }, lic.url ? h("a", { href: lic.url, target: "_blank", rel: "noopener" }, h("strong", null, lic.name)) : h("strong", null, lic.name)),
      known ? h("ul", { class: "perm" },
        yes(lic.share, "Share copies"), yes(lic.adapt, "Adapt or remix"), yes(lic.commercial, "Commercial use"),
        lic.credit ? h("li", { class: "need" }, h("span", { class: "mark", "aria-hidden": "true" }, "!"), "Credit the author") : null,
        lic.shareAlike ? h("li", { class: "need" }, h("span", { class: "mark", "aria-hidden": "true" }, "!"), "Share adaptations under the same licence") : null) : null,
      lic.note ? h("p", { class: "side-note muted small" }, lic.note) : null,
      h("p", { class: "side-note muted small" }, "Stated in: ", source === "licenses.json" ? h("a", { href: licensesUrl(), target: "_blank", rel: "noopener" }, "licenses.json") : source, "."));
  }

  // ---------- preview modal ----------

  // Files that belong to the same item: same course, term, item number and kind of material.
  function relatedFiles(f) {
    const i = f.idInfo;
    if (!i || !i.course || !i.type || !i.item) return [];
    return state.items.filter((g) => g !== f && g.idInfo && g.idInfo.course === i.course && g.idInfo.type && g.idInfo.type.category === i.type.category
      && g.idInfo.item && g.idInfo.item.code.replace(/b$/, "") === i.item.code.replace(/b$/, "")
      && (g.idInfo.term && g.idInfo.term.code) === (i.term && i.term.code)).sort(SORTS.id[1]);
  }
  const duplicatesOf = (f) => f.sha256 ? state.files.filter((g) => g !== f && g.sha256 === f.sha256) : [];

  function uploaderPanel(f) {
    const u = f.up, key = accountKey(f);
    const who = (k) => k ? h("a", { href: personHref(k) }, personLabel(k)) : null;
    const msg = {
      verified: [h("span", { class: "up up-ok" }, icon("check"), "Uploader confirmed"), ` Uploaded by ${personLabel(u.code)} from their registered GitHub account.`],
      behalf: [h("strong", null, "Uploaded by "), who(key), h("strong", null, " on behalf of "), who(u.code), "."],
      recorded: [h("strong", null, "Uploaded by "), who(u.code), "."],
      claimed: [h("span", { class: "up" }, "Not checked"), " Upload history isn't available here, so the student number can't be checked against the uploader."],
      registered: [h("span", { class: "up" }, "Registered"), ` ${u.code} is registered as ${u.reg && u.reg.name}. Adding a GitHub username to the registration confirms their uploads.`],
      student: [h("span", { class: "up" }, "Student number"), ` ${u.code} isn't registered, so no name is shown. Registering is optional.`],
      account: [h("strong", null, "Uploaded by "), who(key), "."],
      unknown: [h("span", { class: "up" }, "Unknown"), " Upload history isn't available on this copy of the site."]
    }[u.status];
    const rows = [];
    if (u.code) rows.push(["Student no.", h("a", { href: personHref(u.code) }, u.reg ? `${u.code} · ${u.reg.name}` : u.code)]);
    if (key && key !== u.code) rows.push(["Uploaded by", [who(key), N.uploader.test(key) ? h("span", { class: "muted" }, " · " + key) : null]]);
    if (u.recorded) rows.push(["Source", h("a", { href: `${REPO}/blob/${C.branch}/uploads.json`, target: "_blank", rel: "noopener" }, "uploads.json")]);
    return h("div", { class: "side-block" },
      h("p", { class: "side-title" }, "Uploader"),
      h("p", { class: "side-note" }, msg),
      rows.length ? h("dl", { class: "info" }, rows.map(([k, v]) => [h("dt", null, k), h("dd", null, v)])) : null);
  }

  // ---------- maintainer verification ----------
  // The owner and collaborators verify files by opening a "[Verify]" issue; the "Verify files"
  // workflow checks their permission and records path + SHA-256 in verifications.json.
  // A record still applies after a rename (same content), and is flagged if the content changes.

  function verificationOf(f) {
    const rec = state.verifications.find((r) => r.path === f.path)
      || (f.sha256 ? state.verifications.find((r) => r.sha256 === f.sha256 && !state.files.some((g) => g.path === r.path)) : null);
    if (!rec) return { state: "none" };
    if (f.sha256 && rec.sha256 && rec.sha256 !== f.sha256) return { state: "changed", rec };
    return { state: "verified", rec };
  }
  // An item (a PDF plus its source, say) is verified when all of its files are.
  function itemVerification(main) {
    const all = [main, ...main.alts].map(verificationOf);
    if (all.some((v) => v.state === "changed")) return { state: "changed", rec: all.find((v) => v.state === "changed").rec };
    if (all.every((v) => v.state === "verified")) return { state: "verified", rec: all[0].rec, recs: all.map((v) => v.rec) };
    if (all.some((v) => v.state === "verified")) return { state: "partial", rec: all.find((v) => v.rec).rec };
    return { state: "none" };
  }
  function verifyIssueUrl(main, undo) {
    const paths = [main, ...main.alts].map((g) => g.path);
    const title = `${undo ? "[Unverify]" : "[Verify]"} ${main.idInfo ? main.idInfo.idPart : main.title}`;
    const body = (undo
      ? "Maintainers: submit this issue to remove the verification of the files below."
      : "Maintainers: submit this issue to verify the files below.")
      + " Verify only after checking that the course code, uploader (student number) and file name are correct; verification says nothing about the content."
      + " A workflow checks that you're the owner or a collaborator, records it and closes the issue.\n\n"
      + paths.join("\n") + "\n\n" + (undo ? "" : "Note (optional): \n");
    return `${REPO}/issues/new?title=${enc(title)}&body=${enc(body)}`;
  }
  const VER_SCOPE = "Verification only confirms the course code, uploader and file name. It does not check or guarantee the content, and it is not a promise.";
  function verBadge(f) {
    const v = itemVerification(f);
    if (v.state === "verified") return h("span", { class: "badge ver", title: `Course code, uploader and name checked by @${v.rec.by} on ${fmtDate(v.rec.date)}. The content is not checked or guaranteed.` }, icon("shield"), "Verified");
    if (v.state === "changed") return h("span", { class: "badge ver-warn", title: "Changed since it was verified" }, "Changed");
    return null;
  }

  function verificationPanel(main) {
    const v = itemVerification(main);
    const by = v.rec ? h("a", { href: "https://github.com/" + enc(v.rec.by), target: "_blank", rel: "noopener" }, "@" + v.rec.by) : null;
    const issue = v.rec && v.rec.issue ? h("a", { href: `${REPO}/issues/${v.rec.issue}`, target: "_blank", rel: "noopener" }, "#" + v.rec.issue) : null;
    const text = {
      verified: [h("span", { class: "up up-ok" }, icon("shield"), "Verified"), " by ", by, ` on ${fmtDate(v.rec && v.rec.date)}`, issue ? [" (", issue, ")"] : null, "."],
      changed: [h("span", { class: "up up-warn" }, "Changed since verification"), " Verified by ", by, ` on ${fmtDate(v.rec && v.rec.date)}, but the file has changed since. A maintainer should check it again.`],
      partial: [h("span", { class: "up up-warn" }, "Partly verified"), " Some files in this item are verified, others aren't."],
      none: [h("span", { class: "up" }, "Not verified yet"), " A maintainer hasn't checked this item yet."]
    }[v.state];
    return h("div", { class: "side-block" },
      h("p", { class: "side-title" }, "Verification"),
      h("p", { class: "side-note" }, text),
      h("p", { class: "side-note muted small" }, VER_SCOPE),
      v.rec && v.rec.note && v.state !== "none" ? h("p", { class: "side-note muted small" }, "Note: " + v.rec.note) : null,
      h("div", { class: "row tight" },
        v.state !== "verified" ? h("a", { class: "btn small", href: verifyIssueUrl(main, false), target: "_blank", rel: "noopener" }, icon("shield"), v.state === "none" ? "Verify this item" : "Verify again") : null,
        v.state !== "none" ? h("a", { class: "btn small ghost", href: verifyIssueUrl(main, true), target: "_blank", rel: "noopener" }, "Unverify") : null),
      h("p", { class: "side-note muted small" }, "Owner and collaborators only. The button opens a pre-filled GitHub issue; submitting it records the verification automatically."));
  }

  function itemFilesPanel(main, current) {
    return h("div", { class: "side-block" },
      h("p", { class: "side-title" }, "Files in this item"),
      h("ul", { class: "item-files" }, [main, ...main.alts].map((g) => h("li", { class: g === current ? "current" : null },
        h("span", { class: "badge t-" + slug(g.type) }, g.ext.toUpperCase() || g.type),
        h("span", { class: "item-file-name" }, g === main ? "Main file" : altLabel(g, main), g.size != null ? h("span", { class: "muted small" }, " · " + fmtSize(g.size)) : null),
        h("a", { class: "icon-btn tiny", href: g.href, download: g.name, title: `Download ${g.name}` }, icon("download"))))));
  }

  function idPanel(f) {
    const i = f.idInfo;
    if (!i) return h("div", { class: "side-block" }, h("p", { class: "side-title" }, "ID"),
      h("p", { class: "side-note muted" }, "This file has no ID. That's fine: IDs are recommended, not required. ", h("a", { href: "#/ids" }, "How IDs work")));
    return h("div", { class: "side-block" },
      h("p", { class: "side-title" }, "ID ", h("button", { class: "icon-btn tiny", type: "button", title: "Copy ID", onclick: (e) => copyText(i.idPart, e.currentTarget) }, icon("copy"))),
      h("p", null, idNode(i, true)),
      h("dl", { class: "info" }, i.fields.map((x) => [h("dt", null, x.label), h("dd", null, h("code", { class: x.cls }, x.part), " ", x.value, x.note ? h("span", { class: "muted small" }, " · " + x.note) : null)])),
      i.problems.length || i.hints.length ? h("ul", { class: "id-notes" },
        i.problems.map((p) => h("li", { class: "bad" }, p)), i.hints.map((p) => h("li", null, p))) : null);
  }

  function openPreview(f) {
    const body = h("div", { class: "preview-body" });
    const fullUrl = SITE_BASE + f.href;
    const blobUrl = `${REPO}/blob/${C.branch}/${f.href}`;

    const noPreview = (msg) => emptyState("No preview available", msg || "Download the file to open it on your computer.",
      h("a", { class: "btn primary", href: f.href, download: f.name }, icon("download"), "Download"));

    switch (f.preview) {
      case "pdf": body.append(h("iframe", { src: f.href, title: f.title })); break;
      case "image": body.append(h("img", { src: f.href, alt: f.title })); break;
      case "video": body.append(h("video", { src: f.href, controls: true })); break;
      case "office":
        if (/^https:/.test(location.protocol) && !/localhost|127\.0\.0\.1/.test(location.hostname)) {
          body.append(h("iframe", { src: "https://view.officeapps.live.com/op/embed.aspx?src=" + enc(fullUrl), title: f.title }));
        } else body.append(noPreview("Office previews work on the published site only."));
        break;
      case "notebook":
        body.append(emptyState("Jupyter notebook", "Open it in a notebook viewer, or download it to run it yourself.",
          h("div", { class: "row" },
            h("a", { class: "btn primary", href: `https://nbviewer.org/github/${C.owner}/${C.repo}/blob/${C.branch}/${f.href}`, target: "_blank", rel: "noopener" }, icon("external"), "Open in nbviewer"),
            h("a", { class: "btn", href: `https://colab.research.google.com/github/${C.owner}/${C.repo}/blob/${C.branch}/${f.href}`, target: "_blank", rel: "noopener" }, icon("external"), "Open in Colab"))));
        break;
      case "text": {
        const pre = h("pre", { class: "text-preview" }, "Loading…");
        body.append(pre);
        fetch(f.href).then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); })
          .then((t) => { pre.textContent = t.length > 200000 ? t.slice(0, 200000) + "\n\n… (truncated, download to see the rest)" : t; })
          .catch(() => { pre.textContent = "Could not load this file."; });
        break;
      }
      default: body.append(noPreview());
    }

    const info = [
      ["Subject", pretty(f.subject)], ["Folder", f.topic], ["File", f.name], ["Size", fmtSize(f.size)],
      ["Uploaded", f.added ? `${fmtDate(f.added)} (${timeAgo(f.added)})` : ""],
      ["Last updated", f.updated && f.updated !== f.added ? fmtDate(f.updated) : ""],
      ["Edited by", f.contributors.length > 1 ? f.contributors.join(", ") : ""]
    ].filter(([, v]) => v);
    const related = relatedFiles(f), dups = duplicatesOf(f);
    const fileList = (title, list, note) => list.length ? h("div", { class: "side-block" },
      h("p", { class: "side-title" }, title), note ? h("p", { class: "side-note muted" }, note) : null,
      h("ul", { class: "mini-list" }, list.map((g) => h("li", null, h("button", { class: "linkish", type: "button", onclick: () => { close(); openPreview(g); } },
        g.idInfo ? h("code", null, g.idInfo.idPart) : g.title, g.idInfo && g.idInfo.type ? h("span", { class: "muted small" }, " " + g.idInfo.type.name) : null))))) : null;

    const lastFocus = document.activeElement;
    const close = () => {
      dlg.remove();
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
      if (parseRoute().name === "file") history.replaceState(null, "", "#/subject/" + enc(f.subject));
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    const closeBtn = h("button", { class: "icon-btn", type: "button", "aria-label": "Close preview", onclick: close }, icon("close"));
    const dlg = h("div", { class: "modal-backdrop", onclick: (e) => { if (e.target === dlg) close(); } },
      h("div", { class: "modal", role: "dialog", "aria-modal": "true", "aria-label": f.title },
        h("div", { class: "modal-head" },
          h("div", { class: "modal-title" }, h("span", { class: "badge t-" + slug(f.type) }, f.type), h("h2", null, f.title)),
          closeBtn),
        h("div", { class: "modal-main" },
          body,
          h("aside", { class: "modal-side" },
            h("div", { class: "stack" },
              h("a", { class: "btn primary", href: f.href, download: f.name }, icon("download"), "Download"),
              h("div", { class: "row tight" },
                h("a", { class: "btn small", href: f.href, target: "_blank", rel: "noopener" }, icon("external"), "New tab"),
                h("button", { class: "btn small", type: "button", onclick: (e) => copyText(SITE_BASE + "#/file/" + f.href, e.currentTarget) }, icon("link"), "Link"),
                h("a", { class: "btn small", href: blobUrl, target: "_blank", rel: "noopener" }, icon("github"), "GitHub"),
                h("a", { class: "btn small", href: `${REPO}/commits/${C.branch}/${f.href}`, target: "_blank", rel: "noopener" }, icon("clock"), "History"))),
            f.alts.length || f.altOf ? itemFilesPanel(f.altOf || f, f) : null,
            verificationPanel(f.altOf || f),
            idPanel(f),
            uploaderPanel(f),
            licensePanel(f),
            h("div", { class: "side-block" }, h("p", { class: "side-title" }, "Problem with this file?"),
              h("p", { class: "side-note muted small" }, "Copyright, personal information, course rules or wrong details: report it and a maintainer reviews it."),
              h("a", { class: "btn small", href: reportUrl(f), target: "_blank", rel: "noopener" }, icon("alert"), "Report this file")),
            fileList("Same item", related, "Question, solution and answer files that share this course, term and item number."),
            fileList("Identical copies", dups, "These files have exactly the same content."),
            h("div", { class: "side-block" }, h("p", { class: "side-title" }, "File"),
              h("dl", { class: "info" }, info.map(([k, v]) => [h("dt", null, k), h("dd", null, v)])))))));
    document.body.append(dlg);
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onKey);
    closeBtn.focus();
  }

  // ---------- views ----------

  const VIEWS = {};

  VIEWS.home = () => {
    const counts = subjectCounts();
    const people = peopleStats().filter((p) => p.uploads || p.authored);
    const withId = state.items.filter((f) => f.idInfo && f.idInfo.status === "full").length;
    const recent = state.hasDates ? [...state.items].sort(SORTS.newest[1]).slice(0, 6) : [];
    const heroSearch = h("input", { type: "search", placeholder: "Search notes, courses or IDs, e.g. 01140086_HWS", "aria-label": "Search files",
      onkeydown: (e) => { if (e.key === "Enter") { state.q = e.target.value.trim().toLowerCase(); document.getElementById("search").value = e.target.value; location.hash = "#/browse"; } } });

    const stat = (n, label, href) => h(href ? "a" : "div", { class: "stat", href }, h("span", { class: "stat-n" }, String(n)), h("span", { class: "stat-l" }, label));
    const tool = (href, ic, name, text) => h("a", { class: "tile", href }, icon(ic), h("span", { class: "tile-name" }, name), h("span", { class: "tile-text" }, text));

    return h("div", null,
      h("section", { class: "hero" },
        h("p", { class: "eyebrow" }, "Shared by students, for students"),
        h("h1", null, C.title),
        h("p", { class: "lead" }, C.description),
        h("label", { class: "hero-search" }, icon("search"), heroSearch),
        h("div", { class: "row" },
          h("a", { class: "btn primary", href: "#/contribute" }, icon("upload"), "Upload a file"),
          h("a", { class: "btn", href: "#/ids" }, icon("id"), "ID system"),
          h("a", { class: "btn", href: "#/requests" }, icon("inbox"), "Request a file"))),

      h("section", { class: "stats" },
        stat(state.items.length, state.items.length === 1 ? "item" : "items", "#/browse"),
        stat(withId, "with an ID", "#/ids"),
        stat(people.length || "—", "uploaders", "#/uploaders"),
        stat(Object.keys(countBy("course")).length || Object.keys(counts).length, Object.keys(countBy("course")).length ? "courses" : "subjects")),

      copyrightNotice(),

      recent.length ? h("section", { class: "section" },
        h("div", { class: "section-head" }, h("h2", null, "Recently added"), h("a", { href: "#/recent" }, "See all →")),
        h("div", { class: "files grid" }, recent.map(card))) : null,

      h("section", { class: "section" },
        h("div", { class: "section-head" }, h("h2", null, "Browse by subject")),
        h("div", { class: "subjects" }, Object.keys(counts).sort().map((s) =>
          h("a", { class: "subject-tile", href: "#/subject/" + enc(s) },
            h("span", { class: "subject-name" }, pretty(s)),
            h("span", { class: "subject-count" }, counts[s] === 1 ? "1 file" : `${counts[s]} files`))))),

      h("section", { class: "section" },
        h("div", { class: "section-head" }, h("h2", null, "Physics tools")),
        h("div", { class: "tiles" },
          tool("#/ids", "id", "ID system", "Decode, search and build file IDs"),
          tool("#/constants", "atom", "Physical constants", "CODATA 2022 values, one click to copy"),
          tool("#/converter", "swap", "Unit converter", "Energy, length, mass, temperature and more"),
          tool("#/resources", "book", "Resources", "HyperPhysics, PhET, MIT OCW, arXiv…"))),

      state.source === "none" ? loadErrorNotice() : null
    );
  };

  VIEWS.browse = () => fileListView({
    title: "All files", desc: "Everything shared so far. Use the search box at the top to filter.",
    filter: () => true, empty: uploadEmpty()
  });

  VIEWS.subject = (r) => fileListView({
    title: pretty(r.arg), filter: (f) => f.subject === r.arg, empty: uploadEmpty(r.arg),
    extra: h("a", { class: "btn primary", href: "#/contribute" }, icon("upload"), "Upload a file")
  });

  VIEWS.course = (r) => fileListView({
    title: courseName(r.arg) || "Course " + r.arg, desc: `Everything with course code ${r.arg} in its ID.`,
    filter: (f) => f.course === r.arg, sort: "id", empty: emptyState("No files for this course", null)
  });

  VIEWS.material = (r) => fileListView({
    title: r.arg, desc: N.raw ? "Type codes: " + N.raw.types.filter((t) => t.category === r.arg).map((t) => `${t.code} (${t.name.toLowerCase()})`).join(", ") : null,
    filter: (f) => f.category === r.arg, sort: "id", empty: emptyState("Nothing here yet", null)
  });

  // ---------- overview pages (Subjects, Courses, Material) ----------

  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;
  function chips(items, key, labelFn) {
    const c = {};
    for (const f of items) if (f[key]) c[f[key]] = (c[f[key]] || 0) + 1;
    const keys = Object.keys(c).sort((a, b) => c[b] - c[a] || a.localeCompare(b));
    return keys.length ? h("div", { class: "chip-row" }, keys.map((k) => h("span", { class: "chip" }, (labelFn ? labelFn(k) : k), h("span", { class: "chip-n" }, String(c[k]))))) : null;
  }
  function latestLine(items) {
    const latest = items.filter((f) => f.added).sort(SORTS.newest[1])[0];
    return latest ? h("p", { class: "overview-latest" }, "Latest: ", h("strong", null, latest.title), ` · ${timeAgo(latest.added)}`) : null;
  }
  function overviewPage(title, desc, cards, empty) {
    return h("div", null,
      h("div", { class: "page-head" }, h("div", null, h("h1", null, title), h("p", { class: "muted" }, desc))),
      state.source === "none" ? loadErrorNotice() : cards.length ? h("div", { class: "overview" }, cards) : empty);
  }

  VIEWS.subjects = () => {
    const names = Object.keys(subjectCounts()).sort();
    return overviewPage("Subjects", "Every subject on the site. Open one to see all of its files.",
      names.map((s) => {
        const items = state.items.filter((f) => f.subject === s);
        return h("a", { class: "overview-card", href: "#/subject/" + enc(s) },
          h("div", { class: "overview-top" }, icon("folder"), h("span", { class: "overview-count" }, plural(items.length, "item"))),
          h("h2", null, pretty(s)),
          chips(items, "course", (c) => courseLabel(c)),
          chips(items, "category"),
          latestLine(items));
      }),
      emptyState("No subjects yet", "Create a folder under files/ to start a subject."));
  };

  VIEWS.courses = () => {
    const codes = [...new Set([...Object.keys(countBy("course")), ...Object.keys(state.courses)])].sort();
    return overviewPage("Courses", "Every course that files carry in their ID. Open one to see all of its material, sorted by type and term.",
      codes.map((c) => {
        const items = state.items.filter((f) => f.course === c);
        const terms = [...new Map(items.filter((f) => f.idInfo.term).map((f) => [f.idInfo.term.code, f.idInfo.term])).values()].sort((a, b) => (b.order || 0) - (a.order || 0));
        return h("a", { class: "overview-card", href: "#/course/" + c },
          h("div", { class: "overview-top" }, icon("course"), h("span", { class: "overview-count" }, plural(items.length, "item"))),
          h("h2", null, courseName(c) || "Course " + c),
          h("p", { class: "overview-code" }, h("code", { class: "f-course" }, c)),
          terms.length ? h("p", { class: "muted small" }, "Terms: " + terms.map((t) => t.label).join(", ")) : null,
          chips(items, "category"),
          latestLine(items));
      }),
      emptyState("No courses yet", "Courses appear when files carry a course code in their ID.", h("a", { class: "btn", href: "#/ids?tab=build" }, "Build a file name")));
  };

  VIEWS.materials = () => {
    const cats = countBy("category");
    return overviewPage("Material", "Files grouped by what they are, from their ID's type code.",
      CATEGORY_ORDER.filter((c) => cats[c]).map((c) => {
        const items = state.items.filter((f) => f.category === c);
        return h("a", { class: "overview-card", href: "#/material/" + enc(c) },
          h("div", { class: "overview-top" }, icon("tag"), h("span", { class: "overview-count" }, plural(items.length, "item"))),
          h("h2", null, c),
          h("p", { class: "muted small" }, N.raw.types.filter((t) => t.category === c).map((t) => `${t.code} ${t.name.toLowerCase()}`).join(" · ")),
          chips(items, "course", (k) => courseLabel(k)),
          latestLine(items));
      }),
      emptyState("No material types yet", "Material types appear when files carry a type code in their ID."));
  };

  VIEWS.file = (r) => {
    const f = state.files.find((x) => x.path === r.arg);
    return f ? VIEWS.subject({ arg: f.subject }) : VIEWS.browse();
  };

  VIEWS.recent = () => state.hasDates
    ? fileListView({ title: "Recently added", desc: "The newest uploads first.", filter: () => true, sort: "newest", empty: uploadEmpty() })
    : h("div", null, h("div", { class: "page-head" }, h("h1", null, "Recently added")),
      emptyState("Upload dates aren't available", "Dates appear when the site is deployed by the GitHub Actions workflow (see the README)."));

  VIEWS.favorites = () => fileListView({
    title: "Favorites", desc: "Files you starred. Saved in this browser only.",
    filter: (f) => state.favs.has(f.path),
    empty: emptyState("No favorites yet", "Click the ☆ on any file to save it here.", h("a", { class: "btn", href: "#/browse" }, "Browse files"))
  });

  VIEWS.uploaders = () => {
    const people = peopleStats();
    const head = h("div", { class: "page-head" }, h("div", null, h("h1", null, "Uploaders"),
      h("p", { class: "muted" }, "Everyone who shares files here. Students put their 9-digit student number at the end of file IDs so their work is credited. Registering a name is optional.")),
      h("a", { class: "btn", href: "#/ids?tab=codes" }, icon("id"), "Register your name"));
    if (!people.length) return h("div", null, head, emptyState("No uploaders yet", "Upload a file to appear here."));
    return h("div", null, head,
      h("div", { class: "table-wrap" }, h("table", { class: "table" },
        h("thead", null, h("tr", null, h("th", null, "Student no."), h("th", null, "Name"), h("th", { class: "opt-md" }, "GitHub"), h("th", { class: "num opt-sm" }, "Uploaded"), h("th", { class: "num" }, "Credited"), h("th", { class: "opt-sm" }, "Last upload"))),
        h("tbody", null, people.map((p) => h("tr", null,
          h("td", null, p.isNumber ? h("code", { class: "f-up" }, p.key) : h("span", { class: "muted" }, "—")),
          h("td", { class: "nowrap" }, h("a", { href: personHref(p.key) }, p.name)),
          h("td", { class: "nowrap opt-md" }, p.login ? h("a", { href: "https://github.com/" + enc(p.login), target: "_blank", rel: "noopener" }, "@" + p.login) : ""),
          h("td", { class: "num opt-sm" }, String(p.uploads)),
          h("td", { class: "num", title: "Files whose ID carries this student number" }, p.isNumber ? String(p.authored) : ""),
          h("td", { class: "nowrap opt-sm" }, p.last ? timeAgo(p.last) : "")))))));
  };

  VIEWS.u = (r) => {
    const key = r.arg;
    const reg = state.uploaders.get(key);
    const login = reg ? reg.github : key.startsWith("@") ? key.slice(1) : null;
    return fileListView({
      title: personLabel(key) || key,
      desc: reg ? `Student number ${key}` + (reg.github ? ` · GitHub @${reg.github}` : "") + ` · files carrying ${key} in their ID${reg.github ? " or uploaded from that account" : ""}.`
        : N.uploader.test(key) ? `Student number ${key} · not registered.` : "Files uploaded from this GitHub account.",
      filter: (f) => f.people.includes(key) || (login && f.up.login && f.up.login.toLowerCase() === login.toLowerCase()),
      sort: "id",
      empty: emptyState("No files yet", null),
      extra: h("div", { class: "row" },
        N.uploader.test(key) ? h("code", { class: "id-code big f-up" }, key) : null,
        login ? h("a", { class: "btn", href: "https://github.com/" + enc(login), target: "_blank", rel: "noopener" }, icon("github"), "@" + login) : null)
    });
  };

  // ---------- the ID system page ----------

  VIEWS.ids = (r) => {
    if (!N.raw) return emptyState("ID rules couldn't be loaded", "assets/naming.json is missing.");
    const tabs = [["lookup", "Look up"], ["build", "Build a name"], ["codes", "Uploader IDs"], ["rules", "Reference"], ["check", "Check files"]];
    let tab = tabs.some(([k]) => k === r.params.get("tab")) ? r.params.get("tab") : "lookup";
    const tabBar = h("div", { class: "tabs", role: "tablist" });
    const panel = h("div", { class: "id-panel" });
    const draw = () => {
      fill(tabBar, ...tabs.map(([k, label]) => h("button", { type: "button", role: "tab", class: "tab" + (k === tab ? " on" : ""), "aria-selected": String(k === tab),
        onclick: () => { tab = k; history.replaceState(null, "", "#/ids?tab=" + k); draw(); } }, label)));
      fill(panel, ID_TABS[tab](r));
    };
    draw();
    return h("div", null,
      h("div", { class: "page-head" }, h("div", null, h("h1", null, "ID system"),
        h("p", { class: "muted" }, "A file's ID is the start of its name. It says which course it's from, what it is, which term, which item and who shared it. IDs are ",
          h("strong", null, "recommended, not required"), ": files without one are welcome too."))),
      h("div", { class: "id-hero" },
        h("p", { class: "id-anatomy" },
          ...[["01140086", "f-course", "course"], ["HWS", "f-type", "type"], ["2627W", "f-term", "term"], ["01", "f-item", "item"], ["AN", "f-tag", "tag"], ["123456789", "f-up", "student no."]]
            .flatMap(([t, cls, label], i) => [i ? h("span", { class: "id-sep" }, "_") : null, h("span", { class: "anat " + cls }, h("span", { class: "anat-t" }, t), h("span", { class: "anat-l" }, label))]),
          h("span", { class: "anat title" }, h("span", { class: "anat-t" }, "Waves Homework 1 Solution.pdf"), h("span", { class: "anat-l" }, "title")))),
      tabBar, panel);
  };

  const ID_TABS = {};

  ID_TABS.lookup = (r) => {
    const out = h("div");
    const input = h("input", { type: "search", class: "input big mono", value: r.params.get("q") || "", autocomplete: "off", spellcheck: "false",
      placeholder: "Paste an ID or file name, or type part of one: 01140086_HWS, 104131, 2627W, 123456789", "aria-label": "Look up an ID", oninput: () => update() });

    function update() {
      let q = input.value.trim();
      if (!q) {
        const withId = state.items.filter((f) => f.idInfo);
        fill(out, h("p", { class: "muted" }, `${withId.length} of ${state.items.length} items have an ID. Start typing to search them, or paste a full name to decode it.`));
        return;
      }
      const shorthand = /^\d{6}(?=_|$)/.test(q);
      q = q.replace(/^(\d{6})(?=_|$)/, (m) => padCourse(m)).replace(/\.[a-z0-9]+$/i, "");
      const info = parseId(q);
      const qU = q.toUpperCase().split(" ")[0];
      const toks = qU.split(/[_\s]+/).filter(Boolean);
      const hits = state.items.filter((f) => {
        if (!f.idInfo) return false;
        const id = f.idInfo.idPart.toUpperCase();
        if (id.startsWith(qU)) return true;
        const parts = id.split("_");
        return toks.every((t) => parts.includes(t) || (t.length > 3 && id.includes(t)));
      }).sort(SORTS.id[1]);
      fill(out, 
        shorthand ? h("p", { class: "notice notice-info" }, `6-digit course shorthand expanded to ${padCourse(input.value.trim().slice(0, 6))}.`) : null,
        info ? h("div", { class: "decode" },
          h("p", null, idNode(info, true)),
          h("div", { class: "table-wrap" }, h("table", { class: "table" }, h("tbody", null, info.fields.map((x) => h("tr", null,
            h("td", null, h("code", { class: x.cls }, x.part)), h("td", null, h("strong", null, x.label)), h("td", null, x.value), h("td", { class: "muted" }, x.note)))))),
          info.problems.length || info.hints.length ? h("ul", { class: "id-notes" },
            info.problems.map((p) => h("li", { class: "bad" }, p)), info.hints.map((p) => h("li", null, p))) : h("p", { class: "ok-line" }, icon("check"), "This is a complete, valid ID.")) : null,
        h("h2", { class: "small-head" }, hits.length ? `${hits.length} matching file${hits.length === 1 ? "" : "s"}` : "No files with a matching ID"),
        hits.length ? h("div", { class: "files grid" }, hits.slice(0, 60).map(card)) : null);
    }
    update();
    setTimeout(() => input.focus(), 0);
    return h("div", null, input, out);
  };

  // The name builder. On the contribute page it gets the student-number box from step 1
  // (opts.uploader) and reports every change to opts.onChange.
  ID_TABS.build = (r, opts = {}) => {
    const types = N.raw.types;
    const now = new Date(), y = now.getFullYear() % 100 - (now.getMonth() < 8 ? 1 : 0);
    const years = []; for (let a = y + 1; a >= 15; a--) years.push(String(a).padStart(2, "0") + String((a + 1) % 100).padStart(2, "0"));
    const lab = (text, el, hint) => h("label", { class: "field" }, h("span", { class: "field-l" }, text), el, hint ? h("span", { class: "field-h" }, hint) : null);
    const saved = store.get("builder", {});

    const course = h("input", { class: "input mono", value: saved.course || "", placeholder: "01140086", maxlength: "8", inputmode: "numeric" });
    const type = h("select", { class: "input" }, CATEGORY_ORDER.map((c) => h("optgroup", { label: c },
      types.filter((t) => t.category === c).map((t) => h("option", { value: t.code, selected: t.code === (saved.type || "HWS") }, `${t.code} · ${t.name} (${t.by})`)))));
    const year = h("select", { class: "input" }, years.map((v) => h("option", { value: v, selected: v === (saved.year || years[1]) }, `${v} (20${v.slice(0, 2)}–${v.slice(2)})`)),
      N.raw.termPlaceholders.map((p) => h("option", { value: p.code, selected: p.code === saved.year }, p.code)));
    const season = h("select", { class: "input" }, N.raw.seasons.map((s) => h("option", { value: s.letter, selected: s.letter === (saved.season || "W") }, `${s.letter} · ${s.name}`)));
    const item = h("input", { class: "input mono", value: saved.item || "01", placeholder: "01" });
    const version = h("input", { class: "input mono", value: saved.version || "", placeholder: "e.g. V2 or V4.1 (optional)" });
    const tagBoxes = N.raw.tags.map((t) => h("label", { class: "check" }, h("input", { type: "checkbox", value: t.code, checked: (saved.tags || []).includes(t.code) }), ` ${t.code} · ${t.name}`));
    const licSel = h("select", { class: "input" }, h("option", { value: "" }, "— none (not stated) —"),
      N.raw.licenses.map((l) => h("option", { value: l.code, selected: l.code === saved.license }, `${l.code} · ${l.short}`)));
    const uploader = opts.uploader || h("input", { class: "input mono", value: saved.uploader || "", placeholder: "123456789", maxlength: "9", inputmode: "numeric" });
    const title = h("input", { class: "input", value: saved.title || "", placeholder: "Waves Homework 1 Solution" });
    const ext = h("input", { class: "input mono", value: saved.ext || "pdf", placeholder: "pdf" });
    // The course name appears as soon as a known course code is typed; a new course asks for its name.
    const courseHint = h("span", { class: "field-h" });
    const courseNameIn = h("input", { class: "input", value: saved.courseName || "", placeholder: "Linear Algebra 1" });
    const courseNameField = lab("Course name (new course)", courseNameIn, "Shown next to the code on the website");
    // Contribute page only: the subject, picked from the course when files of that course already exist.
    const subjects = Object.keys(subjectCounts()).sort();
    const NEW = "__new__";
    const subjectSel = h("select", { class: "input" }, h("option", { value: "" }, "— choose —"), subjects.map((x) => h("option", { value: x, selected: x === saved.subject }, pretty(x))),
      h("option", { value: NEW, selected: saved.subject === NEW }, "New subject…"));
    const newSubject = h("input", { class: "input", value: saved.newSubject || "", placeholder: "Linear Algebra" });
    const newSubjectField = lab("New subject", newSubject, "Becomes a new subject on the website");
    const courseSubject = (code) => { const f = state.items.find((x) => x.idInfo && x.idInfo.course === code); return f ? f.subject : null; };
    let lastCourse = null;
    const result = h("div", { class: "build-out" });
    const licOut = h("div", { class: "stack" });

    function update() {
      const c = padCourse(course.value.trim());
      const known = c ? courseName(c) : "";
      fill(courseHint, known ? [h("strong", null, known), ` (${c})`] : c ? "New course: not on the website yet" : "8 digits, or 6-digit shorthand");
      courseNameField.hidden = !opts.onChange || !c || !!known;
      if (opts.onChange && c && c !== lastCourse && courseSubject(c)) subjectSel.value = courseSubject(c);
      lastCourse = c;
      newSubjectField.hidden = subjectSel.value !== NEW;
      const subject = subjectSel.value === NEW ? newSubject.value.trim() : subjectSel.value ? pretty(subjectSel.value) : "";
      const isXT = type.value === "XT";
      year.disabled = season.disabled = isXT;
      season.disabled = isXT || N.placeholders[year.value] != null;
      const term = isXT ? null : N.placeholders[year.value] ? year.value : year.value + season.value;
      const tags = tagBoxes.map((l) => l.firstChild).filter((b) => b.checked).map((b) => b.value);
      const fields = [c || "00000000", type.value, term, item.value.trim(), version.value.trim().toUpperCase(), ...tags, uploader.value.trim()].filter(Boolean);
      const idPart = fields.join("_");
      const name = idPart + (title.value.trim() ? " " + title.value.trim() : "") + (!opts.onChange && ext.value.trim() ? "." + ext.value.trim().replace(/^\./, "") : "");
      store.set("builder", { course: course.value, type: type.value, year: year.value, season: season.value, item: item.value, version: version.value, tags, license: licSel.value, uploader: uploader.value, title: title.value, ext: ext.value,
        courseName: courseNameIn.value, subject: subjectSel.value, newSubject: newSubject.value });
      const info = parseId(idPart + (title.value.trim() ? " " + title.value.trim() : ""));
      const cat = N.types[type.value].category;
      const lic = N.licenses[licSel.value];
      const rule = lic ? `{ "id": "${idPart}", "license": "${lic.code}" }` : null;
      if (opts.onChange) opts.onChange({ name, idPart, info, course: c, courseName: known ? "" : courseNameIn.value.trim(), subject, type: type.value, term, title: title.value.trim(), license: lic ? lic.code : "",
        item: [item.value.trim(), version.value.trim().toUpperCase(), ...tags].filter(Boolean).join("_"), uploader: uploader.value.trim() });
      fill(licOut, opts.onChange ? h("p", { class: "muted small" }, lic ? lic.note + " The upload form records the licence for you." : "Choose a licence. Not sure? Pick ARR (all rights reserved).") :
        lic ? [h("p", { class: "muted small" }, lic.note),
          h("p", { class: "field-l" }, "Add this rule to licenses.json"),
          h("div", { class: "build-name" }, h("code", null, rule), h("button", { class: "btn small", type: "button", onclick: (e) => copyText(rule, e.currentTarget) }, icon("copy"), "Copy")),
          h("p", { class: "muted small" }, h("a", { href: `${REPO}/edit/${C.branch}/licenses.json`, target: "_blank", rel: "noopener" }, "Edit licenses.json"),
            " and put the line inside ", h("code", null, "\"rules\": [ … ]"), " (comma between entries), or just name the licence in your pull request and a maintainer adds it.")]
          : h("p", { class: "muted small" }, "No licence chosen: others may only read the file here. The licence is never part of the file name."));
      fill(result, 
        h("p", { class: "field-l" }, opts.onChange ? "Your file's ID and name (the upload form applies it)" : "Your file name"),
        h("div", { class: "build-name" }, h("code", null, name), h("button", { class: "btn primary small", type: "button", onclick: (e) => copyText(name, e.currentTarget) }, icon("copy"), "Copy")),
        info ? idNode(info, true) : null,
        info && (info.problems.length || info.hints.length || !c) ? h("ul", { class: "id-notes" },
          !c ? h("li", { class: "bad" }, "Enter the 8-digit course code (6-digit shorthand works too).") : null,
          info.problems.filter((p) => c || !/Course/.test(p)).map((p) => h("li", { class: "bad" }, p)), info.hints.map((p) => h("li", null, p))) : null,
        opts.onChange ? null : h("p", { class: "muted small" }, "Suggested folder: ", h("code", null, `files/<subject>/${cat === "Syllabus" ? "" : cat + "/"}`), " (for collaborators adding files directly). The ", h("a", { href: "#/contribute" }, "upload form"), " names and files uploads for you."));
    }
    [course, type, year, season, item, version, licSel, uploader, title, ext, courseNameIn, subjectSel, newSubject, ...tagBoxes.map((l) => l.firstChild)].forEach((el) => el.addEventListener("input", update));
    update();
    return h("div", { class: "builder" },
      h("div", { class: "build-grid" },
        h("label", { class: "field" }, h("span", { class: "field-l" }, "Course code"), course, courseHint),
        opts.onChange ? courseNameField : null,
        opts.onChange ? lab("Subject", subjectSel, "Picked from the course when it already has files") : null,
        opts.onChange ? newSubjectField : null,
        lab("Type", type),
        lab("Academic year", year),
        lab("Term", season),
        lab("Item", item, "01, 01b, A, Q01, CA01, PS01, P02, C01, FULL or empty"),
        lab("Version", version),
        opts.uploader ? null : lab("Student number", uploader, h("span", null, "9 digits, will be public. ", h("a", { href: "#/ids?tab=codes" }, "More"))),
        lab("Title", title, "Short English title"),
        opts.onChange ? null : lab("Extension", ext)),
      h("div", { class: "field" }, h("span", { class: "field-l" }, "Tags"), h("div", { class: "row" }, tagBoxes)),
      result,
      h("div", { class: "id-format" },
        h("h3", null, opts.onChange ? "Licence (not part of the name)" : "Licence (optional, not part of the name)"),
        h("label", { class: "field" }, h("span", { class: "field-l" }, "How may others reuse this file?"), licSel,
          h("span", { class: "field-h" }, h("a", { href: "#/ids?tab=rules" }, "Compare licences"))),
        licOut));
  };

  ID_TABS.codes = () => {
    const regs = [...state.uploaders.values()].sort((a, b) => a.code.localeCompare(b.code));
    const num = h("input", { class: "input mono", placeholder: "Student number (9 digits)", maxlength: "9", inputmode: "numeric" });
    const name = h("input", { class: "input", placeholder: "Name to show, e.g. Alice Wang" });
    const gh = h("input", { class: "input mono", placeholder: "GitHub username (optional)" });
    const out = h("div", { class: "build-out" });
    function update() {
      const id = num.value.trim(), nm = name.value.trim().replace(/"/g, ""), g = gh.value.trim().replace(/^@/, "");
      if (!N.uploader.test(id)) { fill(out, h("p", { class: "muted" }, "Enter your 9-digit student number to get your registration line.")); return; }
      const taken = state.uploaders.get(id);
      const line = `{ "id": "${id}", "name": "${nm || "Your Name"}"${g ? `, "github": "${g}"` : ""} }`;
      fill(out, 
        taken ? h("p", { class: "notice notice-info" }, `${id} is already registered as ${taken.name}. To change it, edit that line instead.`) : null,
        h("p", { class: "field-l" }, "Register in one of two ways:"),
        h("ol", { class: "steps-mini" },
          h("li", null, h("a", { class: "btn primary small", href: `${REPO}/issues/new?template=uploader-code.yml&title=${enc("[Register] " + id)}`, target: "_blank", rel: "noopener" }, icon("inbox"), "Use the issue form"),
            " and a maintainer adds you."),
          h("li", null, h("a", { class: "btn small", href: `${REPO}/edit/${C.branch}/uploaders.json`, target: "_blank", rel: "noopener" }, icon("external"), "Edit uploaders.json"),
            " yourself: add this line inside ", h("code", null, "\"uploaders\": [ … ]"), " (comma between entries), then propose the change:",
            h("div", { class: "build-name" }, h("code", null, line), h("button", { class: "btn small", type: "button", onclick: (e) => copyText(line, e.currentTarget) }, icon("copy"), "Copy")))));
    }
    [num, name, gh].forEach((el) => el.addEventListener("input", update));
    update();
    return h("div", null,
      h("div", { class: "id-formats" },
        h("div", { class: "id-format" },
          h("h3", null, "Your uploader ID is your student number"),
          h("p", null, "Put your 9-digit student number at the end of the ID, e.g. ", h("code", null, "01140086_HWS_2627W_01_123456789 Waves Homework 1 Solution.pdf"), ". No GitHub account details are needed."),
          h("p", { class: "notice" }, h("strong", null, "It will be public. "), "Anyone can see your student number in file names and on this site, and Git keeps it even after a file is deleted. Leave it out if you'd rather not share it."),
          h("ul", { class: "rules" },
            h("li", null, h("strong", null, "Not registered:"), " the number works as is; files show “Student 123456789”."),
            h("li", null, h("strong", null, "Registered:"), " add your number and name to ", h("code", null, "uploaders.json"), " and your name is shown."),
            h("li", null, h("strong", null, "Uploader confirmed (optional):"), " also add your GitHub username. Files you upload from that account get a ✔."),
            h("li", null, "Most useful on your own work (", N.raw.types.filter((t) => t.by === "Student").map((t) => t.code).join(", "), "). Optional on school material."))),
        h("div", { class: "id-format" },
          h("h3", null, "Register your name (optional)"),
          h("div", { class: "stack" }, num, name, gh), out)),
      h("h2", { class: "small-head section" }, `Registered students (${regs.length})`),
      regs.length ? h("div", { class: "table-wrap" }, h("table", { class: "table" },
        h("thead", null, h("tr", null, h("th", null, "Student no."), h("th", null, "Name"), h("th", null, "GitHub"))),
        h("tbody", null, regs.map((u) => h("tr", null, h("td", null, h("a", { href: personHref(u.code) }, h("code", { class: "f-up" }, u.code))), h("td", { class: "nowrap" }, u.name),
          h("td", { class: "nowrap" }, u.github ? h("a", { href: "https://github.com/" + enc(u.github), target: "_blank", rel: "noopener" }, "@" + u.github) : h("span", { class: "muted" }, "—")))))))
        : h("p", { class: "muted" }, "Nobody has registered yet."));
  };

  ID_TABS.rules = () => {
    const tbl = (head, rows) => h("div", { class: "table-wrap" }, h("table", { class: "table ref" },
      h("thead", null, h("tr", null, head.map((x) => h("th", null, x)))), h("tbody", null, rows)));
    const tr = (...cells) => h("tr", null, cells.map((c) => h("td", null, c)));
    const byOrder = (a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category);
    return h("div", { class: "prose wide" },
      h("h2", null, "1  Template"),
      h("div", { class: "build-name" }, h("code", null, N.raw.template)),
      tbl(["Field", "Rule"], [
        tr(h("code", { class: "f-course" }, "course"), "8 digits, zero-padded. 6-digit shorthand pads each half to 4 digits: 104131 → 0104|0131 → 01040131 (never just prefix 00)."),
        tr(h("code", { class: "f-type" }, "TYPE"), "A type code from section 3."),
        tr(h("code", { class: "f-term" }, "term"), "Academic-year term code (section 2). Past exams keep the term printed on them. Left out for XT."),
        tr(h("code", { class: "f-item" }, "item"), "Serial number, at least two digits, or another pattern from section 5. Optional when the item has no natural number (handouts, syllabus, readings)."),
        tr(h("code", { class: "f-tag" }, "TAG"), "Optional, from section 4."),
        tr(h("code", { class: "f-up" }, "uploader"), "Your 9-digit student number (section 7). Recommended for your own work. It will be public."),
        tr("title", "Short English title after one space. Fields before it are joined with _, never -.")]),
      h("p", { class: "muted" }, "A .tex and its .pdf (or a .pdf and .pptx of the same item) share one base name."),

      h("h2", null, "2  Term codes"),
      h("p", null, h("code", null, "<start yy><end yy><letter>"), ": academic year, not calendar year."),
      tbl(["Code", "Term", "Example"], [...N.raw.seasons.map((s) => tr(h("code", { class: "f-term" }, s.letter), s.name, s.note)),
        ...N.raw.termPlaceholders.map((p) => tr(h("code", { class: "f-term" }, p.code), p.name, p.note))]),
      h("p", { class: "muted" }, "Watch the double A: PEA_2526A_A = official answer, Summer 2026, paper A."),

      h("h2", null, "3  Type codes"),
      h("p", null, "Ask ", h("em", null, "who wrote the content?"), " Your own work is marked Student (HWS, TN, LN…); official material is School (HWQ, TS, LP…)."),
      tbl(["Code", "Meaning", "Material", "By"], [...N.raw.types].sort(byOrder).map((t) => tr(h("a", { href: "#/material/" + enc(t.category) }, h("code", { class: "f-type" }, t.code)), t.name, t.category,
        h("span", { title: N.raw.byNotes[t.by] }, t.by)))),

      h("h2", null, "4  Tags"),
      h("p", null, "Tags go right after the item; the tagged copy sits next to the clean one."),
      tbl(["Code", "Name", "Use"], N.raw.tags.map((t) => tr(h("code", { class: "f-tag" }, t.code), t.name, t.note))),

      h("h2", null, "5  Item patterns"),
      tbl(["Pattern", "Kind", "Meaning"], [...N.raw.serials.map((s) => tr(h("code", { class: "f-item" }, s.example), h("span", { class: "nowrap" }, s.kind), s.note)),
        tr(h("code", { class: "f-ver" }, "V1, V02, V4.1"), "Version", N.raw.version.note),
        tr("Ranges", "", "Use the first number; the range goes in the title: LP_2526A_08 Lectures 8-10. No hyphens inside an ID.")]),

      h("h2", null, "6  Licences"),
      h("p", null, "Each file can have its own licence. It is ", h("strong", null, "not part of the file name"), ": add a rule to ", h("a", { href: licensesUrl(), target: "_blank", rel: "noopener" }, "licenses.json"),
        " (for one file, a folder or an ID), or write ", h("code", null, "SPDX-License-Identifier: CC-BY-4.0"), " near the top of a text file. With neither, the licence is “not stated” and the author keeps all rights."),
      tbl(["Code", "Licence", "Share", "Adapt", "Commercial", "Use"], N.raw.licenses.map((l) => tr(h("code", { class: "f-lic" }, l.code),
        l.url ? h("a", { href: l.url, target: "_blank", rel: "noopener" }, l.name) : l.name,
        l.share ? "✓" : "✕", l.adapt ? "✓" : "✕", l.commercial ? "✓" : "✕", l.note))),
      h("p", { class: "muted" }, "Only the author can choose a licence. For course material that isn't yours, use STUDY (shared with permission) or the licence the owner published it under."),

      h("h2", null, "7  Uploader: student number"),
      h("p", null, N.raw.uploader.note, " ", h("a", { href: "#/ids?tab=codes" }, "Register your name →")),

      h("h2", null, "8  House rules"),
      h("ul", null,
        h("li", null, h("strong", null, "IDs are recommended, not required."), " Every file is welcome; an ID just makes it easier to find and credit."),
        h("li", null, h("strong", null, "Published IDs stay fixed."), " Once a file is on the site, don't change its ID part; links and references depend on it. Fix only real mistakes."),
        h("li", null, h("strong", null, "Unsure about the course or type?"), " Ask in your pull request or open an issue. Don't guess."),
        h("li", null, h("strong", null, "Duplicates are found by content,"), " not by name. The site flags identical files (see Check files)."),
        h("li", null, h("strong", null, "Worked example: "), ["01140086_HWQ_2627W_01 question (School)", "…_HWQ_2627W_01_AN_123456789 your marked-up printout", "…_HWS_2627W_01_DR_123456789 your draft", "…_HWS_2627W_01_123456789 your clean solution", "…_HWA_2627W_01 official answer"].map((x) => h("code", { class: "ex" }, x)))));
  };

  ID_TABS.check = () => {
    const full = state.files.filter((f) => f.idInfo && f.idInfo.status === "full");
    const partial = state.files.filter((f) => f.idInfo && f.idInfo.status === "partial");
    const none = state.files.filter((f) => !f.idInfo);
    const upIssues = state.files.filter((f) => f.up.status === "behalf");
    const groups = new Map();
    for (const f of state.files) if (f.sha256) groups.set(f.sha256, [...(groups.get(f.sha256) || []), f]);
    const dups = [...groups.values()].filter((g) => g.length > 1);
    const idGroups = new Map();
    // A .tex/.zip source and its .pdf may share an ID; only the same ID in the same format clashes.
    for (const f of full) { const k = f.idInfo.idPart + "." + f.ext; idGroups.set(k, [...(idGroups.get(k) || []), f]); }
    const sameId = [...idGroups.values()].filter((g) => g.length > 1);

    const fileRow = (f, note) => h("li", null, h("button", { class: "linkish", type: "button", onclick: () => openPreview(f) }, f.name), note ? h("span", { class: "muted small" }, " · " + note) : null);
    const block = (title, list, render, note, open) => h("details", { class: "check-block", open: open && list.length ? true : null },
      h("summary", null, h("span", { class: "check-n" + (list.length ? "" : " zero") }, String(list.length)), " ", title),
      note ? h("p", { class: "muted small" }, note) : null,
      list.length ? h("ul", { class: "mini-list" }, list.map(render)) : h("p", { class: "muted small" }, "Nothing here."));

    const pct = state.files.length ? Math.round(full.length / state.files.length * 100) : 0;
    return h("div", null,
      h("div", { class: "stats" },
        h("div", { class: "stat" }, h("span", { class: "stat-n" }, `${pct}%`), h("span", { class: "stat-l" }, "files with a full ID")),
        h("div", { class: "stat" }, h("span", { class: "stat-n" }, String(state.items.filter((f) => itemVerification(f).state === "verified").length)), h("span", { class: "stat-l" }, "verified")),
        h("div", { class: "stat" }, h("span", { class: "stat-n" }, String(partial.length)), h("span", { class: "stat-l" }, "IDs with problems")),
        h("div", { class: "stat" }, h("span", { class: "stat-n" }, String(dups.length)), h("span", { class: "stat-l" }, "duplicate groups"))),
      h("div", { class: "section stack" },
        block("IDs with problems", partial, (f) => fileRow(f, f.idInfo.problems.join(" ")), "These start like an ID but break a rule. Renaming them makes them easier to find.", true),
        block("Uploaded on someone else's behalf", upIssues, (f) => fileRow(f, `uploaded by ${personLabel(accountKey(f))} on behalf of ${personLabel(f.up.code)}`), "Allowed; listed so the student can check it's theirs."),
        block("Identical files", dups, (g) => h("li", null, g.map((f, i) => [i ? h("span", { class: "muted" }, "  =  ") : null, h("button", { class: "linkish", type: "button", onclick: () => openPreview(f) }, f.name)])),
          state.source === "index" ? "Same content (SHA-256), whatever the name." : "Content hashes are only available on the deployed site."),
        block("Same ID used more than once", sameId, (g) => h("li", null, h("code", null, g[0].idInfo.idPart), h("span", { class: "muted small" }, ` · ${g.length} files: ${g.map((f) => f.subject).join(", ")}`)),
          "Two files of the same format with exactly the same ID. Add a student number, version or tag to tell them apart."),
        block("Changed since verification", state.items.filter((f) => itemVerification(f).state === "changed"), (f) => fileRow(f, `verified by @${itemVerification(f).rec.by}, content changed since`),
          "A maintainer should check these again and re-verify.", true),
        block("Not verified yet", state.items.filter((f) => ["none", "partial"].includes(itemVerification(f).state)), (f) => fileRow(f, pretty(f.subject)),
          "Open a file and use “Verify this item” (owner and collaborators only)."),
        block("Files without a stated licence", state.files.filter((f) => !f.lic.lic), (f) => fileRow(f, pretty(f.subject)),
          "Nobody may reuse these beyond reading them here. Add a rule for them in licenses.json."),
        block("Files without an ID", none, (f) => fileRow(f, pretty(f.subject)), "Perfectly fine. Add an ID next time you update one of these.")));
  };

  // ---------- other pages ----------

  VIEWS.requests = () => {
    const list = h("div", { class: "requests" }, h("p", { class: "muted" }, "Loading requests…"));
    const newUrl = `${REPO}/issues/new?template=file-request.yml`;
    fetch(`${API}/issues?state=open&per_page=100`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((issues) => {
        const reqs = issues.filter((i) => !i.pull_request &&
          (i.labels.some((l) => l.name === "file-request") || /^\[request\]/i.test(i.title)));
        if (!reqs.length) { fill(list, emptyState("No open requests", "Looking for something? Ask for it!")); return; }
        fill(list, ...reqs.map((i) => h("a", { class: "request", href: i.html_url, target: "_blank", rel: "noopener" },
          h("span", { class: "request-title" }, i.title.replace(/^\[request\]\s*/i, "")),
          h("span", { class: "request-meta" }, `#${i.number} · opened ${timeAgo(i.created_at)} by ${i.user.login}` +
            (i.comments ? ` · ${i.comments} comment${i.comments > 1 ? "s" : ""}` : "")))));
      })
      .catch(() => fill(list, emptyState("Couldn't load requests", "GitHub may be rate-limiting this browser. You can still see them on GitHub.",
        h("a", { class: "btn", href: `${REPO}/issues?q=is%3Aopen+label%3Afile-request`, target: "_blank", rel: "noopener" }, "Open on GitHub"))));

    return h("div", null,
      h("div", { class: "page-head" },
        h("div", null, h("h1", null, "File requests"),
          h("p", { class: "muted" }, "Ask for notes or solutions you need. If you have something on this list, upload it and mention the request number!")),
        h("a", { class: "btn primary", href: newUrl, target: "_blank", rel: "noopener" }, icon("inbox"), "Request a file")),
      list);
  };

  VIEWS.constants = () => {
    const rows = D.constants.map(([sym, sub, name, value, unit, exact]) => {
      const v = Number(value);
      return h("tr", { "data-search": `${sym} ${sub} ${name} ${unit}`.toLowerCase() },
        h("td", { class: "sym" }, h("var", null, sym, sub ? h("sub", null, sub) : null)),
        h("td", null, name, exact ? h("span", { class: "tag" }, "exact") : null),
        h("td", { class: "value" }, sciNode(v, value.replace(/^-|\.|e.*$/g, "").replace(/^0+/, "").length || 1)),
        h("td", { class: "nowrap" }, unit),
        h("td", null, h("button", { class: "icon-btn", type: "button", title: `Copy ${value}`, "aria-label": `Copy value of ${name}`,
          onclick: (e) => copyText(value, e.currentTarget) }, icon("copy"))));
    });
    const filter = h("input", { type: "search", class: "input", placeholder: "Filter, e.g. “electron” or “J K”", "aria-label": "Filter constants",
      oninput: (e) => { const q = e.target.value.toLowerCase().trim(); rows.forEach((r) => { r.hidden = q && !r.dataset.search.includes(q); }); } });
    return h("div", null,
      h("div", { class: "page-head" }, h("div", null, h("h1", null, "Physical constants"),
        h("p", { class: "muted" }, "CODATA 2022 recommended values. Click the copy button to copy a value in calculator-ready form (e.g. 6.62607015e-34). ",
          h("a", { href: "https://physics.nist.gov/cuu/Constants/", target: "_blank", rel: "noopener" }, "Source: NIST"), "."))),
      h("div", { class: "toolbar" }, filter),
      h("div", { class: "table-wrap" }, h("table", { class: "table constants" },
        h("thead", null, h("tr", null, h("th", null, "Symbol"), h("th", null, "Quantity"), h("th", null, "Value"), h("th", null, "Unit"), h("th", null, h("span", { class: "sr-only" }, "Copy")))),
        h("tbody", null, rows))));
  };

  VIEWS.converter = (r) => {
    const cats = Object.keys(D.units);
    let cat = cats.includes(r.params.get("q")) ? r.params.get("q") : store.get("conv-cat", "Energy");
    if (!D.units[cat]) cat = "Energy";

    const toBase = (u, x) => typeof u[2] === "function" ? u[2](x) : x * u[2];
    const fromBase = (u, b) => typeof u[2] === "function" ? u[3](b) : b / u[2];

    const tabs = h("div", { class: "tabs", role: "tablist" });
    const panel = h("div");

    function draw() {
      store.set("conv-cat", cat);
      fill(tabs, ...cats.map((c) => h("button", { type: "button", role: "tab", class: "tab" + (c === cat ? " on" : ""), "aria-selected": String(c === cat),
        onclick: () => { cat = c; draw(); } }, c)));
      const units = D.units[cat].units;
      const saved = store.get("conv:" + cat, null);
      const input = h("input", { type: "number", class: "input big", value: saved ? saved.v : "1", step: "any", "aria-label": "Value" });
      const sel = (val) => h("select", { class: "input" }, units.map((u, i) => h("option", { value: String(i), selected: i === val }, `${u[0]} — ${u[1]}`)));
      const from = sel(saved ? saved.from : 0), to = sel(saved ? saved.to : Math.min(1, units.length - 1));
      const out = h("output", { class: "result" });
      const tbody = h("tbody");

      function calc() {
        const x = parseFloat(input.value);
        const fu = units[from.value], tu = units[to.value];
        store.set("conv:" + cat, { v: input.value, from: Number(from.value), to: Number(to.value) });
        if (!isFinite(x)) { fill(out, "Enter a number"); fill(tbody, ); return; }
        const b = toBase(fu, x);
        fill(out, h("span", { class: "muted" }, `${input.value} ${fu[0]} = `), sciNode(fromBase(tu, b), 7), " ", tu[0]);
        fill(tbody, ...units.map((u) => {
          const val = fromBase(u, b);
          return h("tr", null, h("td", { class: "value" }, sciNode(val, 7)), h("td", null, h("strong", null, u[0])), h("td", { class: "muted" }, u[1]),
            h("td", null, h("button", { class: "icon-btn", type: "button", title: "Copy", onclick: (e) => copyText(String(Number(val.toPrecision(10))), e.currentTarget) }, icon("copy"))));
        }));
      }
      const swap = h("button", { class: "icon-btn", type: "button", title: "Swap units", "aria-label": "Swap units",
        onclick: () => { const t = from.value; from.value = to.value; to.value = t; calc(); } }, icon("swap"));
      [input, from, to].forEach((el) => el.addEventListener("input", calc));
      fill(panel, 
        h("div", { class: "converter" }, input, from, swap, to),
        h("p", { class: "result-line" }, out),
        h("h2", { class: "small-head" }, "In all units"),
        h("div", { class: "table-wrap" }, h("table", { class: "table" }, tbody)));
      calc();
    }
    draw();
    return h("div", null,
      h("div", { class: "page-head" }, h("div", null, h("h1", null, "Unit converter"),
        h("p", { class: "muted" }, "Convert between SI and common physics units. Energy also converts to wavenumber, frequency, temperature and photon wavelength."))),
      tabs, panel);
  };

  VIEWS.resources = () => h("div", null,
    h("div", { class: "page-head" }, h("div", null, h("h1", null, "Resources"),
      h("p", { class: "muted" }, "Free physics websites and tools that students find useful."))),
    D.resources.map((g) => h("section", { class: "section" },
      h("h2", null, g.group),
      h("div", { class: "tiles" }, g.items.map(([name, url, text]) =>
        h("a", { class: "tile", href: url, target: "_blank", rel: "noopener" },
          h("span", { class: "tile-name" }, name, " ", icon("external")),
          h("span", { class: "tile-text" }, text)))))));

  VIEWS.contribute = () => {
    const counts = subjectCounts();
    const subjectSel = h("select", { class: "input", "aria-label": "Subject" }, Object.keys(counts).sort().map((s) => h("option", { value: s }, pretty(s))));
    const go = h("a", { class: "btn small", target: "_blank", rel: "noopener" }, icon("external"), "Open the folder");
    const sync = () => { go.href = directUploadUrl(subjectSel.value); };
    subjectSel.addEventListener("change", sync);
    sync();
    const step = (n, title, ...body) => h("li", { class: "step" }, h("span", { class: "step-n" }, String(n)), h("div", null, h("h3", null, title), ...body));

    // Step 1: the student number, shared with the name builder in step 2.
    const number = h("input", { class: "input mono", value: store.get("builder", {}).uploader || "", placeholder: "123456789", maxlength: "9", inputmode: "numeric", "aria-label": "Student number" });
    const numberNote = h("p", { class: "field-h" });
    // Step 3: what's still missing, and the pre-filled form link.
    const checks = h("ul", { class: "perm checklist" });
    const open = h("a", { class: "btn primary", target: "_blank", rel: "noopener" }, icon("upload"), "Open the upload form");
    let last = null;
    const refresh = () => {
      const n = number.value.trim(), ok = N.uploader.test(n), reg = ok ? state.uploaders.get(n) : null;
      fill(numberNote, !n ? "9 digits. It goes at the end of every file ID and credits the file to you. It is public."
        : !ok ? h("span", { class: "bad" }, "A student number has 9 digits.")
        : reg ? [h("span", { class: "up up-ok" }, icon("check"), "Registered"), ` as ${reg.name}.`]
        : ["Not registered yet. Your number works anyway; ", h("a", { href: "#/ids?tab=codes" }, "register your name"), " (optional) to have it shown."]);
      if (!last) return;
      const idOk = last.info && last.info.status === "full" && !last.info.problems.length && last.course;
      const items = [[ok, "Uploader ID (student number)"], [idOk, "File ID: course, type, term and item"], [!!last.subject, "Subject"], [!!last.title, "Title"], [!!last.license, "Licence"]];
      fill(checks, items.map(([done, label]) => h("li", { class: done ? "ok" : "no" }, h("span", { class: "mark", "aria-hidden": "true" }, done ? "✓" : "✕"), label)));
      const ready = items.every(([done]) => done);
      open.classList.toggle("disabled", !ready);
      open.setAttribute("aria-disabled", String(!ready));
      open.href = ready ? uploadUrl(last) : "#/contribute";
    };
    open.addEventListener("click", (e) => { if (open.classList.contains("disabled")) e.preventDefault(); });
    number.addEventListener("input", refresh);
    const builder = ID_TABS.build(null, { uploader: number, onChange: (v) => { last = v; refresh(); } });
    refresh();

    return h("div", { class: "prose" },
      h("div", { class: "page-head" }, h("div", null, h("h1", null, "How to contribute"),
        h("p", { class: "muted" }, "Three steps: your uploader ID, the file's ID, then the upload form. You need a free GitHub account; no Git or coding."))),
      copyrightNotice(),
      h("ol", { class: "steps" },
        step(1, "Your uploader ID", h("p", null, "Your uploader ID is your ", h("strong", null, "9-digit student number"), ". Enter it here; the next step uses it."),
          h("label", { class: "field uploader-field" }, h("span", { class: "field-l" }, "Student number"), number, numberNote)),
        step(2, "Build the file's ID", h("p", null, "Fill in the course code (its name appears by itself), subject, kind of material, term, item, a short title and the licence. The builder shows the file's ID; ",
          h("a", { href: "#/ids" }, "the ID system"), " explains each part. You don't need to rename your file: the upload form does it."), builder),
        step(3, "Upload", h("p", null, "When everything below is ticked, open the upload form. It opens on GitHub with your answers filled in."),
          checks, h("div", { class: "row" }, open),
          h("p", null, "In the form, only one thing is left: drag your file into ", h("strong", null, "Files"), " and wait until it shows as a link (PDF is best; put LaTeX or other sources in one ", h("code", null, ".zip"),
            "; up to 25 MB). Check the other answers, which are already filled in, and submit."),
          h("p", { class: "muted small" }, "No file ID possible, for example for material from outside the university? ", h("a", { href: uploadUrl(), target: "_blank", rel: "noopener" }, "Upload without an ID"), ".")),
        step(4, "Review", h("p", null, "A bot checks the form within a minute and replies on the issue. If something is wrong, it says what; edit the issue to fix it. Otherwise it opens a pull request, and a maintainer reviews it.")),
        step(5, "It appears on the site", h("p", null, "Once the pull request is merged, your file shows up within a few minutes, credited to your student number and GitHub account."))),
      h("h2", null, "Collaborators and many files"),
      h("p", null, "If you have write access, you can add files straight to a subject folder (", h("strong", null, "Add file → Upload files"), "), or use Git for many files at once. Name files yourself with the ",
        h("a", { href: "#/ids?tab=build" }, "name builder"), " and add their licence to ", h("a", { href: licensesUrl(), target: "_blank", rel: "noopener" }, "licenses.json"), "."),
      h("div", { class: "row" }, subjectSel, go),
      h("h2", null, "Rules"),
      h("ul", null,
        h("li", null, "Share your own work, or material that is clearly free to share."),
        h("li", null, "Follow your university's academic-integrity rules. No solutions to open assignments or private exams."),
        h("li", null, "Remove other personal information (phone numbers, grades). Your student number is public once it's in a file ID."),
        h("li", null, "Everything here is public, and Git keeps old versions."),
        h("li", null, "Choose a licence for each file; it's never part of the file name. Without one, nobody may reuse it beyond reading it here. Only license what you wrote; course material keeps its owner's terms. ",
          h("a", { href: contentLicenseUrl(), target: "_blank", rel: "noopener" }, "Details →"))),
      h("p", null, h("a", { href: `${REPO}#readme`, target: "_blank", rel: "noopener" }, "Read the full guide in the README →")));
  };

  // ---------- help ----------
  // Guide text lives in assets/js/help.js. **bold** marks the site's (English) button names, `code` marks codes.

  function rich(text) {
    return String(text).split(/(\*\*[^*]+\*\*|`[^`]+`)/).filter(Boolean).map((part) =>
      part.startsWith("**") ? h("strong", null, part.slice(2, -2))
        : part.startsWith("`") ? h("code", { dir: "ltr" }, part.slice(1, -1))
        : part);
  }
  function helpBlock(b) {
    if (b.p) return h("p", null, rich(b.p));
    if (b.ul) return h("ul", null, b.ul.map((x) => h("li", null, rich(x))));
    if (b.ol) return h("ol", null, b.ol.map((x) => h("li", null, rich(x))));
    if (b.tip) return h("p", { class: "help-tip" }, icon("star"), h("span", null, rich(b.tip)));
    if (b.code) return h("pre", { class: "help-code", dir: "ltr" }, b.code);
    if (b.licences) {
      const L = b.licences, mark = (ok) => h("td", { class: "mark " + (ok ? "yes" : "no") }, ok ? "✓" : "✕");
      return h("div", { class: "table-wrap help-table" }, h("table", { class: "table ref" },
        h("thead", null, h("tr", null, L.head.map((x) => h("th", null, x)))),
        h("tbody", null, ((N.raw && N.raw.licenses) || []).map((l) => h("tr", null,
          h("td", null, h("code", { class: "f-lic", dir: "ltr" }, l.code)),
          h("td", { dir: "ltr", class: "nowrap" }, l.url ? h("a", { href: l.url, target: "_blank", rel: "noopener" }, l.short) : l.short),
          h("td", null, L.meaning[l.code] || l.note),
          mark(l.share), mark(l.adapt), mark(l.commercial))))));
    }
    return null;
  }

  // Changelog text lives in assets/js/changelog.js, newest first.
  VIEWS.changelog = () => {
    const log = window.CHANGELOG || [];
    const TYPES = { new: "New", improved: "Improved", fixed: "Fixed" };
    return h("div", { class: "help changelog" },
      h("div", { class: "page-head" }, h("div", null, h("h1", null, "Changelog"),
        h("p", { class: "muted" }, "What's new on the site, newest first."))),
      log.length ? log.map((rel) => h("section", { class: "help-section" },
        h("h2", null, h("span", { class: "rel-version" }, "v" + rel.version), rel.title,
          h("time", { class: "rel-date", datetime: rel.date }, fmtDate(rel.date))),
        h("ul", { class: "rel-list" }, rel.changes.map((c) => h("li", null,
          h("span", { class: "rel-type rel-" + c.type }, TYPES[c.type] || c.type), h("span", null, rich(c.text)))))))
        : emptyState("No changes recorded yet", null));
  };

  VIEWS.help = (r) => {
    const H = window.HELP;
    if (!H) return emptyState("Help couldn't be loaded", "assets/js/help.js is missing.");
    const has = (c) => (c && H.text[c] ? c : null);
    let lang = has(r.arg) || has(store.get("helpLang", "")) || has((navigator.language || "en").slice(0, 2).toLowerCase()) || "en";
    const wrap = h("div", { class: "help" });
    function draw() {
      const T = H.text[lang], L = H.languages.find((l) => l.code === lang);
      store.set("helpLang", lang);
      wrap.setAttribute("lang", lang);
      wrap.setAttribute("dir", L.dir);
      fill(wrap,
        h("div", { class: "page-head" }, h("div", null, h("h1", null, T.title), h("p", { class: "muted" }, T.subtitle))),
        h("div", { class: "lang-bar", role: "group", "aria-label": "Language" }, H.languages.map((l) =>
          h("button", { type: "button", class: "tab" + (l.code === lang ? " on" : ""), lang: l.code, "aria-pressed": String(l.code === lang),
            onclick: () => { lang = l.code; history.replaceState(null, "", "#/help/" + lang); draw(); } }, l.name))),
        T.note ? h("p", { class: "notice notice-info" }, rich(T.note)) : null,
        h("nav", { class: "help-toc", "aria-label": T.contents },
          h("p", { class: "field-l" }, T.contents),
          h("ol", null, T.sections.map((sec) => h("li", null, h("button", { type: "button", class: "linkish",
            onclick: () => document.getElementById("help-" + sec.id).scrollIntoView({ behavior: "smooth", block: "start" }) }, sec.title))))),
        T.sections.map((sec) => h("section", { class: "help-section", id: "help-" + sec.id },
          h("h2", null, icon(sec.icon), h("span", null, sec.title)),
          sec.blocks.map(helpBlock))));
    }
    draw();
    return wrap;
  };

  VIEWS.notfound = () => emptyState("Page not found", "That page doesn't exist.", h("a", { class: "btn", href: "#/" }, "Go home"));

  // ---------- start ----------

  async function init() {
    document.getElementById("brand-name").textContent = C.title;
    fill(document.querySelector(".brand-mark"), icon("book"));
    fill(document.querySelector(".footer p"), "Built by students with GitHub Pages · Site code: ",
      h("a", { href: `${REPO}/blob/${C.branch}/LICENSE`, target: "_blank", rel: "noopener" }, "MIT"),
      " · Shared files: each has its own licence, shown in its preview · ", h("a", { href: contentLicenseUrl(), target: "_blank", rel: "noopener" }, "Copyright and takedown"),
      " · ", h("a", { href: reportUrl(), target: "_blank", rel: "noopener" }, "Report a file"));
    document.getElementById("upload-btn").href = "#/contribute";
    fill(document.getElementById("upload-btn"), icon("upload"), h("span", null, "Upload"));
    fill(document.getElementById("menu-btn"), icon("menu"));
    document.querySelector(".search-icon").replaceWith(icon("search"));

    let theme = store.get("theme", "auto");
    applyTheme(theme);
    document.getElementById("theme-toggle").addEventListener("click", () => {
      const i = THEMES.findIndex((x) => x[0] === theme);
      theme = THEMES[(i + 1) % THEMES.length][0];
      store.set("theme", theme);
      applyTheme(theme);
    });

    let accent = store.get("accent", "orange");
    if (!ACCENTS.some((x) => x[0] === accent)) accent = "orange";
    applyAccent(accent);
    document.getElementById("accent-toggle").addEventListener("click", () => {
      accent = ACCENTS[(ACCENTS.findIndex((x) => x[0] === accent) + 1) % ACCENTS.length][0];
      store.set("accent", accent);
      applyAccent(accent);
    });

    document.getElementById("menu-btn").addEventListener("click", () => sidebar().classList.contains("open") ? closeSidebar() : openSidebar());
    document.getElementById("backdrop").addEventListener("click", closeSidebar);

    const search = document.getElementById("search");
    search.addEventListener("input", () => {
      state.q = search.value.trim().toLowerCase();
      if (state.refresh) state.refresh();
      else location.hash = "#/browse";
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) { e.preventDefault(); search.focus(); }
      if (e.key === "Escape") closeSidebar();
    });

    fill(document.getElementById("view"), h("p", { class: "muted loading" }, "Loading files…"));
    const [data, naming, ups, courses, licRules, upRules, verifs] = await Promise.all([loadFiles(), getJson("assets/naming.json"), getJson("uploaders.json"), getJson("courses.json"), getJson("licenses.json"), getJson("uploads.json"), getJson("verifications.json")]);
    setNaming(naming);
    for (const u of (ups && ups.uploaders) || []) {
      const id = String(u.id || "").trim();
      if (!N.uploader.test(id)) continue;
      const github = u.github ? String(u.github).replace(/^@/, "") : null;
      state.uploaders.set(id, { code: id, github, name: u.name || "Student " + id });
      if (github) state.loginToCode.set(github.toLowerCase(), id);
    }
    state.courses = (courses && courses.courses) || {};
    state.licenseRules = ((licRules && licRules.rules) || []).filter((r) => r && N.licenses[r.license] && (r.path || r.id));
    state.verifications = ((verifs && verifs.records) || []).filter((r) => r && r.path && r.by);
    state.uploadRules = ((upRules && upRules.rules) || []).filter((r) => r && N.uploader.test(String(r.uploadedBy || "")) && (r.path || r.id));
    state.files = data.files.filter((f) => !isHidden(f.path)).map(parseFile);
    state.subjects = data.subjects;
    state.source = data.source;
    state.generated = data.generated;
    state.items = groupItems(state.files);
    state.hasDates = state.files.some((f) => f.added);

    buildNav();
    window.addEventListener("hashchange", render);
    render();
  }

  init();
})();
