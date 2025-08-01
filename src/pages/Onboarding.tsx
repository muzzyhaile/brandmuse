import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandBlueprintWizard from '@/components/BrandBlueprintWizard';
import Navigation from '@/components/Navigation';

interface BrandData {
  companyName: string;
  industry: string;
  targetAudience: string;
  brandValues: string[];
  toneOfVoice: string;
  primaryColors: string[];
  bannedWords: string[];
  contentGoals: string[];
  brandPersonality: string;
}

const Onboarding = () => {
  const navigate = useNavigate();

  const handleBrandSetupComplete = (brandData: BrandData) => {
    // In a real app, you would save this data to your backend/database
    localStorage.setItem('brandData', JSON.stringify(brandData));
    localStorage.setItem('onboardingComplete', 'true');
    
    // Navigate to the main calendar view
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <BrandBlueprintWizard onComplete={handleBrandSetupComplete} />
    </div>
  );
};

export default Onboarding;