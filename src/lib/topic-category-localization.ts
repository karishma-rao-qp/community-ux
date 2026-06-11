import type {
  TopicCategory,
  TopicCategoryTranslation,
} from '@/data/mock-topic-categories';
import {
  CATEGORY_DESCRIPTION_MAX_LENGTH,
  CATEGORY_TITLE_MAX_LENGTH,
} from '@/data/mock-topic-categories';

export interface LocalizedCategory {
  title: string;
  description: string;
  languageUsed: string;
  usedFallback: boolean;
}

export interface TranslationFormValues {
  title: string;
  description: string;
}

export interface TranslationFormErrors {
  title?: string;
  description?: string;
}

function normalizeLanguageCode(code: string | null | undefined): string | null {
  if (!code?.trim()) return null;
  return code.trim().toLowerCase();
}

function languageBase(code: string): string {
  return code.split('-')[0].toLowerCase();
}

function findTranslation(
  translations: TopicCategoryTranslation[],
  categoryId: string,
  languageCode: string
): TopicCategoryTranslation | undefined {
  const normalized = normalizeLanguageCode(languageCode);
  if (!normalized) return undefined;

  return translations.find(
    (t) =>
      t.categoryId === categoryId &&
      normalizeLanguageCode(t.languageCode) === normalized &&
      t.title.trim().length > 0
  );
}

function findTranslationByBaseLanguage(
  translations: TopicCategoryTranslation[],
  categoryId: string,
  languageCode: string
): TopicCategoryTranslation | undefined {
  const base = languageBase(languageCode);
  return translations.find(
    (t) =>
      t.categoryId === categoryId &&
      languageBase(t.languageCode) === base &&
      t.title.trim().length > 0
  );
}

/**
 * Resolves localized category title and description with fallback order:
 * 1. Exact preferred (member) language translation
 * 2. Browser locale translation (exact, then language base)
 * 3. Primary/default category title and description
 */
export function getLocalizedCategory(
  category: TopicCategory,
  translations: TopicCategoryTranslation[],
  preferredLanguage: string | null | undefined,
  browserLocale: string | null | undefined,
  defaultLanguage: string
): LocalizedCategory {
  const fallback = {
    title: category.title,
    description: category.description,
    languageUsed: defaultLanguage,
    usedFallback: true,
  };

  const candidates: Array<{ code: string; match: 'exact' | 'base' }> = [];

  const preferred = normalizeLanguageCode(preferredLanguage);
  if (preferred) {
    candidates.push({ code: preferred, match: 'exact' });
    if (languageBase(preferred) !== preferred) {
      candidates.push({ code: languageBase(preferred), match: 'base' });
    }
  }

  const browser = normalizeLanguageCode(browserLocale);
  if (browser && browser !== preferred) {
    candidates.push({ code: browser, match: 'exact' });
    const browserBase = languageBase(browser);
    if (browserBase !== browser) {
      candidates.push({ code: browserBase, match: 'base' });
    }
  }

  for (const candidate of candidates) {
    const translation =
      candidate.match === 'exact'
        ? findTranslation(translations, category.id, candidate.code)
        : findTranslationByBaseLanguage(translations, category.id, candidate.code);

    if (translation) {
      return {
        title: translation.title,
        description:
          translation.description.trim().length > 0
            ? translation.description
            : category.description,
        languageUsed: translation.languageCode,
        usedFallback: false,
      };
    }
  }

  return fallback;
}

export function validateTranslationForm(
  values: TranslationFormValues
): TranslationFormErrors {
  const errors: TranslationFormErrors = {};
  const trimmedTitle = values.title.trim();

  if (!trimmedTitle) {
    errors.title = 'Translated title is required';
  } else if (trimmedTitle.length > CATEGORY_TITLE_MAX_LENGTH) {
    errors.title = `Title must be ${CATEGORY_TITLE_MAX_LENGTH} characters or fewer`;
  }

  if (values.description.length > CATEGORY_DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description must be ${CATEGORY_DESCRIPTION_MAX_LENGTH} characters or fewer`;
  }

  return errors;
}

export function hasTranslationFormErrors(errors: TranslationFormErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function getBrowserLocale(): string {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language || 'en';
}
