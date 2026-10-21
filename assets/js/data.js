// Reference data for the Resources page (Study tools).
window.STUDY_DATA = (function () {
  var resources = [
    { group: "Learn & review", items: [
      ["OpenStax", "https://openstax.org/subjects", "Free, peer-reviewed university textbooks in maths, science, business and more."],
      ["MIT OpenCourseWare", "https://ocw.mit.edu/", "Lecture notes, problem sets with solutions and exams from MIT courses."],
      ["LibreTexts", "https://libretexts.org/", "Open textbooks for almost every subject, from intro to graduate level."],
      ["Khan Academy", "https://www.khanacademy.org/", "Short videos and practice for maths, science and computing."]
    ] },
    { group: "Maths & computing", items: [
      ["Wolfram|Alpha", "https://www.wolframalpha.com/", "Symbolic maths, integrals, unit-aware calculations."],
      ["Desmos", "https://www.desmos.com/calculator", "Fast graphing calculator for plotting functions and data."],
      ["GeoGebra", "https://www.geogebra.org/calculator", "Geometry, algebra, 3D graphs and statistics in the browser."],
      ["Google Colab", "https://colab.research.google.com/", "Run Python / Jupyter notebooks in the browser for free."]
    ] },
    { group: "Writing & research", items: [
      ["Overleaf", "https://www.overleaf.com/", "Write and share LaTeX documents online."],
      ["Google Scholar", "https://scholar.google.com/", "Search papers, books and theses across all fields."],
      ["arXiv", "https://arxiv.org/", "Open-access preprints in physics, maths, computer science and more."],
      ["Zotero", "https://www.zotero.org/", "Free tool to collect, organise and cite your sources."]
    ] },
    { group: "Physics", items: [
      ["HyperPhysics", "http://hyperphysics.phy-astr.gsu.edu/hbase/hframe.html", "Concept maps and short summary pages across all of physics (Georgia State University)."],
      ["PhET Simulations", "https://phet.colorado.edu/", "Interactive physics simulations that run in the browser (CU Boulder)."],
      ["The Feynman Lectures on Physics", "https://www.feynmanlectures.caltech.edu/", "The full three volumes, free to read online (Caltech)."],
      ["NIST Physical Constants", "https://physics.nist.gov/cuu/Constants/", "Official CODATA values of the physical constants."]
    ] }
  ];

  return { resources: resources };
})();
