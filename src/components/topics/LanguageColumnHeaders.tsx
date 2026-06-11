'use client';

type LanguageColumnHeadersProps = {
  primaryLabel: string;
  translationLabel: string;
};

export function LanguageColumnHeaders({
  primaryLabel,
  translationLabel,
}: LanguageColumnHeadersProps) {
  return (
    <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-2">
      <p className="text-sm font-medium text-gray-700">{primaryLabel}</p>
      <p className="text-sm font-medium text-gray-700">{translationLabel}</p>
    </div>
  );
}
