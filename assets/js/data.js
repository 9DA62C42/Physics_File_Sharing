// Reference data for the Constants, Converter and Resources pages.
window.PHYS_DATA = (function () {
  var h = 6.62607015e-34, c = 299792458, eV = 1.602176634e-19, kB = 1.380649e-23;
  var hc = h * c;

  // [symbol, subscript, name, value, unit, exact]. Values: CODATA 2022.
  var constants = [
    ["c", "", "Speed of light in vacuum", "299792458", "m s⁻¹", true],
    ["h", "", "Planck constant", "6.62607015e-34", "J s", true],
    ["ħ", "", "Reduced Planck constant", "1.054571817e-34", "J s", true],
    ["e", "", "Elementary charge", "1.602176634e-19", "C", true],
    ["k", "B", "Boltzmann constant", "1.380649e-23", "J K⁻¹", true],
    ["N", "A", "Avogadro constant", "6.02214076e23", "mol⁻¹", true],
    ["R", "", "Molar gas constant", "8.314462618", "J mol⁻¹ K⁻¹", true],
    ["σ", "", "Stefan–Boltzmann constant", "5.670374419e-8", "W m⁻² K⁻⁴", true],
    ["b", "", "Wien displacement constant", "2.897771955e-3", "m K", true],
    ["G", "", "Newtonian constant of gravitation", "6.67430e-11", "m³ kg⁻¹ s⁻²", false],
    ["g", "n", "Standard acceleration of gravity", "9.80665", "m s⁻²", true],
    ["ε", "0", "Vacuum electric permittivity", "8.8541878188e-12", "F m⁻¹", false],
    ["μ", "0", "Vacuum magnetic permeability", "1.25663706127e-6", "N A⁻²", false],
    ["α", "", "Fine-structure constant", "7.2973525643e-3", "", false],
    ["α⁻¹", "", "Inverse fine-structure constant", "137.035999177", "", false],
    ["m", "e", "Electron mass", "9.1093837139e-31", "kg", false],
    ["m", "p", "Proton mass", "1.67262192595e-27", "kg", false],
    ["m", "n", "Neutron mass", "1.67492750056e-27", "kg", false],
    ["m", "u", "Atomic mass constant (1 u)", "1.66053906892e-27", "kg", false],
    ["m", "e", "Electron mass energy equivalent", "0.51099895069", "MeV", false],
    ["m", "p", "Proton mass energy equivalent", "938.27208943", "MeV", false],
    ["a", "0", "Bohr radius", "5.29177210544e-11", "m", false],
    ["R", "∞", "Rydberg constant", "10973731.568157", "m⁻¹", false],
    ["E", "h", "Hartree energy", "4.3597447222060e-18", "J", false],
    ["μ", "B", "Bohr magneton", "9.2740100657e-24", "J T⁻¹", false],
    ["μ", "N", "Nuclear magneton", "5.0507837393e-27", "J T⁻¹", false],
    ["λ", "C", "Compton wavelength (electron)", "2.42631023538e-12", "m", false],
    ["r", "e", "Classical electron radius", "2.8179403205e-15", "m", false],
    ["F", "", "Faraday constant", "96485.33212", "C mol⁻¹", true],
    ["Φ", "0", "Magnetic flux quantum", "2.067833848e-15", "Wb", true],
    ["eV", "", "Electron volt", "1.602176634e-19", "J", true]
  ];

  // Each unit: [symbol, name, factor-to-base] or [symbol, name, toBase(fn), fromBase(fn)].
  var units = {
    Energy: { base: "J", units: [
      ["J", "joule", 1], ["kJ", "kilojoule", 1e3], ["eV", "electron volt", eV],
      ["meV", "millielectron volt", eV * 1e-3], ["keV", "kiloelectron volt", eV * 1e3],
      ["MeV", "megaelectron volt", eV * 1e6], ["GeV", "gigaelectron volt", eV * 1e9],
      ["erg", "erg", 1e-7], ["cal", "calorie (thermochemical)", 4.184], ["kcal", "kilocalorie", 4184],
      ["kWh", "kilowatt hour", 3.6e6], ["Eₕ", "hartree", 4.3597447222060e-18],
      ["Ry", "rydberg", 2.1798723611030e-18],
      ["cm⁻¹", "wavenumber (E = hcν̃)", hc * 100], ["Hz", "frequency (E = hν)", h],
      ["K", "temperature (E = k_B T)", kB],
      ["nm", "photon wavelength (E = hc/λ)", function (x) { return hc / (x * 1e-9); }, function (E) { return hc / E / 1e-9; }]
    ] },
    Length: { base: "m", units: [
      ["m", "metre", 1], ["km", "kilometre", 1e3], ["cm", "centimetre", 1e-2], ["mm", "millimetre", 1e-3],
      ["μm", "micrometre", 1e-6], ["nm", "nanometre", 1e-9], ["Å", "ångström", 1e-10], ["fm", "femtometre (fermi)", 1e-15],
      ["a₀", "Bohr radius", 5.29177210544e-11], ["in", "inch", 0.0254], ["ft", "foot", 0.3048], ["mi", "mile", 1609.344],
      ["AU", "astronomical unit", 149597870700], ["ly", "light year", 9.4607304725808e15], ["pc", "parsec", 3.0856775814913673e16]
    ] },
    Mass: { base: "kg", units: [
      ["kg", "kilogram", 1], ["g", "gram", 1e-3], ["mg", "milligram", 1e-6], ["t", "tonne", 1e3],
      ["u", "atomic mass unit", 1.66053906892e-27], ["MeV/c²", "MeV per c²", eV * 1e6 / (c * c)],
      ["GeV/c²", "GeV per c²", eV * 1e9 / (c * c)], ["mₑ", "electron mass", 9.1093837139e-31],
      ["mₚ", "proton mass", 1.67262192595e-27], ["lb", "pound", 0.45359237], ["oz", "ounce", 0.028349523125],
      ["M⊕", "Earth mass", 5.9722e24], ["M☉", "solar mass", 1.98841e30]
    ] },
    Time: { base: "s", units: [
      ["s", "second", 1], ["ms", "millisecond", 1e-3], ["μs", "microsecond", 1e-6], ["ns", "nanosecond", 1e-9],
      ["fs", "femtosecond", 1e-15], ["min", "minute", 60], ["h", "hour", 3600], ["d", "day", 86400],
      ["wk", "week", 604800], ["yr", "Julian year", 31557600]
    ] },
    Temperature: { base: "K", units: [
      ["K", "kelvin", 1], ["°C", "degree Celsius", function (x) { return x + 273.15; }, function (k) { return k - 273.15; }],
      ["°F", "degree Fahrenheit", function (x) { return (x - 32) * 5 / 9 + 273.15; }, function (k) { return (k - 273.15) * 9 / 5 + 32; }],
      ["°R", "degree Rankine", 5 / 9],
      ["eV", "electron volt (T = E/k_B)", eV / kB]
    ] },
    Pressure: { base: "Pa", units: [
      ["Pa", "pascal", 1], ["kPa", "kilopascal", 1e3], ["MPa", "megapascal", 1e6], ["bar", "bar", 1e5],
      ["mbar", "millibar", 100], ["atm", "standard atmosphere", 101325], ["Torr", "torr", 101325 / 760],
      ["mmHg", "millimetre of mercury", 133.322387415], ["psi", "pound per square inch", 6894.757293168]
    ] },
    Power: { base: "W", units: [
      ["W", "watt", 1], ["mW", "milliwatt", 1e-3], ["kW", "kilowatt", 1e3], ["MW", "megawatt", 1e6],
      ["hp", "horsepower (mechanical)", 745.69987158227022], ["erg/s", "erg per second", 1e-7],
      ["L☉", "solar luminosity", 3.828e26]
    ] },
    "Magnetic field": { base: "T", units: [
      ["T", "tesla", 1], ["mT", "millitesla", 1e-3], ["μT", "microtesla", 1e-6], ["G", "gauss", 1e-4], ["nT", "nanotesla", 1e-9]
    ] },
    Angle: { base: "rad", units: [
      ["rad", "radian", 1], ["mrad", "milliradian", 1e-3], ["°", "degree", Math.PI / 180],
      ["′", "arcminute", Math.PI / 10800], ["″", "arcsecond", Math.PI / 648000], ["rev", "revolution", 2 * Math.PI]
    ] }
  };

  var resources = [
    { group: "Learn & review", items: [
      ["HyperPhysics", "http://hyperphysics.phy-astr.gsu.edu/hbase/hframe.html", "Concept maps and short summary pages across all of physics (Georgia State University)."],
      ["The Feynman Lectures on Physics", "https://www.feynmanlectures.caltech.edu/", "The full three volumes, free to read online (Caltech)."],
      ["MIT OpenCourseWare – Physics", "https://ocw.mit.edu/search/?d=Physics", "Lecture notes, problem sets with solutions and exams from MIT courses."],
      ["LibreTexts Physics", "https://phys.libretexts.org/", "Free, open textbooks from intro to graduate level."],
      ["OpenStax", "https://openstax.org/subjects/science", "Free peer-reviewed university physics textbooks."],
      ["The Physics Classroom", "https://www.physicsclassroom.com/", "Clear tutorials and practice for introductory physics."]
    ] },
    { group: "Simulate & compute", items: [
      ["PhET Simulations", "https://phet.colorado.edu/", "Interactive physics simulations that run in the browser (CU Boulder)."],
      ["Wolfram|Alpha", "https://www.wolframalpha.com/", "Symbolic maths, integrals, unit-aware calculations."],
      ["Desmos", "https://www.desmos.com/calculator", "Fast graphing calculator for plotting functions and data."],
      ["Google Colab", "https://colab.research.google.com/", "Run Python / Jupyter notebooks in the browser for free."],
      ["Overleaf", "https://www.overleaf.com/", "Write and share LaTeX documents online."]
    ] },
    { group: "Data & reference", items: [
      ["NIST Fundamental Physical Constants", "https://physics.nist.gov/cuu/Constants/", "Official CODATA values of the physical constants."],
      ["NIST Atomic Spectra Database", "https://www.nist.gov/pml/atomic-spectra-database", "Energy levels and spectral lines of atoms and ions."],
      ["Particle Data Group", "https://pdg.lbl.gov/", "The Review of Particle Physics: masses, lifetimes, cross sections."],
      ["ComPADRE", "https://www.compadre.org/", "A curated library of physics and astronomy education resources."]
    ] },
    { group: "Research & community", items: [
      ["arXiv", "https://arxiv.org/", "Open-access preprints in physics, maths and more."],
      ["NASA ADS", "https://ui.adsabs.harvard.edu/", "Search engine for astronomy and physics literature."],
      ["Physics Forums", "https://www.physicsforums.com/", "Ask and answer physics questions with a large community."],
      ["Physics Stack Exchange", "https://physics.stackexchange.com/", "Q&A site for physics researchers and students."]
    ] }
  ];

  return { constants: constants, units: units, resources: resources };
})();
