import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandBlueprintWizard from '@/components/BrandBlueprintWizard';

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
    <BrandBlueprintWizard onComplete={handleBrandSetupComplete} />
  );
};

export default Onboarding;