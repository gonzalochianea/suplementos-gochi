import React from "react";
import PropTypes from "prop-types";
import "../styles/UserDetailModal.css";

// Modal de presentación: muestra los datos completos de un usuario.
// No tiene lógica de datos (no hace fetch ni borra); solo recibe el usuario a
// mostrar y un callback para cerrarse, por lo que es testeable de forma aislada.
function UserDetailModal({ user, onClose }) {
  return (
    <div
      onClick={onClose}
      className="modal-overlay"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card p-4 modal-content"
      >
        <h2 className="mb-4 text-xl font-bold">Detalle de Usuario</h2>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>
        {user.superadmin && <p><strong>Superadmin:</strong> Sí</p>}
        
        <button
          onClick={onClose}
          className="btn btn-outline-danger mt-4"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

UserDetailModal.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    superadmin: PropTypes.bool,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserDetailModal;
