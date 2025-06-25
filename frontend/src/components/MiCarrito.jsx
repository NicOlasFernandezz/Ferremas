import React from "react";

export default function MiCarrito({ carrito, onRemove, onClear, onUpdateQty }) {
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  return (
    <section style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px #0002', padding: '2rem' }}>
      <h2>Mi Carrito</h2>
      {carrito.length === 0 ? (
        <p>El carrito está vacío.</p>
      ) : (
        <>
          <table style={{ width: '100%', marginBottom: 24 }}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.codigo_prod}>
                  <td style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src={item.img} alt={item.nombre} style={{ width: 40, borderRadius: 4 }} />
                    {item.nombre}
                  </td>
                  <td>${item.precio}</td>
                  <td>
                    <button onClick={() => onUpdateQty(item.codigo_prod, item.cantidad - 1)} disabled={item.cantidad <= 1}>-</button>
                    <span style={{ margin: '0 8px' }}>{item.cantidad}</span>
                    <button onClick={() => onUpdateQty(item.codigo_prod, item.cantidad + 1)} disabled={item.cantidad >= item.stock}>+</button>
                  </td>
                  <td>${item.precio * item.cantidad}</td>
                  <td><button onClick={() => onRemove(item.codigo_prod)} style={{ color: '#c00' }}>Quitar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 18, marginBottom: 16 }}>Total: ${total}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button onClick={onClear} style={{ background: '#eee', color: '#111' }}>Vaciar carrito</button>
            <button style={{ background: '#004080', color: '#fff' }} onClick={() => window.location.href = '/finalizar-compra'}>Finalizar compra</button>
          </div>
        </>
      )}
    </section>
  );
}
