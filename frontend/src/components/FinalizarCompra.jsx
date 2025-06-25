import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const regiones = [
  "Región Metropolitana",
  "Valparaíso",
  "Biobío",
  "Araucanía",
  "Antofagasta",
  "Maule",
  "O'Higgins",
  "Los Lagos",
  "Coquimbo",
  "Atacama",
  "Los Ríos",
  "Arica y Parinacota",
  "Magallanes",
  "Tarapacá",
  "Aysén",
  "Ñuble"
];

export default function FinalizarCompra() {
  const location = useLocation();
  const carrito = location.state?.carrito || [];
  const total = location.state?.total || 0;
  const [contacto, setContacto] = useState("");
  const [retiro, setRetiro] = useState("retiro");
  const [region, setRegion] = useState("");
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const [pago, setPago] = useState("tarjeta");
  const [tarjeta, setTarjeta] = useState({ numero: "", nombre: "", vencimiento: "", cvv: "" });
  const [deposito, setDeposito] = useState({ banco: "", titular: "", rut: "", comprobante: null });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Guardar pedido en json-server
    const pedido = {
      carrito,
      total,
      contacto,
      retiro,
      region,
      nombre,
      direccion,
      codigoPostal,
      comuna,
      telefono,
      pago,
      tarjeta: pago === 'tarjeta' ? tarjeta : undefined,
      deposito: pago === 'deposito' ? { ...deposito, comprobante: deposito.comprobante ? deposito.comprobante.name : null } : undefined,
      fecha: new Date().toISOString()
    };
    try {
      await fetch('http://localhost:8000/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedido)
      });
      setEnviado(true);
    } catch {
      alert('No se pudo guardar el pedido');
    }
  };

  if (enviado) {
    return <section style={{ maxWidth: 600, margin: '2rem auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px #0002', padding: '2rem', textAlign: 'center' }}><h2>¡Pedido realizado con éxito!</h2><p>Gracias por tu compra.</p></section>;
  }

  return (
    <section style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 12px #0002', padding: '2rem' }}>
      <h2>Resumen de pedido</h2>
      <div style={{border: '1.5px solid #d0d0d0', borderRadius: 10, padding: 22, marginBottom: 24, background: '#f6f8fa'}}>
        <table style={{ width: '100%', marginBottom: 0 }}>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
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
                <td>{item.cantidad}</td>
                <td>${item.precio * item.cantidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 18, marginTop: 16 }}>Total: ${total}</div>
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: 32 }}>
        <div style={{border: '1.5px solid #d0d0d0', borderRadius: 10, padding: 22, marginBottom: 24, background: '#f6f8fa'}}>
          <h3>Datos de contacto</h3>
          <input type="email" placeholder="Correo de contacto" value={contacto} onChange={e => setContacto(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
          <div style={{ marginBottom: 12 }}>
            <label>
              <input type="radio" name="retiro" value="retiro" checked={retiro === "retiro"} onChange={() => setRetiro("retiro")} /> Retiro en tienda
            </label>
            <label style={{ marginLeft: 24 }}>
              <input type="radio" name="retiro" value="envio" checked={retiro === "envio"} onChange={() => setRetiro("envio")} /> Envío a domicilio
            </label>
          </div>
          <div style={{ marginBottom: 12 }}>
            <select value={region} onChange={e => setRegion(e.target.value)} required style={{ width: '100%', padding: 8 }}>
              <option value="">Selecciona región</option>
              {regiones.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <input type="text" placeholder="Nombre completo" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
          <input type="text" placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
          <input type="text" placeholder="Código postal" value={codigoPostal} onChange={e => setCodigoPostal(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
          <input type="text" placeholder="Comuna" value={comuna} onChange={e => setComuna(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
          <input type="tel" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} required style={{ width: '100%', marginBottom: 12, padding: 8 }} />
        </div>
        <div style={{border: '1.5px solid #d0d0d0', borderRadius: 10, padding: 22, marginBottom: 24, background: '#f6f8fa'}}>
          <h3>Método de pago</h3>
          <div style={{ marginBottom: 12 }}>
            <label>
              <input type="radio" name="pago" value="tarjeta" checked={pago === "tarjeta"} onChange={() => setPago("tarjeta")} /> Tarjeta de crédito/débito
            </label>
            <label style={{ marginLeft: 24 }}>
              <input type="radio" name="pago" value="deposito" checked={pago === "deposito"} onChange={() => setPago("deposito")} /> Depósito bancario
            </label>
          </div>
          {pago === "tarjeta" ? (
            <div style={{ marginBottom: 16 }}>
              <input type="text" placeholder="Número de tarjeta" value={tarjeta.numero} onChange={e => setTarjeta({ ...tarjeta, numero: e.target.value })} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
              <input type="text" placeholder="Nombre en la tarjeta" value={tarjeta.nombre} onChange={e => setTarjeta({ ...tarjeta, nombre: e.target.value })} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
              <input type="text" placeholder="Vencimiento (MM/AA)" value={tarjeta.vencimiento} onChange={e => setTarjeta({ ...tarjeta, vencimiento: e.target.value })} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
              <input type="text" placeholder="CVV" value={tarjeta.cvv} onChange={e => setTarjeta({ ...tarjeta, cvv: e.target.value })} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <input type="text" placeholder="Banco" value={deposito.banco} onChange={e => setDeposito({ ...deposito, banco: e.target.value })} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
              <input type="text" placeholder="Titular de la cuenta" value={deposito.titular} onChange={e => setDeposito({ ...deposito, titular: e.target.value })} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
              <input type="text" placeholder="RUT" value={deposito.rut} onChange={e => setDeposito({ ...deposito, rut: e.target.value })} required style={{ width: '100%', marginBottom: 8, padding: 8 }} />
              <label style={{ display: 'block', marginBottom: 8 }}>
                Comprobante de depósito:
                <input type="file" onChange={e => setDeposito({ ...deposito, comprobante: e.target.files[0] })} required />
              </label>
            </div>
          )}
        </div>
        <button type="submit" style={{ background: '#004080', color: '#fff', padding: '0.8em 2em', borderRadius: 6, fontSize: 18, width: '100%', marginTop: 16 }}>Confirmar compra</button>
      </form>
    </section>
  );
}
