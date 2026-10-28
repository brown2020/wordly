import { STORAGE_KEYS } from "@/constants/constants";
import { ArchiveRecord, ScoreData } from "@/types/types";

export const SCORES_UPDATED_EVENT = "wordly:scores-updated";
export const ARCHIVE_UPDATED_EVENT = "wordly:archive-updated";

function readStoredArray(key: string): unknown[] {
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

export function isScoreRecord(value: unknown): value is ScoreData {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ScoreData>;
  if (typeof record.date !== "string" || !Number.isFinite(Date.parse(record.date))) {
    return false;
  }
  if (typeof record.attempts !== "number" || !Number.isFinite(record.attempts)) {
    return false;
  }
  if (typeof record.word !== "string" || record.word.length === 0) {
    return false;
  }
  return true;
}

export function sanitizeScoreRecords(value: unknown): ScoreData[] {
  if (!Array.isArray(value)) return [];
  return value.filter(isScoreRecord);
}

function isArchiveRecord(value: unknown): value is ArchiveRecord {
  if (!value || typeof value !== "object") return false;
  const record = value as Partial<ArchiveRecord>;
  return (
    typeof record.puzzleNumber === "number" &&
    Number.isInteger(record.puzzleNumber) &&
    typeof record.attempts === "number" &&
    Number.isFinite(record.attempts) &&
    typeof record.isWin === "boolean"
  );
}

function writeStoredArray<T>(key: string, value: T[]) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readScores(): ScoreData[] {
  return sanitizeScoreRecords(readStoredArray(STORAGE_KEYS.SCORES));
}

export function hasRecordedCompletion(
  record: ScoreData,
  existing: ScoreData[]
): boolean {
  if (
    (record.mode === "daily" || record.mode === "archive") &&
    typeof record.puzzleNumber === "number"
  ) {
    return existing.some(
      (score) =>
        score.mode === record.mode && score.puzzleNumber === record.puzzleNumber
    );
  }
  return false;
}

export function appendScoreRecord(record: ScoreData) {
  const scores = readScores();
  if (!isScoreRecord(record) || hasRecordedCompletion(record, scores)) {
    return;
  }
  scores.push(record);
  writeStoredArray(STORAGE_KEYS.SCORES, scores);
  window.dispatchEvent(new Event(SCORES_UPDATED_EVENT));
}

export function readArchiveRecords(): ArchiveRecord[] {
  return readStoredArray(STORAGE_KEYS.ARCHIVE_COMPLETED).filter(isArchiveRecord);
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
