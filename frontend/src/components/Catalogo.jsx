import React, { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000/productos/";
const SUCURSAL_URL = "http://127.0.0.1:8000/sucursal/";

export default function Catalogo({ onAdd, carrito = [] }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        // Verificar si data es un array o un objeto con productos
        let productosRaw = [];
        if (Array.isArray(data)) productosRaw = data;
        else if (data && Array.isArray(data.productos)) productosRaw = data.productos;
        // Eliminar duplicados por codigo_prod
        const productosUnicos = Object.values(
          productosRaw.reduce((acc, prod) => {
            acc[prod.codigo_prod] = prod;
            return acc;
          }, {})
        );
        setProductos(productosUnicos);
      })
      .catch(() => setProductos([]));
    fetch(SUCURSAL_URL)
      .then((res) => res.json())
      .then((data) => setSucursales(data))
      .catch(() => setSucursales([]));
  }, []);

  // Obtener categorias
  const categorias = [
    ...new Set(productos.map((p) => p.categoria))
  ];

  // Filtrar productos por busqueda, categoria, precio y sucursal
  const productosFiltrados = productos.filter((producto) => {
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.marca.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria ? producto.categoria === categoria : true;
    const coincidePrecioMin = precioMin ? producto.precio >= parseInt(precioMin) : true;
    const coincidePrecioMax = precioMax ? producto.precio <= parseInt(precioMax) : true;
    const coincideSucursal = sucursal ? (producto.sucursal && (producto.sucursal.id === Number(sucursal))) : true;
    return coincideBusqueda && coincideCategoria && coincidePrecioMin && coincidePrecioMax && coincideSucursal;
  });

  // Obtener cantidad en carrito para cada producto
  const cantidadEnCarrito = (codigo_prod) => {
    const item = carrito.find((i) => i.codigo_prod === codigo_prod);
    return item ? item.cantidad : 0;
  };

  return (
    <section style={{ padding: "2rem" }}>
      <h2>Catálogo de Productos</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", minWidth: 200 }}
        />
        <select
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", minWidth: 180 }}
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={sucursal}
          onChange={e => setSucursal(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", minWidth: 180 }}
        >
          <option value="">Todas las sucursales</option>
          {sucursales.map((s) => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Precio mínimo"
          value={precioMin}
          onChange={e => setPrecioMin(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", minWidth: 120 }}
          min="0"
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={precioMax}
          onChange={e => setPrecioMax(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "4px", border: "1px solid #ccc", minWidth: 120 }}
          min="0"
        />
      </div>
      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
        {productosFiltrados.length === 0 ? (
          <p>No se encontraron productos.</p>
        ) : (
          productosFiltrados.map((producto) => {
            const enCarrito = cantidadEnCarrito(producto.codigo_prod);
            const agotado = producto.stock === 0 || enCarrito >= producto.stock;
            return (
              <div key={producto.codigo_prod} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "1rem", minWidth: "220px", background: "#f9f9f9", maxWidth: "250px" }}>
                <img src={producto.img} alt={producto.nombre} style={{ width: "100%", borderRadius: "4px" }} />
                <h3>{producto.nombre}</h3>
                <p><strong>Marca:</strong> {producto.marca}</p>
                <p><strong>Categoría:</strong> {producto.categoria}</p>
                <p><strong>Sucursal:</strong> {producto.sucursal?.nombre || ''}</p>
                <p>{producto.descripcion}</p>
                <p><strong>Precio:</strong> ${producto.precio}</p>
                <p><strong>Stock:</strong> {producto.stock > 0 ? producto.stock : <span style={{color: 'red'}}>Agotado</span>}</p>
                <button
                  disabled={agotado}
                  style={agotado ? { background: '#ccc', color: '#fff', cursor: 'not-allowed' } : {}}
                  onClick={() => onAdd && onAdd(producto)}
                >
                  {agotado ? 'Stock agotado' : 'Agregar al carrito'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
