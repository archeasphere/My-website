import React from 'react';
import './QuestSection.css';

const QuestSection = ({ quests = [] }) => {
  if (!quests || quests.length === 0) return null;

  return (
    <div className="quest-section">
      <h3>
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/>
        </svg>
        Quests
      </h3>
      <div className="quest-list">
        {quests.map((quest, index) => (
          <div key={index} className="quest-card">
            <div className="quest-header">
              <h4>{quest.name}</h4>
              <div className="quest-status" data-status={quest.status || 'available'}>
                {quest.status || 'Available'}
              </div>
            </div>
            <div className="quest-content">
              <p className="quest-description">{quest.description}</p>
              {quest.rewards && (
                <div className="quest-rewards">
                  <h5>Rewards:</h5>
                  <ul>
                    {quest.rewards.map((reward, idx) => (
                      <li key={idx}>{reward}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestSection;
