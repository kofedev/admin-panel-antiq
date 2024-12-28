export interface Language {
  languageId: number,
  languageCode: string,
  languageName: string,
  isActive: boolean,
  byDefault: boolean,
  isInitial?: boolean
}
