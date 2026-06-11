'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { LanguageColumnHeaders } from '@/components/topics/LanguageColumnHeaders';
import type { TopicCategory } from '@/data/mock-topic-categories';
import {
  MOCK_TOPIC_FILTERS,
  TOPIC_DESCRIPTION_MAX_LENGTH,
  TOPIC_TITLE_MAX_LENGTH,
} from '@/data/mock-topic-categories';
import {
  DEFAULT_COMMUNITY_LANGUAGE,
  MOCK_COMMUNITY_LANGUAGES,
  getCommunityLanguageLabel,
  getPrimaryCommunityLanguage,
} from '@/data/mock-community-languages';
import {
  getLocalizedCategory,
  hasTranslationFormErrors,
  validateTranslationForm,
} from '@/lib/topic-category-localization';
import {
  createTopic,
  getAllCategoryTranslations,
  getTopicCategories,
} from '@/services/topic-category-translations';

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
const WuFormGroup = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuFormGroup })),
  { ssr: false }
);

type SelectOption = { value: string; label: string };
type LanguageOption = { value: string; label: string; isPrimary: boolean };

type TopicFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

const EMPTY_DEFAULT = { title: '', description: '', tags: '' };
const EMPTY_TRANSLATION = { title: '', description: '', tags: '' };

function TitleInputWithCounter({
  value,
  onChange,
  placeholder,
  invalid,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  invalid?: boolean;
}) {
  return (
    <div className="relative w-full">
      <WuInput
        variant="outlined"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={TOPIC_TITLE_MAX_LENGTH}
        invalid={invalid}
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">
        {value.length}/{TOPIC_TITLE_MAX_LENGTH}
      </span>
    </div>
  );
}

function UploadZone({
  label,
  browseLabel,
  accept,
  onFileSelect,
}: {
  label: string;
  browseLabel: string;
  accept: string;
  onFileSelect: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    onFileSelect(file);
    event.target.value = '';
  }

  return (
    <WuFormGroup
      Label={label}
      labelPosition="left"
      Input={
        <div className="w-full">
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full min-h-[120px] rounded-md border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center gap-2 px-4 text-center"
          >
            <span className="wm-cloud-upload text-2xl text-gray-400" />
            <span className="text-sm text-blue-600">{browseLabel}</span>
            {fileName && (
              <span className="text-xs text-gray-500 truncate max-w-full">{fileName}</span>
            )}
          </button>
        </div>
      }
    />
  );
}

export function TopicFormModal({ open, onOpenChange, onSaved }: TopicFormModalProps) {
  const { showToast } = useWuShowToast();
  const [defaultForm, setDefaultForm] = useState(EMPTY_DEFAULT);
  const [translationForm, setTranslationForm] = useState(EMPTY_TRANSLATION);
  const [translationErrors, setTranslationErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption | null>(null);
  const [category, setCategory] = useState<SelectOption | null>(null);
  const [filter, setFilter] = useState<SelectOption | null>(null);
  const [categories, setCategories] = useState<TopicCategory[]>([]);

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
  const primaryLabel = getPrimaryCommunityLanguage().label;
  const translationLabel = isPrimarySelected
    ? 'Translation'
    : (selectedLanguage?.label ?? 'Translation');

  const categoryOptions: SelectOption[] = categories.map((c) => ({
    value: c.id,
    label: c.title,
  }));

  const localizedCategoryOptions: SelectOption[] = useMemo(() => {
    const categoryTranslations = getAllCategoryTranslations();
    return categories.map((c) => {
      if (isPrimarySelected || !selectedLanguage) {
        return { value: c.id, label: c.title };
      }
      const localized = getLocalizedCategory(
        c,
        categoryTranslations,
        selectedLanguage.value,
        null,
        DEFAULT_COMMUNITY_LANGUAGE
      );
      return { value: c.id, label: localized.title };
    });
  }, [categories, selectedLanguage, isPrimarySelected]);

  const localizedCategory = category
    ? localizedCategoryOptions.find((o) => o.value === category.value) ?? category
    : null;

  const filterOptions: SelectOption[] = MOCK_TOPIC_FILTERS.map((f) => ({
    value: f.id,
    label: f.label,
  }));

  useEffect(() => {
    if (!open) return;

    const loaded = getTopicCategories();
    const defaultCategory = loaded.find((c) => c.key === 'default') ?? loaded[0];
    const defaultTranslationLang =
      languageOptions.find((l) => l.value === 'fr') ??
      languageOptions.find((l) => !l.isPrimary) ??
      primaryLanguage;

    setCategories(loaded);
    setCategory(
      defaultCategory
        ? { value: defaultCategory.id, label: defaultCategory.title }
        : null
    );
    setFilter(null);
    setDefaultForm(EMPTY_DEFAULT);
    setTranslationForm(EMPTY_TRANSLATION);
    setTranslationErrors({});
    setSelectedLanguage(defaultTranslationLang);
  }, [open, languageOptions, primaryLanguage]);

  const defaultTitleValid =
    defaultForm.title.trim().length > 0 &&
    defaultForm.title.length <= TOPIC_TITLE_MAX_LENGTH;
  const defaultDescriptionValid =
    defaultForm.description.length <= TOPIC_DESCRIPTION_MAX_LENGTH;

  const translationValidation = validateTranslationForm(translationForm);
  const translationValid = !hasTranslationFormErrors(translationValidation);

  const canSave =
    defaultTitleValid &&
    defaultDescriptionValid &&
    (isPrimarySelected || translationValid);

  function handleSave() {
    if (!canSave || !category || !selectedLanguage) return;

    if (!isPrimarySelected) {
      const errors = validateTranslationForm(translationForm);
      setTranslationErrors(errors);
      if (hasTranslationFormErrors(errors)) return;
    }

    const tags = defaultForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const created = createTopic({
      title: defaultForm.title,
      description: defaultForm.description,
      categoryId: category.value,
      filterId: filter?.value ?? null,
      tags,
      translation:
        !isPrimarySelected && translationForm.title.trim()
          ? {
              languageCode: selectedLanguage.value,
              title: translationForm.title,
              description: translationForm.description,
              tags: translationForm.tags,
            }
          : undefined,
    });

    if (!created) {
      showToast({ message: 'Failed to create topic', variant: 'error' });
      return;
    }

    showToast({
      message: !isPrimarySelected
        ? `Topic created with ${getCommunityLanguageLabel(selectedLanguage.value)} translation`
        : 'Topic created',
      variant: 'success',
    });
    onSaved();
    onOpenChange(false);
  }

  return (
    <WuModal open={open} onOpenChange={onOpenChange} size="lg">
      <WuModalHeader>Add topic</WuModalHeader>
      <WuModalContent>
        <div className="flex flex-col gap-5">
          <WuFormGroup
            Label="Language"
            labelPosition="left"
            Input={
              <WuSelect
                variant="outlined"
                data={languageOptions}
                accessorKey={{ value: 'value', label: 'label' }}
                value={selectedLanguage}
                onSelect={(v) => {
                  setSelectedLanguage(v as LanguageOption);
                  setTranslationErrors({});
                }}
              />
            }
          />

          <LanguageColumnHeaders
            primaryLabel={primaryLabel}
            translationLabel={translationLabel}
          />

          <WuFormGroup
            Label="Title"
            labelPosition="left"
            Input={
              <div className="grid grid-cols-2 gap-4 w-full">
                <TitleInputWithCounter
                  value={defaultForm.title}
                  onChange={(title) => setDefaultForm((prev) => ({ ...prev, title }))}
                  placeholder="Add a title"
                />
                <div>
                  <TitleInputWithCounter
                    value={isPrimarySelected ? '' : translationForm.title}
                    onChange={(title) =>
                      setTranslationForm((prev) => ({ ...prev, title }))
                    }
                    placeholder="Add a title"
                    invalid={Boolean(translationErrors.title)}
                  />
                  {translationErrors.title && (
                    <p className="text-xs text-red-600 mt-1">{translationErrors.title}</p>
                  )}
                </div>
              </div>
            }
          />

          <WuFormGroup
            Label="Description"
            labelPosition="left"
            Input={
              <div className="grid grid-cols-2 gap-4 w-full">
                <WuTextarea
                  variant="outlined"
                  placeholder="Describe your topic"
                  value={defaultForm.description}
                  onChange={(e) =>
                    setDefaultForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="min-h-[120px]"
                  maxLength={TOPIC_DESCRIPTION_MAX_LENGTH}
                />
                <div>
                  <WuTextarea
                    variant="outlined"
                    placeholder="Describe your topic"
                    value={isPrimarySelected ? '' : translationForm.description}
                    onChange={(e) =>
                      setTranslationForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="min-h-[120px]"
                    maxLength={TOPIC_DESCRIPTION_MAX_LENGTH}
                    readonly={isPrimarySelected}
                  />
                  {translationErrors.description && (
                    <p className="text-xs text-red-600 mt-1">
                      {translationErrors.description}
                    </p>
                  )}
                </div>
              </div>
            }
          />

          <WuFormGroup
            Label="Category"
            labelPosition="left"
            Input={
              <div className="grid grid-cols-2 gap-4 w-full">
                <WuSelect
                  variant="outlined"
                  data={categoryOptions}
                  accessorKey={{ value: 'value', label: 'label' }}
                  value={category}
                  onSelect={(v) => setCategory(v as SelectOption)}
                />
                <WuSelect
                  variant="outlined"
                  data={localizedCategoryOptions}
                  accessorKey={{ value: 'value', label: 'label' }}
                  value={localizedCategory}
                  onSelect={(v) => setCategory(v as SelectOption)}
                  disabled={isPrimarySelected}
                />
              </div>
            }
          />

          <WuFormGroup
            Label="Tags"
            labelPosition="left"
            Input={
              <div className="grid grid-cols-2 gap-4 w-full">
                <WuInput
                  variant="outlined"
                  placeholder="Add tags"
                  value={defaultForm.tags}
                  onChange={(e) =>
                    setDefaultForm((prev) => ({ ...prev, tags: e.target.value }))
                  }
                />
                <WuInput
                  variant="outlined"
                  placeholder="Add tags"
                  value={isPrimarySelected ? '' : translationForm.tags}
                  onChange={(e) =>
                    setTranslationForm((prev) => ({ ...prev, tags: e.target.value }))
                  }
                  readonly={isPrimarySelected}
                />
              </div>
            }
          />

          <div className="border-t border-gray-200 pt-4 flex flex-col gap-5">
            <WuFormGroup
              Label="Filter"
              labelPosition="left"
              Input={
                <WuSelect
                  variant="outlined"
                  placeholder="Select filter"
                  data={filterOptions}
                  accessorKey={{ value: 'value', label: 'label' }}
                  value={filter}
                  onSelect={(v) => setFilter(v as SelectOption)}
                />
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UploadZone
                label="Upload image"
                browseLabel="Browse here to upload image"
                accept="image/*"
                onFileSelect={(file) =>
                  showToast({
                    message: `Image "${file.name}" attached`,
                    variant: 'success',
                  })
                }
              />
              <UploadZone
                label="Upload file"
                browseLabel="Browse here to upload file"
                accept=".pdf,.doc,.docx,.txt,.csv"
                onFileSelect={(file) =>
                  showToast({
                    message: `File "${file.name}" attached`,
                    variant: 'success',
                  })
                }
              />
            </div>
          </div>
        </div>
      </WuModalContent>
      <WuModalFooter>
        <WuModalClose variant="secondary">Cancel</WuModalClose>
        <WuButton onClick={handleSave} disabled={!canSave || !category}>
          Add topic
        </WuButton>
      </WuModalFooter>
    </WuModal>
  );
}
