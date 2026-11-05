import { NavLink } from "react-router-dom";
import "../../styles/Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <ul className="footer-nav">
          <li>
            <NavLink className="footer-link" to="/">
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink className="footer-link" to="/products">
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink className="footer-link" to="/contacto">
              Contacto
            </NavLink>
          </li>
        </ul>
        
        <p className="footer-copy">© 2026 Suplementos Gochi. Todos los derechos reservados.</p>
        
        <div className="footer-social">
          <a href="https://www.instagram.com/suplementosgochi" target="_blank" rel="noreferrer" className="social-icon" aria-label="Instagram">
            <i className="fa-brands fa-instagram"></i>
          </a>
          <a href="https://wa.me/541166818345" target="_blank" rel="noreferrer" className="social-icon" aria-label="WhatsApp">
            <i className="fa-brands fa-whatsapp"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
