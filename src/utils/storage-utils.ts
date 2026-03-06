import { STORAGE_KEYS } from "@/constants/constants";
import { ArchiveRecord, ScoreData } from "@/types/types";

export const SCORES_UPDATED_EVENT = "wordly:scores-updated";
export const ARCHIVE_UPDATED_EVENT = "wordly:archive-updated";

function readStoredArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Failed to read ${key} from localStorage:`, error);
    return [];
  }
}

function writeStoredArray<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readScores(): ScoreData[] {
  return readStoredArray<ScoreData>(STORAGE_KEYS.SCORES);
}

export function appendScoreRecord(record: ScoreData) {
  const scores = readScores();
  scores.push(record);
  writeStoredArray(STORAGE_KEYS.SCORES, scores);
  window.dispatchEvent(new Event(SCORES_UPDATED_EVENT));
}

export function readArchiveRecords(): ArchiveRecord[] {
  return readStoredArray<ArchiveRecord>(STORAGE_KEYS.ARCHIVE_COMPLETED);
}

export function upsertArchiveRecord(record: ArchiveRecord) {
  const records = readArchiveRecords();
  const existingIndex = records.findIndex(
    (item) => item.puzzleNumber === record.puzzleNumber
  );

  if (existingIndex >= 0) {
    records[existingIndex] = record;
  } else {
    records.push(record);
  }

  writeStoredArray(STORAGE_KEYS.ARCHIVE_COMPLETED, records);
  window.dispatchEvent(new Event(ARCHIVE_UPDATED_EVENT));
}
