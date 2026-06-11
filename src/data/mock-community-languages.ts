export interface CommunityLanguage {
  code: string;
  label: string;
  isPrimary: boolean;
}

/** Default community language used when no translation matches. */
export const DEFAULT_COMMUNITY_LANGUAGE = 'en';

export const MOCK_COMMUNITY_LANGUAGES: CommunityLanguage[] = [
  { code: 'en', label: 'English', isPrimary: true },
  { code: 'es', label: 'Spanish', isPrimary: false },
  { code: 'fr', label: 'French', isPrimary: false },
  { code: 'de', label: 'German', isPrimary: false },
  { code: 'ja', label: 'Japanese', isPrimary: false },
  { code: 'pt-BR', label: 'Portuguese (Brazil)', isPrimary: false },
];

export function getPrimaryCommunityLanguage(): CommunityLanguage {
  return (
    MOCK_COMMUNITY_LANGUAGES.find((l) => l.isPrimary) ??
    MOCK_COMMUNITY_LANGUAGES[0]
  );
}

export function isValidCommunityLanguageCode(code: string): boolean {
  return MOCK_COMMUNITY_LANGUAGES.some((l) => l.code === code);
}

export function getCommunityLanguageLabel(code: string): string {
  return MOCK_COMMUNITY_LANGUAGES.find((l) => l.code === code)?.label ?? code;
}
