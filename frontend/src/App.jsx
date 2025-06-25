import React, { useState, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Catalogo from './components/Catalogo';
import Carrito from './components/Carrito';
import AdminProductos from './components/AdminProductos';
import MiCarrito from './components/MiCarrito';
import FinalizarCompra from './components/FinalizarCompra';
import Sucursales from './components/Sucursales';

function SliderDestacados({ productos }) {
  const [actual, setActual] = React.useState(0);

  // Cambio automático cada 3 segundos
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActual((prev) => (prev + 1) % productos.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [productos.length]);

  const siguiente = () => setActual((prev) => (prev + 1) % productos.length);
  const anterior = () => setActual((prev) => (prev - 1 + productos.length) % productos.length);

  if (!productos || productos.length === 0) return null;

  const prod = productos[actual];
  return (
    <div style={{ maxWidth:2000, margin: '2rem 0 2rem 10vw', textAlign: 'center', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #0002', padding: 40, border: '3px solid #1976d2', position: 'relative' }}>
      <h3 style={{ marginBottom: 18, color: '#1976d2', fontSize: 28, fontWeight: 700, letterSpacing: 1 }}>Productos destacados</h3>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <button onClick={anterior} style={{ marginRight: 30, padding: '8px 18px', fontSize: 22, borderRadius: 8, border: '1px solid #1976d2', background: '#e3f0ff', color: '#1976d2', cursor: 'pointer' }}>{'<'}</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <img src={prod.img || prod.imagen} alt={prod.nombre} style={{ width: 160, height: 160, objectFit: 'contain', marginBottom: 18, borderRadius: 12, background: '#f7f7f7', boxShadow: '0 2px 8px #0001' }} />
          <h4 style={{ margin: '10px 0 6px', fontSize: 24 }}>{prod.nombre}</h4>
          <p style={{ fontSize: 17, color: '#444', margin: '0 0 12px' }}>{prod.descripcion}</p>
          <div style={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 10, fontSize: 22 }}>${prod.precio?.toLocaleString()}</div>
        </div>
        <button onClick={siguiente} style={{ marginLeft: 30, padding: '8px 18px', fontSize: 22, borderRadius: 8, border: '1px solid #1976d2', background: '#e3f0ff', color: '#1976d2', cursor: 'pointer' }}>{'>'}</button>
      </div>
    </div>
  );
}

function Home() {
  const [productos, setProductos] = React.useState([]);
  React.useEffect(() => {
    fetch('http://127.0.0.1:8000/productos/')
      .then(res => res.json())
      .then(data => setProductos((Array.isArray(data) ? data : data.productos)?.slice(0, 3) || []));
  }, []);
  return (
    <div className="home-bg">
      <h2 style={{ marginTop: '0rem', marginBottom: '2.5rem', fontSize: '44px', fontWeight: 'bold', textAlign: 'center', color: '#1565c0', letterSpacing: 2, textShadow: '0 4px 16px #b3d3f7, 0 1px 0 #fff' }}>
        ¡Bienvenido a Ferremas!
      </h2>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 64 }}>
        <SliderDestacados productos={productos} />
        {/* Texto fuera del slider */}
        <div style={{ maxWidth: 400, textAlign: 'left', background: 'linear-gradient(120deg, #e3f0ff 0%, #f7faff 100%)', borderRadius: 22, padding: '38px 32px', boxShadow: '0 8px 32px #1976d233, 0 1.5px 0 #fff', border: '2.5px solid #90caf9', fontSize: 23, color: '#234', minHeight: 240, lineHeight: 1.7, marginTop: 10, transition: 'box-shadow 0.3s', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 90, height: 90, background: 'radial-gradient(circle, #e3f0ff 60%, #90caf9 100%)', borderRadius: '50%', opacity: 0.25, zIndex: 0 }} />
          <strong style={{ fontSize: 28, color: '#1976d2', letterSpacing: 1, zIndex: 1, position: 'relative' }}>¡Bienvenido!</strong>
          <p style={{ margin: '22px 0 0', fontSize: 22, color: '#234', zIndex: 1, position: 'relative' }}>
            Descubre nuestra <span style={{ color: '#1976d2', fontWeight: 600 }}>ferretería online</span>, donde encontrarás productos de calidad, ofertas destacadas y un proceso de compra fácil y seguro.<br/><br/>
            <span style={{ color: '#1976d2', fontWeight: 700, fontSize: 23 }}>¡Explora el catálogo y arma tu carrito en segundos!</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Admin() {
  // Obtener el email del usuario autenticado desde localStorage
  const email = localStorage.getItem('userEmail');
  // Solo permitir acceso si el email es de admin
  if (!email || !email.endsWith('@admin.com')) {
    return <h2 style={{textAlign:'center',marginTop:'3rem',color:'#c00'}}>Acceso denegado: solo administradores</h2>;
  }
  return <AdminProductos />;
}

function App() {
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const carritoBtnRef = useRef(null);

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.codigo_prod === producto.codigo_prod);
      if (existe) {
        // No permitir agregar más que el stock disponible
        if (existe.cantidad >= producto.stock) return prev;
        return prev.map((item) =>
          item.codigo_prod === producto.codigo_prod
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        // Solo agregar si hay stock
        if (producto.stock < 1) return prev;
        return [...prev, { ...producto, cantidad: 1 }];
      }
    });
    setMostrarCarrito(true);
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (codigo_prod) => {
    setCarrito((prev) => prev.filter((item) => item.codigo_prod !== codigo_prod));
  };

  // Vaciar carrito
  const vaciarCarrito = () => setCarrito([]);

  // Actualizar cantidad de un producto en el carrito
  const actualizarCantidad = (codigo_prod, nuevaCantidad) => {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.codigo_prod === codigo_prod
            ? { ...item, cantidad: Math.max(1, nuevaCantidad) }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  };

  return (
    <BrowserRouter>
      <Header />
      <button ref={carritoBtnRef} onClick={() => setMostrarCarrito((v) => !v)} style={{ position: 'fixed', top: 20, right: 20, zIndex: 2100 }}>
        🛒 Carrito ({carrito.reduce((acc, item) => acc + item.cantidad, 0)})
      </button>
      {mostrarCarrito && (
        <Carrito
          carrito={carrito}
          onRemove={eliminarDelCarrito}
          onClear={vaciarCarrito}
          onClose={() => setMostrarCarrito(false)}
          onUpdateQty={actualizarCantidad}
          anchorRef={carritoBtnRef}
        />
      )}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo onAdd={agregarAlCarrito} carrito={carrito} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/mi-carrito" element={<MiCarrito carrito={carrito} onRemove={eliminarDelCarrito} onClear={vaciarCarrito} onUpdateQty={actualizarCantidad} />} />
          <Route path="/finalizar-compra" element={<FinalizarCompra carrito={carrito} total={carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0)} />} />
          <Route path="/sucursales" element={<Sucursales />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
