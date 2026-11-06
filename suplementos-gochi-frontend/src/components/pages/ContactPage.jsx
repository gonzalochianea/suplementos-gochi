import { useState } from "react";
import Input from "../Input";
import { notifySuccess } from "../../utils/notify";
import "../../styles/ContactPage.css";

const INITIAL_CONTACT_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  reason: "",
  isClient: "no",
  message: "",
};

function ContactPage() {
  const [formData, setFormData] = useState(INITIAL_CONTACT_FORM);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData(INITIAL_CONTACT_FORM);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    notifySuccess(
      "¡Mensaje Enviado!",
      `Gracias ${formData.firstName} por contactarte con Suplementos Gochi. Nos comunicaremos a la brevedad.`
    );

    // Reiniciar el formulario tras el envío
    handleReset();
  };

  return (
    <div className="contact-container">
      <h1>Contacto</h1>
      <p className="contact-subtitle">
        ¿Tenés dudas o necesitás asesoramiento personalizado sobre suplementación? Escribinos.
      </p>

      <form onSubmit={handleSubmit} className="contact-form">
        <Input
          label="Nombre"
          labelId="firstName"
          type="text"
          value={formData.firstName}
          onChange={handleChange}
          isRequired={true}
          placeholder="Tu nombre"
        />

        <Input
          label="Apellido"
          labelId="lastName"
          type="text"
          value={formData.lastName}
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
          labelId="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          isRequired={true}
          placeholder="+54 11 1234-5678"
        />

        <div className="form-group">
          <label htmlFor="reason">Motivo de contacto</label>
          <select
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            className="form-input"
          >
            <option value="" disabled>
              Seleccioná una opción
            </option>
            <option value="buy">Comprar suplementos</option>
            <option value="quote">Presupuesto / Cotización</option>
            <option value="support">Soporte / Consultas de pedidos</option>
            <option value="wholesale">Ventas Mayoristas</option>
            <option value="other">Otro motivo</option>
          </select>
        </div>

        <div className="radio-group-container">
          <p className="radio-group-title">¿Sos cliente nuestro?</p>
          <div className="radio-options">
            <label className="radio-label">
              <input
                type="radio"
                name="isClient"
                value="yes"
                checked={formData.isClient === "yes"}
                onChange={handleChange}
              />
              Sí
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="isClient"
                value="no"
                checked={formData.isClient === "no"}
                onChange={handleChange}
              />
              No
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="message">Mensaje / Consulta</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            placeholder="Escribí aquí tu consulta o requerimiento..."
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
