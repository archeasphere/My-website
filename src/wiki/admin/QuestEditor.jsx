import React, { useState } from 'react';
import './QuestEditor.css';

const QuestEditor = ({ quests = [], onChange }) => {
  const [newQuest, setNewQuest] = useState({
    name: '',
    description: '',
    status: 'permanent',
    rewards: []
  });
  const [newReward, setNewReward] = useState('');

  const handleAddQuest = () => {
    if (newQuest.name && newQuest.description) {
      const updatedQuests = [...quests, { ...newQuest, id: Date.now() }];
      onChange(updatedQuests);
      setNewQuest({
        name: '',
        description: '',
        status: 'available',
        rewards: []
      });
    }
  };

  const [editingQuest, setEditingQuest] = useState(null);
  const [editingReward, setEditingReward] = useState('');

  const handleDeleteQuest = (questId) => {
    const updatedQuests = quests.filter(quest => quest.id !== questId);
    onChange(updatedQuests);
  };

  const handleEditQuest = (quest) => {
    setEditingQuest({ ...quest, rewards: [...quest.rewards] });
  };

  const handleUpdateQuest = () => {
    if (editingQuest) {
      const updatedQuests = quests.map(q => 
        q.id === editingQuest.id ? editingQuest : q
      );
      onChange(updatedQuests);
      setEditingQuest(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingQuest(null);
    setEditingReward('');
  };

  const handleAddReward = (rewardText, isEditing = false) => {
    const trimmedReward = rewardText.trim();
    if (trimmedReward) {
      if (isEditing && editingQuest) {
        setEditingQuest(prev => ({
          ...prev,
          rewards: [...(prev.rewards || []), trimmedReward]
        }));
      } else {
        setNewQuest(prev => ({
          ...prev,
          rewards: [...(prev.rewards || []), trimmedReward]
        }));
      }
    }
  };

  const handleNewReward = (isEditing = false) => {
    const reward = isEditing ? editingReward : newReward;
    if (reward.trim()) {
      handleAddReward(reward, isEditing);
      if (isEditing) {
        setEditingReward('');
      } else {
        setNewReward('');
      }
    }
  };

  const handleRemoveReward = (index) => {
    setNewQuest(prev => ({
      ...prev,
      rewards: prev.rewards.filter((_, idx) => idx !== index)
    }));
  };

  return (
    <div className="quest-editor">
      <h3>Quest Management</h3>
      
      <div className="quest-list-editor">
        {quests.map(quest => (
          <div key={quest.id} className={`quest-item ${editingQuest?.id === quest.id ? 'editing' : ''}`}>
            {editingQuest?.id === quest.id ? (
              <div className="quest-edit-form">
                <div className="quest-edit-header">
                  <input
                    type="text"
                    value={editingQuest.name}
                    onChange={(e) => setEditingQuest(prev => ({ ...prev, name: e.target.value }))}
                    className="quest-input edit-name"
                    placeholder="Quest name"
                  />
                  <select
                    value={editingQuest.status}
                    onChange={(e) => setEditingQuest(prev => ({ ...prev, status: e.target.value }))}
                    className="quest-input edit-status"
                  >
                    <option value="permanent">Permanent</option>
                    <option value="event-active">Event - Active</option>
                    <option value="event-inactive">Event - Inactive</option>
                  </select>
                </div>
                <textarea
                  value={editingQuest.description}
                  onChange={(e) => setEditingQuest(prev => ({ ...prev, description: e.target.value }))}
                  className="quest-input edit-description"
                  placeholder="Quest description"
                  rows={3}
                />
                <div className="edit-rewards">
                  <div className="rewards-input">
                    <input
                      type="text"
                      value={editingReward}
                      onChange={(e) => setEditingReward(e.target.value)}
                      placeholder="Add reward"
                      className="quest-input"
                      onKeyPress={(e) => e.key === 'Enter' && handleNewReward(true)}
                    />
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleNewReward(true);
                      }}
                      className="add-reward"
                      disabled={!editingReward.trim()}
                    >
                      Add
                    </button>
                  </div>
                  <div className="rewards-list">
                    {editingQuest.rewards.map((reward, index) => (
                      <div key={index} className="reward-tag">
                        {reward}
                        <button onClick={(e) => {
                          e.preventDefault();
                          setEditingQuest(prev => ({
                            ...prev,
                            rewards: prev.rewards.filter((_, i) => i !== index)
                          }));
                        }}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="edit-actions">
                  <button onClick={handleUpdateQuest} className="save-edit" disabled={!editingQuest.name || !editingQuest.description}>
                    Save Changes
                  </button>
                  <button onClick={handleCancelEdit} className="cancel-edit">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="quest-item-header">
                  <div className="quest-title-group">
                    <h4>{quest.name}</h4>
                    <div className="quest-status" data-status={quest.status}>
                      {quest.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                  </div>
                  <div className="quest-actions">
                    <button 
                      onClick={() => handleEditQuest(quest)}
                      className="edit-quest"
                      aria-label="Edit quest"
                    >
                      ✎
                    </button>
                    <button 
                      onClick={() => handleDeleteQuest(quest.id)}
                      className="delete-quest"
                      aria-label="Delete quest"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <p className="quest-item-description">{quest.description}</p>
                {quest.rewards && quest.rewards.length > 0 && (
                  <div className="quest-item-rewards">
                    <span>Rewards: </span>
                    {quest.rewards.join(', ')}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="new-quest-form">
        <h4>Add New Quest</h4>
        <div className="form-group">
          <input
            type="text"
            value={newQuest.name}
            onChange={(e) => setNewQuest(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Quest name"
            className="quest-input"
          />
        </div>
        <div className="form-group">
          <textarea
            value={newQuest.description}
            onChange={(e) => setNewQuest(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Quest description"
            className="quest-input"
            rows={3}
          />
        </div>
        <div className="form-group">
          <select
            value={newQuest.status}
            onChange={(e) => setNewQuest(prev => ({ ...prev, status: e.target.value }))}
            className="quest-input"
          >
            <option value="permanent">Permanent</option>
            <option value="event-active">Event - Active</option>
            <option value="event-inactive">Event - Inactive</option>
          </select>
        </div>
        <div className="form-group rewards-group">
          <div className="rewards-input">
            <input
              type="text"
              value={newReward}
              onChange={(e) => setNewReward(e.target.value)}
              placeholder="Add reward"
              className="quest-input"
              onKeyPress={(e) => e.key === 'Enter' && handleNewReward()}
            />
            <button 
              onClick={() => handleNewReward()}
              className="add-reward"
              disabled={!newReward.trim()}
            >
              Add
            </button>
          </div>
          {newQuest.rewards.length > 0 && (
            <div className="rewards-list">
              {newQuest.rewards.map((reward, index) => (
                <div key={index} className="reward-tag">
                  {reward}
                  <button onClick={() => handleRemoveReward(index)}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleAddQuest}
          className="add-quest"
          disabled={!newQuest.name || !newQuest.description}
        >
          Add Quest
        </button>
      </div>
    </div>
  );
};

export default QuestEditor;
