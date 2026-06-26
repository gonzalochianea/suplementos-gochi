import { useState } from "react"
import { NavLink } from "react-router-dom"
import useGetUsers from "../../hooks/user/useGetUsers"
import useDeleteUser from "../../hooks/user/useDeleteUser"
import { notifySuccess, notifyError, notifyInfo, confirmAction } from "../../utils/notify"
import UserDetailModal from "../UserDetailModal"
import "../../styles/AdminPanelPage.css";

// Panel de Administrador (Gestión de Usuarios).
// Layout tipo Dashboard con sidebar. El buscador filtra en memoria del cliente
// sobre el estado de React (no vuelve a pegarle a la API). Los detalles se ven
// en un modal y la eliminación es Soft Delete con confirmación nativa.
function AdminPanelPage() {
  const { users, error, loading, refetch } = useGetUsers()
  const { deleteUser } = useDeleteUser()

  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)

  // Filtro en memoria por nombre o email
  const term = search.trim().toLowerCase()
  const filteredUsers = term
    ? users.filter(
        (u) =>
          u.name?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term)
      )
    : users

  const handleDelete = async (user) => {
    // El Superadmin es inmutable: no puede eliminarse
    if (user.superadmin) {
      notifyInfo("Acción no permitida", "El Superadmin no puede ser eliminado.")
      return
    }
    const confirmed = await confirmAction(
      `¿Eliminar a "${user.name}"?`,
      "El usuario dejará de listarse y no podrá iniciar sesión.",
      "Sí, eliminar"
    )
    if (confirmed) {
      const result = await deleteUser(user.id)
      if (result) {
        if (selectedUser?.id === user.id) setSelectedUser(null)
        refetch()
        notifySuccess("Usuario eliminado", `"${user.name}" fue dado de baja correctamente.`)
      } else {
        notifyError("Error al eliminar", "Ocurrió un error al eliminar el usuario.")
      }
    }
  }

  return (
    <div className="admin-layout">
      {/* Sidebar de navegación rápida */}
      <aside className="admin-sidebar-custom">
        <h2 className="admin-sidebar-title">Panel Admin</h2>
        <NavLink to="/admin/users" className="admin-sidebar-link">
          <span className="admin-icon">👥</span> Usuarios
        </NavLink>
        <NavLink to="/products" className="admin-sidebar-link">
          <span className="admin-icon">📦</span> Productos
        </NavLink>
        <NavLink to="/products/create" className="admin-sidebar-link">
          <span className="admin-icon">➕</span> Crear producto
        </NavLink>
      </aside>

      {/* Contenido principal */}
      <main className="admin-main">
        <h1>Gestión de Usuarios</h1>
        {/* BUSCADOR */}
        <input
          type="text"
          className="form-control my-3 admin-form-container"
          placeholder="Buscar por nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <p>Cargando usuarios...</p>}
        {error && <p className="text-danger">{error?.message || String(error)}</p>}

        {!loading && !error && (
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    No se encontraron usuarios.
                  </td>
                </tr>
              )}
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.role}{user.superadmin && " ⭐"}
                  </td>
                  <td>
                    <button className="btn btn-outline-primary btn-sm me-2" onClick={() => setSelectedUser(user)}>Ver</button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(user)}
                      disabled={user.superadmin}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {/* Modal de detalles del usuario seleccionado (sin historial de compras) */}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  )
}

export default AdminPanelPage
