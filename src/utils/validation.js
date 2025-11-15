// Answer validation with fuzzy matching using Levenshtein distance

function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(null));

  for (let i = 0; i <= len1; i++) matrix[0][i] = i;
  for (let j = 0; j <= len2; j++) matrix[j][0] = j;

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[len2][len1];
}

// Normalize string for comparison
function normalizeString(str) {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD') // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w\s]/g, ''); // Remove punctuation
}

// Check if answer is correct with fuzzy matching
export function validateAnswer(userAnswer, correctAnswer, threshold = 0.85) {
  const normalizedUser = normalizeString(userAnswer);
  const normalizedCorrect = normalizeString(correctAnswer);

  // Exact match
  if (normalizedUser === normalizedCorrect) {
    return { isCorrect: true, similarity: 1 };
  }

  // Calculate similarity
  const maxLen = Math.max(normalizedUser.length, normalizedCorrect.length);
  if (maxLen === 0) return { isCorrect: false, similarity: 0 };

  const distance = levenshteinDistance(normalizedUser, normalizedCorrect);
  const similarity = 1 - distance / maxLen;

  return {
    isCorrect: similarity >= threshold,
    similarity,
  };
}

// Check if answer contains the correct answer (for partial matching)
export function containsAnswer(userAnswer, correctAnswer) {
  const normalizedUser = normalizeString(userAnswer);
  const normalizedCorrect = normalizeString(correctAnswer);

  return normalizedUser.includes(normalizedCorrect) || normalizedCorrect.includes(normalizedUser);
}

// Get hint message based on attempt
export function getHintMessage(attempts) {
  const messages = [
    "Take your time! Think about the connections.",
    "Almost there! Check your spelling.",
    "Need a hint? Click the hint button!",
    "Don't give up! You're learning!",
  ];

  return messages[Math.min(attempts, messages.length - 1)];
}
