import PropTypes from "prop-types";
import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/FastCarousel.css";

function FastCarousel({ categories }) {
  const containerRef = useRef(null);
  const scrollInterval = useRef(null);
  const navigate = useNavigate();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scrollAmount = 15; // Velocidad del scroll (bastante rápida, según el pedido)

  const updateScrollButtons = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  const startScrolling = (direction) => {
    stopScrolling();
    scrollInterval.current = setInterval(() => {
      if (containerRef.current) {
        containerRef.current.scrollLeft += (direction === "right" ? scrollAmount : -scrollAmount);
        updateScrollButtons();
      }
    }, 10);
  };

  const stopScrolling = () => {
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }
  };

  useEffect(() => {
    const handleMouseUp = () => stopScrolling();
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);

    // Check initial state
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("resize", updateScrollButtons);
      stopScrolling();
    };
  }, []);

  const handleCardClick = (id) => {
    navigate("/products", { state: { category: id } });
  };

  return (
    <section className="fast-carousel-section">
      <h2 className="fast-carousel-title">SUPLEMENTOS</h2>

      <div className="fast-carousel-wrapper">
        {canScrollLeft && (
          <button
            className="carousel-arrow arrow-left"
            onMouseDown={() => startScrolling("left")}
            onTouchStart={(e) => { e.preventDefault(); startScrolling("left"); }}
            onMouseLeave={stopScrolling}
          >
            &#10094;
          </button>
        )}

        <div className="fast-carousel-container" ref={containerRef} onScroll={updateScrollButtons}>
          {categories.map((cat) => (
            <div key={cat.id} className="fast-card" onClick={() => handleCardClick(cat.id)}>
              <img src={cat.img} alt={cat.name} />
              <div className="fast-card-overlay">
                <h3>{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {canScrollRight && (
          <button
            className="carousel-arrow arrow-right"
            onMouseDown={() => startScrolling("right")}
            onTouchStart={(e) => { e.preventDefault(); startScrolling("right"); }}
            onMouseLeave={stopScrolling}
          >
            &#10095;
          </button>
        )}
      </div>
    </section>
  );
}

FastCarousel.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      img: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FastCarousel;
