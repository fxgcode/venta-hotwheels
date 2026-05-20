// ===== CARRITO COMPARTIDO (localStorage) =====
const CLAVE = 'carrito_fxg';

function cargarCarrito() {
  try { return JSON.parse(sessionStorage.getItem(CLAVE)) || []; }
  catch { return []; }
}

function guardarCarrito(c) {
  sessionStorage.setItem(CLAVE, JSON.stringify(c));
}

const carrito = cargarCarrito();

// ===== AGREGAR / ELIMINAR =====
function agregar(nombre, precio) {
  const existente = carrito.find(i => i.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  guardarCarrito(carrito);
  mostrar();
  document.getElementById('fab-wrap').style.display = 'block';

  // Animar botón
  const btn = event.target;
  const original = btn.textContent;
  btn.textContent = '✔ Agregado';
  btn.style.background = 'linear-gradient(135deg,#2ecc71,#27ae60)';
  setTimeout(() => { btn.textContent = original; btn.style.background = ''; }, 900);
}

function eliminar(index) {
  carrito.splice(index, 1);
  guardarCarrito(carrito);
  mostrar();
  if (carrito.length === 0) {
    document.getElementById('fab-wrap').style.display = 'none';
    document.getElementById('carrito-panel').classList.remove('visible');
  }
}

// ===== MOSTRAR CARRITO =====
function mostrar() {
  const lista   = document.getElementById('lista-carrito');
  const vacio   = document.getElementById('carrito-vacio');
  const totalEl = document.getElementById('total-carrito');
  const badge   = document.getElementById('fab-badge');

  lista.innerHTML = '';
  let total = 0;
  let totalItems = 0;

  carrito.forEach((item, i) => {
    total      += item.precio * item.cantidad;
    totalItems += item.cantidad;
    const li = document.createElement('li');
    li.innerHTML = `
      <span style="background:#1a1a2e;color:#fff;font-size:0.72rem;font-weight:700;
        width:24px;height:24px;border-radius:6px;display:inline-flex;
        align-items:center;justify-content:center;flex-shrink:0">${item.cantidad}</span>
      <span style="flex:1;font-weight:500;color:#222;font-size:0.84rem;
        overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.nombre}</span>
      <span style="font-weight:700;color:#e63946;white-space:nowrap">
        $${(item.precio * item.cantidad).toLocaleString('es-CO')}</span>
      <button onclick="eliminar(${i})" style="background:none;border:none;color:#bbb;
        cursor:pointer;font-size:0.85rem;padding:2px 6px;border-radius:4px;"
        onmouseover="this.style.color='#e63946'" onmouseout="this.style.color='#bbb'">✕</button>
    `;
    lista.appendChild(li);
  });

  vacio.classList.toggle('visible', carrito.length === 0);
  totalEl.textContent = `Total: $${total.toLocaleString('es-CO')}`;
  badge.textContent   = totalItems;
}

// ===== CARRITO PANEL =====
function toggleCarrito() {
  document.getElementById('carrito-panel').classList.toggle('visible');
}

// Cerrar panel al hacer clic fuera
document.addEventListener('click', e => {
  const panel = document.getElementById('carrito-panel');
  const fab   = document.querySelector('.fab-carrito');
  if (panel && fab &&
      panel.classList.contains('visible') &&
      !panel.contains(e.target) &&
      !fab.contains(e.target)) {
    panel.classList.remove('visible');
  }
});

// ===== MODAL DATOS =====
function enviarPedidoMenu() {
  if (carrito.length === 0) return;
  document.getElementById('carrito-panel').classList.remove('visible');
  document.getElementById('modal-overlay').classList.add('visible');
  document.getElementById('modal-pedido').classList.add('visible');
  document.getElementById('campo-nombre').focus();
}

function cerrarModal() {
  document.getElementById('modal-overlay').classList.remove('visible');
  document.getElementById('modal-pedido').classList.remove('visible');
}

function confirmarPedido() {
  const nombre = document.getElementById('campo-nombre').value.trim();
  const dir    = document.getElementById('campo-dir').value.trim();
  const barrio = document.getElementById('campo-barrio').value.trim();

  if (!nombre) { document.getElementById('campo-nombre').focus(); return; }
  if (!dir)    { document.getElementById('campo-dir').focus();    return; }
  if (!barrio) { document.getElementById('campo-barrio').focus(); return; }

  let total = 0;
  let mensaje = `¡Hola! Quiero hacer el siguiente pedido:\n\n`;
  mensaje += `*Nombre:* ${nombre}\n`;
  mensaje += `*Dirección:* ${dir}\n`;
  mensaje += `*Barrio:* ${barrio}\n\n`;
  mensaje += `*Pedido:*\n`;

  carrito.forEach(item => {
    mensaje += `▪ ${item.cantidad}x ${item.nombre} → $${(item.precio * item.cantidad).toLocaleString('es-CO')}\n`;
    total += item.precio * item.cantidad;
  });

  mensaje += `\n *Total: $${total.toLocaleString('es-CO')}*\n\n¡Gracias!`;

  cerrarModal();
  window.open(`https://wa.me/573159745293?text=${encodeURIComponent(mensaje)}`, '_blank');
}

// ===== INICIALIZAR =====
mostrar();
if (carrito.length > 0) {
  document.getElementById('fab-wrap').style.display = 'block';
}

