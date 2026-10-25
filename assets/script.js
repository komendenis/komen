(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var GH = "https://github.com/komendenis/";
  // Set this to the address that should receive contact-form messages.
  var CONTACT_EMAIL = "you@example.com";

  // Each project links to its notebook on GitHub.
  var projects = [
    {
      title: "Ice Cream Sales vs Temperature",
      icon: "🍦",
      category: "regression",
      algo: "Linear Regression",
      description: "Explores how daily temperature drives ice cream profits, checks for nulls and duplicates, and fits a linear model to predict sales from temperature.",
      tags: ["pandas", "Matplotlib", "scikit-learn"],
      url: GH + "ICE-CREAM/blob/main/ICE%20CREAM%20EDA%20MACHINE%20EDA.ipynb"
    },
    {
      title: "Medical Insurance Cost Prediction",
      icon: "🏥",
      category: "regression",
      algo: "Support Vector Regression",
      description: "Predicts insurance charges from age, BMI, smoking status and region. Encodes categorical features, scales inputs, and scores the model with MSE and R².",
      tags: ["Seaborn", "LabelEncoder", "StandardScaler"],
      url: GH + "ML/blob/main/MEDICAL%20INSURANCE%20EDA.ipynb"
    },
    {
      title: "Breast Cancer Diagnosis",
      icon: "🔬",
      category: "classification",
      algo: "Decision Tree",
      description: "Classifies tumours as malignant or benign from cell-nucleus measurements, with KDE plots per class, a stratified split and a confusion matrix.",
      tags: ["Seaborn", "Stratified split", "Confusion matrix"],
      url: GH + "ML/blob/main/komen256-Copy1%20(1).ipynb"
    },
    {
      title: "Telegram Ham or Spam",
      icon: "✉️",
      category: "nlp",
      algo: "Multinomial Naive Bayes",
      description: "Separates spam from legitimate Telegram messages by turning text into token counts with a bag-of-words vectoriser, then training a Naive Bayes classifier.",
      tags: ["NLP", "CountVectorizer", "scikit-learn"],
      url: GH + "ML/blob/main/Telegram%20Ham%20or%20Spam.ipynb"
    },
    {
      title: "War Survival Dataset",
      icon: "🛡️",
      category: "data",
      algo: "Synthetic data · NumPy",
      description: "Generates a 1,000-person synthetic dataset modelling survival factors in wartime (food and water supply, shelter, and psychological support) for later analysis.",
      tags: ["NumPy", "pandas", "Data design"],
      url: GH + "War-Effects/blob/main/War%20Survival-Copy1.ipynb"
    }
  ];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // ---- Render projects ----
  var grid = document.getElementById("project-grid");
  projects.forEach(function (p) {
    var card = el("article", "card reveal");
    card.dataset.category = p.category;
    card.appendChild(el("div", "card__icon", p.icon));
    card.appendChild(el("h3", null, p.title));
    var tags = el("ul", "tags");
    p.tags.forEach(function (t) { tags.appendChild(el("li", null, t)); });
    card.appendChild(tags);
    card.appendChild(el("p", null, p.description));
    var meta = el("div", "card__meta");
    meta.appendChild(el("span", "card__algo", p.algo));
    var link = el("a", "card__link", "Notebook ↗");
    link.href = p.url;
    link.target = "_blank";
    link.rel = "noopener";
    link.setAttribute("aria-label", "Open " + p.title + " notebook on GitHub");
    meta.appendChild(link);
    card.appendChild(meta);
    grid.appendChild(card);
  });

  // ---- Filters ----
  var chips = document.querySelectorAll(".chip");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.dataset.filter;
      chips.forEach(function (c) {
        c.classList.toggle("is-active", c === chip);
        c.setAttribute("aria-pressed", c === chip ? "true" : "false");
      });
      grid.querySelectorAll(".card").forEach(function (card) {
        card.hidden = !(f === "all" || card.dataset.category === f);
      });
    });
  });

  // ---- Theme toggle (persisted per viewer) ----
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  if (stored === "light" || stored === "dark") {
    root.dataset.theme = stored;
  } else {
    root.dataset.theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.getElementById("theme-toggle").addEventListener("click", function () {
    var next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  // ---- Mobile menu ----
  var menuBtn = document.getElementById("menu-toggle");
  var links = document.getElementById("nav-links");
  function setMenu(open) {
    links.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  menuBtn.addEventListener("click", function () { setMenu(!links.classList.contains("is-open")); });
  links.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });

  // ---- Active nav link on scroll ----
  var navLinks = links.querySelectorAll("a");
  var sections = Array.prototype.map.call(navLinks, function (a) {
    return document.querySelector(a.getAttribute("href"));
  });

  // ---- Count-up stats ----
  function countUp(node) {
    var target = parseInt(node.dataset.count, 10);
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var t = Math.min((ts - start) / 900, 1);
      node.textContent = Math.round(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        entry.target.querySelectorAll("[data-count]").forEach(countUp);
        revealObs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(function (n) { revealObs.observe(n); });

    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { if (s) navObs.observe(s); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (n) { n.classList.add("is-visible"); });
    document.querySelectorAll("[data-count]").forEach(function (n) { n.textContent = n.dataset.count; });
  }

  // ---- Contact form: validates, then opens the visitor's mail client ----
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    Array.prototype.forEach.call(form.elements, function (f) {
      if (!f.name) return;
      var valid = f.checkValidity() && f.value.trim() !== "";
      f.classList.toggle("is-invalid", !valid);
      if (!valid) ok = false;
    });
    if (!ok) {
      status.textContent = "Please fill in every field with a valid email.";
      return;
    }
    var f = form.elements;
    var name = f.namedItem("name").value.trim();
    var subject = encodeURIComponent("Portfolio enquiry from " + name);
    var body = encodeURIComponent(f.namedItem("message").value.trim() + "\n\n— " + name + " (" + f.namedItem("email").value.trim() + ")");
    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
    status.textContent = "Your email app should open with this message. If it doesn't, write to " + CONTACT_EMAIL + ".";
    form.reset();
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---- Installable app (PWA) ----
  if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  var installBtn = document.getElementById("install-btn");
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.hidden = false;
  });
  installBtn.addEventListener("click", function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () {
      deferredPrompt = null;
      installBtn.hidden = true;
    });
  });
  window.addEventListener("appinstalled", function () { installBtn.hidden = true; });
})();
