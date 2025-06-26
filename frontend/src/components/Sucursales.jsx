import React, { useEffect, useState } from "react";
import styles from "./Sucursales.module.css";

const API_URL = "http://127.0.0.1:8000/sucursal/";

export default function Sucursales() {
  //Sucursales obtenidas del backend
  const [sucursales, setSucursales] = useState([]);
  //mostrar si está cargando
  const [loading, setLoading] = useState(true);
  //mostrar errores de carga
  const [error, setError] = useState(null);

  // useEffect para cargar las sucursales
  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar sucursales");
        return res.json();
      })
      .then((data) => {
        console.log('Respuesta sucursales:', data); // DEBUG
        let sucursalesArray = [];
        // Manejo flexible de la respuesta según el formato recibido
        if (Array.isArray(data)) {
          sucursalesArray = data;
        } else if (Array.isArray(data.sucursales)) {
          sucursalesArray = data.sucursales;
        } else if (Array.isArray(data.results)) {
          sucursalesArray = data.results;
        }
        setSucursales(sucursalesArray);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ textAlign: 'center', color: '#1976d2', fontWeight: 800, fontSize: 32, marginBottom: 30 }}>Nuestras Sucursales</h2>
      {loading ? (
        <div style={{ textAlign: 'center', color: '#1976d2', fontSize: 22 }}>Cargando sucursales...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'red', fontSize: 20 }}>{error}</div>
      ) : (
        <div className={styles.sucursalesContainer}>
          {sucursales.length === 0 ? (
            <div style={{ color: '#888', fontSize: 18 }}>No hay sucursales registradas.</div>
          ) : (
            sucursales.map((s) => (
              <div className={styles.sucursalCard} key={s.id}>
                <div className={styles.sucursalNombre}>{s.nombre}</div>
                <div className={styles.sucursalDato}><b>Comuna:</b> {s.comuna}</div>
                <div className={styles.sucursalDato}><b>Dirección:</b> {s["dirección"]}</div>
                <div className={styles.sucursalDato}><b>Número:</b> {s.numero}</div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
