const STORAGE_KEY = "pokemon-tracker-ignored-duplicates";

function getStoredKeys(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (value): value is string => typeof value === "string"
    );
  } catch {
    return [];
  }
}

export function getIgnoredDuplicateKeys(): string[] {
  return getStoredKeys();
}

export function isDuplicateIgnored(key: string): boolean {
  return getStoredKeys().includes(key);
}

export function ignoreDuplicate(key: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const keys = getStoredKeys();

  if (keys.includes(key)) {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([...keys, key])
  );
}

export function restoreDuplicate(key: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const keys = getStoredKeys().filter(
    (storedKey) => storedKey !== key
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(keys)
  );
}