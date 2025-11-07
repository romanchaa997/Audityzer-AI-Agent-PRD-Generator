
import React, { useRef, useState, useEffect } from 'react';
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

// Define summary for version history dropdown
interface VersionSummary {
  id: number;
  timestamp: string;
}

interface PrdDisplayProps {
  content: string;
  isLoading: boolean;
  error: string | null;
  onSave: () => void;
  onClear: () => void;
  theme: string;
  setTheme: (theme: string) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  setNotification: (message: string) => void;
  versionHistory: VersionSummary[];
  onLoadVersion: (versionId: number) => void;
  onClearHistory: () => void;
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
  onClear,
  theme,
  setTheme,
  fontFamily,
  setFontFamily,
  setNotification,
  versionHistory,
  onLoadVersion,
  onClearHistory,
}) => {
  const prdContentRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const contentElement = prdContentRef.current;
    if (!contentElement) return;

    // First, remove old highlights
    const existingHighlights = contentElement.querySelectorAll('mark.search-highlight');
    existingHighlights.forEach(mark => {
      const parent = mark.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(mark.textContent || ''), mark);
        parent.normalize(); // Merge adjacent text nodes
      }
    });

    if (!searchTerm.trim()) {
      return;
    }
    
    // Escape special regex characters
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedTerm})`, 'gi');
    
    // Using TreeWalker to only search within text nodes
    const walker = document.createTreeWalker(contentElement, NodeFilter.SHOW_TEXT, null);
    const nodesToProcess: Text[] = [];
    let currentNode = walker.nextNode();
    while (currentNode) {
      if (currentNode instanceof Text && (currentNode.nodeValue || '').match(regex)) {
        if (currentNode.parentElement?.tagName.toLowerCase() !== 'script' && currentNode.parentElement?.tagName.toLowerCase() !== 'style') {
          nodesToProcess.push(currentNode);
        }
      }
      currentNode = walker.nextNode();
    }
    
    nodesToProcess.forEach(node => {
      const parts = (node.nodeValue || '').split(regex);
      if (parts.length <= 1) return;

      const fragment = document.createDocumentFragment();
      parts.forEach((part, i) => {
        if (i % 2 === 1) {
          const mark = document.createElement('mark');
          mark.className = 'search-highlight bg-yellow-400 text-black px-0.5 rounded-sm';
          mark.textContent = part;
          fragment.appendChild(mark);
        } else if (part) {
          fragment.appendChild(document.createTextNode(part));
        }
      });
      node.parentNode?.replaceChild(fragment, node);
    });

  }, [searchTerm, content, theme, fontFamily]);

  const handleExportPdf = async () => {
    const { jsPDF } = window.jspdf;
    const contentElement = prdContentRef.current;
    if (!contentElement) return;

    try {
        setSearchTerm(''); // Temporarily disable search highlights for clean PDF
        await new Promise(resolve => setTimeout(resolve, 50)); // Allow DOM to update

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
          <h2 className="text-2xl font-semibold text-brand-text-primary shrink-0 mr-4">Generated PRD</h2>
          <PrdToolbar
            onSave={onSave}
            onClear={onClear}
            onExportPdf={handleExportPdf}
            onExportMarkdown={handleExportMarkdown}
            theme={theme}
            setTheme={setTheme}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            hasContent={!!content && !isLoading}
            versionHistory={versionHistory}
            onLoadVersion={onLoadVersion}
            onClearHistory={onClearHistory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
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
