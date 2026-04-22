export interface LocalPracticeIdentity {
  id: string;
  name: string;
}

const STORAGE_KEY = "keyclash.local-practice-identity";
const DEFAULT_NAME = "Local Runner";

function createLocalPracticeIdentity(): LocalPracticeIdentity {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? `local:${crypto.randomUUID()}`
      : `local:${Math.random().toString(36).slice(2, 12)}`;

  return {
    id,
    name: DEFAULT_NAME,
  };
}

export function getLocalPracticeIdentity(): LocalPracticeIdentity | null {
  if (typeof window === "undefined") {
    return null;
  }

  const storedValue = window.localStorage.getItem(STORAGE_KEY);
  if (storedValue) {
    try {
      const parsed = JSON.parse(storedValue) as Partial<LocalPracticeIdentity>;
      if (parsed.id && parsed.name) {
        return {
          id: parsed.id,
          name: parsed.name,
        };
      }
    } catch (error) {
      console.error("Failed to parse local practice identity:", error);
    }
  }

  const identity = createLocalPracticeIdentity();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
  return identity;
}
