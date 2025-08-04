// include.js
async function includeHTML() {
  const mapping = [
    { selector: '[data-include="header"]', path: 'partials/header.html' },
    { selector: '[data-include="footer"]', path: 'partials/footer.html' }
  ];

  await Promise.all(mapping.map(async ({ selector, path }) => {
    const container = document.querySelector(selector);
    if (!container) return;
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`Fallo cargando ${path}`);
      container.innerHTML = await res.text();
    } catch (e) {
      console.warn(e);
    }
  }));

  // Después de incluir, inicializa lo que depende del DOM insertado
  if (typeof setActiveNavFromPath === 'function') setActiveNavFromPath();
  if (typeof initMobileMenu === 'function') initMobileMenu();
}
document.addEventListener('DOMContentLoaded', includeHTML);
