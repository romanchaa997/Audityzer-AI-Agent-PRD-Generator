
import React from 'react';
import type { Feature } from '../App';
import { LoadingSpinner } from './icons/LoadingSpinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { TrashIcon } from './icons/TrashIcon';

interface FeatureInputProps {
  features: Feature[];
  setFeatures: (features: Feature[]) => void;
  onGenerate: () => void;
  isLoading: boolean;
  template: string;
  setTemplate: (template: string) => void;
}

const templates = [
  { id: 'agile', name: 'Agile' },
  { id: 'waterfall', name: 'Waterfall' },
  { id: 'lean', name: 'Lean' },
];

export const FeatureInput: React.FC<FeatureInputProps> = ({ features, setFeatures, onGenerate, isLoading, template, setTemplate }) => {
  const handleFeatureChange = (id: number, field: 'name' | 'description', value: string) => {
    const newFeatures = features.map(feature => 
      feature.id === id ? { ...feature, [field]: value } : feature
    );
    setFeatures(newFeatures);
  };

  const handleAddFeature = () => {
    const newFeature: Feature = {
      id: Date.now(),
      name: '',
      description: '',
    };
    setFeatures([...features, newFeature]);
  };

  const handleRemoveFeature = (id: number) => {
    const newFeatures = features.filter(feature => feature.id !== id);
    setFeatures(newFeatures);
  };
  
  return (
    <div className="bg-brand-secondary p-6 rounded-lg shadow-lg border border-brand-accent flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2 text-brand-text-primary">1. Select Template</h2>
        <p className="text-brand-text-secondary mb-4">
          Choose a methodology to tailor the PRD structure.
        </p>
        <div className="flex space-x-2 rounded-lg bg-brand-primary p-1">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplate(t.id)}
              className={`w-full rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-primary focus:ring-brand-blue ${
                template === t.id
                  ? 'bg-brand-blue text-white shadow'
                  : 'text-brand-text-secondary hover:bg-brand-accent hover:text-brand-text-primary'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col flex-grow min-h-0">
        <h2 className="text-2xl font-semibold mb-2 text-brand-text-primary">2. Define Features</h2>
        <p className="text-brand-text-secondary mb-4">
          List the core features and provide a detailed description for each.
        </p>
        <div className="space-y-4 pr-2 -mr-2 overflow-y-auto flex-grow">
          {features.map((feature, index) => (
            <div key={feature.id} className="bg-brand-primary p-4 rounded-md border border-brand-accent">
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-brand-text-secondary">Feature #{index + 1}</label>
                <button 
                  onClick={() => handleRemoveFeature(feature.id)} 
                  className="p-1 rounded-full hover:bg-red-500/20 text-red-400"
                  title="Remove feature"
                  disabled={isLoading}
                >
                  <TrashIcon />
                </button>
              </div>
              <input
                type="text"
                value={feature.name}
                onChange={(e) => handleFeatureChange(feature.id, 'name', e.target.value)}
                placeholder="Feature Name (e.g., Onchain Intelligence Dashboard)"
                className="w-full p-2 bg-brand-accent border border-brand-accent rounded-md focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all duration-200 text-brand-text-primary mb-2"
                disabled={isLoading}
              />
              <textarea
                value={feature.description}
                onChange={(e) => handleFeatureChange(feature.id, 'description', e.target.value)}
                placeholder="Briefly describe what this feature does and the value it provides to the user."
                className="w-full h-20 p-2 bg-brand-accent border border-brand-accent rounded-md focus:ring-2 focus:ring-brand-blue focus:outline-none transition-all duration-200 resize-y text-brand-text-secondary"
                disabled={isLoading}
              />
            </div>
          ))}
        </div>
        <button
          onClick={handleAddFeature}
          disabled={isLoading}
          className="mt-4 w-full text-center bg-brand-accent text-brand-text-primary font-semibold py-2 px-4 rounded-md hover:bg-brand-blue hover:text-white transition-colors duration-300 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          + Add Feature
        </button>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading || features.length === 0}
        className="mt-auto w-full flex items-center justify-center bg-brand-blue text-white font-bold py-3 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
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
