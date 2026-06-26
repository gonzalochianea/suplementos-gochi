import PropTypes from "prop-types";
import "../styles/HeroAutoCarousel.css";

function HeroAutoCarousel({ imgSrc, altText }) {
  return (
    <div className="hero-auto-carousel">
      <div className="hero-slide active">
        <img 
          src={imgSrc} 
          alt={altText} 
          className="hero-img" 
        />
      </div>
    </div>
  );
}

HeroAutoCarousel.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
};

export default HeroAutoCarousel;
