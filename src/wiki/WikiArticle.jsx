import React, { useState } from 'react';
import './wiki.css';
import NPCDirectory from './NPCDirectory';
import NPCPage from './NPCPage';
import AdminEditor from './admin/AdminEditor';
import { isAdmin } from '../utils/adminAuth';

const WikiArticle = ({ article }) => {
  const [selectedNpcId, setSelectedNpcId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const adminMode = isAdmin();

  if (article.id === 'npcs') {
    if (selectedNpcId) {
      return (
        <div className="wiki-article">
          <NPCPage 
            npcId={selectedNpcId} 
            onBack={() => setSelectedNpcId(null)}
          />
        </div>
      );
    }

    return (
      <div className="wiki-article">
        <div className="article-header">
          <h2>{article.title}</h2>
          {adminMode && (
            <button onClick={() => {
              setIsEditing(true);
            }} className="new-npc-button">
              Add New NPC
            </button>
          )}
        </div>

        <NPCDirectory onSelectNpc={setSelectedNpcId} />

        {isEditing && (
          <div className="admin-overlay">
            <AdminEditor
              onClose={() => setIsEditing(false)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="wiki-article">
      <h2>{article.title}</h2>
      <div>{article.content}</div>
    </div>
  );

  return (
    <div className="wiki-article">
      <h2>{article.title}</h2>
      <div>{article.content}</div>
    </div>
  );
};

export default WikiArticle;
