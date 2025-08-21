import React, { useState } from 'react';
import { loadStoredData, STORAGE_KEYS } from '../articles';
import './ArmorEditor.css';

const ArmorEditor = ({ armorData, onClose }) => {
  const initialState = armorData || {
    name: '',
    type: 'light',
    rarity: 'common',
    stats: {
      defense: 0,
      weight: 0
    },
    description: '',
    image: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [imagePreview, setImagePreview] = useState(initialState.image);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { armor } = loadStoredData();
    
    const newArmor = {
      ...formData,
      id: armorData ? armorData.id : Date.now(),
      lastEdited: new Date().toISOString(),
      editedBy: 'Admin' // This could be replaced with actual user name if you implement user system
    };

    const updatedArmor = armorData
      ? armor.map(item => item.id === armorData.id ? newArmor : item)
      : [...armor, newArmor];

    localStorage.setItem(STORAGE_KEYS.ARMOR, JSON.stringify(updatedArmor));
    onClose();
    window.location.reload();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStatsChange = (stat, value) => {
    setFormData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: parseFloat(value) || 0
      }
    }));
  };

  return (
    <div className="armor-editor">
      <div className="editor-header">
        <h2>{armorData ? 'Edit Armor' : 'Add New Armor'}</h2>
        <button onClick={onClose} className="close-button">×</button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label>Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="light">Light</option>
            <option value="medium">Medium</option>
            <option value="heavy">Heavy</option>
            <option value="special">Special</option>
          </select>
        </div>

        <div className="form-group">
          <label>Rarity</label>
          <select
            value={formData.rarity}
            onChange={(e) => setFormData(prev => ({ ...prev, rarity: e.target.value }))}
          >
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>

        <div className="form-group">
          <label>Stats</label>
          <div className="stats-grid">
            <div className="stat-input">
              <label>Defense</label>
              <input
                type="number"
                value={formData.stats.defense}
                onChange={(e) => handleStatsChange('defense', e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
            <div className="stat-input">
              <label>Weight</label>
              <input
                type="number"
                value={formData.stats.weight}
                onChange={(e) => handleStatsChange('weight', e.target.value)}
                min="0"
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Image</label>
          <div className="image-upload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="save-button">
            {armorData ? 'Save Changes' : 'Add Armor'}
          </button>
          <button type="button" onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArmorEditor;
