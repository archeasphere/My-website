import React, { useState } from 'react';
import { saveData, STORAGE_KEYS, loadStoredData } from '../articles';
import ShopItemEditor from './ShopItemEditor';
import QuestEditor from './QuestEditor';
import './AdminEditor.css';

const AdminEditor = ({ onClose, npcData = null }) => {
  const [formData, setFormData] = useState(npcData || {
    id: '',
    name: '',
    role: '',
    location: '',
    description: '',
    image: null,
    quests: [],
    shopItems: [],
    lastEdited: new Date().toISOString(),
    editedBy: 'Admin'
  });

  const [previewImage, setPreviewImage] = useState(npcData?.image || null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { npcs } = loadStoredData();
    
    // Update or add new NPC
    const updatedNpcs = formData.id && npcs.find(n => n.id === formData.id)
      ? npcs.map(npc => npc.id === formData.id ? { ...formData, lastEdited: new Date().toISOString() } : npc)
      : [...npcs, { ...formData, id: formData.name.toLowerCase().replace(/\s+/g, '-'), lastEdited: new Date().toISOString() }];

    saveData(updatedNpcs, STORAGE_KEYS.NPCS);
    onClose();
  };

  const handleQuestLineChange = (e) => {
    const questLines = e.target.value.split(',').map(q => q.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, questLines }));
  };

  return (
    <div className="admin-editor">
      <form onSubmit={handleSubmit}>
        <h2>{npcData ? 'Edit NPC' : 'Create New NPC'}</h2>
        
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label>Role:</label>
          <input
            type="text"
            value={formData.role}
            onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={formData.location}
            onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            required
            rows={5}
          />
        </div>

        <div className="form-group">
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Preview" />
            </div>
          )}
        </div>

        <QuestEditor
          quests={formData.quests}
          onChange={(quests) => setFormData(prev => ({ ...prev, quests: quests }))}
        />

        <ShopItemEditor
          items={formData.shopItems}
          onChange={(items) => setFormData(prev => ({ ...prev, shopItems: items }))}
        />

        <div className="button-group">
          <button type="submit" className="save-button">Save</button>
          <button type="button" onClick={onClose} className="cancel-button">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditor;
