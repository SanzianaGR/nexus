// localStorage utility functions

export const storage = {
  // Save puzzle to cache
  savePuzzle: (key, puzzle) => {
    try {
      const cached = JSON.parse(localStorage.getItem('nexus_puzzles') || '{}');
      cached[key] = { puzzle, timestamp: Date.now() };
      localStorage.setItem('nexus_puzzles', JSON.stringify(cached));
    } catch (error) {
      console.error('Failed to save puzzle:', error);
    }
  },

  // Get cached puzzle
  getPuzzle: (key, maxAge = 24 * 60 * 60 * 1000) => { // 24 hours default
    try {
      const cached = JSON.parse(localStorage.getItem('nexus_puzzles') || '{}');
      const entry = cached[key];

      if (entry && Date.now() - entry.timestamp < maxAge) {
        return entry.puzzle;
      }
      return null;
    } catch (error) {
      console.error('Failed to get puzzle:', error);
      return null;
    }
  },

  // Save user preferences
  savePreference: (key, value) => {
    try {
      localStorage.setItem(`nexus_pref_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save preference:', error);
    }
  },

  // Get user preference
  getPreference: (key, defaultValue = null) => {
    try {
      const value = localStorage.getItem(`nexus_pref_${key}`);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error('Failed to get preference:', error);
      return defaultValue;
    }
  },

  // Clear all cached puzzles
  clearPuzzles: () => {
    try {
      localStorage.removeItem('nexus_puzzles');
    } catch (error) {
      console.error('Failed to clear puzzles:', error);
    }
  },
};
