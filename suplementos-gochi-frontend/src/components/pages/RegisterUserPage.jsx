import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useRegisterUser from "../../hooks/user/useRegisterUser";
import useAuth from "../../hooks/user/useAuth";
import { notifySuccess, notifyError } from "../../utils/notify";

function RegisterUserPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });

  const { registerUser, error } = useRegisterUser();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const newUser = await registerUser(form);
    if (newUser) {
      setForm({
        name: "",
        email: "",
        password: "",
        role: "client",
      });
      await notifySuccess(
        "Usuario registrado",
        `La cuenta de ${newUser.name} se creó correctamente`
      );
      if (!isAdmin) {
        navigate("/user/login");
      }
    } else {
      notifyError(
        "No se pudo registrar",
        error || "Verificá que la contraseña tenga al menos 8 caracteres y una mayúscula"
      );
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h1>Crear Cuenta</h1>

        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Nombre completo</label>
            <input
              className="form-control"
              onChange={handleInputChange}
              value={form.name}
              type="text"
              required
              minLength={2}
              name="name"
              id="name"
              placeholder="Ej: Gonzalo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              className="form-control"
              onChange={handleInputChange}
              value={form.email}
              type="email"
              required
              name="email"
              id="email"
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña (mín. 8 caracteres y 1 mayúscula)
            </label>
            <input
              className="form-control"
              onChange={handleInputChange}
              value={form.password}
              type="password"
              required
              minLength={8}
              name="password"
              id="password"
              placeholder="Ej: Password123"
            />
          </div>

          {isAdmin && (
            <div className="form-group">
              <label htmlFor="role" className="form-label">Rol</label>
              <select
                className="form-select"
                onChange={handleInputChange}
                value={form.role}
                name="role"
                id="role"
              >
                <option value="client">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn btn-primary auth-btn w-100 mb-2">
            Registrarse
          </button>
          <button
            type="button"
            onClick={() => setForm({ name: "", email: "", password: "", role: "client" })}
            className="btn btn-outline-secondary auth-btn w-100"
          >
            Limpiar formulario
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterUserPage;
