
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-brand-secondary py-6 px-4 md:px-8 border-b border-brand-accent">
      <div className="container mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-brand-text-primary tracking-tight">
          Audityzer AI Agent PRD Generator
        </h1>
        <p className="mt-2 text-md md:text-lg text-brand-text-secondary">
          Generate a comprehensive Product Requirements Document for your Web3 project using AI.
        </p>
      </div>
    </header>
  );
};
