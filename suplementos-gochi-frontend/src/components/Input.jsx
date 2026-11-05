import PropTypes from "prop-types";

// Enfoque reutilizable de campos de formulario estilizados
function Input({ label, value, onChange, labelId, type = "text", isRequired = false, placeholder = "" }) {
  return (
    <div className="form-group">
      <label htmlFor={labelId}>{label}</label>
      <input
        required={isRequired}
        type={type}
        value={value}
        onChange={onChange}
        id={labelId}
        name={labelId}
        placeholder={placeholder}
        className="form-input"
      />
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  labelId: PropTypes.string.isRequired,
  type: PropTypes.string,
  isRequired: PropTypes.bool,
  placeholder: PropTypes.string,
};

export default Input;