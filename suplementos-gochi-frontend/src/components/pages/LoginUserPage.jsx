import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useLoginUser from "../../hooks/user/useLoginUser";
import useAuth from "../../hooks/user/useAuth";
import { notifySuccess, notifyError } from "../../utils/notify";

function LoginUserPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const { loginUser } = useLoginUser();

  const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = await loginUser(form.email, form.password);
    if (data && data.token) {
      login(data);
      setForm({
        email: "",
        password: "",
      });
      await notifySuccess(
        "¡Bienvenido!",
        `Sesión iniciada como ${data.user?.name || data.user?.email}`
      );
      navigate("/");
    } else {
      notifyError("No se pudo iniciar sesión", "Email o contraseña incorrectos");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h1>Iniciar Sesión</h1>

        <form onSubmit={handleFormSubmit}>
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
              placeholder="ejemplo@gochi.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              className="form-control"
              onChange={handleInputChange}
              value={form.password}
              type="password"
              required
              name="password"
              id="password"
              placeholder="Tu contraseña"
            />
          </div>

          <button type="submit" className="btn btn-primary auth-btn w-100">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginUserPage;
