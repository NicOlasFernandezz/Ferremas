import React, { useState } from "react";
import styles from "./Header.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import AuthPopup from "./AuthPopup";

export default function Header() {
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/');
    window.location.reload(); 
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <h1 className={styles.title}>Ferremas</h1>
        <nav className="main-nav">
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkHover}` : styles.navLink
                }
              >
                Inicio
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/Catalogo"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkHover}` : styles.navLink
                }
              >
                Productos
              </NavLink>
            </li>
            <li className={styles.navItem}>
              <NavLink
                to="/Sucursales"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.navLinkHover}` : styles.navLink
                }
              >
                Sucursales
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className={styles.headerRight}>
          {/* Botón para admin */}
          {email && email.endsWith('@admin.com') && (
            <NavLink to="/admin" className={styles.authButton} style={{ marginRight: 10 }}>
              Panel Admin
            </NavLink>
          )}
          {email ? (
            <button className={styles.authButton} onClick={handleLogout}>
              Cerrar sesión
            </button>
          ) : (
            <button className={styles.authButton} onClick={() => setShowAuth(true)}>
              Iniciar sesión / Registrarse
            </button>
          )}
        </div>
        {showAuth && <AuthPopup open={showAuth} onClose={() => setShowAuth(false)} />}
      </div>
    </header>
  );
}
