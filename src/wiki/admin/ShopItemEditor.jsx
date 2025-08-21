import React, { useState } from 'react';
import './ShopItemEditor.css';

const ShopItemEditor = ({ items = [], onChange }) => {
  const [newItem, setNewItem] = useState({
    name: '',
    image: null,
    buyPrice: '',
    sellPrice: '',
  });
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setNewItem(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.buyPrice && newItem.sellPrice) {
      const updatedItems = [...items, { ...newItem, id: Date.now() }];
      onChange(updatedItems);
      setNewItem({
        name: '',
        image: null,
        buyPrice: '',
        sellPrice: '',
      });
      setPreviewImage(null);
    }
  };

  const handleDeleteItem = (itemId) => {
    const updatedItems = items.filter(item => item.id !== itemId);
    onChange(updatedItems);
  };

  return (
    <div className="shop-editor">
      <h3>Shop Items</h3>
      
      <div className="shop-items-table">
        <div className="table-header">
          <div className="col-image">Image</div>
          <div className="col-name">Item Name</div>
          <div className="col-price">Buy Price</div>
          <div className="col-price">Sell Price</div>
          <div className="col-actions">Actions</div>
        </div>
        
        {items.map(item => (
          <div key={item.id} className="table-row">
            <div className="col-image">
              {item.image && <img src={item.image} alt={item.name} />}
            </div>
            <div className="col-name">{item.name}</div>
            <div className="col-price">{item.buyPrice}</div>
            <div className="col-price">{item.sellPrice}</div>
            <div className="col-actions">
              <button 
                onClick={() => handleDeleteItem(item.id)}
                className="delete-item"
                aria-label="Delete item"
              >
                ×
              </button>
            </div>
          </div>
        ))}
        
        <div className="table-row new-item">
          <div className="col-image">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="item-image"
            />
            {previewImage && <img src={previewImage} alt="Preview" />}
          </div>
          <div className="col-name">
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Item name"
            />
          </div>
          <div className="col-price">
            <input
              type="number"
              value={newItem.buyPrice}
              onChange={(e) => setNewItem(prev => ({ ...prev, buyPrice: e.target.value }))}
              placeholder="Buy price"
            />
          </div>
          <div className="col-price">
            <input
              type="number"
              value={newItem.sellPrice}
              onChange={(e) => setNewItem(prev => ({ ...prev, sellPrice: e.target.value }))}
              placeholder="Sell price"
            />
          </div>
          <div className="col-actions">
            <button 
              onClick={handleAddItem}
              className="add-item"
              disabled={!newItem.name || !newItem.buyPrice || !newItem.sellPrice}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopItemEditor;
