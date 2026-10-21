// Renders the file list that Jekyll embeds in index.html (window.SHARED_FILES).
// Folder layout: files/<Subject>/[optional sub-folders/]<file>
(function () {
  "use strict";

  var TYPES = {
    pdf: "PDF", doc: "Word", docx: "Word", odt: "Doc", txt: "Text", md: "Text",
    tex: "LaTeX", bib: "LaTeX", ppt: "Slides", pptx: "Slides", key: "Slides",
    xls: "Sheet", xlsx: "Sheet", csv: "Data", json: "Data", dat: "Data",
    ipynb: "Notebook", py: "Code", m: "Code", jl: "Code", c: "Code", cpp: "Code", f90: "Code",
    png: "Image", jpg: "Image", jpeg: "Image", gif: "Image", svg: "Image",
    zip: "Archive", tar: "Archive", gz: "Archive"
  };

  function pretty(s) {
    return s.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  }

  function parse(path) {
    var parts = path.split("/").filter(Boolean); // ["files", subject, ..., name]
    var name = parts[parts.length - 1];
    var dot = name.lastIndexOf(".");
    var ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
    return {
      href: parts.map(encodeURIComponent).join("/"), // relative, works under any baseurl
      name: name,
      title: pretty(dot > 0 ? name.slice(0, dot) : name),
      ext: ext,
      type: TYPES[ext] || (ext ? ext.toUpperCase() : "File"),
      subject: parts.length > 2 ? parts[1] : "Other",
      topic: parts.slice(2, -1).map(pretty).join(" / ")
    };
  }

  var files = (window.SHARED_FILES || [])
    .filter(function (p) { return p.indexOf("/files/") === 0; })
    .map(parse)
    .sort(function (a, b) { return a.title.localeCompare(b.title); });

  var subjects = {};
  files.forEach(function (f) { subjects[f.subject] = (subjects[f.subject] || 0) + 1; });

  var state = { q: "", subject: "All" };
  var searchEl = document.getElementById("search");
  var chipsEl = document.getElementById("subjects");
  var resultsEl = document.getElementById("results");
  var summaryEl = document.getElementById("summary");

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function renderChips() {
    chipsEl.innerHTML = "";
    var names = ["All"].concat(Object.keys(subjects).sort());
    names.forEach(function (s) {
      var b = el("button", "chip" + (state.subject === s ? " active" : ""));
      b.type = "button";
      b.setAttribute("aria-pressed", state.subject === s);
      b.appendChild(document.createTextNode(s === "All" ? "All" : pretty(s)));
      b.appendChild(el("span", "count", String(s === "All" ? files.length : subjects[s])));
      b.addEventListener("click", function () { state.subject = s; update(); });
      chipsEl.appendChild(b);
    });
  }

  function matches(f) {
    if (state.subject !== "All" && f.subject !== state.subject) return false;
    if (!state.q) return true;
    var hay = (f.name + " " + f.title + " " + f.subject + " " + f.topic + " " + f.type).toLowerCase();
    return state.q.split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  function card(f) {
    var c = el("article", "card");
    var top = el("div", "card-top");
    top.appendChild(el("span", "badge t-" + f.type.toLowerCase(), f.type));
    top.appendChild(el("span", "subject", pretty(f.subject)));
    c.appendChild(top);
    c.appendChild(el("h3", null, f.title));
    if (f.topic) c.appendChild(el("p", "topic", f.topic));
    c.appendChild(el("p", "filename", f.name));
    var actions = el("div", "card-actions");
    var open = el("a", "btn small primary", "Open");
    open.href = f.href; open.target = "_blank"; open.rel = "noopener";
    var dl = el("a", "btn small", "Download");
    dl.href = f.href; dl.setAttribute("download", f.name);
    actions.appendChild(open);
    actions.appendChild(dl);
    c.appendChild(actions);
    return c;
  }

  function renderResults() {
    resultsEl.innerHTML = "";
    var shown = files.filter(matches);

    if (!files.length) {
      summaryEl.textContent = "";
      var empty = el("div", "empty");
      empty.appendChild(el("p", null, "No files have been shared yet. Be the first!"));
      var a = el("a", "btn primary", "Upload a file");
      a.href = window.REPO.url + "/upload/" + window.REPO.branch + "/files";
      a.target = "_blank"; a.rel = "noopener";
      empty.appendChild(a);
      resultsEl.appendChild(empty);
      return;
    }

    summaryEl.textContent = shown.length + " of " + files.length + " files";
    if (!shown.length) {
      resultsEl.appendChild(el("div", "empty", "Nothing matches your search."));
      return;
    }

    // Group by subject so the page reads like a library shelf.
    var groups = {};
    shown.forEach(function (f) { (groups[f.subject] = groups[f.subject] || []).push(f); });
    Object.keys(groups).sort().forEach(function (s) {
      var sec = el("section", "group");
      sec.appendChild(el("h2", null, pretty(s)));
      var grid = el("div", "grid");
      groups[s].forEach(function (f) { grid.appendChild(card(f)); });
      sec.appendChild(grid);
      resultsEl.appendChild(sec);
    });
  }

  function update() {
    renderChips();
    renderResults();
  }

  searchEl.addEventListener("input", function () {
    state.q = searchEl.value.trim().toLowerCase();
    renderResults();
  });

  update();
})();
