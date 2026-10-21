// Physics File Sharing: a small single-page app.
// Files come from files.json (built by scripts/build_index.py in GitHub Actions);
// if that is missing, the GitHub API is used to list the files/ folder instead.
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
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14.5a6.5 6.5 0 0 1 3.5 5.5"/>',
    inbox: '<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1 3h6l1-3h5"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14"/><path d="M12 17h.01"/>',
    atom: '<circle cx="12" cy="12" r="1.5"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
    swap: '<path d="M7 4L3 8l4 4"/><path d="M3 8h14"/><path d="M17 12l4 4-4 4"/><path d="M21 16H7"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    auto: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
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

  const pretty = (s) => s.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

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
    if (x === 0 || (a >= 1e-2 && a < 1e7)) {
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
    const [type, preview] = TYPES[ext] || [ext ? ext.toUpperCase() : "File", null];
    return {
      path: parts.join("/"),
      href: parts.map(encodeURIComponent).join("/"),
      name, ext, type, preview,
      title: pretty(dot > 0 ? name.slice(0, dot) : name),
      subject: parts.length > 2 ? parts[1] : "Other",
      topic: parts.slice(2, -1).map(pretty).join(" / "),
      size: e.size == null ? null : e.size,
      added: e.added || null,
      updated: e.updated || null,
      contributors: e.contributors || []
    };
  }
  const isHidden = (path) => path.split("/").some((p) => p.startsWith(".") || p.startsWith("_"));

  async function loadFiles() {
    try {
      const r = await fetch("files.json", { cache: "no-cache" });
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      return { files: d.files, subjects: d.subjects || [], generated: d.generated, source: "index" };
    } catch (e) { /* fall through to the API */ }
    try {
      const r = await fetch(`${API}/git/trees/${encodeURIComponent(C.branch)}?recursive=1`);
      if (!r.ok) throw new Error(r.status);
      const d = await r.json();
      const files = [], subjects = [];
      for (const t of d.tree) {
        if (!t.path.startsWith("files/") || isHidden(t.path)) continue;
        if (t.type === "blob") files.push({ path: t.path, size: t.size });
        else if (t.type === "tree" && t.path.split("/").length === 2) subjects.push(t.path.split("/")[1]);
      }
      return { files, subjects, source: "api" };
    } catch (e) {
      return { files: [], subjects: [], source: "none" };
    }
  }

  const state = {
    files: [], subjects: [], source: "", generated: null, hasDates: false,
    q: "", type: "All", sort: store.get("sort", "name"), layout: store.get("layout", "grid"),
    favs: new Set(store.get("favs", [])),
    refresh: null // re-renders the visible file list in place while typing
  };

  function subjectCounts() {
    const counts = {};
    for (const s of state.subjects) counts[s] = 0;
    for (const f of state.files) counts[f.subject] = (counts[f.subject] || 0) + 1;
    return counts;
  }

  function contributorStats() {
    const map = new Map();
    for (const f of state.files) {
      f.contributors.forEach((name, i) => {
        if (!map.has(name)) map.set(name, { name, uploads: 0, edits: 0, subjects: new Set(), last: null });
        const s = map.get(name);
        if (i === 0) { s.uploads++; s.subjects.add(f.subject); } else s.edits++;
        if (f.updated && (!s.last || f.updated > s.last)) s.last = f.updated;
      });
    }
    return [...map.values()].sort((a, b) => b.uploads - a.uploads || b.edits - a.edits || a.name.localeCompare(b.name));
  }

  function toggleFav(path) {
    if (state.favs.has(path)) state.favs.delete(path); else state.favs.add(path);
    store.set("favs", [...state.favs]);
    updateNavCounts();
    return state.favs.has(path);
  }

  const uploadUrl = (subject) => `${REPO}/upload/${C.branch}/files${subject ? "/" + encodeURIComponent(subject) : ""}`;

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
    const main = document.getElementById("view");
    main.replaceChildren(view(r));
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

  function buildNav() {
    const counts = subjectCounts();
    const nav = document.getElementById("nav");
    nav.replaceChildren(
      h("div", { class: "nav-section" },
        h("p", { class: "nav-heading" }, "Library"),
        navLink("#/", "home", "Home"),
        navLink("#/browse", "files", "All files", state.files.length),
        navLink("#/recent", "clock", "Recently added"),
        navLink("#/favorites", "star", "Favorites", state.favs.size, "fav-count")),
      h("div", { class: "nav-section" },
        h("p", { class: "nav-heading" }, "Subjects"),
        Object.keys(counts).sort().map((s) => navLink("#/subject/" + encodeURIComponent(s), "folder", pretty(s), counts[s]))),
      h("div", { class: "nav-section" },
        h("p", { class: "nav-heading" }, "Community"),
        navLink("#/contributors", "users", "Contributors"),
        navLink("#/requests", "inbox", "File requests"),
        navLink("#/contribute", "help", "How to contribute")),
      h("div", { class: "nav-section" },
        h("p", { class: "nav-heading" }, "Study tools"),
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
    if (r.name === "subject") current += "/" + encodeURIComponent(r.arg);
    if (r.name === "file") {
      const f = state.files.find((x) => x.path === r.arg);
      current = f ? "#/subject/" + encodeURIComponent(f.subject) : "#/browse";
    }
    document.querySelectorAll("#nav .nav-link").forEach((a) => {
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
    document.getElementById("theme-toggle").replaceChildren(icon(ic), h("span", { class: "nav-label" }, label));
  }

  // ---------- file cards and lists ----------

  function matchesQuery(f) {
    if (!state.q) return true;
    const hay = [f.name, f.title, pretty(f.subject), f.topic, f.type, ...f.contributors].join(" ").toLowerCase();
    return state.q.split(/\s+/).every((w) => hay.includes(w));
  }

  const SORTS = {
    name: ["Name (A–Z)", (a, b) => a.title.localeCompare(b.title)],
    newest: ["Newest first", (a, b) => (b.added || "").localeCompare(a.added || "")],
    updated: ["Recently updated", (a, b) => (b.updated || "").localeCompare(a.updated || "")],
    largest: ["Largest first", (a, b) => (b.size || 0) - (a.size || 0)],
    subject: ["Subject", (a, b) => a.subject.localeCompare(b.subject) || a.title.localeCompare(b.title)]
  };

  function fileMeta(f) {
    const bits = [];
    if (f.size != null) bits.push(fmtSize(f.size));
    if (f.added) bits.push(fmtDate(f.added));
    if (f.contributors[0]) bits.push("by " + f.contributors[0]);
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

    return h("article", { class: "card" },
      h("div", { class: "card-top" },
        h("span", { class: "badge t-" + slug(f.type) }, f.type),
        star),
      h("div", { class: "card-body" },
        h("h3", null, h("button", { class: "title-link", type: "button", onclick: () => openPreview(f) }, f.title)),
        h("p", { class: "card-sub" }, pretty(f.subject) + (f.topic ? " · " + f.topic : "")),
        h("p", { class: "card-meta" }, fileMeta(f) || f.name)),
      h("div", { class: "card-actions" },
        h("button", { class: "btn small", type: "button", onclick: () => openPreview(f) }, icon("eye"), "Preview"),
        h("a", { class: "btn small", href: f.href, download: f.name }, icon("download"), "Download"),
        h("button", { class: "icon-btn", type: "button", title: "Copy link to this file",
          onclick: (e) => copyText(SITE_BASE + "#/file/" + f.href, e.currentTarget) }, icon("link"))));
  }

  function emptyState(title, text, action) {
    return h("div", { class: "empty" }, h("p", { class: "empty-title" }, title), text ? h("p", null, text) : null, action || null);
  }

  // A filterable, sortable list used by All files, Subject, Recent and Favorites.
  function fileListView({ title, desc, filter, sort, empty, extra }) {
    const base = state.files.filter(filter);
    const types = [...new Set(base.map((f) => f.type))].sort();
    if (!types.includes(state.type)) state.type = "All";
    let sortKey = sort || state.sort;
    if (!state.hasDates && (sortKey === "newest" || sortKey === "updated")) sortKey = "name";

    const count = h("span", { class: "result-count", "aria-live": "polite" });
    const results = h("div");

    const typeSel = h("select", { "aria-label": "File type", onchange: (e) => { state.type = e.target.value; refresh(); } },
      h("option", { value: "All" }, "All types"),
      types.map((t) => h("option", { value: t, selected: t === state.type }, t)));
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
      const list = base.filter((f) => matchesQuery(f) && (state.type === "All" || f.type === state.type)).sort(SORTS[sortKey][1]);
      count.textContent = `${list.length} ${list.length === 1 ? "file" : "files"}` + (list.length !== base.length ? ` of ${base.length}` : "");
      if (!base.length) results.replaceChildren(empty);
      else if (!list.length) results.replaceChildren(emptyState("Nothing matches", "Try a different search or file type.",
        h("button", { class: "btn", type: "button", onclick: clearFilters }, "Clear filters")));
      else results.replaceChildren(h("div", { class: "files " + state.layout }, list.map(card)));
    }
    function clearFilters() {
      state.q = ""; state.type = "All"; typeSel.value = "All";
      document.getElementById("search").value = "";
      refresh();
    }
    state.refresh = refresh;
    refresh();

    return h("div", null,
      h("div", { class: "page-head" },
        h("div", null, h("h1", null, title), desc ? h("p", { class: "muted" }, desc) : null),
        extra || null),
      h("div", { class: "toolbar" }, count, h("div", { class: "toolbar-right" }, typeSel, sortSel,
        h("div", { class: "segmented", role: "group", "aria-label": "Layout" }, layoutBtn("grid", "grid", "Grid view"), layoutBtn("list", "list", "List view")))),
      results);
  }

  const uploadEmpty = (subject) => emptyState("No files here yet", "Be the first to share something!",
    h("a", { class: "btn primary", href: uploadUrl(subject), target: "_blank", rel: "noopener" }, icon("upload"), "Upload a file"));

  // ---------- preview modal ----------

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
          body.append(h("iframe", { src: "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(fullUrl), title: f.title }));
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
      ["Contributors", f.contributors.join(", ")]
    ].filter(([, v]) => v);

    let lastFocus = document.activeElement;
    const close = () => {
      dlg.remove();
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("modal-open");
      if (parseRoute().name === "file") history.replaceState(null, "", "#/subject/" + encodeURIComponent(f.subject));
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
            h("dl", { class: "info" }, info.map(([k, v]) => [h("dt", null, k), h("dd", null, v)])),
            h("div", { class: "stack" },
              h("a", { class: "btn primary", href: f.href, download: f.name }, icon("download"), "Download"),
              h("a", { class: "btn", href: f.href, target: "_blank", rel: "noopener" }, icon("external"), "Open in new tab"),
              h("button", { class: "btn", type: "button", onclick: (e) => copyText(SITE_BASE + "#/file/" + f.href, e.currentTarget) }, icon("link"), "Copy link"),
              h("a", { class: "btn", href: blobUrl, target: "_blank", rel: "noopener" }, icon("github"), "View on GitHub"),
              h("a", { class: "btn ghost", href: `${REPO}/commits/${C.branch}/${f.href}`, target: "_blank", rel: "noopener" }, icon("clock"), "File history"))))));
    document.body.append(dlg);
    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onKey);
    closeBtn.focus();
  }

  // ---------- views ----------

  const VIEWS = {};

  VIEWS.home = () => {
    const counts = subjectCounts();
    const people = contributorStats();
    const totalSize = state.files.reduce((s, f) => s + (f.size || 0), 0);
    const recent = state.hasDates ? [...state.files].sort(SORTS.newest[1]).slice(0, 6) : [];
    const heroSearch = h("input", { type: "search", placeholder: "Search notes, e.g. “harmonic oscillator”", "aria-label": "Search files",
      onkeydown: (e) => { if (e.key === "Enter") { state.q = e.target.value.trim().toLowerCase(); document.getElementById("search").value = e.target.value; location.hash = "#/browse"; } } });

    const stat = (n, label) => h("div", { class: "stat" }, h("span", { class: "stat-n" }, String(n)), h("span", { class: "stat-l" }, label));
    const tool = (href, ic, name, text) => h("a", { class: "tile", href }, icon(ic), h("span", { class: "tile-name" }, name), h("span", { class: "tile-text" }, text));

    return h("div", null,
      h("section", { class: "hero" },
        h("p", { class: "eyebrow" }, "Shared by students, for students"),
        h("h1", null, C.title),
        h("p", { class: "lead" }, C.description),
        h("label", { class: "hero-search" }, icon("search"), heroSearch),
        h("div", { class: "row" },
          h("a", { class: "btn primary", href: uploadUrl(), target: "_blank", rel: "noopener" }, icon("upload"), "Upload a file"),
          h("a", { class: "btn", href: "#/browse" }, icon("files"), "Browse all files"),
          h("a", { class: "btn", href: "#/requests" }, icon("inbox"), "Request a file"))),

      h("section", { class: "stats" },
        stat(state.files.length, state.files.length === 1 ? "file" : "files"),
        stat(Object.keys(counts).length, "subjects"),
        stat(people.length || "—", "contributors"),
        stat(totalSize ? fmtSize(totalSize) : "—", "shared")),

      recent.length ? h("section", { class: "section" },
        h("div", { class: "section-head" }, h("h2", null, "Recently added"), h("a", { href: "#/recent" }, "See all →")),
        h("div", { class: "files grid" }, recent.map(card))) : null,

      h("section", { class: "section" },
        h("div", { class: "section-head" }, h("h2", null, "Browse by subject")),
        h("div", { class: "subjects" }, Object.keys(counts).sort().map((s) =>
          h("a", { class: "subject-tile", href: "#/subject/" + encodeURIComponent(s) },
            h("span", { class: "subject-name" }, pretty(s)),
            h("span", { class: "subject-count" }, counts[s] === 1 ? "1 file" : `${counts[s]} files`))))),

      h("section", { class: "section" },
        h("div", { class: "section-head" }, h("h2", null, "Study tools")),
        h("div", { class: "tiles" },
          tool("#/constants", "atom", "Physical constants", "CODATA 2022 values, one click to copy"),
          tool("#/converter", "swap", "Unit converter", "Energy, length, mass, temperature and more"),
          tool("#/resources", "book", "Resources", "HyperPhysics, PhET, MIT OCW, arXiv…"),
          tool("#/contributors", "users", "Contributors", "The students who share the most"))),

      state.source === "none" ? h("p", { class: "notice" }, "Couldn't load the file list. Check your connection or try again later.") : null
    );
  };

  VIEWS.browse = () => fileListView({
    title: "All files", desc: "Everything shared so far. Use the search box at the top to filter.",
    filter: () => true, empty: uploadEmpty()
  });

  VIEWS.subject = (r) => fileListView({
    title: pretty(r.arg), desc: null,
    filter: (f) => f.subject === r.arg, empty: uploadEmpty(r.arg),
    extra: h("a", { class: "btn primary", href: uploadUrl(r.arg), target: "_blank", rel: "noopener" }, icon("upload"), "Upload to " + pretty(r.arg))
  });

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

  VIEWS.contributors = () => {
    const people = contributorStats();
    const head = h("div", { class: "page-head" }, h("div", null, h("h1", null, "Contributors"),
      h("p", { class: "muted" }, "Thank you to everyone who shares their work! Ranked by number of files uploaded.")));
    if (!people.length) {
      return h("div", null, head, emptyState("No contributor data yet",
        state.source === "index" ? "Upload a file to get on the board!" : "Contributor names appear when the site is deployed by the GitHub Actions workflow (see the README)."));
    }
    const medal = ["🥇", "🥈", "🥉"];
    return h("div", null, head,
      h("div", { class: "table-wrap" }, h("table", { class: "table" },
        h("thead", null, h("tr", null, h("th", null, "#"), h("th", null, "Name"), h("th", { class: "num" }, "Uploads"), h("th", { class: "num" }, "Edits"), h("th", null, "Subjects"), h("th", null, "Last active"))),
        h("tbody", null, people.map((p, i) => h("tr", null,
          h("td", null, medal[i] || String(i + 1)),
          h("td", null, h("button", { class: "linkish", type: "button", title: "Show their files",
            onclick: () => { state.q = p.name.toLowerCase(); document.getElementById("search").value = p.name; location.hash = "#/browse"; } }, p.name)),
          h("td", { class: "num" }, String(p.uploads)),
          h("td", { class: "num" }, String(p.edits)),
          h("td", null, [...p.subjects].map(pretty).join(", ")),
          h("td", null, p.last ? timeAgo(p.last) : "")))))));
  };

  VIEWS.requests = () => {
    const list = h("div", { class: "requests" }, h("p", { class: "muted" }, "Loading requests…"));
    const newUrl = `${REPO}/issues/new?template=file-request.yml`;
    fetch(`${API}/issues?state=open&per_page=100`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((issues) => {
        const reqs = issues.filter((i) => !i.pull_request &&
          (i.labels.some((l) => l.name === "file-request") || /^\[request\]/i.test(i.title)));
        if (!reqs.length) { list.replaceChildren(emptyState("No open requests", "Looking for something? Ask for it!")); return; }
        list.replaceChildren(...reqs.map((i) => h("a", { class: "request", href: i.html_url, target: "_blank", rel: "noopener" },
          h("span", { class: "request-title" }, i.title.replace(/^\[request\]\s*/i, "")),
          h("span", { class: "request-meta" }, `#${i.number} · opened ${timeAgo(i.created_at)} by ${i.user.login}` +
            (i.comments ? ` · ${i.comments} comment${i.comments > 1 ? "s" : ""}` : "")))));
      })
      .catch(() => list.replaceChildren(emptyState("Couldn't load requests", "GitHub may be rate-limiting this browser. You can still see them on GitHub.",
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
      const tr = h("tr", { "data-search": `${sym} ${sub} ${name} ${unit}`.toLowerCase() },
        h("td", { class: "sym" }, h("var", null, sym, sub ? h("sub", null, sub) : null)),
        h("td", null, name, exact ? h("span", { class: "tag" }, "exact") : null),
        h("td", { class: "value" }, sciNode(v, value.replace(/^-|\.|e.*$/g, "").replace(/^0+/, "").length || 1)),
        h("td", null, unit),
        h("td", null, h("button", { class: "icon-btn", type: "button", title: `Copy ${value}`, "aria-label": `Copy value of ${name}`,
          onclick: (e) => copyText(value, e.currentTarget) }, icon("copy"))));
      return tr;
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
      tabs.replaceChildren(...cats.map((c) => h("button", { type: "button", role: "tab", class: "tab" + (c === cat ? " on" : ""), "aria-selected": String(c === cat),
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
        if (!isFinite(x)) { out.replaceChildren("Enter a number"); tbody.replaceChildren(); return; }
        const b = toBase(fu, x);
        out.replaceChildren(h("span", { class: "muted" }, `${input.value} ${fu[0]} = `), sciNode(fromBase(tu, b), 7), " ", tu[0]);
        tbody.replaceChildren(...units.map((u) => {
          const val = fromBase(u, b);
          return h("tr", null, h("td", { class: "value" }, sciNode(val, 7)), h("td", null, h("strong", null, u[0])), h("td", { class: "muted" }, u[1]),
            h("td", null, h("button", { class: "icon-btn", type: "button", title: "Copy", onclick: (e) => copyText(String(Number(val.toPrecision(10))), e.currentTarget) }, icon("copy"))));
        }));
      }
      const swap = h("button", { class: "icon-btn", type: "button", title: "Swap units", "aria-label": "Swap units",
        onclick: () => { const t = from.value; from.value = to.value; to.value = t; calc(); } }, icon("swap"));
      [input, from, to].forEach((el) => el.addEventListener("input", calc));
      panel.replaceChildren(
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
      h("p", { class: "muted" }, "Free websites and tools that physics students find useful."))),
    D.resources.map((g) => h("section", { class: "section" },
      h("h2", null, g.group),
      h("div", { class: "tiles" }, g.items.map(([name, url, text]) =>
        h("a", { class: "tile", href: url, target: "_blank", rel: "noopener" },
          h("span", { class: "tile-name" }, name, " ", icon("external")),
          h("span", { class: "tile-text" }, text)))))));

  VIEWS.contribute = () => {
    const counts = subjectCounts();
    const subjectSel = h("select", { class: "input", "aria-label": "Subject" }, Object.keys(counts).sort().map((s) => h("option", { value: s }, pretty(s))));
    const go = h("a", { class: "btn primary", target: "_blank", rel: "noopener" }, icon("upload"), "Upload to this subject");
    const sync = () => { go.href = uploadUrl(subjectSel.value); };
    subjectSel.addEventListener("change", sync);
    sync();
    const step = (n, title, ...body) => h("li", { class: "step" }, h("span", { class: "step-n" }, String(n)), h("div", null, h("h3", null, title), ...body));
    return h("div", { class: "prose" },
      h("div", { class: "page-head" }, h("div", null, h("h1", null, "How to contribute"),
        h("p", { class: "muted" }, "You only need a free GitHub account. No coding required."))),
      h("div", { class: "callout" }, h("p", null, h("strong", null, "Quick upload: "), "pick a subject and you'll go straight to GitHub's upload page."),
        h("div", { class: "row" }, subjectSel, go)),
      h("ol", { class: "steps" },
        step(1, "Open the subject folder", h("p", null, "Use the button above, or open the ", h("a", { href: `${REPO}/tree/${C.branch}/files`, target: "_blank", rel: "noopener" }, "files/ folder"), " on GitHub and choose a subject.")),
        step(2, "Upload your file", h("p", null, "Click ", h("strong", null, "Add file → Upload files"), " and drag your file in. Up to 25 MB per file in the browser.")),
        step(3, "Describe and submit", h("p", null, "Write a short message like ", h("code", null, "Add Griffiths ch. 4 solutions"), ". Without write access, GitHub opens a ", h("strong", null, "pull request"), " for you. Click ", h("strong", null, "Propose changes"), " and then ", h("strong", null, "Create pull request"), ".")),
        step(4, "It appears on the site", h("p", null, "Once your change is merged, the site rebuilds automatically. Your file shows up within a few minutes, with your name on the Contributors page."))),
      h("h2", null, "Naming your files"),
      h("p", null, "Use ", h("code", null, "Topic-What-it-is_YourName.pdf"), ", e.g. ", h("code", null, "Griffiths-QM-Ch2-Solutions_AliceW.pdf"), ". Hyphens and underscores show as spaces on the site. Make sub-folders for a course, like ", h("code", null, "files/Quantum-Mechanics/PHYS301/"), "."),
      h("h2", null, "Rules"),
      h("ul", null,
        h("li", null, "Share your own work, or material that is clearly free to share."),
        h("li", null, "Follow your university's academic-integrity rules. No solutions to open assignments or private exams."),
        h("li", null, "Remove personal information such as student IDs."),
        h("li", null, "Everything here is public, and Git keeps old versions.")),
      h("p", null, h("a", { href: `${REPO}#readme`, target: "_blank", rel: "noopener" }, "Read the full guide in the README →")));
  };

  VIEWS.notfound = () => emptyState("Page not found", "That page doesn't exist.", h("a", { class: "btn", href: "#/" }, "Go home"));

  // ---------- start ----------

  async function init() {
    document.getElementById("brand-name").textContent = C.title;
    document.getElementById("upload-btn").href = uploadUrl();
    document.getElementById("upload-btn").replaceChildren(icon("upload"), h("span", null, "Upload"));
    document.getElementById("menu-btn").replaceChildren(icon("menu"));
    document.querySelector(".search-icon").replaceWith(icon("search"));

    let theme = store.get("theme", "auto");
    applyTheme(theme);
    document.getElementById("theme-toggle").addEventListener("click", () => {
      const i = THEMES.findIndex((x) => x[0] === theme);
      theme = THEMES[(i + 1) % THEMES.length][0];
      store.set("theme", theme);
      applyTheme(theme);
    });

    document.getElementById("menu-btn").addEventListener("click", () => sidebar().classList.contains("open") ? closeSidebar() : openSidebar());
    document.getElementById("backdrop").addEventListener("click", closeSidebar);

    const search = document.getElementById("search");
    search.addEventListener("input", () => {
      state.q = search.value.trim().toLowerCase();
      const name = parseRoute().name;
      if (state.refresh && ["browse", "subject", "favorites", "recent", "file"].includes(name)) state.refresh();
      else location.hash = "#/browse";
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) { e.preventDefault(); search.focus(); }
      if (e.key === "Escape") closeSidebar();
    });

    document.getElementById("view").replaceChildren(h("p", { class: "muted loading" }, "Loading files…"));
    const data = await loadFiles();
    state.files = data.files.filter((f) => !isHidden(f.path)).map(parseFile);
    state.subjects = data.subjects;
    state.source = data.source;
    state.generated = data.generated;
    state.hasDates = state.files.some((f) => f.added);

    buildNav();
    window.addEventListener("hashchange", render);
    render();
  }

  init();
})();
