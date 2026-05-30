import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const html = readFileSync("en/services/index.html", "utf8");
const d = new JSDOM(html).window.document;

const out = {
  lang: d.documentElement.getAttribute("lang"),
  h1: d.querySelectorAll("h1").length,
  h1text: d.querySelector("h1")?.textContent.trim(),
  nav: d.querySelectorAll("nav#navbar").length,
  footer: d.querySelectorAll("footer").length,
  canonical: d.querySelector("link[rel=canonical]").href,
  hreflang: [...d.querySelectorAll("link[rel=alternate][hreflang]")].map(
    (l) => `${l.hreflang}=${l.href}`,
  ),
  ogUrl: d.querySelector('meta[property="og:url"]').content,
  ogLocale: d.querySelector('meta[property="og:locale"]').content,
  ogAlt: d.querySelector('meta[property="og:locale:alternate"]').content,
  twitterCard: d.querySelector('meta[name="twitter:card"]').content,
  title: d.querySelector("title").textContent.trim(),
  titleLen: d.querySelector("title").textContent.trim().length,
  descLen: d.querySelector('meta[name=description]').content.length,
  processId: !!d.querySelector("#process"),
  switcher: [...d.querySelectorAll(".lang-option")].map(
    (a) =>
      `${a.dataset.lang}:${a.getAttribute("href")}${a.hasAttribute("aria-current") ? "(active)" : ""}`,
  ),
};

// Ordering: lang-detect, then theme-init, then first stylesheet
const idxLangDetect = html.indexOf("LANG_AUTO_REDIRECT");
const idxTheme = html.indexOf("light-mode");
const idxFirstCss = html.indexOf('<link rel="stylesheet"');
out.order_langdetect_before_theme = idxLangDetect < idxTheme;
out.order_theme_before_css = idxTheme < idxFirstCss;

// scripts defer with v8
out.scripts = [...d.querySelectorAll("script[src]")].map((s) => s.getAttribute("src"));
out.heroCssPresent = html.includes("hero.css");

console.log(JSON.stringify(out, null, 2));
