
import React, { useState } from 'react';
import { SaveIcon } from './icons/SaveIcon';
import { LoadIcon } from './icons/LoadIcon';
import { ClearIcon } from './icons/ClearIcon';
import { ExportIcon } from './icons/ExportIcon';
import { SearchIcon } from './icons/SearchIcon';

interface VersionSummary {
  id: number;
  timestamp: string;
}

interface PrdToolbarProps {
  onSave: () => void;
  onClear: () => void;
  onExportPdf: () => void;
  onExportMarkdown: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  hasContent: boolean;
  versionHistory: VersionSummary[];
  onLoadVersion: (versionId: number) => void;
  onClearHistory: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const PrdToolbar: React.FC<PrdToolbarProps> = ({
  onSave,
  onClear,
  onExportPdf,
  onExportMarkdown,
  theme,
  setTheme,
  fontFamily,
  setFontFamily,
  hasContent,
  versionHistory,
  onLoadVersion,
  onClearHistory,
  searchTerm,
  setSearchTerm,
}) => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);

  return (
    <div className="flex items-center space-x-2">
      {/* --- Search Bar --- */}
      {hasContent && (
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-brand-accent border border-brand-accent text-brand-text-primary text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full pl-10 p-2.5"
          />
        </div>
      )}

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
          <option value="theme-blueprint">Blueprint</option>
          <option value="theme-matrix">Matrix</option>
        </select>
      </div>

      {/* --- Local Storage Actions --- */}
      <button onClick={onSave} disabled={!hasContent} className="p-2 rounded-md hover:bg-brand-accent disabled:opacity-50 disabled:cursor-not-allowed" title="Save current draft as new version">
        <SaveIcon />
      </button>

      {/* --- Version History Dropdown --- */}
      <div className="relative">
        <button
          onClick={() => setIsVersionHistoryOpen(!isVersionHistoryOpen)}
          className="p-2 rounded-md hover:bg-brand-accent"
          title="Version History"
        >
          <LoadIcon />
        </button>
        {isVersionHistoryOpen && (
          <div
            className="absolute right-0 mt-2 w-64 bg-brand-accent border border-brand-secondary rounded-md shadow-lg z-10"
            onMouseLeave={() => setIsVersionHistoryOpen(false)}
          >
            <div className="p-2 font-semibold text-sm text-brand-text-primary border-b border-brand-secondary">Version History</div>
            <ul className="py-1 max-h-60 overflow-y-auto">
              {versionHistory.length > 0 ? (
                versionHistory.slice().reverse().map(version => (
                  <li key={version.id}>
                    <button
                      onClick={() => { onLoadVersion(version.id); setIsVersionHistoryOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-brand-text-secondary hover:bg-brand-secondary hover:text-brand-text-primary"
                    >
                      {version.timestamp}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-sm text-brand-text-secondary">No versions saved.</li>
              )}
            </ul>
            {versionHistory.length > 0 && (
               <div className="border-t border-brand-secondary">
                  <button
                    onClick={() => { onClearHistory(); setIsVersionHistoryOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    Clear All History
                  </button>
               </div>
            )}
          </div>
        )}
      </div>
       <button onClick={onClear} disabled={!hasContent} className="p-2 rounded-md hover:bg-brand-accent disabled:opacity-50 disabled:cursor-not-allowed" title="Clear current PRD content">
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
