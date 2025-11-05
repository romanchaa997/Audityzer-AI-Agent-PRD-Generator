
import React, { useState } from 'react';
import { SaveIcon } from './icons/SaveIcon';
import { LoadIcon } from './icons/LoadIcon';
import { ClearIcon } from './icons/ClearIcon';
import { ExportIcon } from './icons/ExportIcon';

interface PrdToolbarProps {
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  onExportPdf: () => void;
  onExportMarkdown: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  hasContent: boolean;
}

export const PrdToolbar: React.FC<PrdToolbarProps> = ({
  onSave,
  onLoad,
  onClear,
  onExportPdf,
  onExportMarkdown,
  theme,
  setTheme,
  fontFamily,
  setFontFamily,
  hasContent,
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      {/* --- Font Selector --- */}
      <div className="relative">
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="bg-brand-accent border border-brand-accent text-brand-text-primary text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 appearance-none"
          aria-label="Select font family"
        >
          <option value="font-inter">Inter</option>
          <option value="font-roboto">Roboto</option>
          <option value="font-lato">Lato</option>
          <option value="font-arial">Arial</option>
        </select>
      </div>

      {/* --- Theme Selector --- */}
      <div className="relative">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="bg-brand-accent border border-brand-accent text-brand-text-primary text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 appearance-none"
          aria-label="Select theme"
        >
          <option value="theme-dark">Dark</option>
          <option value="theme-light">Light</option>
        </select>
      </div>

      {/* --- Local Storage Actions --- */}
      <button onClick={onSave} disabled={!hasContent} className="p-2 rounded-md hover:bg-brand-accent disabled:opacity-50 disabled:cursor-not-allowed" title="Save PRD">
        <SaveIcon />
      </button>
      <button onClick={onLoad} className="p-2 rounded-md hover:bg-brand-accent" title="Load PRD">
        <LoadIcon />
      </button>
       <button onClick={onClear} disabled={!hasContent} className="p-2 rounded-md hover:bg-brand-accent disabled:opacity-50 disabled:cursor-not-allowed" title="Clear PRD">
        <ClearIcon />
      </button>

      {/* --- Export Dropdown --- */}
      <div className="relative">
        <button
          onClick={() => setIsExportOpen(!isExportOpen)}
          disabled={!hasContent}
          className="p-2 rounded-md hover:bg-brand-accent disabled:opacity-50 disabled:cursor-not-allowed"
          title="Export PRD"
        >
          <ExportIcon />
        </button>
        {isExportOpen && (
          <div
            className="absolute right-0 mt-2 w-48 bg-brand-accent border border-brand-secondary rounded-md shadow-lg z-10"
            onMouseLeave={() => setIsExportOpen(false)}
          >
            <ul className="py-1">
              <li>
                <button
                  onClick={() => { onExportPdf(); setIsExportOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-brand-text-primary hover:bg-brand-secondary"
                >
                  Export as PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => { onExportMarkdown(); setIsExportOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-sm text-brand-text-primary hover:bg-brand-secondary"
                >
                  Export as Markdown
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};