import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import StrategyViewer from '@/components/StrategyViewer';

const StrategyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <StrategyViewer />
      </div>
    </div>
  );
};

export default StrategyPage;