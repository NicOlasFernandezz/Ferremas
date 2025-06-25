import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Carrito({ carrito, onRemove, onClear, onClose, onUpdateQty, anchorRef }) {
  const popupRef = useRef(null);
  const [pos, setPos] = useState({ top: 60, left: 0 });
  const anchoCarrito = 370;
  const navigate = useNavigate();

  // Calcular posición debajo del botón, usando position: fixed y evitando desbordes
  useEffect(() => {
    if (anchorRef && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      let left = rect.left;
      // Si el carrito se sale de la pantalla, ajusta a la izquierda
      if (left + anchoCarrito > window.innerWidth) {
        left = window.innerWidth - anchoCarrito - 16; // 16px de margen derecho
        if (left < 0) left = 8; // margen izquierdo mínimo
      }
      setPos({
        top: rect.bottom + 8,
        left
      });
    }
  }, [anchorRef, carrito]);

  // Cerrar el popup si se hace click fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target) && anchorRef && !anchorRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, anchorRef]);

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  return (
    <div ref={popupRef} style={{
      position: 'fixed',
      top: pos.top,
      left: 1090,
      background: '#fff',
      borderRadius: 8,
      boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      width: anchoCarrito,
      maxWidth: '95vw',
      maxHeight: '70vh',
      overflowY: 'auto',
      padding: '2rem',
      zIndex: 3000,
      display: 'flex',
      flexDirection: 'column',
      color: '#111'
    }}>
      <form method="post" action="/cart" id="mini-cart" className="mini-cart" aria-hidden="false" tabIndex="-1" noValidate>
        <button onClick={onClose} type="button" style={{ position: 'absolute', top: 10, right: 10, fontSize: 24, background: 'none', border: 'none', cursor: 'pointer', color: '#111', fontWeight: 'bold', zIndex: 10 }}>×</button>
        <h2 style={{marginTop:0}}>Carrito de compras</h2>
        <div className="mini-cart__content">
          <div className="mini-cart__line-item-list">
            {carrito.length === 0 ? (
              <p>El carrito está vacío.</p>
            ) : (
              carrito.map((item) => (
                <div className="mini-cart__line-item" key={item.codigo_prod} style={{display:'flex',marginBottom:16,borderBottom:'1px solid #eee',paddingBottom:12}}>
                  <div className="mini-cart__image-wrapper" style={{marginRight:12}}>
                    <div className="aspect-ratio" style={{width:60,height:60,overflow:'hidden',borderRadius:4,background:'#f5f5f5'}}>
                      <img src={item.img} alt={item.nombre} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    </div>
                  </div>
                  <div className="mini-cart__item-wrapper" style={{flex:1, color:'#111'}}>
                    <div className="mini-cart__product-info" style={{color:'#111'}}>
                      <span className="mini-cart__product-title" style={{fontWeight:'bold'}}>{item.nombre}</span>
                      <div className="mini-cart__price-list"><span className="price">${item.precio}</span></div>
                    </div>
                    <div className="mini-cart__quantity" style={{marginTop:8,display:'flex',alignItems:'center',gap:8, color:'#111'}}>
                      <button type="button" className="quantity-selector__button" aria-label="Disminuir la cantidad en 1" title="Disminuir la cantidad en 1" onClick={() => onUpdateQty(item.codigo_prod, item.cantidad - 1)} disabled={item.cantidad <= 1}>-</button>
                      <input aria-label="Cantidad" className="quantity-selector__value" inputMode="numeric" value={item.cantidad} size="2" readOnly style={{width:32,textAlign:'center',border:'1px solid #ccc',borderRadius:4}} />
                      <button type="button" className="quantity-selector__button" aria-label="Aumentar la cantidad en 1" title="Aumentar la cantidad en 1" onClick={() => onUpdateQty(item.codigo_prod, item.cantidad + 1)} disabled={item.cantidad >= item.stock}>+</button>
                      <a href="#" className="mini-cart__quantity-remove link" style={{marginLeft:8,color:'#c00',fontSize:13}} onClick={e => {e.preventDefault();onRemove(item.codigo_prod);}}>Quitar</a>
                    </div>
                    {item.cantidad >= item.stock && (
                      <div style={{color: 'red', fontSize: 12, marginTop: 4}}>Stock máximo alcanzado</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mini-cart__recap" style={{marginTop:16,borderTop:'1px solid #eee',paddingTop:12, color:'#111'}}>
          <div className="mini-cart__recap-price-line" style={{display:'flex',justifyContent:'space-between',fontWeight:'bold', color:'#111'}}>
            <span>Total</span>
            <span>${total}</span>
          </div>
          <div className="mini-cart__button-container" style={{marginTop:12}}>
            <button
              type="button"
              style={{ width: '100%', background: '#004080', color: '#fff', padding: '0.8em 2em', borderRadius: 6, fontSize: 18, marginBottom: 8 }}
              onClick={() => {
                onClose();
                navigate('/finalizar-compra', { state: { carrito, total } });
              }}
            >
              Finalizar compra
            </button>
            <button
              type="button"
              style={{ width: '100%', background: '#c00', color: '#fff', padding: '0.8em 2em', borderRadius: 6, fontSize: 16 }}
              onClick={onClear}
              disabled={carrito.length === 0}
            >
              Vaciar carrito
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
