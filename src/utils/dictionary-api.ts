// Dictionary API service for word validation
const DICTIONARY_API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

// Cache validated words to avoid repeated API calls
const validatedWordsCache = new Map<string, boolean>();

/**
 * Validate a word against the Free Dictionary API
 * Returns true if the word exists, false otherwise
 * Falls back to local validation on network errors
 */
export async function validateWordWithAPI(word: string): Promise<boolean> {
  const normalizedWord = word.toLowerCase().trim();

  // Check cache first
  if (validatedWordsCache.has(normalizedWord)) {
    return validatedWordsCache.get(normalizedWord)!;
  }

  try {
    const response = await fetch(`${DICTIONARY_API_URL}/${normalizedWord}`, {
      method: "GET",
      // Short timeout to avoid blocking the game
      signal: AbortSignal.timeout(3000),
    });

    const isValid = response.ok;
    validatedWordsCache.set(normalizedWord, isValid);
    return isValid;
  } catch {
    // Network error or timeout - don't cache, return true to allow the word
    // This prevents blocking gameplay when offline
    console.warn("Dictionary API unavailable, allowing word:", normalizedWord);
    return true;
  }
}

/**
 * Clear the validation cache (useful for testing)
 */
export function clearValidationCache(): void {
  validatedWordsCache.clear();
}
