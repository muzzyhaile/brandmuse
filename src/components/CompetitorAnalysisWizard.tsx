import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  Search, 
  Target, 
  Lightbulb,
  Sparkles,
  Plus,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Competitor {
  name: string;
  platforms: string[];
  strengths: string[];
  weaknesses: string[];
  contentTypes: string[];
  postingFrequency: string;
  engagement: string;
  notes: string;
}

interface CompetitorAnalysisData {
  competitors: Competitor[];
  industryTrends: string[];
  opportunities: string[];
  differentiators: string[];
}

interface CompetitorAnalysisWizardProps {
  onComplete: (data: CompetitorAnalysisData) => void;
  onBack?: () => void;
}

const wizardSteps = [
  { id: 'competitors', title: 'Competitor List', description: 'Identify your main competitors', icon: Search },
  { id: 'analysis', title: 'Competitor Analysis', description: 'Analyze strengths and weaknesses', icon: Target },
  { id: 'trends', title: 'Industry Trends', description: 'Identify current market trends', icon: TrendingUp },
  { id: 'strategy', title: 'Strategic Insights', description: 'Define opportunities and differentiators', icon: Lightbulb }
];

const platforms = ['Instagram', 'TikTok', 'LinkedIn', 'Twitter/X', 'Facebook', 'YouTube', 'Pinterest'];
const contentTypes = ['Educational', 'Entertainment', 'Behind-the-scenes', 'User-generated', 'Promotional', 'News/Updates'];
const frequencies = ['Multiple times daily', 'Daily', '3-4 times per week', '1-2 times per week', 'Weekly', 'Bi-weekly'];
const engagementLevels = ['Very High (>10%)', 'High (5-10%)', 'Medium (2-5%)', 'Low (1-2%)', 'Very Low (<1%)'];

const CompetitorAnalysisWizard = ({ onComplete, onBack }: CompetitorAnalysisWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<CompetitorAnalysisData>({
    competitors: [],
    industryTrends: [],
    opportunities: [],
    differentiators: []
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

  const addCompetitor = () => {
    setData(prev => ({
      ...prev,
      competitors: [...prev.competitors, {
        name: '',
        platforms: [],
        strengths: [],
        weaknesses: [],
        contentTypes: [],
        postingFrequency: '',
        engagement: '',
        notes: ''
      }]
    }));
  };

  const removeCompetitor = (index: number) => {
    setData(prev => ({
      ...prev,
      competitors: prev.competitors.filter((_, i) => i !== index)
    }));
  };

  const updateCompetitor = (index: number, field: keyof Competitor, value: any) => {
    setData(prev => ({
      ...prev,
      competitors: prev.competitors.map((comp, i) => 
        i === index ? { ...comp, [field]: value } : comp
      )
    }));
  };

  const addToList = (field: 'industryTrends' | 'opportunities' | 'differentiators', value: string) => {
    if (value.trim()) {
      setData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeFromList = (field: 'industryTrends' | 'opportunities' | 'differentiators', index: number) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const renderStepContent = () => {
    switch (wizardSteps[currentStep].id) {
      case 'competitors':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Label className="text-base">Your Main Competitors</Label>
              <Button onClick={addCompetitor} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Competitor
              </Button>
            </div>
            
            {data.competitors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No competitors added yet. Click "Add Competitor" to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.competitors.map((competitor, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <Input
                        placeholder="Competitor name"
                        value={competitor.name}
                        onChange={(e) => updateCompetitor(index, 'name', e.target.value)}
                        className="flex-1 mr-2"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCompetitor(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm">Platforms</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {platforms.map(platform => (
                            <div key={platform} className="flex items-center space-x-2">
                              <Checkbox
                                id={`${index}-${platform}`}
                                checked={competitor.platforms.includes(platform)}
                                onCheckedChange={(checked) => {
                                  const newPlatforms = checked
                                    ? [...competitor.platforms, platform]
                                    : competitor.platforms.filter(p => p !== platform);
                                  updateCompetitor(index, 'platforms', newPlatforms);
                                }}
                              />
                              <Label htmlFor={`${index}-${platform}`} className="text-xs">
                                {platform}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'analysis':
        return (
          <div className="space-y-6">
            {data.competitors.map((competitor, index) => (
              <Card key={index} className="p-4">
                <h4 className="font-semibold mb-4">{competitor.name || `Competitor ${index + 1}`}</h4>
                
                <div className="grid gap-4">
                  <div>
                    <Label className="text-sm">Content Types</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {contentTypes.map(type => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${index}-content-${type}`}
                            checked={competitor.contentTypes.includes(type)}
                            onCheckedChange={(checked) => {
                              const newTypes = checked
                                ? [...competitor.contentTypes, type]
                                : competitor.contentTypes.filter(t => t !== type);
                              updateCompetitor(index, 'contentTypes', newTypes);
                            }}
                          />
                          <Label htmlFor={`${index}-content-${type}`} className="text-xs">
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm">Posting Frequency</Label>
                      <Select
                        value={competitor.postingFrequency}
                        onValueChange={(value) => updateCompetitor(index, 'postingFrequency', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencies.map(freq => (
                            <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm">Engagement Level</Label>
                      <Select
                        value={competitor.engagement}
                        onValueChange={(value) => updateCompetitor(index, 'engagement', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select engagement" />
                        </SelectTrigger>
                        <SelectContent>
                          {engagementLevels.map(level => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm">Strengths</Label>
                    <Textarea
                      placeholder="What are they doing well? (separate with commas)"
                      value={competitor.strengths.join(', ')}
                      onChange={(e) => updateCompetitor(index, 'strengths', 
                        e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      )}
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Weaknesses</Label>
                    <Textarea
                      placeholder="What could they improve? (separate with commas)"
                      value={competitor.weaknesses.join(', ')}
                      onChange={(e) => updateCompetitor(index, 'weaknesses', 
                        e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                      )}
                      rows={2}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Additional Notes</Label>
                    <Textarea
                      placeholder="Any other observations..."
                      value={competitor.notes}
                      onChange={(e) => updateCompetitor(index, 'notes', e.target.value)}
                      rows={2}
                      className="mt-1"
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        );

      case 'trends':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base">Industry Trends</Label>
              <p className="text-sm text-muted-foreground mb-4">
                What trends are you seeing in your industry?
              </p>
              
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter a trend (e.g., Video-first content, AI integration)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToList('industryTrends', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addToList('industryTrends', input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {data.industryTrends.map((trend, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {trend}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeFromList('industryTrends', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 'strategy':
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base">Market Opportunities</Label>
              <p className="text-sm text-muted-foreground mb-4">
                What gaps or opportunities do you see in the market?
              </p>
              
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter an opportunity"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToList('opportunities', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addToList('opportunities', input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {data.opportunities.map((opportunity, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {opportunity}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeFromList('opportunities', index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base">Your Differentiators</Label>
              <p className="text-sm text-muted-foreground mb-4">
                What makes you unique compared to competitors?
              </p>
              
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Enter a differentiator"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToList('differentiators', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    addToList('differentiators', input.value);
                    input.value = '';
                  }}
                >
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {data.differentiators.map((diff, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {diff}
                    <X 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => removeFromList('differentiators', index)}
                    />
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
              <TrendingUp className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Competitor Analysis Wizard</CardTitle>
          <p className="text-muted-foreground">Analyze your competitive landscape</p>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">Step {currentStep + 1} of {wizardSteps.length}</p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            {wizardSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={step.id} className={cn("flex flex-col items-center text-center flex-1", index <= currentStep ? "text-primary" : "text-muted-foreground")}>
                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors", index <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              );
            })}
          </div>

          <Separator />

          <div className="min-h-[300px]">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">{wizardSteps[currentStep].title}</h3>
              <p className="text-sm text-muted-foreground">{wizardSteps[currentStep].description}</p>
            </div>
            {renderStepContent()}
          </div>

          <div className="flex justify-between pt-6 border-t border-card-border">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0 && !onBack}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              {currentStep === 0 ? 'Back to Strategy' : 'Previous'}
            </Button>
            <Button onClick={handleNext} className="bg-gradient-primary hover:bg-primary/90">
              {currentStep === wizardSteps.length - 1 ? (
                <>Complete Setup<Sparkles className="h-4 w-4 ml-2" /></>
              ) : (
                <>Next<ChevronRight className="h-4 w-4 ml-2" /></>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetitorAnalysisWizard;
