import React, { useState } from 'react';
import { loadStoredData } from './articles';
import AdminEditor from './admin/ArmorEditor';
import DeleteConfirmation, { handleDeleteArmor } from './DeleteConfirmation';
import { isAdmin } from '../utils/adminAuth';
import './ArmorPage.css';

const ArmorPage = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { armor } = loadStoredData();
  const adminMode = isAdmin();

  const handleDelete = (armorId) => {
    // This will be implemented similarly to NPC delete
    handleDeleteArmor(armorId);
    onBack();
    window.location.reload();
  };

  // Filter armor based on search query
  const filteredArmor = armor?.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="armor-page">
      <div className="armor-header">
        <button onClick={onBack} className="back-button">← Back to Directory</button>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search armor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        {adminMode && (
          <button onClick={() => setIsEditing(true)} className="add-armor-button">
            Add New Armor
          </button>
        )}
      </div>

      <div className="armor-grid">
        {filteredArmor.map((item) => (
          <div key={item.id} className="armor-card">
            <div className="armor-card-header">
              <h3>{item.name}</h3>
              {adminMode && (
                <div className="armor-actions">
                  <button 
                    onClick={() => setIsEditing(item)}
                    className="edit-button"
                    aria-label="Edit armor"
                  >
                    ✎
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(item.id)}
                    className="delete-button"
                    aria-label="Delete armor"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            
            {item.image && (
              <div className="armor-image">
                <img src={item.image} alt={item.name} />
              </div>
            )}

            <div className="armor-details">
              <div className="info-section">
                <h4>Type</h4>
                <p>{item.type}</p>
              </div>

              <div className="info-section">
                <h4>Rarity</h4>
                <p>{item.rarity}</p>
              </div>

              <div className="info-section">
                <h4>Stats</h4>
                <ul className="stats-list">
                  {item.stats && Object.entries(item.stats).map(([stat, value]) => (
                    <li key={stat}>{stat}: {value}</li>
                  ))}
                </ul>
              </div>

              {item.description && (
                <div className="info-section">
                  <h4>Description</h4>
                  <p>{item.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="admin-overlay">
          <AdminEditor
            armorData={typeof isEditing === 'object' ? isEditing : null}
            onClose={() => setIsEditing(false)}
          />
        </div>
      )}

      {showDeleteConfirm && (
        <DeleteConfirmation
          itemName={armor.find(a => a.id === showDeleteConfirm)?.name}
          onConfirm={() => handleDelete(showDeleteConfirm)}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default ArmorPage;
