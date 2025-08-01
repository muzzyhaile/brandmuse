import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube, 
  Facebook,
  Share,
  Clock,
  Users
} from 'lucide-react';

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
  onBack: () => void;
}

const PlatformStrategyWizard = ({ onComplete, onBack }: PlatformStrategyWizardProps) => {
  const [platforms, setPlatforms] = useState<PlatformConfig[]>([
    {
      platform: 'Instagram',
      enabled: false,
      postingFrequency: '',
      bestTimes: [],
      contentTypes: [],
      tone: '',
      hashtags: [],
      goals: []
    },
    {
      platform: 'LinkedIn',
      enabled: false,
      postingFrequency: '',
      bestTimes: [],
      contentTypes: [],
      tone: '',
      hashtags: [],
      goals: []
    },
    {
      platform: 'Twitter',
      enabled: false,
      postingFrequency: '',
      bestTimes: [],
      contentTypes: [],
      tone: '',
      hashtags: [],
      goals: []
    },
    {
      platform: 'YouTube',
      enabled: false,
      postingFrequency: '',
      bestTimes: [],
      contentTypes: [],
      tone: '',
      hashtags: [],
      goals: []
    },
    {
      platform: 'Facebook',
      enabled: false,
      postingFrequency: '',
      bestTimes: [],
      contentTypes: [],
      tone: '',
      hashtags: [],
      goals: []
    }
  ]);

  const [crossPosting, setCrossPosting] = useState(false);
  const [adaptationNotes, setAdaptationNotes] = useState('');

  const platformIcons = {
    Instagram: Instagram,
    LinkedIn: Linkedin,
    Twitter: Twitter,
    YouTube: Youtube,
    Facebook: Facebook
  };

  const contentTypeOptions = {
    Instagram: ['Stories', 'Reels', 'Posts', 'IGTV', 'Live'],
    LinkedIn: ['Articles', 'Posts', 'Documents', 'Videos', 'Polls'],
    Twitter: ['Tweets', 'Threads', 'Spaces', 'Polls'],
    YouTube: ['Shorts', 'Long-form Videos', 'Live Streams', 'Premieres'],
    Facebook: ['Posts', 'Stories', 'Videos', 'Events', 'Live']
  };

  const frequencyOptions = [
    'Daily', '3-4 times/week', '2-3 times/week', 'Weekly', 'Bi-weekly', 'Monthly'
  ];

  const timeOptions = [
    '6-8 AM', '8-10 AM', '10-12 PM', '12-2 PM', '2-4 PM', 
    '4-6 PM', '6-8 PM', '8-10 PM', '10-12 AM'
  ];

  const updatePlatform = (index: number, field: keyof PlatformConfig, value: any) => {
    const updated = platforms.map((platform, i) => 
      i === index ? { ...platform, [field]: value } : platform
    );
    setPlatforms(updated);
  };

  const toggleContentType = (platformIndex: number, contentType: string) => {
    const platform = platforms[platformIndex];
    const updated = platform.contentTypes.includes(contentType)
      ? platform.contentTypes.filter(t => t !== contentType)
      : [...platform.contentTypes, contentType];
    
    updatePlatform(platformIndex, 'contentTypes', updated);
  };

  const toggleTime = (platformIndex: number, time: string) => {
    const platform = platforms[platformIndex];
    const updated = platform.bestTimes.includes(time)
      ? platform.bestTimes.filter(t => t !== time)
      : [...platform.bestTimes, time];
    
    updatePlatform(platformIndex, 'bestTimes', updated);
  };

  const handleSubmit = () => {
    const enabledPlatforms = platforms.filter(p => p.enabled);
    if (enabledPlatforms.length > 0) {
      onComplete({
        platforms: enabledPlatforms,
        crossPosting,
        adaptationNotes
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Platform Strategy
        </h1>
        <p className="text-muted-foreground">
          Configure your approach for each social media platform
        </p>
      </div>

      <div className="grid gap-6">
        {platforms.map((platform, index) => {
          const Icon = platformIcons[platform.platform as keyof typeof platformIcons];
          
          return (
            <Card key={platform.platform} className={platform.enabled ? 'ring-2 ring-primary' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <Icon className="h-6 w-6" />
                    {platform.platform}
                  </CardTitle>
                  <Checkbox
                    checked={platform.enabled}
                    onCheckedChange={(checked) => updatePlatform(index, 'enabled', checked === true)}
                  />
                </div>
              </CardHeader>
              
              {platform.enabled && (
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Posting Frequency
                      </Label>
                      <Select
                        value={platform.postingFrequency}
                        onValueChange={(value) => updatePlatform(index, 'postingFrequency', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map(freq => (
                            <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Platform Goals</Label>
                      <Textarea
                        placeholder="e.g., Brand awareness, Lead generation..."
                        value={platform.goals.join(', ')}
                        onChange={(e) => updatePlatform(index, 'goals', e.target.value.split(', ').filter(g => g.trim()))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Content Types</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {contentTypeOptions[platform.platform as keyof typeof contentTypeOptions]?.map(type => (
                        <Badge
                          key={type}
                          variant={platform.contentTypes.includes(type) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleContentType(index, type)}
                        >
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Best Posting Times
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {timeOptions.map(time => (
                        <Badge
                          key={time}
                          variant={platform.bestTimes.includes(time) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => toggleTime(index, time)}
                        >
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Platform-Specific Tone</Label>
                    <Input
                      placeholder="e.g., Professional, Casual, Inspirational..."
                      value={platform.tone}
                      onChange={(e) => updatePlatform(index, 'tone', e.target.value)}
                    />
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}

        {/* Cross-posting Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share className="h-5 w-5" />
              Cross-Platform Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cross-posting"
                checked={crossPosting}
                onCheckedChange={(checked) => setCrossPosting(checked === true)}
              />
              <Label htmlFor="cross-posting">
                Enable cross-posting with platform adaptations
              </Label>
            </div>
            
            <div>
              <Label>Adaptation Notes</Label>
              <Textarea
                placeholder="Describe how content should be adapted for different platforms..."
                value={adaptationNotes}
                onChange={(e) => setAdaptationNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Next: Competitor Analysis
        </Button>
      </div>
    </div>
  );
};

export default PlatformStrategyWizard;