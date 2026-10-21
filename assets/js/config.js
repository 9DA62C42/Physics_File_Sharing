// Site settings. Edit these if you fork or rename the repository.
window.SITE_CONFIG = {
  title: "Physics File Sharing",
  description: "Notes, problem sets, formula sheets and lab reports shared by physics students.",
  owner: "9da62c42",
  repo: "physics_file_sharing",
  branch: "main"
};

// On <owner>.github.io/<repo>/ the repository is detected from the address.
(function (c) {
  var host = location.hostname;
  if (/\.github\.io$/i.test(host)) {
    c.owner = host.split(".")[0];
    c.repo = location.pathname.split("/")[1] || host;
  }
})(window.SITE_CONFIG);
