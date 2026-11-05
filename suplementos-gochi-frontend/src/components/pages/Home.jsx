import HeroAutoCarousel from "../HeroAutoCarousel";
import FastCarousel from "../FastCarousel";

const categoriesData = [
  { id: "Proteínas", name: "Proteínas", img: "/carousel/proteinas.webp" },
  { id: "Creatinas", name: "Creatinas", img: "/carousel/creatinas.webp" },
  { id: "Pre-entrenos", name: "Pre-entrenos", img: "/carousel/pre-entrenos.webp" },
  { id: "Aminoácidos", name: "Aminoácidos", img: "/carousel/aminoacidos.webp" },
  { id: "Vitaminas", name: "Vitaminas", img: "/carousel/vitaminas.webp" },
  { id: "Barritas", name: "Barritas", img: "/carousel/barritas.webp" },
];

function Home() {
  return (
    <>
      <HeroAutoCarousel
        imgSrc="/carousel/hero-grid-2.png"
        altText="Suplementos Gochi"
      />

      <FastCarousel categories={categoriesData} />

      <section className="reasons-section">
        <h2 className="reasons-title">¿Por qué elegirnos?</h2>
        <div className="reasons-container">
          <div className="reasons-card">
            <h3>🏆 Productos Certificados</h3>
            <p>
              Trabajamos únicamente con marcas reconocidas y certificadas. Cada producto pasa por un
              control de calidad antes de llegar a tus manos.
            </p>
          </div>

          <div className="reasons-card">
            <h3>🚚 Envío Rápido</h3>
            <p>
              Despachamos a todo Argentina en 24-72hs hábiles. Seguimiento en tiempo real de tu pedido
              desde el momento en que lo procesamos.
            </p>
          </div>

          <div className="reasons-card">
            <h3>💳 Pagos Seguros</h3>
            <p>
              Tu información está protegida. Aceptamos todas las tarjetas de crédito, débito, transferencias
              y MercadoPago con la máxima seguridad.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
