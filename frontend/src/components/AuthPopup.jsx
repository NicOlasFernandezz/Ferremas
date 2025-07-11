import React, { useState } from "react";

export default function AuthPopup({ open, onClose }) {
  const [view, setView] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerLastName, setRegisterLastName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerAddress, setRegisterAddress] = useState("");
  const [registerRut, setRegisterRut] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError("Completa todos los campos");
      return;
    }
    setError("");
    
    try {
      const res = await fetch('http://127.0.0.1:8000/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Guardar tokens y datos del usuario
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_type', data.user_type);
        localStorage.setItem('user_data', JSON.stringify(data.user_data));
        localStorage.setItem('userEmail', loginEmail);
        
        onClose();
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerName || !registerLastName || !registerPhone || !registerAddress || !registerRut || !registerEmail || !registerPassword || !registerConfirm) {
      setError("Completa todos los campos");
      return;
    }
    if (registerPassword !== registerConfirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    
    try {
      const res = await fetch('http://127.0.0.1:8000/clientes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombre: registerName,
          apellido: registerLastName,
          telefono: registerPhone,
          direccion: registerAddress,
          rut: registerRut,
          email: registerEmail, 
          password: registerPassword 
        })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Guardar tokens y datos del usuario
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user_type', data.user_type);
        localStorage.setItem('user_data', JSON.stringify(data.user_data));
        localStorage.setItem('userEmail', registerEmail);
        
        onClose();
      } else {
        // Manejar errores específicos del backend
        console.error('Error response:', data);
        if (data.email && Array.isArray(data.email)) {
          setError(data.email[0]);
        } else if (data.rut && Array.isArray(data.rut)) {
          setError(data.rut[0]);
        } else if (data.nombre && Array.isArray(data.nombre)) {
          setError(`Nombre: ${data.nombre[0]}`);
        } else if (data.apellido && Array.isArray(data.apellido)) {
          setError(`Apellido: ${data.apellido[0]}`);
        } else if (data.telefono && Array.isArray(data.telefono)) {
          setError(`Teléfono: ${data.telefono[0]}`);
        } else if (data.direccion && Array.isArray(data.direccion)) {
          setError(`Dirección: ${data.direccion[0]}`);
        } else if (data.password && Array.isArray(data.password)) {
          setError(`Contraseña: ${data.password[0]}`);
        } else if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
          setError(data.non_field_errors[0]);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError(`Error al registrar usuario: ${JSON.stringify(data)}`);
        }
      }
    } catch (err) {
      console.error('Network error:', err);
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', borderRadius: 8, padding: '2rem', minWidth: 320, maxWidth: 400, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 2px 12px #0002', position: 'relative', color: '#111' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 10, fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', color: '#111' }}>×</button>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <button onClick={() => setView('login')} style={{ fontWeight: view === 'login' ? 'bold' : 'normal', marginRight: 8, background: 'none', border: 'none', cursor: 'pointer', color: view === 'login' ? '#004080' : '#111' }}>Iniciar sesión</button>
          <button onClick={() => setView('register')} style={{ fontWeight: view === 'register' ? 'bold' : 'normal', background: 'none', border: 'none', cursor: 'pointer', color: view === 'register' ? '#004080' : '#111' }}>Registrarse</button>
        </div>
        {view === 'login' ? (
          <form onSubmit={handleLogin}>
            <h2 style={{ marginTop: 0, color: '#111' }}>Iniciar Sesión</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#111' }}>Email</label>
              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4, color: '#111' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#111' }}>Contraseña</label>
              <input type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4, color: '#111' }} />
            </div>
            {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
            <button type="submit" style={{ width: "100%", padding: 10, background: "#004080", color: "#fff", border: "none", borderRadius: 4 }}>Ingresar</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <h2 style={{ marginTop: 0, color: '#111' }}>Registrarse</h2>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#111' }}>Nombre</label>
              <input type="text" value={registerName} onChange={e => setRegisterName(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4, color: '#111' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#111' }}>Apellido</label>
              <input type="text" value={registerLastName} onChange={e => setRegisterLastName(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4, color: '#111' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#111' }}>Teléfono</label>
              <input type="tel" value={registerPhone} onChange={e => setRegisterPhone(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4, color: '#111' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#111' }}>Dirección</label>
              <input type="text" value={registerAddress} onChange={e => setRegisterAddress(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4, color: '#111' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#111' }}>RUT</label>
              <input type="text" value={registerRut} onChange={e => setRegisterRut(e.target.value)} placeholder="12345678-9" style={{ width: "100%", padding: 8, marginTop: 4, color: '#111' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#111' }}>Email</label>
              <input type="email" value={registerEmail} onChange={e => setRegisterEmail(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4, color: '#111' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#111' }}>Contraseña</label>
              <input type="password" value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4, color: '#111' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: '#111' }}>Confirmar contraseña</label>
              <input type="password" value={registerConfirm} onChange={e => setRegisterConfirm(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 4, color: '#111' }} />
            </div>
            {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
            <button type="submit" style={{ width: "100%", padding: 10, background: "#004080", color: "#fff", border: "none", borderRadius: 4 }}>Registrarse</button>
          </form>
        )}
      </div>
    </div>
  );
}
