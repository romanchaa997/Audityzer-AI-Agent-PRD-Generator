
import React from 'react';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { SparklesIcon } from './icons/SparklesIcon';

interface FeatureInputProps {
  features: string;
  setFeatures: (features: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const FeatureInput: React.FC<FeatureInputProps> = ({ features, setFeatures, onGenerate, isLoading }) => {
  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg border border-brand-accent">
      <h2 className="text-2xl font-semibold mb-4 text-brand-text-primary">1. Define Features</h2>
      <p className="text-brand-text-secondary mb-4">
        List the core feature categories for your project below. The AI will use this list to structure the PRD.
      </p>
      <textarea
        value={features}
        onChange={(e) => setFeatures(e.target.value)}
        placeholder="e.g., - Onchain Intelligence Dashboard..."
        className="w-full h-64 p-3 bg-brand-primary border border-brand-accent rounded-md focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all duration-200 resize-y text-brand-text-primary"
        disabled={isLoading}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="mt-4 w-full flex items-center justify-center bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            Generating...
          </>
        ) : (
          <>
            <SparklesIcon />
            Generate PRD
          </>
        )}
      </button>
    </div>
  );
};
