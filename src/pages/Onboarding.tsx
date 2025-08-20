import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandBlueprintWizard from '@/components/BrandBlueprintWizard';
import ContentPillarsWizard from '@/components/ContentPillarsWizard';
import PlatformStrategyWizard from '@/components/PlatformStrategyWizard';
import CompetitorAnalysisWizard from '@/components/CompetitorAnalysisWizard';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { markStrategyCompleted } from '@/lib/userDataService';
import { 
  Sparkles, 
  Target, 
  Layers3, 
  Megaphone, 
  TrendingUp,
  CheckCircle,
  Circle
} from 'lucide-react';

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

const wizardSteps = [
  {
    id: 'brand' as const,
    title: 'Brand Blueprint',
    description: 'Define your brand foundation and guidelines',
    icon: Target,
    component: BrandBlueprintWizard
  },
  {
    id: 'pillars' as const,
    title: 'Content Pillars',
    description: 'Establish your content themes and structure',
    icon: Layers3,
    component: ContentPillarsWizard
  },
  {
    id: 'platforms' as const,
    title: 'Platform Strategy',
    description: 'Configure your social media approach',
    icon: Megaphone,
    component: PlatformStrategyWizard
  },
  {
    id: 'competitors' as const,
    title: 'Competitor Analysis',
    description: 'Analyze your competitive landscape',
    icon: TrendingUp,
    component: CompetitorAnalysisWizard
  }
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [selectedWizard, setSelectedWizard] = useState<WizardStep | null>(null);
  const [brandData, setBrandData] = useState<BrandData | null>(null);
  const [contentPillarsData, setContentPillarsData] = useState<ContentPillarsData | null>(null);
  const [platformStrategyData, setPlatformStrategyData] = useState<PlatformStrategyData | null>(null);
  const [competitorAnalysisData, setCompetitorAnalysisData] = useState<CompetitorAnalysisData | null>(null);

  const handleBrandComplete = (data: BrandData) => {
    setBrandData(data);
    setSelectedWizard(null);
  };

  const handlePillarsComplete = (data: ContentPillarsData) => {
    setContentPillarsData(data);
    setSelectedWizard(null);
  };

  const handlePlatformsComplete = (data: PlatformStrategyData) => {
    setPlatformStrategyData(data);
    setSelectedWizard(null);
  };

  const handleCompetitorsComplete = (data: CompetitorAnalysisData) => {
    setCompetitorAnalysisData(data);
    setSelectedWizard(null);
  };

  const handleWizardBack = () => {
    setSelectedWizard(null);
  };

  const getCompletedCount = () => {
    let count = 0;
    if (brandData) count++;
    if (contentPillarsData) count++;
    if (platformStrategyData) count++;
    if (competitorAnalysisData) count++;
    return count;
  };

  const getCompletionPercentage = () => {
    return (getCompletedCount() / wizardSteps.length) * 100;
  };

  const isWizardCompleted = (wizardId: WizardStep) => {
    switch (wizardId) {
      case 'brand': return !!brandData;
      case 'pillars': return !!contentPillarsData;
      case 'platforms': return !!platformStrategyData;
      case 'competitors': return !!competitorAnalysisData;
      default: return false;
    }
  };

  const handleFinishStrategy = async () => {
    const completeStrategy = {
      brand: brandData,
      contentPillars: contentPillarsData,
      platformStrategy: platformStrategyData,
      competitorAnalysis: competitorAnalysisData
    };
    
    try {
      // Save to localStorage for immediate access
      localStorage.setItem('contentStrategy', JSON.stringify(completeStrategy));
      localStorage.setItem('onboardingComplete', 'true');
      
      // Save to database
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await markStrategyCompleted(session.user.id, completeStrategy);
      }
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving strategy:', error);
      toast.error('Failed to save strategy. Please try again.');
    }
  };

  const renderWizardSelector = () => {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl shadow-elevated border-card-border">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-primary p-3 rounded-full">
                <Sparkles className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Content Strategy Builder</CardTitle>
            <p className="text-muted-foreground">
              Complete all wizards to build your comprehensive content strategy
            </p>
            <div className="mt-4">
              <Progress value={getCompletionPercentage()} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {getCompletedCount()} of {wizardSteps.length} wizards completed
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select a wizard to configure:</h3>
              
              <div className="grid gap-4">
                {wizardSteps.map((wizard) => {
                  const IconComponent = wizard.icon;
                  const isCompleted = isWizardCompleted(wizard.id);
                  
                  return (
                    <Button
                      key={wizard.id}
                      variant="outline"
                      className="h-auto p-4 justify-start text-left"
                      onClick={() => setSelectedWizard(wizard.id)}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-6 w-6 text-primary" />
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{wizard.title}</span>
                            {isCompleted && (
                              <Badge variant="secondary" className="text-xs">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {wizard.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {getCompletedCount() === wizardSteps.length && (
              <div className="pt-6 border-t border-card-border text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Congratulations! You've completed all wizards.
                </p>
                <Button 
                  onClick={handleFinishStrategy}
                  className="bg-gradient-primary hover:bg-primary/90"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Complete Strategy Setup
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSelectedWizard = () => {
    if (!selectedWizard) return null;

    const wizardConfig = wizardSteps.find(w => w.id === selectedWizard);
    if (!wizardConfig) return null;

    switch (selectedWizard) {
      case 'brand':
        return <BrandBlueprintWizard onComplete={handleBrandComplete} onBack={handleWizardBack} />;
      case 'pillars':
        return <ContentPillarsWizard onComplete={handlePillarsComplete} onBack={handleWizardBack} />;
      case 'platforms':
        return <PlatformStrategyWizard onComplete={handlePlatformsComplete} onBack={handleWizardBack} />;
      case 'competitors':
        return <CompetitorAnalysisWizard onComplete={handleCompetitorsComplete} onBack={handleWizardBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      {selectedWizard ? renderSelectedWizard() : renderWizardSelector()}
    </div>
  );
};

export default Onboarding;