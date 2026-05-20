// =====  CARRITO COMPARTIDO (localStrorage)  =====
const CLAVE = 'carrito_fxg';

function cargarCarrito() {
    try { return JSON.parse(sessionStorage.getItem(CLAVE)) || []; }
    catch { return []; }
}

function guardarCarrito(c) {
    sessionStorage.setItem(CLAVE, JSON.stringify(c));
}

function calcularTotal(c) {
    return c.reduce((s, i) => s + i.precio * i.cantidad, 0);
}

let carrito = cargarCarrito();

function agregar(nombre, precio) {
    const existente = carrito.find(i => i.nombre === nombre);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    guardarCarrito(carrito);
    mostrar();
    animarBoton(event.target);
}

function animarBoton(btn) {
    btn.textContent = '✔ Agregado';
    btn.style.background = "linear-gradient(135deg, #2ecc71, #27ae60)";
    setTimeout(() => {
        btn.textContent = '+ Agregar';
        btn.style.background = '';
    }, 900);
}

function mostrar() {
    const lista        = document.getElementById("lista");
    const carritoVacio = document.getElementById("carrito-vacio");
    const badge        = document.getElementById("contador-badge");
    const cartBadge    = document.getElementById("cart-badge");
    const fabBadge     = document.getElementById("fab-badge");
    const listaWidget  = document.getElementById("lista-widget");
    const dropVacio    = document.getElementById("cart-drop-vacio");
    const totalWidget  = document.getElementById("total-widget");
    const totalEl      = document.getElementById("total");

    if (lista) lista.innerHTML = "";
    if (listaWidget) listaWidget.innerHTML = "";

    const vacio = carrito.length === 0;
    if (carritoVacio) carritoVacio.classList.toggle("visible", vacio);
    if (dropVacio)    dropVacio.classList.toggle("visible", vacio);

    const count = carrito.reduce((s, i) => s + i.cantidad, 0);
    if (badge)     badge.textContent     = count;
    if (cartBadge) cartBadge.textContent = count;
    if (fabBadge)  fabBadge.textContent  = count;

    carrito.forEach((item, index) => {
        // --- Lista principal (si existe) ---
        if (lista) {
            const li = document.createElement("li");
            const nombreSpan = document.createElement("span");
            nombreSpan.textContent = `${item.cantidad}x ${item.nombre}`;
            const precioSpan = document.createElement("span");
            precioSpan.textContent = "$" + (item.precio * item.cantidad).toLocaleString("es-CO");
            precioSpan.style.color = "#f4a261";
            precioSpan.style.fontWeight = "600";
            precioSpan.style.marginLeft = "auto";
            precioSpan.style.marginRight = "12px";
            const btn = document.createElement("button");
            btn.textContent = "\u2715 Quitar";
            btn.onclick = () => eliminar(index);
            li.appendChild(nombreSpan);
            li.appendChild(precioSpan);
            li.appendChild(btn);
            lista.appendChild(li);
        }

        // --- Widget dropdown ---
        if (listaWidget) {
            const liW = document.createElement("li");
            liW.innerHTML = `
              <span class="item-qty">${item.cantidad}</span>
              <span class="item-nombre">${item.nombre}</span>
              <span class="item-precio">$${(item.precio * item.cantidad).toLocaleString("es-CO")}</span>
              <button class="item-del" onclick="eliminar(${index})">\u2715</button>
            `;
            listaWidget.appendChild(liW);
        }
    });

    const total = calcularTotal(carrito);
    const totalStr = "Total: $" + total.toLocaleString("es-CO");
    if (totalEl)     totalEl.textContent     = totalStr;
    if (totalWidget) totalWidget.textContent = totalStr;
}

function eliminar(index) {
    carrito.splice(index, 1);
    guardarCarrito(carrito);
    mostrar();
}

function enviarPedido() {
    if (carrito.length === 0) {
        alert("🛒 Tu carrito está vacío. ¡Agrega algo primero!");
        return;
    }
    // Abrir modal de datos
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

    let mensaje = `¡Hola! Quiero hacer el siguiente pedido:\n\n`;
    mensaje += `*Nombre:* ${nombre}\n`;
    mensaje += `*Dirección:* ${dir}\n`;
    mensaje += `*Barrio:* ${barrio}\n\n`;
    mensaje += `*Pedido:*\n`;

    carrito.forEach(item => {
        mensaje += `▪ ${item.cantidad}x ${item.nombre} → $${(item.precio * item.cantidad).toLocaleString("es-CO")}\n`;
    });

    const total = calcularTotal(carrito);
    mensaje += `\n*Total: $${total.toLocaleString("es-CO")}*`;
    mensaje += `\n\n¡Gracias!`;

    cerrarModal();
    const url = "https://wa.me/573159745293?text=" + encodeURIComponent(mensaje);
    window.open(url, "_blank");
}

// Mostrar estado inicial del carrito
mostrar();

// ===== SIDEBAR =====
function toggleSidebar() {
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('overlay');
  const hamburger = document.getElementById('hamburger');

  sidebar.classList.toggle('open');
  overlay.classList.toggle('visible');
  hamburger.classList.toggle('open');
}

function cerrarSidebar() {
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('overlay');
  const hamburger = document.getElementById('hamburger');

  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
  hamburger.classList.remove('open');
}

// Marcar enlace activo al hacer click
document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});

// ===== CART WIDGET =====
function toggleCarritoWidget() {
  document.getElementById('cart-dropdown').classList.toggle('visible');
}

// Cerrar al hacer click fuera
document.addEventListener('click', (e) => {
  const widget = document.querySelector('.cart-widget');
  if (widget && !widget.contains(e.target)) {
    document.getElementById('cart-dropdown').classList.remove('visible');
  }
});