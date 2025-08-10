import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Palette, 
  Target, 
  MessageSquare, 
  Shield, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Users,
  Heart,
  Zap,
  FileText,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BusinessContextGenerator, BusinessContextProfile } from '@/lib/businessContextProfile';
import { toast } from 'sonner';

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

interface BrandBlueprintWizardProps {
  onComplete: (brandData: BrandData, contextProfile: BusinessContextProfile) => void;
  onBack?: () => void;
}

const wizardSteps = [
  {
    id: 'basics',
    title: 'Brand Basics',
    description: 'Tell us about your brand foundation',
    icon: Target
  },
  {
    id: 'audience',
    title: 'Target Audience',
    description: 'Define who you speak to',
    icon: Users
  },
  {
    id: 'voice',
    title: 'Brand Voice',
    description: 'How does your brand communicate?',
    icon: MessageSquare
  },
  {
    id: 'visual',
    title: 'Visual Identity',
    description: 'Colors and visual elements',
    icon: Palette
  },
  {
    id: 'guidelines',
    title: 'Content Guidelines',
    description: 'Rules and restrictions',
    icon: Shield
  }
];

const BrandBlueprintWizard = ({ onComplete, onBack }: BrandBlueprintWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);
  const [brandData, setBrandData] = useState<BrandData>({
    companyName: '',
    industry: '',
    targetAudience: '',
    brandValues: [],
    toneOfVoice: '',
    primaryColors: [],
    bannedWords: [],
    contentGoals: [],
    brandPersonality: ''
  });

  const progress = ((currentStep + 1) / wizardSteps.length) * 100;

  const handleNext = async () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate comprehensive business context profile
      setIsGeneratingProfile(true);
      
      try {
        const contextProfile = BusinessContextGenerator.generateProfile({
          wizardType: 'brand_blueprint',
          userInputs: {
            brandName: brandData.companyName,
            industry: brandData.industry,
            targetAudience: brandData.targetAudience,
            brandValues: brandData.brandValues,
            tone: brandData.toneOfVoice,
            brandPersonality: brandData.brandPersonality,
            contentGoals: brandData.contentGoals,
            primaryColors: brandData.primaryColors,
            bannedWords: brandData.bannedWords
          }
        });
        
        toast.success('Brand blueprint and comprehensive context profile generated!');
        onComplete(brandData, contextProfile);
      } catch (error) {
        toast.error('Failed to generate context profile. Please try again.');
        console.error('Profile generation error:', error);
      } finally {
        setIsGeneratingProfile(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const updateBrandData = (field: keyof BrandData, value: any) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: keyof BrandData, value: string) => {
    const current = brandData[field] as string[];
    if (value && !current.includes(value)) {
      updateBrandData(field, [...current, value]);
    }
  };

  const removeFromArray = (field: keyof BrandData, value: string) => {
    const current = brandData[field] as string[];
    updateBrandData(field, current.filter(item => item !== value));
  };

  const renderStepContent = () => {
    switch (wizardSteps[currentStep].id) {
      case 'basics':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={brandData.companyName}
                onChange={(e) => updateBrandData('companyName', e.target.value)}
                placeholder="Enter your company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={brandData.industry}
                onChange={(e) => updateBrandData('industry', e.target.value)}
                placeholder="e.g., Technology, Fashion, Food & Beverage"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brandPersonality">Brand Personality</Label>
              <Textarea
                id="brandPersonality"
                value={brandData.brandPersonality}
                onChange={(e) => updateBrandData('brandPersonality', e.target.value)}
                placeholder="Describe your brand's personality in a few sentences..."
                rows={4}
              />
            </div>
          </div>
        );

      case 'audience':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={brandData.targetAudience}
                onChange={(e) => updateBrandData('targetAudience', e.target.value)}
                placeholder="Describe your ideal customer demographics, interests, and behaviors..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Brand Values</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a brand value"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToArray('brandValues', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addToArray('brandValues', input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {brandData.brandValues.map((value, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => removeFromArray('brandValues', value)}
                  >
                    {value} ×
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 'voice':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="toneOfVoice">Tone of Voice</Label>
              <Textarea
                id="toneOfVoice"
                value={brandData.toneOfVoice}
                onChange={(e) => updateBrandData('toneOfVoice', e.target.value)}
                placeholder="Describe how your brand communicates (e.g., friendly, professional, quirky, authoritative)..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Content Goals</Label>
              <div className="grid grid-cols-2 gap-2">
                {['Education', 'Entertainment', 'Inspiration', 'Sales', 'Community Building', 'Brand Awareness'].map((goal) => (
                  <Button
                    key={goal}
                    variant={brandData.contentGoals.includes(goal) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      if (brandData.contentGoals.includes(goal)) {
                        removeFromArray('contentGoals', goal);
                      } else {
                        addToArray('contentGoals', goal);
                      }
                    }}
                    className="justify-start"
                  >
                    {goal}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'visual':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Primary Brand Colors</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add hex color (e.g., #FF5733)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToArray('primaryColors', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addToArray('primaryColors', input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {brandData.primaryColors.map((color, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    style={{ backgroundColor: color, color: '#fff' }}
                    onClick={() => removeFromArray('primaryColors', color)}
                  >
                    {color} ×
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 'guidelines':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Banned Words/Phrases</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add words or phrases to avoid"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToArray('bannedWords', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addToArray('bannedWords', input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {brandData.bannedWords.map((word, index) => (
                  <Badge
                    key={index}
                    variant="destructive"
                    className="cursor-pointer"
                    onClick={() => removeFromArray('bannedWords', word)}
                  >
                    {word} ×
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl shadow-elevated border-card-border">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-primary p-3 rounded-full">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Brand Blueprint Wizard</CardTitle>
          <p className="text-muted-foreground">
            Let's set up your brand guidelines to ensure consistent content creation
          </p>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentStep + 1} of {wizardSteps.length}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step Navigation */}
          <div className="flex items-center justify-between">
            {wizardSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center text-center flex-1",
                    index <= currentStep ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors",
                      index <= currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Current Step Content */}
          <div className="min-h-[300px]">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">{wizardSteps[currentStep].title}</h3>
              <p className="text-sm text-muted-foreground">
                {wizardSteps[currentStep].description}
              </p>
            </div>
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-card-border">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 && !onBack}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep === 0 ? 'Back to Strategy' : 'Previous'}
            </Button>
            <Button
              onClick={handleNext}
              disabled={isGeneratingProfile}
              className="bg-gradient-primary hover:bg-primary/90"
            >
              {isGeneratingProfile ? (
                <>
                  Generating Profile...
                  <Sparkles className="h-4 w-4 ml-2 animate-spin" />
                </>
              ) : currentStep === wizardSteps.length - 1 ? (
                <>
                  Complete & Generate Profile
                  <FileText className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandBlueprintWizard;