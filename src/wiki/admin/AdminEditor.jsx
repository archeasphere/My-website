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
    questLines: [], // Added this field that was referenced in handleQuestLineChange
    lastEdited: new Date().toISOString(),
    editedBy: 'Admin'
  });

  const [previewImage, setPreviewImage] = useState(npcData?.image || null);
  const [errors, setErrors] = useState({}); // Added error state
  const [isSubmitting, setIsSubmitting] = useState(false); // Added loading state

  // Improved image validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image must be smaller than 2MB' }));
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file' }));
        return;
      }

      // Clear previous errors
      setErrors(prev => ({ ...prev, image: null }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.onerror = () => {
        setErrors(prev => ({ ...prev, image: 'Failed to read image file' }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate unique ID
  const generateUniqueId = (name, existingNpcs) => {
    let baseId = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').trim('-');
    let id = baseId;
    let counter = 1;

    while (existingNpcs.some(npc => npc.id === id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }

    return id;
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { npcs } = loadStoredData();
      
      let updatedNpcs;
      
      if (formData.id && npcs.find(n => n.id === formData.id)) {
        // Update existing NPC
        updatedNpcs = npcs.map(npc => 
          npc.id === formData.id 
            ? { ...formData, lastEdited: new Date().toISOString() } 
            : npc
        );
      } else {
        // Create new NPC with unique ID
        const uniqueId = generateUniqueId(formData.name, npcs);
        updatedNpcs = [...npcs, { 
          ...formData, 
          id: uniqueId, 
          lastEdited: new Date().toISOString() 
        }];
      }

      await saveData(updatedNpcs, STORAGE_KEYS.NPCS);
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to save NPC data. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuestLineChange = (e) => {
    const questLines = e.target.value.split(',').map(q => q.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, questLines }));
  };

  // Helper to render error messages
  const renderError = (fieldName) => {
    return errors[fieldName] ? (
      <span className="error-message">{errors[fieldName]}</span>
    ) : null;
  };

  return (
    <div className="admin-editor">
      <form onSubmit={handleSubmit}>
        <h2>{npcData ? 'Edit NPC' : 'Create New NPC'}</h2>
        
        {errors.submit && (
          <div className="error-banner">{errors.submit}</div>
        )}
        
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={errors.name ? 'error' : ''}
            required
          />
          {renderError('name')}
        </div>

        <div className="form-group">
          <label>Role:</label>
          <input
            type="text"
            value={formData.role}
            onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
            className={errors.role ? 'error' : ''}
            required
          />
          {renderError('role')}
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input
            type="text"
            value={formData.location}
            onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className={errors.location ? 'error' : ''}
            required
          />
          {renderError('location')}
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={errors.description ? 'error' : ''}
            required
            rows={5}
          />
          {renderError('description')}
        </div>

        {/* Added the missing Quest Lines field */}
        <div className="form-group">
          <label>Quest Lines (comma-separated):</label>
          <input
            type="text"
            value={formData.questLines?.join(', ') || ''}
            onChange={handleQuestLineChange}
            placeholder="e.g. main-story, side-quest, daily"
          />
        </div>

        <div className="form-group">
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={errors.image ? 'error' : ''}
          />
          {renderError('image')}
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
          <button 
            type="submit" 
            className="save-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditor;