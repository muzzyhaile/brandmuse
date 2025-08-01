import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, 
  ChevronRight, 
  Megaphone, 
  Clock, 
  Target,
  Hash,
  Sparkles,
  Plus,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlatformConfig {
  platform: string;
  enabled: boolean;
  postingFrequency: string;
  bestTimes: string[];
  contentTypes: string[];
  tone: string;
  hashtags: string[];
  goals: string[];
}

interface PlatformStrategyData {
  platforms: PlatformConfig[];
  crossPosting: boolean;
  adaptationNotes: string;
}

interface PlatformStrategyWizardProps {
  onComplete: (data: PlatformStrategyData) => void;
  onBack?: () => void;
}

const wizardSteps = [
  { id: 'platforms', title: 'Platform Selection', description: 'Choose your social media platforms', icon: Megaphone },
  { id: 'scheduling', title: 'Posting Schedule', description: 'Set frequency and optimal times', icon: Clock },
  { id: 'content', title: 'Content Strategy', description: 'Define content types and tone', icon: Target },
  { id: 'optimization', title: 'Optimization', description: 'Hashtags and cross-posting settings', icon: Hash }
];

const availablePlatforms = ['Instagram', 'TikTok', 'LinkedIn', 'Twitter/X', 'Facebook', 'YouTube'];
const frequencyOptions = ['daily', '3x per week', '2x per week', 'weekly', 'bi-weekly'];
const timeSlots = ['6-9 AM', '9-12 PM', '12-3 PM', '3-6 PM', '6-9 PM', '9-12 AM'];
const contentTypeOptions = ['Photos', 'Videos', 'Stories', 'Reels', 'Carousels', 'Live', 'Polls', 'Text Posts'];
const toneOptions = ['professional', 'casual', 'friendly', 'authoritative', 'playful', 'inspirational'];

const PlatformStrategyWizard = ({ onComplete, onBack }: PlatformStrategyWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<PlatformStrategyData>({
    platforms: availablePlatforms.map(platform => ({
      platform,
      enabled: false,
      postingFrequency: 'daily',
      bestTimes: [],
      contentTypes: [],
      tone: 'professional',
      hashtags: [],
      goals: []
    })),
    crossPosting: false,
    adaptationNotes: ''
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

  const togglePlatform = (platformName: string) => {
    setData(prev => ({
      ...prev,
      platforms: prev.platforms.map(p =>
        p.platform === platformName ? { ...p, enabled: !p.enabled } : p
      )
    }));
  };

  const updatePlatform = (platformName: string, field: keyof PlatformConfig, value: any) => {
    setData(prev => ({
      ...prev,
      platforms: prev.platforms.map(p =>
        p.platform === platformName ? { ...p, [field]: value } : p
      )
    }));
  };

  const addHashtag = (platformName: string, hashtag: string) => {
    if (hashtag.trim()) {
      updatePlatform(platformName, 'hashtags', [
        ...data.platforms.find(p => p.platform === platformName)?.hashtags || [],
        hashtag.trim()
      ]);
    }
  };

  const removeHashtag = (platformName: string, index: number) => {
    const platform = data.platforms.find(p => p.platform === platformName);
    if (platform) {
      updatePlatform(platformName, 'hashtags', platform.hashtags.filter((_, i) => i !== index));
    }
  };

  const addGoal = (platformName: string, goal: string) => {
    if (goal.trim()) {
      updatePlatform(platformName, 'goals', [
        ...data.platforms.find(p => p.platform === platformName)?.goals || [],
        goal.trim()
      ]);
    }
  };

  const removeGoal = (platformName: string, index: number) => {
    const platform = data.platforms.find(p => p.platform === platformName);
    if (platform) {
      updatePlatform(platformName, 'goals', platform.goals.filter((_, i) => i !== index));
    }
  };

  const renderStepContent = () => {
    const enabledPlatforms = data.platforms.filter(p => p.enabled);

    switch (wizardSteps[currentStep].id) {
      case 'platforms':
        return (
          <div className="space-y-4">
            <Label className="text-base">Select the platforms you want to use:</Label>
            <div className="grid grid-cols-2 gap-3">
              {data.platforms.map((platform) => (
                <div key={platform.platform} className="flex items-center space-x-2">
                  <Checkbox
                    id={platform.platform}
                    checked={platform.enabled}
                    onCheckedChange={() => togglePlatform(platform.platform)}
                  />
                  <Label htmlFor={platform.platform} className="font-medium">
                    {platform.platform}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'scheduling':
        return (
          <div className="space-y-6">
            {enabledPlatforms.map((platform) => (
              <div key={platform.platform} className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">{platform.platform}</h4>
                
                <div className="space-y-2">
                  <Label>Posting Frequency</Label>
                  <Select
                    value={platform.postingFrequency}
                    onValueChange={(value) => updatePlatform(platform.platform, 'postingFrequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map(freq => (
                        <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Best Times to Post</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map(time => (
                      <div key={time} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${platform.platform}-${time}`}
                          checked={platform.bestTimes.includes(time)}
                          onCheckedChange={(checked) => {
                            const newTimes = checked
                              ? [...platform.bestTimes, time]
                              : platform.bestTimes.filter(t => t !== time);
                            updatePlatform(platform.platform, 'bestTimes', newTimes);
                          }}
                        />
                        <Label htmlFor={`${platform.platform}-${time}`} className="text-sm">
                          {time}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            {enabledPlatforms.map((platform) => (
              <div key={platform.platform} className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">{platform.platform}</h4>
                
                <div className="space-y-2">
                  <Label>Content Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {contentTypeOptions.map(type => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${platform.platform}-${type}`}
                          checked={platform.contentTypes.includes(type)}
                          onCheckedChange={(checked) => {
                            const newTypes = checked
                              ? [...platform.contentTypes, type]
                              : platform.contentTypes.filter(t => t !== type);
                            updatePlatform(platform.platform, 'contentTypes', newTypes);
                          }}
                        />
                        <Label htmlFor={`${platform.platform}-${type}`} className="text-sm">
                          {type}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tone of Voice</Label>
                  <Select
                    value={platform.tone}
                    onValueChange={(value) => updatePlatform(platform.platform, 'tone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map(tone => (
                        <SelectItem key={tone} value={tone} className="capitalize">{tone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Platform Goals</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a goal..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addGoal(platform.platform, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addGoal(platform.platform, input.value);
                        input.value = '';
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {platform.goals.map((goal, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {goal}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => removeGoal(platform.platform, index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'optimization':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="crossPosting"
                  checked={data.crossPosting}
                  onCheckedChange={(checked) => setData(prev => ({ ...prev, crossPosting: !!checked }))}
                />
                <Label htmlFor="crossPosting">Enable cross-posting between platforms</Label>
              </div>

              <div className="space-y-2">
                <Label>Content Adaptation Notes</Label>
                <Textarea
                  placeholder="Notes on how to adapt content for different platforms..."
                  value={data.adaptationNotes}
                  onChange={(e) => setData(prev => ({ ...prev, adaptationNotes: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            {enabledPlatforms.map((platform) => (
              <div key={platform.platform} className="space-y-4 p-4 border rounded-lg">
                <h4 className="font-semibold">{platform.platform} Hashtags</h4>
                
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add hashtag (without #)..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addHashtag(platform.platform, e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addHashtag(platform.platform, input.value);
                        input.value = '';
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {platform.hashtags.map((hashtag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        #{hashtag}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() => removeHashtag(platform.platform, index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
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
              <Megaphone className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Platform Strategy Wizard</CardTitle>
          <p className="text-muted-foreground">Configure your social media platform strategy</p>
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

export default PlatformStrategyWizard;
