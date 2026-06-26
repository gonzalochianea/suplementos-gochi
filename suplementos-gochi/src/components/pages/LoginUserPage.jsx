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

  const {login} = useAuth()
  const navigate = useNavigate()

  const {loginUser} = useLoginUser()

    const handleInputChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  };

      const handleFormSubmit = async (e) => {
        e.preventDefault()
        // success = usuario sin password, incluye el rol
        const success = await loginUser(form.email, form.password)
        if(success){
            login(success)
            setForm({
                email: "",
                password: ""
            })
            await notifySuccess("¡Bienvenido!", `Sesión iniciada como ${success.name}`)
            navigate("/")
        } else {
            notifyError("No se pudo iniciar sesión", "Credenciales incorrectas")
        }
    }

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <h1> Iniciar Sesión </h1>

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
            />
          </div>

          <button type="submit" className="btn btn-primary auth-btn w-100"> Ingresar </button>
        </form>
      </div>
    </div>
  );
}

export default LoginUserPage;
