/**
 * Topic Category Translation Service
 *
 * Frontend mock service consistent with expected REST API endpoints.
 * Replace mock implementations with fetch calls when backend is available.
 *
 * Expected endpoints:
 *   GET    /api/topic-categories/:categoryId/translations
 *   PUT    /api/topic-categories/:categoryId/translations/:languageCode
 *   DELETE /api/topic-categories/:categoryId/translations/:languageCode
 *   GET    /api/topic-categories/translations/export
 *   POST   /api/topic-categories/translations/import
 */

import {
  MOCK_TOPIC_CATEGORIES,
  MOCK_TOPIC_CATEGORY_TRANSLATIONS,
  MOCK_TOPICS,
  type Topic,
  type TopicCategory,
  type TopicCategoryTranslation,
  type TopicTranslation,
} from '@/data/mock-topic-categories';
import type { TranslationExportRow } from '@/lib/topic-category-translation-import-export';

let categories: TopicCategory[] = [...MOCK_TOPIC_CATEGORIES];
let translations: TopicCategoryTranslation[] = [...MOCK_TOPIC_CATEGORY_TRANSLATIONS];
let topics: Topic[] = [...MOCK_TOPICS];
let topicTranslations: TopicTranslation[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getTopicCategories(): TopicCategory[] {
  return categories;
}

export function getTopics(): Topic[] {
  return topics;
}

export function getActiveTopics(): Topic[] {
  return topics.filter((t) => t.status === 'active');
}

export function getDeletedTopics(): Topic[] {
  return topics.filter((t) => t.status === 'deleted');
}

export function getTopicCategoryById(categoryId: string): TopicCategory | undefined {
  return categories.find((c) => c.id === categoryId);
}

export function getCategoryTranslations(categoryId: string): TopicCategoryTranslation[] {
  return translations.filter((t) => t.categoryId === categoryId);
}

export function getAllCategoryTranslations(): TopicCategoryTranslation[] {
  return translations;
}

export function upsertCategoryTranslation(
  categoryId: string,
  languageCode: string,
  title: string,
  description: string
): TopicCategoryTranslation {
  const existingIndex = translations.findIndex(
    (t) => t.categoryId === categoryId && t.languageCode === languageCode
  );
  const timestamp = nowIso();

  if (existingIndex >= 0) {
    const updated: TopicCategoryTranslation = {
      ...translations[existingIndex],
      title,
      description,
      updatedAt: timestamp,
    };
    translations = [
      ...translations.slice(0, existingIndex),
      updated,
      ...translations.slice(existingIndex + 1),
    ];
    return updated;
  }

  const created: TopicCategoryTranslation = {
    id: generateId('tr'),
    categoryId,
    languageCode,
    title,
    description,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  translations = [...translations, created];
  return created;
}

export function deleteCategoryTranslation(
  categoryId: string,
  languageCode: string
): boolean {
  const before = translations.length;
  translations = translations.filter(
    (t) => !(t.categoryId === categoryId && t.languageCode === languageCode)
  );
  return translations.length < before;
}

export function createTopicCategory(input: {
  title: string;
  description: string;
  criteria: string;
}): TopicCategory {
  const key = input.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50);

  const category: TopicCategory = {
    id: generateId('cat'),
    key: key || generateId('cat-key'),
    title: input.title.trim(),
    description: input.description.trim(),
    criteria: input.criteria.trim(),
    topicCount: 0,
    createdAt: nowIso(),
  };

  categories = [...categories, category];
  return category;
}

export function updateTopicCategory(
  categoryId: string,
  input: { title: string; description: string; criteria: string }
): TopicCategory | null {
  const index = categories.findIndex((c) => c.id === categoryId);
  if (index < 0) return null;

  const updated: TopicCategory = {
    ...categories[index],
    title: input.title.trim(),
    description: input.description.trim(),
    criteria: input.criteria.trim(),
  };

  categories = [
    ...categories.slice(0, index),
    updated,
    ...categories.slice(index + 1),
  ];
  return updated;
}

export function createTopic(input: {
  title: string;
  description?: string;
  categoryId: string;
  filterId?: string | null;
  tags?: string[];
  translation?: {
    languageCode: string;
    title: string;
    description: string;
    tags: string;
  };
}): Topic | null {
  const category = categories.find((c) => c.id === input.categoryId);
  if (!category) return null;

  const topic: Topic = {
    id: generateId('topic'),
    title: input.title.trim(),
    description: input.description?.trim() ?? '',
    categoryId: input.categoryId,
    filterId: input.filterId ?? null,
    tags: input.tags ?? [],
    status: 'active',
    createdBy: 'karishma.rao',
    createdAt: nowIso(),
    likes: 0,
    dislikes: 0,
    comments: 0,
  };

  topics = [...topics, topic];
  categories = categories.map((c) =>
    c.id === input.categoryId ? { ...c, topicCount: c.topicCount + 1 } : c
  );

  if (input.translation?.title.trim()) {
    upsertTopicTranslation(
      topic.id,
      input.translation.languageCode,
      input.translation.title.trim(),
      input.translation.description.trim(),
      input.translation.tags.trim()
    );
  }

  return topic;
}

export function upsertTopicTranslation(
  topicId: string,
  languageCode: string,
  title: string,
  description: string,
  tags = ''
): TopicTranslation {
  const existingIndex = topicTranslations.findIndex(
    (t) => t.topicId === topicId && t.languageCode === languageCode
  );
  const timestamp = nowIso();

  if (existingIndex >= 0) {
    const updated: TopicTranslation = {
      ...topicTranslations[existingIndex],
      title,
      description,
      tags,
      updatedAt: timestamp,
    };
    topicTranslations = [
      ...topicTranslations.slice(0, existingIndex),
      updated,
      ...topicTranslations.slice(existingIndex + 1),
    ];
    return updated;
  }

  const created: TopicTranslation = {
    id: generateId('topic-tr'),
    topicId,
    languageCode,
    title,
    description,
    tags,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  topicTranslations = [...topicTranslations, created];
  return created;
}

export function getTopicTranslations(topicId: string): TopicTranslation[] {
  return topicTranslations.filter((t) => t.topicId === topicId);
}

export function importCategoryTranslations(
  rows: TranslationExportRow[]
): { updated: number; created: number } {
  let updated = 0;
  let created = 0;

  for (const row of rows) {
    const existing = translations.find(
      (t) => t.categoryId === row.categoryId && t.languageCode === row.languageCode
    );

    if (existing) {
      upsertCategoryTranslation(
        row.categoryId,
        row.languageCode,
        row.translatedTitle,
        row.translatedDescription
      );
      updated += 1;
    } else {
      upsertCategoryTranslation(
        row.categoryId,
        row.languageCode,
        row.translatedTitle,
        row.translatedDescription
      );
      created += 1;
    }
  }

  return { updated, created };
}

/** Reset store to initial mock data — useful for tests. */
export function resetTopicCategoryStore(): void {
  categories = [...MOCK_TOPIC_CATEGORIES];
  translations = [...MOCK_TOPIC_CATEGORY_TRANSLATIONS];
  topics = [...MOCK_TOPICS];
  topicTranslations = [];
}
