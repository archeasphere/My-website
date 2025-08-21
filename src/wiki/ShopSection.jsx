import React from 'react';
import './ShopSection.css';

const ShopSection = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="shop-section">
      <h3>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H2v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6h-6zm-6-2h4v2h-4V4zM9 18V9l7.5 4L9 18z"/>
        </svg>
        Shop Items
      </h3>
      <div className="shop-items">
        {items.map((item) => (
          <div key={item.id} className="shop-item">
            <div className="item-image">
              {item.image && <img src={item.image} alt={item.name} />}
            </div>
            <div className="item-name">{item.name}</div>
            <div className="item-price buy-price">Buy: {item.buyPrice}g</div>
            <div className="item-price sell-price">Sell: {item.sellPrice}g</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopSection;
