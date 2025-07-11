import React, { useEffect, useState } from 'react';

const EMPLEADOS_URL = 'http://127.0.0.1:8000/empleados/';
const CARGOS_URL = 'http://127.0.0.1:8000/cargo/';

function AdminEmpleados() {
  // Estados para empleados, cargos y formularios
  const [empleados, setEmpleados] = useState([]);
  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    rut: '', nombre: '', apellido: '', direccion: '', celular: '', email: '', cargo_id: ''
  });
  const [editando, setEditando] = useState(null);
  const [editEmpleado, setEditEmpleado] = useState({
    rut: '', nombre: '', apellido: '', direccion: '', celular: '', email: '', cargo_id: '', is_active: true
  });

  useEffect(() => {
    fetchEmpleados();
    fetchCargos();
  }, []);

  // Obtiene la lista de empleados desde el backend
  const fetchEmpleados = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(EMPLEADOS_URL);
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setEmpleados(data);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      setError('Error al cargar empleados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtiene la lista de cargos desde el backend
  const fetchCargos = async () => {
    try {
      const res = await fetch(CARGOS_URL);
      const data = await res.json();
      setCargos(data);
    } catch (error) {
      console.error('Error al obtener cargos:', error);
    }
  };

  // Manejo de cambios en el formulario de nuevo empleado
  const handleChange = (e) => {
    setNuevoEmpleado({ ...nuevoEmpleado, [e.target.name]: e.target.value });
  };

  // Manejo de cambios en el formulario de edición de empleado
  const handleEditChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setEditEmpleado({ ...editEmpleado, [e.target.name]: value });
  };

  // Crea un nuevo empleado en el backend
  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones básicas
    if (!nuevoEmpleado.rut || !nuevoEmpleado.nombre || !nuevoEmpleado.apellido || 
        !nuevoEmpleado.email || !nuevoEmpleado.celular || !nuevoEmpleado.direccion || 
        !nuevoEmpleado.cargo_id) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(EMPLEADOS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...nuevoEmpleado,
          celular: Number(nuevoEmpleado.celular),
          cargo_id: Number(nuevoEmpleado.cargo_id)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al crear empleado:', errorData);
        
        // Mostrar errores específicos del backend
        if (errorData.rut) {
          setError('Error en RUT: ' + errorData.rut.join(', '));
        } else if (errorData.email) {
          setError('Error en email: ' + errorData.email.join(', '));
        } else {
          setError('Error al crear empleado: ' + JSON.stringify(errorData));
        }
        return;
      }

      setNuevoEmpleado({
        rut: '', nombre: '', apellido: '', direccion: '', celular: '', email: '', cargo_id: ''
      });
      fetchEmpleados();
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión al crear empleado');
    } finally {
      setLoading(false);
    }
  };

  // Elimina un empleado por su id
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      try {
        await fetch(`${EMPLEADOS_URL}${id}/`, { method: 'DELETE' });
        fetchEmpleados();
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
        alert('Error al eliminar empleado');
      }
    }
  };

  // Prepara el formulario para editar un empleado existente
  const handleEdit = (empleado) => {
    if (!empleado.id) {
      setError('Error: ID del empleado no válido');
      return;
    }
    
    setError('');
    setEditando(empleado.id);
    setEditEmpleado({
      rut: empleado.rut || '',
      nombre: empleado.nombre || '',
      apellido: empleado.apellido || '',
      direccion: empleado.direccion || '',
      celular: empleado.celular || '',
      email: empleado.email_user || '',
      cargo_id: empleado.cargo?.id || '',
      is_active: empleado.is_active !== undefined ? empleado.is_active : true
    });
  };

  // Actualiza un empleado existente en el backend
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!editando) {
      setError('Error: No se ha seleccionado un empleado para editar');
      return;
    }
    
    setLoading(true);
    
    try {
      const body = {
        rut: editEmpleado.rut,
        nombre: editEmpleado.nombre,
        apellido: editEmpleado.apellido,
        direccion: editEmpleado.direccion,
        celular: Number(editEmpleado.celular),
        cargo_id: Number(editEmpleado.cargo_id),
        is_active: editEmpleado.is_active
      };

      console.log('Actualizando empleado ID:', editando);
      console.log('URL completa:', `${EMPLEADOS_URL}${editando}/`);

      const response = await fetch(`${EMPLEADOS_URL}${editando}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.log('Respuesta del servidor:', response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al actualizar empleado:', errorData);
        
        if (response.status === 404) {
          setError('Empleado no encontrado. Es posible que haya sido eliminado.');
        } else if (errorData.rut) {
          setError('Error en RUT: ' + errorData.rut.join(', '));
        } else if (errorData.email) {
          setError('Error en email: ' + errorData.email.join(', '));
        } else {
          setError('Error al actualizar empleado: ' + JSON.stringify(errorData));
        }
        return;
      }

      setEditando(null);
      fetchEmpleados();
      setError('');
    } catch (error) {
      console.error('Error de conexión:', error);
      setError('Error de conexión al actualizar empleado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <button 
          onClick={() => window.location.href = '/admin'}
          style={{ 
            padding: '8px 16px', 
            background: '#6c757d', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 4, 
            marginRight: 16,
            cursor: 'pointer'
          }}
        >
          ← Volver al Panel
        </button>
        <h2 style={{ margin: 0 }}>Gestión de Empleados</h2>
      </div>
      
      {/* Mostrar errores */}
      {error && (
        <div style={{ 
          background: '#f8d7da', 
          color: '#721c24', 
          padding: 12, 
          borderRadius: 4, 
          marginBottom: 16,
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      {/* Indicador de carga */}
      {loading && (
        <div style={{ 
          background: '#d1ecf1', 
          color: '#0c5460', 
          padding: 12, 
          borderRadius: 4, 
          marginBottom: 16,
          textAlign: 'center'
        }}>
          Cargando...
        </div>
      )}
      
      {/* Formulario para crear nuevo empleado */}
      <form onSubmit={handleCreate} style={{ marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 8, background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
        <h3 style={{ width: '100%', margin: '0 0 16px 0' }}>Agregar Nuevo Empleado</h3>
        <input 
          name="rut" 
          placeholder="RUT (ej: 12345678-9)" 
          value={nuevoEmpleado.rut} 
          onChange={handleChange} 
          required 
          style={{ minWidth: 120, padding: 8 }} 
        />
        <input 
          name="nombre" 
          placeholder="Nombre" 
          value={nuevoEmpleado.nombre} 
          onChange={handleChange} 
          required 
          style={{ minWidth: 120, padding: 8 }} 
        />
        <input 
          name="apellido" 
          placeholder="Apellido" 
          value={nuevoEmpleado.apellido} 
          onChange={handleChange} 
          required 
          style={{ minWidth: 120, padding: 8 }} 
        />
        <input 
          name="email" 
          placeholder="Email" 
          type="email"
          value={nuevoEmpleado.email} 
          onChange={handleChange} 
          required 
          style={{ minWidth: 150, padding: 8 }} 
        />
        <input 
          name="direccion" 
          placeholder="Dirección" 
          value={nuevoEmpleado.direccion} 
          onChange={handleChange} 
          required 
          style={{ minWidth: 150, padding: 8 }} 
        />
        <input 
          name="celular" 
          placeholder="Celular" 
          type="number"
          value={nuevoEmpleado.celular} 
          onChange={handleChange} 
          required 
          style={{ minWidth: 120, padding: 8 }} 
        />
        <select 
          name="cargo_id" 
          value={nuevoEmpleado.cargo_id} 
          onChange={handleChange} 
          required 
          style={{ minWidth: 120, padding: 8 }}
        >
          <option value="">Selecciona Cargo</option>
          {cargos.map((cargo) => (
            <option key={cargo.id} value={cargo.id}>{cargo.nombre_cargo}</option>
          ))}
        </select>
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '8px 16px', 
            background: loading ? '#ccc' : '#004080', 
            color: '#fff', 
            border: 'none', 
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creando...' : 'Crear Empleado'}
        </button>
      </form>

      {/* Tabla de empleados */}
      <table border="1" cellPadding="8" style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th>ID</th>
            <th>RUT</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Celular</th>
            <th>Cargo</th>
            <th>Estado</th>
            <th>Cambiar Contraseña</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado) => {
            const isEditing = editando === empleado.id;
            return (
            <tr key={empleado.id}>
              <td>{empleado.id}</td>
              <td>
                {isEditing ? (
                  <input 
                    name="rut" 
                    value={editEmpleado.rut} 
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 4 }}
                  />
                ) : (
                  empleado.rut
                )}
              </td>
              <td>
                {isEditing ? (
                  <input 
                    name="nombre" 
                    value={editEmpleado.nombre} 
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 4 }}
                  />
                ) : (
                  empleado.nombre
                )}
              </td>
              <td>
                {isEditing ? (
                  <input 
                    name="apellido" 
                    value={editEmpleado.apellido} 
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 4 }}
                  />
                ) : (
                  empleado.apellido
                )}
              </td>
              <td>{empleado.email_user || 'No disponible'}</td>
              <td>
                {isEditing ? (
                  <input 
                    name="direccion" 
                    value={editEmpleado.direccion} 
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 4 }}
                  />
                ) : (
                  empleado.direccion
                )}
              </td>
              <td>
                {isEditing ? (
                  <input 
                    name="celular" 
                    type="number"
                    value={editEmpleado.celular} 
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 4 }}
                  />
                ) : (
                  empleado.celular
                )}
              </td>
              <td>
                {isEditing ? (
                  <select 
                    name="cargo_id" 
                    value={editEmpleado.cargo_id} 
                    onChange={handleEditChange}
                    style={{ width: '100%', padding: 4 }}
                  >
                    <option value="">Selecciona Cargo</option>
                    {cargos.map((cargo) => (
                      <option key={cargo.id} value={cargo.id}>{cargo.nombre_cargo}</option>
                    ))}
                  </select>
                ) : (
                  empleado.cargo?.nombre_cargo || 'Sin cargo'
                )}
              </td>
              <td>
                {isEditing ? (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <input 
                      type="checkbox"
                      name="is_active" 
                      checked={editEmpleado.is_active} 
                      onChange={handleEditChange}
                    />
                    Activo
                  </label>
                ) : (
                  <span style={{ color: empleado.is_active ? 'green' : 'red' }}>
                    {empleado.is_active ? 'Activo' : 'Inactivo'}
                  </span>
                )}
              </td>
              <td>
                <span style={{ color: empleado.must_change_password ? 'orange' : 'green' }}>
                  {empleado.must_change_password ? 'Pendiente' : 'Actualizada'}
                </span>
              </td>
              <td>
                {isEditing ? (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button 
                      onClick={handleUpdate}
                      disabled={loading}
                      style={{ 
                        padding: '4px 8px', 
                        background: loading ? '#ccc' : '#28a745', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 4, 
                        fontSize: 12,
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button 
                      onClick={() => setEditando(null)}
                      disabled={loading}
                      style={{ 
                        padding: '4px 8px', 
                        background: loading ? '#ccc' : '#6c757d', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: 4, 
                        fontSize: 12,
                        cursor: loading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button 
                      onClick={() => handleEdit(empleado)}
                      style={{ padding: '4px 8px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, fontSize: 12 }}
                    >
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDelete(empleado.id)}
                      style={{ padding: '4px 8px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, fontSize: 12 }}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>

      {empleados.length === 0 && (
        <p style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>
          No hay empleados registrados
        </p>
      )}
    </div>
  );
}

export default AdminEmpleados;
