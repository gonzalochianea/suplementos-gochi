import { useState } from "react";
import Input from "../Input";
import { notifySuccess } from "../../utils/notify";
import "../../styles/ContactPage.css";

function ContactPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    motivo: "",
    esCliente: "no",
    mensaje: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario de Contacto Enviado:", formData);
    
    notifySuccess(
      "¡Mensaje Enviado!",
      `Gracias ${formData.nombre} por contactarte con Suplementos Gochi. Nos comunicaremos a la brevedad.`
    );

    // Resetear el formulario tras el envío
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      motivo: "",
      esCliente: "no",
      mensaje: "",
    });
  };

  return (
    <div className="contact-container">
      <h1>Contacto</h1>
      <p className="contact-subtitle">
        ¿Tienes dudas o necesitas un presupuesto personalizado? Escríbenos.
      </p>

      <form onSubmit={handleSubmit} className="contact-form">
        <Input
          label="Nombre"
          labelId="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          isRequired={true}
          placeholder="Tu nombre"
        />

        <Input
          label="Apellido"
          labelId="apellido"
          type="text"
          value={formData.apellido}
          onChange={handleChange}
          isRequired={true}
          placeholder="Tu apellido"
        />

        <Input
          label="Correo Electrónico"
          labelId="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          isRequired={true}
          placeholder="Tu correo electrónico"
        />

        <Input
          label="Teléfono"
          labelId="telefono"
          type="tel"
          value={formData.telefono}
          onChange={handleChange}
          isRequired={true}
          placeholder="+54 11 1234-5678"
        />

        <div className="form-group">
          <label htmlFor="motivo">Motivo de contacto</label>
          <select
            id="motivo"
            name="motivo"
            value={formData.motivo}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="" disabled>Seleccione una opción</option>
            <option value="comprar">Comprar productos</option>
            <option value="presupuesto">Presupuesto / Cotización</option>
            <option value="soporte">Soporte Técnico / Reclamos</option>
            <option value="mayorista">Ventas Mayoristas</option>
            <option value="otro">Otro Motivo</option>
          </select>
        </div>


        <div className="radio-group-container">
          <p className="radio-group-title">¿Es cliente nuestro?</p>
          <div className="radio-options">
            <label className="radio-label">
              <input
                type="radio"
                name="esCliente"
                value="si"
                checked={formData.esCliente === "si"}
                onChange={handleChange}
              />
              Sí
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="esCliente"
                value="no"
                checked={formData.esCliente === "no"}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="mensaje">Mensaje / Consulta</label>
          <textarea
            id="mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Escribe aquí tu consulta o requerimiento..."
            className="form-input"
            className="form-input textarea-resize-vertical"
          ></textarea>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn btn-primary">
            Enviar Mensaje
          </button>
          <button type="button" onClick={handleReset} className="btn btn-outline-danger">
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ContactPage;
