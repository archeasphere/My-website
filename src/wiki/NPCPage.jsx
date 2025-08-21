import React, { useState } from 'react';
import { loadStoredData } from './articles';
import AdminEditor from './admin/AdminEditor';
import DeleteConfirmation, { handleDeleteNpc } from './DeleteConfirmation';
import { isAdmin } from '../utils/adminAuth';
import './NPCPage.css';

const NPCPage = ({ npcId, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { npcs } = loadStoredData();
  const npc = npcs.find(n => n.id === npcId);
  const adminMode = isAdmin();

  const handleDelete = () => {
    handleDeleteNpc(npcId);
    onBack();
    window.location.reload(); // Refresh to show updated list
  };

  if (!npc) {
    return (
      <div className="npc-page">
        <h2>NPC Not Found</h2>
        <button onClick={onBack} className="back-button">Return to Directory</button>
      </div>
    );
  }

  return (
    <div className="npc-page">
      <button onClick={onBack} className="back-button">← Back to Directory</button>
      
      <div className="npc-content">
        <div className="npc-header">
          <h2>{npc.name}</h2>
          {adminMode && (
            <div className="header-actions">
              <button onClick={() => setIsEditing(true)} className="edit-button">
                Edit NPC
              </button>
              <button onClick={() => setShowDeleteConfirm(true)} className="delete-button">
                Delete NPC
              </button>
            </div>
          )}
        </div>

        <div className="npc-details">
          {npc.image && (
            <div className="npc-main-image">
              <img src={npc.image} alt={npc.name} />
            </div>
          )}

          <div className="npc-info">
            <div className="info-section">
              <h3>Role</h3>
              <p>{npc.role}</p>
            </div>

            <div className="info-section">
              <h3>Location</h3>
              <p>📍 {npc.location}</p>
            </div>

            <div className="info-section">
              <h3>Description</h3>
              <p>{npc.description}</p>
            </div>

            {npc.questLines?.length > 0 && (
              <div className="info-section">
                <h3>Quest Lines</h3>
                <ul className="quest-list">
                  {npc.questLines.map(quest => (
                    <li key={quest}>{quest}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="info-section metadata">
              <p>Last edited: {new Date(npc.lastEdited).toLocaleDateString()}</p>
              <p>Editor: {npc.editedBy}</p>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="admin-overlay">
          <AdminEditor
            npcData={npc}
            onClose={() => setIsEditing(false)}
          />
        </div>
      )}

      {showDeleteConfirm && (
        <DeleteConfirmation
          npcName={npc.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default NPCPage;
