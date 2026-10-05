export interface LocalizedText {
  et: string;
  en: string;
}

export interface Contact {
  team: LocalizedText;
  name: string;
  role: LocalizedText;
  email: string;
  phone: string;
  hours: LocalizedText;
  help: LocalizedText;
}

export type StatusFilter = "All" | "Pending" | "Completed";
