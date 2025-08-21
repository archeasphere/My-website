
import React, { useState } from 'react';
import WikiHome from './wiki/WikiHome';
import WikiNav from './wiki/WikiNav';
import WikiArticle from './wiki/WikiArticle';
import { articles } from './wiki/articles';
import './wiki/wiki.css';

function App() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedArticle = articles.find(a => a.id === selectedId);

  return (
    <div className="app-container">
      <WikiNav articles={articles} onSelect={setSelectedId} />
      <div className="main-content">
        {!selectedId ? <WikiHome /> : <WikiArticle article={selectedArticle} />}
      </div>
    </div>
  );
}

export default App;
