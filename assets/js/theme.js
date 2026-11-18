/* Apply saved preferences before rendering. Storage can be unavailable. */
(() => {
  let theme = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  let direction = "ltr";
  try {
    const saved = localStorage.getItem("gv-theme");
    if (saved === "dark" || saved === "light") theme = saved;
    if (localStorage.getItem("gv-direction") === "rtl") direction = "rtl";
  } catch {}
  document.documentElement.dataset.theme = theme;
  document.documentElement.dir = direction;
})();
