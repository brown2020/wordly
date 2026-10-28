// Dictionary API service for word validation
import { isValidWord } from "@/constants/valid-words";

const DICTIONARY_API_URL = "https://api.dictionaryapi.dev/api/v2/entries/en";

// Cache only definitive answers. Transport failures stay uncached so a
// later successful response can still accept an unknown word.
const validatedWordsCache = new Map<string, boolean>();

export function clearValidatedWordCache(): void {
  validatedWordsCache.clear();
}

/**
 * Accept bundled dictionary words without a network call.
 * Unknown words are accepted only when the dictionary API returns success.
 * HTTP 404 is a definitive miss. Other statuses and network errors are not
 * cached and do not accept the guess.
 */
export async function validateWordWithAPI(word: string): Promise<boolean> {
  const normalizedWord = word.toLowerCase().trim();
  if (!/^[a-z]{5}$/.test(normalizedWord)) {
    return false;
  }

  const cached = validatedWordsCache.get(normalizedWord);
  if (cached !== undefined) {
    return cached;
  }

  if (isValidWord(normalizedWord)) {
    validatedWordsCache.set(normalizedWord, true);
    return true;
  }

  try {
    const response = await fetch(
      `${DICTIONARY_API_URL}/${encodeURIComponent(normalizedWord)}`,
      {
        method: "GET",
        signal: AbortSignal.timeout(3000),
      }
    );

    if (response.status === 404) {
      validatedWordsCache.set(normalizedWord, false);
      return false;
    }

    if (!response.ok) {
      console.warn(
        "Dictionary API request failed, rejecting unknown word:",
        normalizedWord,
        response.status
      );
      return false;
    }

    validatedWordsCache.set(normalizedWord, true);
    return true;
  } catch {
    console.warn(
      "Dictionary API unavailable, falling back to local word list:",
      normalizedWord
    );
    return false;
  }
}
