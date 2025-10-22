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

  //
  // --- CAMBIO IMPORTANTE ---
  //
  // Después de incluir todo el HTML, AHORA SÍ, inicializa todo el JS.
  if (typeof initAll === 'function') {
    initAll(); 
  } else {
    console.error("Error: La función initAll() no se encontró. Asegúrate de que script.js esté cargado ANTES que include.js");
  }
}

document.addEventListener('DOMContentLoaded', includeHTML);