import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Search, TrendingUp, Eye } from 'lucide-react';

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
  onBack: () => void;
}

const CompetitorAnalysisWizard = ({ onComplete, onBack }: CompetitorAnalysisWizardProps) => {
  const [competitors, setCompetitors] = useState<Competitor[]>([
    {
      name: '',
      platforms: [],
      strengths: [],
      weaknesses: [],
      contentTypes: [],
      postingFrequency: '',
      engagement: '',
      notes: ''
    }
  ]);

  const [industryTrends, setIndustryTrends] = useState<string[]>([]);
  const [opportunities, setOpportunities] = useState<string[]>([]);
  const [differentiators, setDifferentiators] = useState<string[]>([]);

  const [currentTrend, setCurrentTrend] = useState('');
  const [currentOpportunity, setCurrentOpportunity] = useState('');
  const [currentDifferentiator, setCurrentDifferentiator] = useState('');

  const platforms = ['Instagram', 'LinkedIn', 'Twitter', 'YouTube', 'Facebook', 'TikTok', 'Pinterest'];
  const contentTypes = ['Posts', 'Stories', 'Videos', 'Reels', 'Articles', 'Podcasts', 'Live Streams'];
  const engagementLevels = ['Low', 'Medium', 'High', 'Very High'];
  const frequencies = ['Daily', '3-4 times/week', '2-3 times/week', 'Weekly', 'Bi-weekly', 'Monthly'];

  const addCompetitor = () => {
    setCompetitors([...competitors, {
      name: '',
      platforms: [],
      strengths: [],
      weaknesses: [],
      contentTypes: [],
      postingFrequency: '',
      engagement: '',
      notes: ''
    }]);
  };

  const removeCompetitor = (index: number) => {
    if (competitors.length > 1) {
      setCompetitors(competitors.filter((_, i) => i !== index));
    }
  };

  const updateCompetitor = (index: number, field: keyof Competitor, value: any) => {
    const updated = competitors.map((competitor, i) => 
      i === index ? { ...competitor, [field]: value } : competitor
    );
    setCompetitors(updated);
  };

  const toggleArrayItem = (index: number, field: 'platforms' | 'strengths' | 'weaknesses' | 'contentTypes', item: string) => {
    const competitor = competitors[index];
    const currentArray = competitor[field] as string[];
    const updated = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    
    updateCompetitor(index, field, updated);
  };

  const addToArray = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (item.trim() && !array.includes(item.trim())) {
      setArray([...array, item.trim()]);
    }
  };

  const removeFromArray = (array: string[], setArray: (arr: string[]) => void, index: number) => {
    setArray(array.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const validCompetitors = competitors.filter(c => c.name.trim());
    onComplete({
      competitors: validCompetitors,
      industryTrends,
      opportunities,
      differentiators
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Competitor Analysis
        </h1>
        <p className="text-muted-foreground">
          Analyze your competition to identify opportunities and differentiate your content
        </p>
      </div>

      <div className="grid gap-6">
        {/* Competitors */}
        {competitors.map((competitor, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Competitor {index + 1}
                </CardTitle>
                {competitors.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCompetitor(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Competitor Name</Label>
                  <Input
                    placeholder="Company or brand name"
                    value={competitor.name}
                    onChange={(e) => updateCompetitor(index, 'name', e.target.value)}
                  />
                </div>
                
                <div>
                  <Label>Posting Frequency</Label>
                  <Select
                    value={competitor.postingFrequency}
                    onValueChange={(value) => updateCompetitor(index, 'postingFrequency', value)}
                  >
                    <SelectTrigger>
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
                  <Label>Engagement Level</Label>
                  <Select
                    value={competitor.engagement}
                    onValueChange={(value) => updateCompetitor(index, 'engagement', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
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
                <Label>Active Platforms</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {platforms.map(platform => (
                    <Badge
                      key={platform}
                      variant={competitor.platforms.includes(platform) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem(index, 'platforms', platform)}
                    >
                      {platform}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label>Content Types</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {contentTypes.map(type => (
                    <Badge
                      key={type}
                      variant={competitor.contentTypes.includes(type) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleArrayItem(index, 'contentTypes', type)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Strengths</Label>
                  <Textarea
                    placeholder="What they do well (one per line)"
                    value={competitor.strengths.join('\n')}
                    onChange={(e) => updateCompetitor(index, 'strengths', e.target.value.split('\n').filter(s => s.trim()))}
                  />
                </div>
                
                <div>
                  <Label>Weaknesses/Gaps</Label>
                  <Textarea
                    placeholder="What they could improve (one per line)"
                    value={competitor.weaknesses.join('\n')}
                    onChange={(e) => updateCompetitor(index, 'weaknesses', e.target.value.split('\n').filter(s => s.trim()))}
                  />
                </div>
              </div>

              <div>
                <Label>Additional Notes</Label>
                <Textarea
                  placeholder="Any other observations about their content strategy..."
                  value={competitor.notes}
                  onChange={(e) => updateCompetitor(index, 'notes', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        <Button variant="outline" onClick={addCompetitor} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Another Competitor
        </Button>

        {/* Industry Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Industry Trends
              </CardTitle>
              <CardDescription>
                Current trends in your industry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a trend"
                  value={currentTrend}
                  onChange={(e) => setCurrentTrend(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToArray(industryTrends, setIndustryTrends, currentTrend);
                      setCurrentTrend('');
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    addToArray(industryTrends, setIndustryTrends, currentTrend);
                    setCurrentTrend('');
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {industryTrends.map((trend, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-secondary p-2 rounded">
                    <span>{trend}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromArray(industryTrends, setIndustryTrends, i)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Opportunities
              </CardTitle>
              <CardDescription>
                Content gaps you can fill
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add an opportunity"
                  value={currentOpportunity}
                  onChange={(e) => setCurrentOpportunity(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToArray(opportunities, setOpportunities, currentOpportunity);
                      setCurrentOpportunity('');
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    addToArray(opportunities, setOpportunities, currentOpportunity);
                    setCurrentOpportunity('');
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {opportunities.map((opportunity, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-secondary p-2 rounded">
                    <span>{opportunity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromArray(opportunities, setOpportunities, i)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Differentiators</CardTitle>
              <CardDescription>
                What makes you unique
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a differentiator"
                  value={currentDifferentiator}
                  onChange={(e) => setCurrentDifferentiator(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToArray(differentiators, setDifferentiators, currentDifferentiator);
                      setCurrentDifferentiator('');
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    addToArray(differentiators, setDifferentiators, currentDifferentiator);
                    setCurrentDifferentiator('');
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {differentiators.map((diff, i) => (
                  <div key={i} className="flex items-center justify-between text-sm bg-secondary p-2 rounded">
                    <span>{diff}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromArray(differentiators, setDifferentiators, i)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Complete Strategy Setup
        </Button>
      </div>
    </div>
  );
};

export default CompetitorAnalysisWizard;