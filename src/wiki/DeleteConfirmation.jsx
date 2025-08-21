import React from 'react';
import { loadStoredData, saveData, STORAGE_KEYS } from './articles';
import './DeleteConfirmation.css';

const DeleteConfirmation = ({ npcName, onConfirm, onCancel }) => {
  return (
    <div className="delete-overlay">
      <div className="delete-confirmation">
        <h3>Delete NPC</h3>
        <p>Are you sure you want to delete <span className="highlight">{npcName}</span>?</p>
        <p className="warning">This action cannot be undone.</p>
        <div className="button-group">
          <button onClick={onConfirm} className="delete-button">Delete</button>
          <button onClick={onCancel} className="cancel-button">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export const handleDeleteNpc = (npcId) => {
  const { npcs } = loadStoredData();
  const updatedNpcs = npcs.filter(npc => npc.id !== npcId);
  saveData(updatedNpcs, STORAGE_KEYS.NPCS);
};

export default DeleteConfirmation;
