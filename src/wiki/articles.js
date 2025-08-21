// Wiki data structure
export const articles = [
  {
    id: 'npcs',
    title: 'NPCs',
    content: 'Directory of all NPCs in the world.',
    type: 'category'
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    content: 'How to join the Minecraft server, rules, and basic info.',
    type: 'article'
  },
  {
    id: 'armor',
    title: 'Armor',
    content: 'Directory of all armor types and sets in the game.',
    type: 'category'
  }
];

// NPC data structure
export const npcData = [];

// Local Storage Keys
export const STORAGE_KEYS = {
  NPCS: 'bgs-npcs-data',
  ARTICLES: 'bgs-articles-data',
  ARMOR: 'bgs-armor-data'
};

// Default armor data
export const armorData = [];

// Load data from localStorage or use defaults
export const loadStoredData = () => {
  try {
    const storedNpcs = localStorage.getItem(STORAGE_KEYS.NPCS);
    const storedArticles = localStorage.getItem(STORAGE_KEYS.ARTICLES);
    const storedArmor = localStorage.getItem(STORAGE_KEYS.ARMOR);
    
    return {
      npcs: storedNpcs ? JSON.parse(storedNpcs) : npcData,
      articles: storedArticles ? JSON.parse(storedArticles) : articles,
      armor: storedArmor ? JSON.parse(storedArmor) : armorData
    };
  } catch (error) {
    console.error('Error loading stored data:', error);
    return { npcs: npcData, articles: articles };
  }
};

// Save data to localStorage
export const saveData = (data, key) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};
