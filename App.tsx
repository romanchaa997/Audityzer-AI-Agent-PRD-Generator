
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { FeatureInput } from './components/FeatureInput';
import { PrdDisplay } from './components/PrdDisplay';
import { generatePrd } from './services/geminiService';

const initialFeatures = `- Onchain Intelligence Dashboard
- AI-Powered Community Concierge  
- Automated Analytics & Reporting
- Gamified Giveaways & Bounties
- Security Health Bot
- Dynamic Integration Layer
- Compliance & Transparency Bot`;

const PRD_LOCAL_STORAGE_KEY = 'audityzer_prd_content';
const FONT_LOCAL_STORAGE_KEY = 'audityzer_prd_font';

function App() {
  const [features, setFeatures] = useState<string>(initialFeatures);
  const [prdContent, setPrdContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>('theme-dark');
  const [fontFamily, setFontFamily] = useState<string>('font-inter');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Load saved PRD and font from local storage on initial render
    const savedPrd = localStorage.getItem(PRD_LOCAL_STORAGE_KEY);
    if (savedPrd) {
      setPrdContent(savedPrd);
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
    if (!features.trim()) {
      setError('Feature list cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setPrdContent('');

    try {
      const content = await generatePrd(features);
      setPrdContent(content);
      localStorage.setItem(PRD_LOCAL_STORAGE_KEY, content); // Auto-save on generation
      setNotification('PRD generated and saved successfully!');
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
  }, [features]);

  const handleSavePrd = () => {
    localStorage.setItem(PRD_LOCAL_STORAGE_KEY, prdContent);
    setNotification('PRD saved successfully!');
  };

  const handleLoadPrd = () => {
    const savedPrd = localStorage.getItem(PRD_LOCAL_STORAGE_KEY);
    if (savedPrd) {
      setPrdContent(savedPrd);
      setNotification('PRD loaded from local storage.');
    } else {
      setNotification('No saved PRD found.');
    }
  };

  const handleClearPrd = () => {
    setPrdContent('');
    localStorage.removeItem(PRD_LOCAL_STORAGE_KEY);
    setNotification('PRD content cleared.');
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
          />
          <PrdDisplay
            content={prdContent}
            isLoading={isLoading}
            error={error}
            onSave={handleSavePrd}
            onLoad={handleLoadPrd}
            onClear={handleClearPrd}
            theme={theme}
            setTheme={setTheme}
            fontFamily={fontFamily}
            setFontFamily={handleSetFontFamily}
            setNotification={setNotification}
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