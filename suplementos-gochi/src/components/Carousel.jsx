import { useState, useEffect } from "react";

function Carousel({ slides = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Avanzar automáticamente cada 5 segundos
  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [activeIndex, slides.length]); // Incluir handleNext requeriría useCallback, dejamos los valores dependientes.

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  if (!slides || slides.length === 0) {
    return null;
  }

  return (
    <div className="carousel-container">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === activeIndex ? "active" : ""}`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="carousel-image"
          />
          <div className="carousel-content">
            <h2 className="carousel-title">{slide.title}</h2>
            <p className="carousel-desc">{slide.description}</p>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="carousel-btn carousel-btn-prev"
            aria-label="Diapositiva anterior"
          >
            &#10094;
          </button>
          <button
            onClick={handleNext}
            className="carousel-btn carousel-btn-next"
            aria-label="Siguiente diapositiva"
          >
            &#10095;
          </button>

          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`indicator-dot ${index === activeIndex ? "active" : ""}`}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Carousel;
