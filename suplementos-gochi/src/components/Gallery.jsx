function Gallery({ items = [] }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section className="gallery-section">
      <h2 className="gallery-title">Categorías Destacadas</h2>
      <div className="gallery-grid">
        {items.map((item, index) => (
          <div key={index} className="gallery-item">
            <img
              src={item.image}
              alt={item.title}
              className="gallery-item-image"
            />
            <div className="gallery-item-overlay">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
