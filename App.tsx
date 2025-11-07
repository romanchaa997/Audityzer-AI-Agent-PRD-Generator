
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { FeatureInput } from './components/FeatureInput';
import { PrdDisplay } from './components/PrdDisplay';
import { generatePrd } from './services/geminiService';

// Define the structure for a single feature with a description
export interface Feature {
  id: number;
  name: string;
  description: string;
}

// Define the structure for a single version
interface Version {
  id: number; // Using timestamp as a unique ID
  timestamp: string;
  content: string;
  features: Feature[];
}

const initialFeaturesList = [
  'Onchain Intelligence Dashboard',
  'AI-Powered Community Concierge',
  'Automated Analytics & Reporting',
  'Gamified Giveaways & Bounties',
  'Security Health Bot',
  'Dynamic Integration Layer',
  'Compliance & Transparency Bot',
];

const initialFeatures: Feature[] = initialFeaturesList.map((name, index) => ({
  id: Date.now() + index,
  name,
  description: '',
}));


const PRD_VERSIONS_LOCAL_STORAGE_KEY = 'audityzer_prd_versions';
const FONT_LOCAL_STORAGE_KEY = 'audityzer_prd_font';

function App() {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [prdContent, setPrdContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>('theme-dark');
  const [fontFamily, setFontFamily] = useState<string>('font-inter');
  const [notification, setNotification] = useState<string | null>(null);
  const [versionHistory, setVersionHistory] = useState<Version[]>([]);
  const [template, setTemplate] = useState<string>('agile');

  useEffect(() => {
    // Load saved versions and font from local storage on initial render
    const savedVersionsRaw = localStorage.getItem(PRD_VERSIONS_LOCAL_STORAGE_KEY);
    if (savedVersionsRaw) {
      try {
        const savedVersions = JSON.parse(savedVersionsRaw) as Version[];
        if (Array.isArray(savedVersions) && savedVersions.length > 0) {
          setVersionHistory(savedVersions);
          // Load the most recent version into the editor
          const latestVersion = savedVersions[savedVersions.length - 1];
          setPrdContent(latestVersion.content);
          setFeatures(latestVersion.features);
        }
      } catch (e) {
        console.error("Failed to parse version history from localStorage", e);
        localStorage.removeItem(PRD_VERSIONS_LOCAL_STORAGE_KEY); // Clear corrupted data
      }
    }

    const savedFont = localStorage.getItem(FONT_LOCAL_STORAGE_KEY);
    if (savedFont) {
      setFontFamily(savedFont);
    }
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3800); // Hide before animation ends
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  const handleSetFontFamily = (font: string) => {
    setFontFamily(font);
    localStorage.setItem(FONT_LOCAL_STORAGE_KEY, font);
  };

  const handleGeneratePrd = useCallback(async () => {
    if (features.length === 0 || features.every(f => !f.name.trim())) {
      setError('Feature list cannot be empty. Please add at least one feature.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setPrdContent('');

    try {
      const content = await generatePrd(features, template);
      setPrdContent(content);
      
      const newVersion: Version = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        content,
        features,
      };
      
      const updatedHistory = [...versionHistory, newVersion];
      setVersionHistory(updatedHistory);
      localStorage.setItem(PRD_VERSIONS_LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));

      setNotification('PRD generated and saved as a new version!');
    } catch (e) {
      console.error(e);
      let userMessage = 'An unknown error occurred. Please try again.';
      if (e instanceof Error) {
        if (e.message.includes('API_KEY_INVALID') || e.message.includes('permission denied')) {
            userMessage = 'API Authentication Failed: Your API key appears to be invalid or missing permissions. Please verify your key and its configuration.';
        } else if (e.message.toLowerCase().includes('network') || e.message.toLowerCase().includes('fetch failed')) {
            userMessage = 'Network Error: Could not connect to the generation service. Please check your internet connection.';
        } else if (e.message.includes('400')) {
            userMessage = 'Invalid Request: The server could not process the request. Please check if the feature list format is correct.';
        } else if (e.message.includes('500')) {
            userMessage = 'Server Error: The generation service encountered an internal issue. Please try again later.';
        } else {
            // For other generic errors, show a slightly more detailed message
            userMessage = `Generation failed: ${e.message}`;
        }
      }
      setError(userMessage);
    } finally {
      setIsLoading(false);
    }
  }, [features, versionHistory, template]);

  const handleSavePrd = () => {
    if (!prdContent.trim()) {
      setNotification('Cannot save empty PRD.');
      return;
    }
    const newVersion: Version = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      content: prdContent,
      features: features,
    };
    const updatedHistory = [...versionHistory, newVersion];
    setVersionHistory(updatedHistory);
    localStorage.setItem(PRD_VERSIONS_LOCAL_STORAGE_KEY, JSON.stringify(updatedHistory));
    setNotification('Current draft saved as a new version!');
  };

  const handleLoadVersion = (versionId: number) => {
    const versionToLoad = versionHistory.find(v => v.id === versionId);
    if (versionToLoad) {
      setPrdContent(versionToLoad.content);
      setFeatures(versionToLoad.features);
      setNotification(`Loaded version from ${versionToLoad.timestamp}.`);
    } else {
      setNotification('Could not find the selected version.');
    }
  };

  const handleClearPrd = () => {
    setPrdContent('');
    setNotification('PRD content cleared.');
  };

  const handleClearHistory = () => {
    setPrdContent('');
    setFeatures(initialFeatures);
    setVersionHistory([]);
    localStorage.removeItem(PRD_VERSIONS_LOCAL_STORAGE_KEY);
    setNotification('Version history and current PRD have been cleared.');
  };

  return (
    <div className="min-h-screen bg-brand-primary font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <FeatureInput
            features={features}
            setFeatures={setFeatures}
            onGenerate={handleGeneratePrd}
            isLoading={isLoading}
            template={template}
            setTemplate={setTemplate}
          />
          <PrdDisplay
            content={prdContent}
            isLoading={isLoading}
            error={error}
            onSave={handleSavePrd}
            onClear={handleClearPrd}
            theme={theme}
            setTheme={setTheme}
            fontFamily={fontFamily}
            setFontFamily={handleSetFontFamily}
            setNotification={setNotification}
            versionHistory={versionHistory.map(v => ({ id: v.id, timestamp: v.timestamp }))}
            onLoadVersion={handleLoadVersion}
            onClearHistory={handleClearHistory}
          />
        </div>
      </main>
      {notification && (
        <div className="notification fixed bottom-8 right-8 bg-brand-blue text-white py-2 px-5 rounded-lg shadow-2xl z-50">
          {notification}
        </div>
      )}
    </div>
  );
}

export default App;
