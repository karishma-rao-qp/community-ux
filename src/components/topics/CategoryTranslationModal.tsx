'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import type { TopicCategory } from '@/data/mock-topic-categories';
import {
  MOCK_COMMUNITY_LANGUAGES,
  getCommunityLanguageLabel,
  getPrimaryCommunityLanguage,
} from '@/data/mock-community-languages';
import {
  hasTranslationFormErrors,
  validateTranslationForm,
} from '@/lib/topic-category-localization';
import {
  deleteCategoryTranslation,
  getCategoryTranslations,
  upsertCategoryTranslation,
} from '@/services/topic-category-translations';
import { LanguageColumnHeaders } from '@/components/topics/LanguageColumnHeaders';

const WuModal = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModal })),
  { ssr: false }
);
const WuModalHeader = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModalHeader })),
  { ssr: false }
);
const WuModalContent = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModalContent })),
  { ssr: false }
);
const WuModalFooter = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModalFooter })),
  { ssr: false }
);
const WuModalClose = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModalClose })),
  { ssr: false }
);
const WuButton = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuButton })),
  { ssr: false }
);
const WuInput = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuInput })),
  { ssr: false }
);
const WuTextarea = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuTextarea })),
  { ssr: false }
);
const WuSelect = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuSelect })),
  { ssr: false }
);

type LanguageOption = { value: string; label: string };

type CategoryTranslationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: TopicCategory | null;
  onSaved: () => void;
};

export function CategoryTranslationModal({
  open,
  onOpenChange,
  category,
  onSaved,
}: CategoryTranslationModalProps) {
  const { showToast } = useWuShowToast();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const languageOptions = useMemo<LanguageOption[]>(
    () =>
      MOCK_COMMUNITY_LANGUAGES.filter((l) => !l.isPrimary).map((l) => ({
        value: l.code,
        label: l.label,
      })),
    []
  );

  useEffect(() => {
    if (!open || !category) return;

    const defaultLang =
      languageOptions.find((l) => l.value === 'es') ?? languageOptions[0] ?? null;
    setSelectedLanguage(defaultLang);
  }, [open, category, languageOptions]);

  useEffect(() => {
    if (!open || !category || !selectedLanguage) return;

    const existing = getCategoryTranslations(category.id).find(
      (t) => t.languageCode === selectedLanguage.value
    );

    setTitle(existing?.title ?? '');
    setDescription(existing?.description ?? '');
    setErrors({});
  }, [open, category, selectedLanguage]);

  function handleSave() {
    if (!category || !selectedLanguage) return;

    const validationErrors = validateTranslationForm({ title, description });
    setErrors(validationErrors);

    if (hasTranslationFormErrors(validationErrors)) return;

    upsertCategoryTranslation(
      category.id,
      selectedLanguage.value,
      title.trim(),
      description.trim()
    );

    showToast({
      message: `Translation saved for ${getCommunityLanguageLabel(selectedLanguage.value)}`,
      variant: 'success',
    });
    onSaved();
  }

  function handleClear() {
    if (!category || !selectedLanguage) return;

    deleteCategoryTranslation(category.id, selectedLanguage.value);
    setTitle('');
    setDescription('');
    setErrors({});
    showToast({
      message: `Translation cleared for ${getCommunityLanguageLabel(selectedLanguage.value)}`,
      variant: 'success',
    });
    onSaved();
  }

  if (!category) return null;

  const primaryLabel = getPrimaryCommunityLanguage().label;
  const translationLabel = selectedLanguage?.label ?? '';

  return (
    <WuModal open={open} onOpenChange={onOpenChange} size="lg">
      <WuModalHeader>Translations — {category.title}</WuModalHeader>
      <WuModalContent>
        <div className="flex flex-col gap-4">
          <WuSelect
            Label="Language"
            variant="outlined"
            data={languageOptions}
            accessorKey={{ value: 'value', label: 'label' }}
            value={selectedLanguage}
            onSelect={(v) => setSelectedLanguage(v as LanguageOption)}
          />

          <LanguageColumnHeaders
            primaryLabel={primaryLabel}
            translationLabel={translationLabel}
          />

          <div className="grid grid-cols-2 gap-4 items-start">
            <WuInput
              Label="Title"
              variant="outlined"
              value={category.title}
              readonly
            />
            <div>
              <WuInput
                Label="Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                invalid={Boolean(errors.title)}
              />
              {errors.title && (
                <p className="text-xs text-red-600 mt-1">{errors.title}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-start">
            <WuTextarea
              Label="Description"
              variant="outlined"
              value={category.description}
              readonly
            />
            <div>
              <WuTextarea
                Label="Description"
                variant="outlined"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {errors.description && (
                <p className="text-xs text-red-600 mt-1">{errors.description}</p>
              )}
            </div>
          </div>
        </div>
      </WuModalContent>
      <WuModalFooter>
        <WuModalClose variant="secondary">Close</WuModalClose>
        <WuButton variant="secondary" onClick={handleClear} disabled={!selectedLanguage}>
          Clear Translation
        </WuButton>
        <WuButton onClick={handleSave} disabled={!selectedLanguage}>
          Save Translation
        </WuButton>
      </WuModalFooter>
    </WuModal>
  );
}
