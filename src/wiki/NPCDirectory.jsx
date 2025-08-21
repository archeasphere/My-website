import React, { useState } from 'react';
import { loadStoredData } from './articles';
import DeleteConfirmation, { handleDeleteNpc } from './DeleteConfirmation';
import { isAdmin } from '../utils/adminAuth';
import './NPCDirectory.css';

const NPCDirectory = ({ onSelectNpc }) => {
  const { npcs } = loadStoredData();
  const [deleteNpc, setDeleteNpc] = useState(null);
  const adminMode = isAdmin();

  const handleDeleteClick = (e, npc) => {
    e.stopPropagation();
    setDeleteNpc(npc);
  };

  const handleConfirmDelete = () => {
    handleDeleteNpc(deleteNpc.id);
    setDeleteNpc(null);
    window.location.reload(); // Refresh to show updated list
  };

  return (
    <div className="npc-directory">
      <h2>NPC Directory</h2>
      {npcs.length === 0 ? (
        <div className="empty-state">
          <p>No NPCs have been added yet. Use the "Add New NPC" button to create one!</p>
        </div>
      ) : (
        <div className="npc-grid">
          {npcs.map(npc => (
            <div 
              key={npc.id} 
              className="npc-card"
              onClick={() => onSelectNpc(npc.id)}
            >
              {npc.image && (
                <div className="npc-preview-image">
                  <img src={npc.image} alt={npc.name} />
                </div>
              )}
              <h3>{npc.name}</h3>
              <p className="npc-preview-role">{npc.role}</p>
              <p className="npc-preview-location">📍 {npc.location}</p>
              {adminMode && (
                <button 
                  className="delete-icon"
                  onClick={(e) => handleDeleteClick(e, npc)}
                  aria-label="Delete NPC"
                >
                  ✕
                </button>
              )}
              <button className="view-npc-button">View Details</button>
            </div>
          ))}
        </div>
      )}
      
      {deleteNpc && (
        <DeleteConfirmation
          npcName={deleteNpc.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteNpc(null)}
        />
      )}
    </div>
  );
};

export default NPCDirectory;
