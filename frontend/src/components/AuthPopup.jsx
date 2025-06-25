import React, { useState } from "react";

export default function AuthPopup({ open, onClose }) {
  const [view, setView] = useState("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError("Completa todos los campos");
      return;
    }
    setError("");
    // Guardar el email en localStorage para control de sesión y permisos
    localStorage.setItem('userEmail', loginEmail);
    // Aquí iría la lógica real de login
    onClose();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword || !registerConfirm) {
      setError("Completa todos los campos");
      return;
    }
    if (registerPassword !== registerConfirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setError("");
    try {
      // Validar si el email ya existe
      const checkRes = await fetch(`http://localhost:8000/usuarios?email=${encodeURIComponent(registerEmail)}`);
      const users = await checkRes.json();
      if (users.length > 0) {
        setError('El email ya está registrado');
        return;
      }
      // Guardar usuario 
      const res = await fetch('http://localhost:8000/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: registerName, email: registerEmail, password: registerPassword })
      });
      if (!res.ok) throw new Error('Error al registrar usuario');
      // Guardar el email en localStorage para control de sesión y permisos
      localStorage.setItem('userEmail', registerEmail);
      onClose();
    } catch (err) {
      setError('No se pudo registrar el usuario');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', zIndex: 4000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ background: '#fff', borderRadius: 8, padding: '2rem', minWidth: 320, maxWidth: 350, boxShadow: '0 2px 12px #0002', position: 'relative', color: '#111' }}>
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
