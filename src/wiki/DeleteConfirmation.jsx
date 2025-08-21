import React from 'react';
import { loadStoredData, saveData, STORAGE_KEYS } from './articles';
import './DeleteConfirmation.css';

const DeleteConfirmation = ({ npcName, itemName, onConfirm, onCancel }) => {
  const name = npcName || itemName;
  const type = npcName ? 'NPC' : 'Item';
  
  return (
    <div className="delete-overlay">
      <div className="delete-confirmation">
        <h3>Delete {type}</h3>
        <p>Are you sure you want to delete <span className="highlight">{name}</span>?</p>
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

export const handleDeleteArmor = (armorId) => {
  const { armor } = loadStoredData();
  const updatedArmor = armor.filter(item => item.id !== armorId);
  saveData(updatedArmor, STORAGE_KEYS.ARMOR);
};

export default DeleteConfirmation;
