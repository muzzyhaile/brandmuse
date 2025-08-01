import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  ChevronLeft, 
  ChevronRight, 
  Layers3, 
  FileText, 
  PieChart, 
  Lightbulb, 
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentPillar {
  name: string;
  description: string;
  topics: string[];
  percentage: number;
}

interface ContentPillarsData {
  pillars: ContentPillar[];
  contentMix: {
    educational: number;
    promotional: number;
    entertaining: number;
    inspirational: number;
  };
}

interface ContentPillarsWizardProps {
  onComplete: (data: ContentPillarsData) => void;
  onBack?: () => void;
}

const wizardSteps = [
  {
    id: 'pillars',
    title: 'Content Pillars',
    description: 'Define your main content themes',
    icon: Layers3
  },
  {
    id: 'topics',
    title: 'Topics & Themes',
    description: 'Add specific topics for each pillar',
    icon: Lightbulb
  },
  {
    id: 'distribution',
    title: 'Content Distribution',
    description: 'Set percentage allocation for each pillar',
    icon: PieChart
  },
  {
    id: 'mix',
    title: 'Content Mix',
    description: 'Define your content type balance',
    icon: TrendingUp
  }
];

const ContentPillarsWizard = ({ onComplete, onBack }: ContentPillarsWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<ContentPillarsData>({
    pillars: [
      { name: '', description: '', topics: [], percentage: 25 }
    ],
    contentMix: {
      educational: 40,
      promotional: 20,
      entertaining: 25,
      inspirational: 15
    }
  });

  const progress = ((currentStep + 1) / wizardSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < wizardSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const addPillar = (name: string) => {
    if (name.trim() && data.pillars.length < 6) {
      const newPercentage = Math.floor(100 / (data.pillars.length + 1));
      setData(prev => ({
        ...prev,
        pillars: [...prev.pillars, { name: name.trim(), description: '', topics: [], percentage: newPercentage }]
      }));
    }
  };

  const removePillar = (index: number) => {
    if (data.pillars.length > 1) {
      setData(prev => ({
        ...prev,
        pillars: prev.pillars.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePillarDescription = (index: number, description: string) => {
    setData(prev => ({
      ...prev,
      pillars: prev.pillars.map((pillar, i) => 
        i === index ? { ...pillar, description } : pillar
      )
    }));
  };

  const updatePillarTopics = (index: number, topics: string[]) => {
    setData(prev => ({
      ...prev,
      pillars: prev.pillars.map((pillar, i) => 
        i === index ? { ...pillar, topics } : pillar
      )
    }));
  };

  const updatePillarPercentage = (index: number, percentage: number) => {
    setData(prev => ({
      ...prev,
      pillars: prev.pillars.map((pillar, i) => 
        i === index ? { ...pillar, percentage } : pillar
      )
    }));
  };

  const updateContentMix = (type: keyof typeof data.contentMix, value: number) => {
    setData(prev => ({
      ...prev,
      contentMix: { ...prev.contentMix, [type]: value }
    }));
  };

  const renderStepContent = () => {
    switch (wizardSteps[currentStep].id) {
      case 'pillars':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Add Content Pillars</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter pillar name (e.g., Education, Behind the Scenes)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addPillar(e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addPillar(input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>
              <div className="grid gap-3 mt-4">
                {data.pillars.map((pillar, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{pillar.name || `Pillar ${index + 1}`}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePillar(index)}
                        className="text-destructive hover:text-destructive"
                        disabled={data.pillars.length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'topics':
        return (
          <div className="space-y-6">
            {data.pillars.map((pillar, pillarIndex) => (
              <div key={pillarIndex} className="space-y-3">
                <Label className="text-base font-semibold">{pillar.name || `Pillar ${pillarIndex + 1}`} - Description & Topics</Label>
                <Textarea
                  placeholder="Describe this content pillar..."
                  value={pillar.description}
                  onChange={(e) => updatePillarDescription(pillarIndex, e.target.value)}
                  rows={2}
                  className="mb-3"
                />
                <Textarea
                  placeholder="Add specific topics, separated by commas..."
                  value={pillar.topics.join(', ')}
                  onChange={(e) => updatePillarTopics(pillarIndex, e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                  rows={3}
                />
              </div>
            ))}
          </div>
        );

      case 'distribution':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base">Content Pillar Distribution (%)</Label>
              {data.pillars.map((pillar, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{pillar.name || `Pillar ${index + 1}`}</span>
                    <span className="text-muted-foreground">{pillar.percentage}%</span>
                  </div>
                  <Slider
                    value={[pillar.percentage]}
                    onValueChange={(value) => updatePillarPercentage(index, value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              ))}
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Total: {data.pillars.reduce((sum, pillar) => sum + pillar.percentage, 0)}%
                </p>
              </div>
            </div>
          </div>
        );

      case 'mix':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base">Content Type Mix (%)</Label>
              {Object.entries(data.contentMix).map(([type, percentage]) => (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium capitalize">{type}</span>
                    <span className="text-muted-foreground">{percentage}%</span>
                  </div>
                  <Slider
                    value={[percentage]}
                    onValueChange={(value) => updateContentMix(type as keyof typeof data.contentMix, value[0])}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              ))}
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Total: {Object.values(data.contentMix).reduce((sum, val) => sum + val, 0)}%
                </p>
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
              <Layers3 className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Content Pillars Wizard</CardTitle>
          <p className="text-muted-foreground">
            Define your core content themes and distribution strategy
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
              className="bg-gradient-primary hover:bg-primary/90"
            >
              {currentStep === wizardSteps.length - 1 ? (
                <>
                  Complete Setup
                  <Sparkles className="h-4 w-4 ml-2" />
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

export default ContentPillarsWizard;