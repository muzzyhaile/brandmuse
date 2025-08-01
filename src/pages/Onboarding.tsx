import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandBlueprintWizard from '@/components/BrandBlueprintWizard';
import ContentPillarsWizard from '@/components/ContentPillarsWizard';
import PlatformStrategyWizard from '@/components/PlatformStrategyWizard';
import CompetitorAnalysisWizard from '@/components/CompetitorAnalysisWizard';
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

interface ContentPillarsData {
  pillars: Array<{
    name: string;
    description: string;
    topics: string[];
    percentage: number;
  }>;
  contentMix: {
    educational: number;
    promotional: number;
    entertaining: number;
    inspirational: number;
  };
}

interface PlatformStrategyData {
  platforms: Array<{
    platform: string;
    enabled: boolean;
    postingFrequency: string;
    bestTimes: string[];
    contentTypes: string[];
    tone: string;
    hashtags: string[];
    goals: string[];
  }>;
  crossPosting: boolean;
  adaptationNotes: string;
}

interface CompetitorAnalysisData {
  competitors: Array<{
    name: string;
    platforms: string[];
    strengths: string[];
    weaknesses: string[];
    contentTypes: string[];
    postingFrequency: string;
    engagement: string;
    notes: string;
  }>;
  industryTrends: string[];
  opportunities: string[];
  differentiators: string[];
}

type WizardStep = 'brand' | 'pillars' | 'platforms' | 'competitors';

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<WizardStep>('brand');
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [contentPillarsData, setContentPillarsData] = useState<ContentPillarsData | null>(null);
  const [platformStrategyData, setPlatformStrategyData] = useState<PlatformStrategyData | null>(null);

  const handleBrandComplete = (data: BrandData) => {
    setBrandData(data);
    setCurrentStep('pillars');
  };

  const handlePillarsComplete = (data: ContentPillarsData) => {
    setContentPillarsData(data);
    setCurrentStep('platforms');
  };

  const handlePlatformsComplete = (data: PlatformStrategyData) => {
    setPlatformStrategyData(data);
    setCurrentStep('competitors');
  };

  const handleCompetitorsComplete = (data: CompetitorAnalysisData) => {
    // Save all collected data
    const completeStrategy = {
      brand: brandData,
      contentPillars: contentPillarsData,
      platformStrategy: platformStrategyData,
      competitorAnalysis: data
    };
    
    localStorage.setItem('contentStrategy', JSON.stringify(completeStrategy));
    localStorage.setItem('onboardingComplete', 'true');
    
    // Navigate to the main calendar view
    navigate('/');
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'pillars':
        setCurrentStep('brand');
        break;
      case 'platforms':
        setCurrentStep('pillars');
        break;
      case 'competitors':
        setCurrentStep('platforms');
        break;
    }
  };

  const renderCurrentWizard = () => {
    switch (currentStep) {
      case 'brand':
        return <BrandBlueprintWizard onComplete={handleBrandComplete} />;
      case 'pillars':
        return <ContentPillarsWizard onComplete={handlePillarsComplete} onBack={handleBack} />;
      case 'platforms':
        return <PlatformStrategyWizard onComplete={handlePlatformsComplete} onBack={handleBack} />;
      case 'competitors':
        return <CompetitorAnalysisWizard onComplete={handleCompetitorsComplete} onBack={handleBack} />;
      default:
        return <BrandBlueprintWizard onComplete={handleBrandComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      {renderCurrentWizard()}
    </div>
  );
};

export default Onboarding;