import React, { useEffect, useState } from 'react';

const API_URL = 'http://127.0.0.1:8000/productos/'; // URLS para backend
const PEDIDOS_URL = 'http://127.0.0.1:8000/pedidos/'; 

function AdminProductos() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ codigo_prod: '', nombre: '', precio: '', descripcion: '', marca: '', categoria: '', stock: '', img: '' });
  const [editando, setEditando] = useState(null);
  const [editProducto, setEditProducto] = useState({ codigo_prod: '', nombre: '', precio: '', descripcion: '', marca: '', categoria: '', stock: '', img: '' });
  const [mostrarPedidos, setMostrarPedidos] = useState(false);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProductos(data);
  };

  const fetchPedidos = async () => {
    const res = await fetch(PEDIDOS_URL);
    const data = await res.json();
    setPedidos(data);
  };

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditProducto({ ...editProducto, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...nuevoProducto,
        precio: Number(nuevoProducto.precio),
        stock: Number(nuevoProducto.stock)
      }),
    });
    setNuevoProducto({ codigo_prod: '', nombre: '', precio: '', descripcion: '', marca: '', categoria: '', stock: '', img: '' });
    fetchProductos();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
    fetchProductos();
  };

  const handleEdit = (producto) => {
    setEditando(producto.id);
    setEditProducto({ ...producto });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}${editando}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...editProducto,
        precio: Number(editProducto.precio),
        stock: Number(editProducto.stock)
      }),
    });
    setEditando(null);
    fetchProductos();
  };

  const handleDeletePedido = async (id) => {
    await fetch(`${PEDIDOS_URL}${id}/`, { method: 'DELETE' });
    fetchPedidos();
  };

  const handleMarcarEntregado = async (id) => {
    const pedido = pedidos.find((p) => p.id === id);
    if (!pedido) return;
    await fetch(`${PEDIDOS_URL}${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...pedido, entregado: true })
    });
    fetchPedidos();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Productos</h2>
      <button style={{ marginBottom: 16 }} onClick={async () => {
        if (!mostrarPedidos) await fetchPedidos();
        setMostrarPedidos(!mostrarPedidos);
      }}>
        {mostrarPedidos ? 'Ocultar Pedidos' : 'Ver Pedidos'}
      </button>
      {mostrarPedidos && (
        <div style={{ marginBottom: 24 }}>
          <h3>Pedidos Realizados</h3>
          {pedidos.length === 0 ? (
            <p>No hay pedidos registrados.</p>
          ) : (
            <table border="1" cellPadding="8" style={{ width: '100%', fontSize: 14, marginBottom: 16 }}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Fecha</th>
                  <th>Contacto</th>
                  <th>Nombre</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Total</th>
                  <th>Productos</th>
                  <th>Entregado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>{pedido.id}</td>
                    <td>{pedido.fecha ? new Date(pedido.fecha).toLocaleString() : ''}</td>
                    <td>{pedido.contacto}</td>
                    <td>{pedido.nombre}</td>
                    <td>{pedido.telefono}</td>
                    <td>{pedido.direccion}</td>
                    <td>${pedido.total}</td>
                    <td>
                      <ul style={{ margin: 0, paddingLeft: 16 }}>
                        {pedido.carrito && pedido.carrito.map((item, idx) => (
                          <li key={idx}>{item.nombre} x{item.cantidad}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{pedido.entregado ? 'Sí' : 'No'}</td>
                    <td>
                      <button onClick={() => handleDeletePedido(pedido.id)} style={{ marginRight: 8 }}>Eliminar</button>
                      <button onClick={() => handleMarcarEntregado(pedido.id)} disabled={pedido.entregado}>Marcar entregado</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      <form onSubmit={handleCreate} style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <input name="codigo_prod" placeholder="Código" value={nuevoProducto.codigo_prod} onChange={handleChange} required style={{ minWidth: 80 }} />
        <input name="nombre" placeholder="Nombre" value={nuevoProducto.nombre} onChange={handleChange} required style={{ minWidth: 120 }} />
        <input name="precio" placeholder="Precio" value={nuevoProducto.precio} onChange={handleChange} required type="number" min="0" style={{ minWidth: 80 }} />
        <input name="descripcion" placeholder="Descripción" value={nuevoProducto.descripcion} onChange={handleChange} required style={{ minWidth: 120 }} />
        <input name="marca" placeholder="Marca" value={nuevoProducto.marca} onChange={handleChange} required style={{ minWidth: 80 }} />
        <input name="categoria" placeholder="Categoría" value={nuevoProducto.categoria} onChange={handleChange} required style={{ minWidth: 100 }} />
        <input name="stock" placeholder="Stock" value={nuevoProducto.stock} onChange={handleChange} required type="number" min="0" style={{ minWidth: 60 }} />
        <input name="img" placeholder="URL Imagen" value={nuevoProducto.img} onChange={handleChange} style={{ minWidth: 120 }} />
        <button type="submit">Crear</button>
      </form>
      <table border="1" cellPadding="8" style={{ width: '100%', fontSize: 14 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Descripción</th>
            <th>Marca</th>
            <th>Categoría</th>
            <th>Stock</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>
                {editando === producto.id ? (
                  <input name="codigo_prod" value={editProducto.codigo_prod} onChange={handleEditChange} />
                ) : (
                  producto.codigo_prod
                )}
              </td>
              <td>
                {editando === producto.id ? (
                  <input name="nombre" value={editProducto.nombre} onChange={handleEditChange} />
                ) : (
                  producto.nombre
                )}
              </td>
              <td>
                {editando === producto.id ? (
                  <input name="precio" value={editProducto.precio} onChange={handleEditChange} type="number" />
                ) : (
                  producto.precio
                )}
              </td>
              <td>
                {editando === producto.id ? (
                  <input name="descripcion" value={editProducto.descripcion} onChange={handleEditChange} />
                ) : (
                  producto.descripcion
                )}
              </td>
              <td>
                {editando === producto.id ? (
                  <input name="marca" value={editProducto.marca} onChange={handleEditChange} />
                ) : (
                  producto.marca
                )}
              </td>
              <td>
                {editando === producto.id ? (
                  <input name="categoria" value={editProducto.categoria} onChange={handleEditChange} />
                ) : (
                  producto.categoria
                )}
              </td>
              <td>
                {editando === producto.id ? (
                  <input name="stock" value={editProducto.stock} onChange={handleEditChange} type="number" />
                ) : (
                  producto.stock
                )}
              </td>
              <td>
                {editando === producto.id ? (
                  <input name="img" value={editProducto.img} onChange={handleEditChange} />
                ) : (
                  <img src={producto.img} alt={producto.nombre} style={{ width: 40 }} />
                )}
              </td>
              <td>
                {editando === producto.id ? (
                  <>
                    <button onClick={handleUpdate}>Guardar</button>
                    <button onClick={() => setEditando(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(producto)}>Editar</button>
                    <button onClick={() => handleDelete(producto.id)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminProductos;
