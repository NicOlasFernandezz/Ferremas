import React, { useEffect, useState } from 'react';

const API_URL = 'http://127.0.0.1:8000/productos/'; // URLS para backend
const PEDIDOS_URL = 'http://127.0.0.1:8000/pedidos/'; 
const SUCURSAL_URL = 'http://127.0.0.1:8000/sucursal/';

function AdminProductos() {
  // Estados para productos, sucursales, pedidos y formularios
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ codigo_prod: '', nombre: '', precio: '', descripcion: '', marca: '', categoria: '', stock: '', sucursal_id: '' });
  const [editando, setEditando] = useState(null);
  const [editProducto, setEditProducto] = useState({ codigo_prod: '', nombre: '', precio: '', descripcion: '', marca: '', categoria: '', stock: '', sucursal_id: '' });
  const [sucursales, setSucursales] = useState([]);
  const [mostrarPedidos, setMostrarPedidos] = useState(false);
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    fetchProductos();
    fetchSucursales();
  }, []);

  // Obtiene la lista de productos desde el backend
  const fetchProductos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProductos(data);
  };

  // Obtiene la lista de sucursales desde el backend
  const fetchSucursales = async () => {
    const res = await fetch(SUCURSAL_URL);
    const data = await res.json();
    setSucursales(data);
  };

  // Obtiene la lista de pedidos desde el backend
  const fetchPedidos = async () => {
    const res = await fetch(PEDIDOS_URL);
    const data = await res.json();
    setPedidos(data);
  };

  // cambio de los inputs formulario de nuevo producto
  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  // cambio input formulario de edición de producto
  const handleEditChange = (e) => {
    setEditProducto({ ...editProducto, [e.target.name]: e.target.value });
  };

  // Crea un nuevo producto en el backend
  const handleCreate = async (e) => {
    e.preventDefault();
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...nuevoProducto,
        precio: Number(nuevoProducto.precio),
        stock: Number(nuevoProducto.stock),
        sucursal_id: Number(nuevoProducto.sucursal_id)
      }),
    });
    setNuevoProducto({ codigo_prod: '', nombre: '', precio: '', descripcion: '', marca: '', categoria: '', stock: '', sucursal_id: '' });
    fetchProductos();
  };

  // Elimina un producto por su id
  const handleDelete = async (id) => {
    await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
    fetchProductos();
  };

  // Prepara el formulario para editar un producto existente
  const handleEdit = (producto) => {
    setEditando(producto.id);
    setEditProducto({
      codigo_prod: producto.codigo_prod,
      nombre: producto.nombre,
      precio: producto.precio,
      descripcion: producto.descripcion,
      marca: producto.marca,
      categoria: producto.categoria,
      stock: producto.stock,
      sucursal_id: producto.sucursal?.id || ''
    });
  };

  // Actualiza un producto existente en el backend
  const handleUpdate = async (e) => {
    e.preventDefault();
    const body = {
      codigo_prod: editProducto.codigo_prod,
      nombre: editProducto.nombre,
      precio: Number(editProducto.precio),
      descripcion: editProducto.descripcion,
      marca: editProducto.marca,
      categoria: editProducto.categoria,
      stock: Number(editProducto.stock),
      sucursal_id: Number(editProducto.sucursal_id)
    };
    await fetch(`${API_URL}${editando}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setEditando(null);
    fetchProductos();
  };

  // Elimina un pedido por su id
  const handleDeletePedido = async (id) => {
    await fetch(`${PEDIDOS_URL}${id}/`, { method: 'DELETE' });
    fetchPedidos();
  };

  // Marca un pedido como entregado
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
        <select name="sucursal_id" value={nuevoProducto.sucursal_id} onChange={handleChange} required style={{ minWidth: 120 }}>
          <option value="">Selecciona Sucursal</option>
          {sucursales.map((s) => (
            <option key={s.id} value={s.id}>{s.nombre}</option>
          ))}
        </select>
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
            <th>Sucursal</th>
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
                  <select name="sucursal_id" value={editProducto.sucursal_id} onChange={handleEditChange} required>
                    <option value="">Selecciona Sucursal</option>
                    {sucursales.map((s) => (
                      <option key={s.id} value={s.id}>{s.nombre}</option>
                    ))}
                  </select>
                ) : (
                  producto.sucursal?.nombre || ''
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
