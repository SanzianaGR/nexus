import { useState, useCallback } from 'react';

export function useScore() {
  const [baseScore] = useState(1000);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);

  const addMistake = useCallback(() => {
    setMistakes(m => m + 1);
  }, []);

  const addHint = useCallback(() => {
    setHintsUsed(h => h + 1);
  }, []);

  const updateTime = useCallback((seconds) => {
    setTimeSpent(seconds);
  }, []);

  const calculateScore = useCallback(() => {
    // Base: 1000 points
    // Time penalty: -1 point per second
    // Hint penalty: -10 per hint
    // Accuracy bonus: +50 if no mistakes

    let score = baseScore;
    score -= timeSpent; // Time penalty
    score -= hintsUsed * 10; // Hint penalty

    if (mistakes === 0) {
      score += 50; // Perfect accuracy bonus
    }

    return Math.max(0, score); // Never negative
  }, [baseScore, timeSpent, hintsUsed, mistakes]);

  const getAccuracy = useCallback(() => {
    if (mistakes === 0) return 100;
    // This is a simplified accuracy - you might want to track total attempts
    return Math.max(0, 100 - (mistakes * 10));
  }, [mistakes]);

  const reset = useCallback(() => {
    setHintsUsed(0);
    setMistakes(0);
    setTimeSpent(0);
  }, []);

  return {
    hintsUsed,
    mistakes,
    timeSpent,
    addMistake,
    addHint,
    updateTime,
    calculateScore,
    getAccuracy,
    reset,
  };
}
