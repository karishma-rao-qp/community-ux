'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import type { TopicCategory } from '@/data/mock-topic-categories';
import {
  CATEGORY_DESCRIPTION_MAX_LENGTH,
  CATEGORY_TITLE_MAX_LENGTH,
} from '@/data/mock-topic-categories';
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
  createTopicCategory,
  getCategoryTranslations,
  updateTopicCategory,
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

type LanguageOption = { value: string; label: string; isPrimary: boolean };

type CategoryFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: TopicCategory | null;
  initialLanguage?: string;
  onSaved: () => void;
};

const EMPTY_FORM = { title: '', description: '', criteria: '' };

export function CategoryFormModal({
  open,
  onOpenChange,
  category,
  initialLanguage,
  onSaved,
}: CategoryFormModalProps) {
  const { showToast } = useWuShowToast();
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption | null>(null);
  const [defaultForm, setDefaultForm] = useState(EMPTY_FORM);
  const [translationForm, setTranslationForm] = useState({ title: '', description: '' });
  const [translationErrors, setTranslationErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  const isEdit = Boolean(category);

  const languageOptions = useMemo<LanguageOption[]>(
    () =>
      MOCK_COMMUNITY_LANGUAGES.map((l) => ({
        value: l.code,
        label: l.label,
        isPrimary: l.isPrimary,
      })),
    []
  );

  const primaryLanguage = useMemo(
    () => languageOptions.find((l) => l.isPrimary) ?? languageOptions[0],
    [languageOptions]
  );

  const isPrimarySelected = selectedLanguage?.isPrimary ?? true;

  useEffect(() => {
    if (!open) return;

    const preferred =
      languageOptions.find((l) => l.value === initialLanguage) ?? primaryLanguage;
    setSelectedLanguage(preferred);

    if (category) {
      setDefaultForm({
        title: category.title,
        description: category.description,
        criteria: category.criteria,
      });

      if (!preferred.isPrimary) {
        const existing = getCategoryTranslations(category.id).find(
          (t) => t.languageCode === preferred.value
        );
        setTranslationForm({
          title: existing?.title ?? '',
          description: existing?.description ?? '',
        });
      } else {
        setTranslationForm({ title: '', description: '' });
      }
    } else {
      setDefaultForm(EMPTY_FORM);
      setTranslationForm({ title: '', description: '' });
    }

    setTranslationErrors({});
  }, [open, category, initialLanguage, languageOptions, primaryLanguage]);

  useEffect(() => {
    if (!open || !category || !selectedLanguage || selectedLanguage.isPrimary) return;

    const existing = getCategoryTranslations(category.id).find(
      (t) => t.languageCode === selectedLanguage.value
    );
    setTranslationForm({
      title: existing?.title ?? '',
      description: existing?.description ?? '',
    });
    setTranslationErrors({});
  }, [open, category, selectedLanguage]);

  function handleLanguageChange(option: LanguageOption) {
    setSelectedLanguage(option);
    setTranslationErrors({});
  }

  const defaultTitleValid =
    defaultForm.title.trim().length > 0 &&
    defaultForm.title.length <= CATEGORY_TITLE_MAX_LENGTH;
  const defaultDescriptionValid =
    defaultForm.description.length <= CATEGORY_DESCRIPTION_MAX_LENGTH;

  const translationValidation = validateTranslationForm(translationForm);
  const translationValid = !hasTranslationFormErrors(translationValidation);

  const canSave = isPrimarySelected
    ? defaultTitleValid && defaultDescriptionValid
    : isEdit
      ? translationValid && defaultDescriptionValid
      : defaultTitleValid && defaultDescriptionValid && translationValid;

  function handleSave() {
    if (!selectedLanguage || !canSave) return;

    if (isPrimarySelected) {
      if (category) {
        updateTopicCategory(category.id, defaultForm);
        showToast({ message: 'Category updated', variant: 'success' });
      } else {
        createTopicCategory(defaultForm);
        showToast({ message: 'Category created', variant: 'success' });
      }
    } else if (category) {
      const errors = validateTranslationForm(translationForm);
      setTranslationErrors(errors);
      if (hasTranslationFormErrors(errors)) return;

      updateTopicCategory(category.id, defaultForm);
      upsertCategoryTranslation(
        category.id,
        selectedLanguage.value,
        translationForm.title.trim(),
        translationForm.description.trim()
      );
      showToast({
        message: `Translation saved for ${getCommunityLanguageLabel(selectedLanguage.value)}`,
        variant: 'success',
      });
    } else {
      const errors = validateTranslationForm(translationForm);
      setTranslationErrors(errors);
      if (hasTranslationFormErrors(errors) || !defaultTitleValid) return;

      const created = createTopicCategory(defaultForm);
      upsertCategoryTranslation(
        created.id,
        selectedLanguage.value,
        translationForm.title.trim(),
        translationForm.description.trim()
      );
      showToast({
        message: `Category created with ${getCommunityLanguageLabel(selectedLanguage.value)} translation`,
        variant: 'success',
      });
    }

    onSaved();
    onOpenChange(false);
  }

  const primaryLabel = getPrimaryCommunityLanguage().label;
  const translationLabel = selectedLanguage?.label ?? '';

  return (
    <WuModal open={open} onOpenChange={onOpenChange} size={isPrimarySelected ? 'md' : 'lg'}>
      <WuModalHeader>{isEdit ? 'Edit Category' : 'Add Category'}</WuModalHeader>
      <WuModalContent>
        <div className="flex flex-col gap-4">
          <WuSelect
            Label="Language"
            variant="outlined"
            data={languageOptions}
            accessorKey={{ value: 'value', label: 'label' }}
            value={selectedLanguage}
            onSelect={(v) => handleLanguageChange(v as LanguageOption)}
          />

          {isPrimarySelected ? (
            <>
              <WuInput
                Label="Title"
                variant="outlined"
                placeholder="Category title"
                value={defaultForm.title}
                onChange={(e) =>
                  setDefaultForm((prev) => ({ ...prev, title: e.target.value }))
                }
                maxLength={CATEGORY_TITLE_MAX_LENGTH}
              />
              <WuTextarea
                Label="Description"
                variant="outlined"
                placeholder="Describe this category"
                value={defaultForm.description}
                onChange={(e) =>
                  setDefaultForm((prev) => ({ ...prev, description: e.target.value }))
                }
                maxLength={CATEGORY_DESCRIPTION_MAX_LENGTH}
              />
              <WuTextarea
                Label="Criteria"
                variant="outlined"
                placeholder="Who can post in this category?"
                value={defaultForm.criteria}
                onChange={(e) =>
                  setDefaultForm((prev) => ({ ...prev, criteria: e.target.value }))
                }
              />
            </>
          ) : (
            <>
              <LanguageColumnHeaders
                primaryLabel={primaryLabel}
                translationLabel={translationLabel}
              />

              <div className="grid grid-cols-2 gap-4 items-start">
                <WuInput
                  Label="Title"
                  variant="outlined"
                  placeholder="Category title"
                  value={defaultForm.title}
                  onChange={(e) =>
                    setDefaultForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  maxLength={CATEGORY_TITLE_MAX_LENGTH}
                  readonly={isEdit}
                />
                <div>
                  <WuInput
                    Label="Title"
                    variant="outlined"
                    placeholder="Category title in selected language"
                    value={translationForm.title}
                    onChange={(e) =>
                      setTranslationForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    invalid={Boolean(translationErrors.title)}
                    maxLength={CATEGORY_TITLE_MAX_LENGTH}
                  />
                  {translationErrors.title && (
                    <p className="text-xs text-red-600 mt-1">{translationErrors.title}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-start">
                <WuTextarea
                  Label="Description"
                  variant="outlined"
                  placeholder="Describe this category"
                  value={defaultForm.description}
                  onChange={(e) =>
                    setDefaultForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  maxLength={CATEGORY_DESCRIPTION_MAX_LENGTH}
                  readonly={isEdit}
                />
                <div>
                  <WuTextarea
                    Label="Description"
                    variant="outlined"
                    placeholder="Description in selected language"
                    value={translationForm.description}
                    onChange={(e) =>
                      setTranslationForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    maxLength={CATEGORY_DESCRIPTION_MAX_LENGTH}
                  />
                  {translationErrors.description && (
                    <p className="text-xs text-red-600 mt-1">{translationErrors.description}</p>
                  )}
                </div>
              </div>

              <WuTextarea
                Label="Criteria"
                variant="outlined"
                placeholder="Who can post in this category?"
                value={defaultForm.criteria}
                onChange={(e) =>
                  setDefaultForm((prev) => ({ ...prev, criteria: e.target.value }))
                }
              />
            </>
          )}
        </div>
      </WuModalContent>
      <WuModalFooter>
        <WuModalClose variant="secondary">Cancel</WuModalClose>
        <WuButton onClick={handleSave} disabled={!canSave}>
          Save
        </WuButton>
      </WuModalFooter>
    </WuModal>
  );
}
