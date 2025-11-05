import React, { useRef } from 'react';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { PrdToolbar } from './PrdToolbar';

// Define types for window libraries
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
    TurndownService: any;
  }
}

interface PrdDisplayProps {
  content: string;
  isLoading: boolean;
  error: string | null;
  onSave: () => void;
  onLoad: () => void;
  onClear: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  setNotification: (message: string) => void;
}

const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const getThemeBackgroundColor = (theme: string) => {
    switch(theme) {
        case 'theme-light': return '#ffffff';
        case 'theme-blueprint': return '#F0F4F8';
        case 'theme-matrix': return '#010101';
        case 'theme-dark':
        default:
            return '#1A1A2E';
    }
}

export const PrdDisplay: React.FC<PrdDisplayProps> = ({
  content,
  isLoading,
  error,
  onSave,
  onLoad,
  onClear,
  theme,
  setTheme,
  fontFamily,
  setFontFamily,
  setNotification,
}) => {
  const prdContentRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = async () => {
    const { jsPDF } = window.jspdf;
    const contentElement = prdContentRef.current;
    if (!contentElement) return;

    try {
        const canvas = await window.html2canvas(contentElement, {
          scale: 2, // Higher scale for better quality
          backgroundColor: getThemeBackgroundColor(theme),
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('Audityzer-PRD.pdf');
    } catch (err) {
        console.error("Failed to generate PDF:", err);
        setNotification("Could not generate PDF. See console for details.");
    }
  };

  const handleExportMarkdown = () => {
    if (!content) return;
    const turndownService = new window.TurndownService();
    const markdown = turndownService.turndown(content);
    downloadFile(markdown, 'Audityzer-PRD.md', 'text/markdown');
  };

  const containerClass = `prose prose-invert max-w-none prose-h2:text-xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-semibold prose-h4:text-base prose-h4:font-semibold prose-strong:text-brand-text-primary prose-ul:list-disc prose-ul:ml-5 prose-li:text-brand-text-secondary prose-p:text-brand-text-secondary h-full overflow-y-auto p-4 prd-content ${theme} ${fontFamily}`;

  return (
    <div className="bg-brand-secondary rounded-lg shadow-lg border border-brand-accent flex flex-col h-full min-h-[500px] lg:h-auto">
      <div className="flex justify-between items-center p-4 border-b border-brand-accent">
          <h2 className="text-2xl font-semibold text-brand-text-primary">2. Generated PRD</h2>
          <PrdToolbar
            onSave={onSave}
            onLoad={onLoad}
            onClear={onClear}
            onExportPdf={handleExportPdf}
            onExportMarkdown={handleExportMarkdown}
            theme={theme}
            setTheme={setTheme}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            hasContent={!!content && !isLoading}
          />
      </div>
      <div className="flex-grow p-2 overflow-hidden">
        <div
          ref={prdContentRef}
          className={containerClass}
        >
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-brand-text-secondary">
              <LoadingSpinner />
              <p className="mt-4">Generating your PRD... this may take a moment.</p>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-full text-red-400 p-4 text-center">
              <p className="max-w-md">{error}</p>
            </div>
          )}
          {!isLoading && !error && !content && (
            <div className="flex items-center justify-center h-full text-brand-text-secondary">
              <p>Your generated PRD will appear here.</p>
            </div>
          )}
          {content && (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          )}
        </div>
      </div>
    </div>
  );
};