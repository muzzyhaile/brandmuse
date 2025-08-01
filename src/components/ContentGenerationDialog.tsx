import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Calendar, Video, Image, FileText, MessageSquare, Target, Users, MessageCircle, Megaphone, TrendingUp, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { addDays } from 'date-fns';

interface ContentGenerationDialogProps {
  trigger: React.ReactNode;
  onContentGenerated: (content: any[]) => void;
}

interface BriefData {
  // Campaign Basics
  campaignName: string;
  timeframe: string;
  contentTypes: string[];
  
  // Campaign Objectives
  objectives: string;
  targetAudience: string;
  keyMessages: string;
  
  // Content Details
  toneOfVoice: string;
  callToAction: string;
  hashtags: string;
  
  // Additional Context
  budget: string;
  successMetrics: string;
  additionalNotes: string;
}

const ContentGenerationDialog = ({ trigger, onContentGenerated }: ContentGenerationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [briefData, setBriefData] = useState<BriefData>({
    campaignName: '',
    timeframe: '',
    contentTypes: [],
    objectives: '',
    targetAudience: '',
    keyMessages: '',
    toneOfVoice: '',
    callToAction: '',
    hashtags: '',
    budget: '',
    successMetrics: '',
    additionalNotes: '',
  });

  const contentTypes = [
    { id: 'post', label: 'Social Media Posts', icon: MessageSquare },
    { id: 'story', label: 'Stories & Reels', icon: Image },
    { id: 'video', label: 'Video Content', icon: Video },
    { id: 'article', label: 'Articles & Blogs', icon: FileText },
  ];

  const toneOptions = [
    'Professional', 'Casual', 'Friendly', 'Authoritative', 'Playful', 
    'Inspirational', 'Educational', 'Conversational', 'Witty', 'Empathetic'
  ];

  const handleContentTypeToggle = (typeId: string) => {
    setBriefData(prev => ({
      ...prev,
      contentTypes: prev.contentTypes.includes(typeId) 
        ? prev.contentTypes.filter(id => id !== typeId)
        : [...prev.contentTypes, typeId]
    }));
  };

  const handleInputChange = (field: keyof BriefData, value: string) => {
    setBriefData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    if (!briefData.campaignName || !briefData.timeframe || briefData.contentTypes.length === 0) {
      toast({
        title: "Missing Required Information",
        description: "Please fill in campaign name, timeframe, and select at least one content type.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate content generation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate content items based on timeframe and content types
      const generatedContent = generateContentItems(briefData);
      
      // Add generated content to calendar
      onContentGenerated(generatedContent);
      
      toast({
        title: "Content Brief Created Successfully!",
        description: `Generated ${generatedContent.length} pieces of content for "${briefData.campaignName}" campaign.`,
      });
      
      setIsOpen(false);
      // Reset form
      setBriefData({
        campaignName: '',
        timeframe: '',
        contentTypes: [],
        objectives: '',
        targetAudience: '',
        keyMessages: '',
        toneOfVoice: '',
        callToAction: '',
        hashtags: '',
        budget: '',
        successMetrics: '',
        additionalNotes: '',
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateContentItems = (briefData: BriefData) => {
    const contentIdeas = {
      post: [
        'Product showcase post',
        'Behind the scenes content',
        'Customer testimonial',
        'Industry insight post',
        'Educational carousel',
        'Company culture highlight',
        'Trending topic commentary',
        'User-generated content feature'
      ],
      story: [
        'Quick tip story',
        'Day in the life story',
        'Process walkthrough',
        'Team introduction',
        'Product demo',
        'Q&A session',
        'Poll or question',
        'Behind the scenes story'
      ],
      video: [
        'Tutorial video',
        'Product demonstration',
        'Interview content',
        'Webinar highlight',
        'Testimonial video',
        'Educational series',
        'Event recap',
        'How-to guide'
      ],
      article: [
        'Industry analysis',
        'Thought leadership piece',
        'Case study',
        'Best practices guide',
        'Trend report',
        'How-to article',
        'Company update',
        'Expert interview'
      ]
    };

    const getDaysFromTimeframe = (timeframe: string) => {
      switch (timeframe) {
        case '1-week': return 7;
        case '2-weeks': return 14;
        case '1-month': return 30;
        case '3-months': return 90;
        default: return 7;
      }
    };

    const getContentCount = (timeframe: string, contentTypes: string[]) => {
      const days = getDaysFromTimeframe(timeframe);
      const postsPerType = Math.max(1, Math.floor((days / 7) * 2)); // ~2 posts per week per type
      return Math.min(postsPerType, 8); // Cap at 8 per type
    };

    const generated = [];
    const startDate = new Date();
    const days = getDaysFromTimeframe(briefData.timeframe);
    const contentCount = getContentCount(briefData.timeframe, briefData.contentTypes);

    briefData.contentTypes.forEach((type) => {
      const ideas = contentIdeas[type as keyof typeof contentIdeas] || [];
      
      for (let i = 0; i < contentCount; i++) {
        const dayOffset = Math.floor((i / contentCount) * days);
        const contentDate = addDays(startDate, dayOffset);
        
        generated.push({
          id: `generated-${type}-${i}-${Date.now()}`,
          date: contentDate,
          title: `${briefData.campaignName} - ${ideas[i % ideas.length]}`,
          type: type as 'post' | 'story' | 'video' | 'article',
          status: 'draft' as const,
          content: `Generated content for ${briefData.campaignName} campaign. ${briefData.objectives ? `Objective: ${briefData.objectives}` : ''}`,
          campaign: briefData.campaignName,
          briefData: briefData
        });
      }
    });

    return generated;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Social Media Content Brief
          </DialogTitle>
          <DialogDescription>
            Fill out this brief to generate strategic content. All questions are optional except the marked ones (*).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campaign Essentials */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Campaign Essentials
              </CardTitle>
              <CardDescription>The basics we need to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name *</Label>
                  <Input
                    id="campaign-name"
                    placeholder="e.g., Summer Launch, Holiday Sale..."
                    value={briefData.campaignName}
                    onChange={(e) => handleInputChange('campaignName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe *</Label>
                  <Select value={briefData.timeframe} onValueChange={(value) => handleInputChange('timeframe', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-week">1 Week</SelectItem>
                      <SelectItem value="2-weeks">2 Weeks</SelectItem>
                      <SelectItem value="1-month">1 Month</SelectItem>
                      <SelectItem value="3-months">3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Content Types * (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <div
                        key={type.id}
                        className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          briefData.contentTypes.includes(type.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleContentTypeToggle(type.id)}
                      >
                        <Checkbox
                          checked={briefData.contentTypes.includes(type.id)}
                          onChange={() => handleContentTypeToggle(type.id)}
                        />
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Campaign Strategy
              </CardTitle>
              <CardDescription>Help us understand your goals and audience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="objectives">What are your main objectives?</Label>
                <Textarea
                  id="objectives"
                  placeholder="e.g., Increase brand awareness, drive sales, launch new product, engage community..."
                  value={briefData.objectives}
                  onChange={(e) => handleInputChange('objectives', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-audience">Who is your target audience?</Label>
                <Textarea
                  id="target-audience"
                  placeholder="e.g., Young professionals aged 25-35, tech enthusiasts, small business owners..."
                  value={briefData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-messages">Key messages to communicate</Label>
                <Textarea
                  id="key-messages"
                  placeholder="e.g., Quality craftsmanship, affordable luxury, innovative solutions..."
                  value={briefData.keyMessages}
                  onChange={(e) => handleInputChange('keyMessages', e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Content Guidelines
              </CardTitle>
              <CardDescription>Define the voice and style for your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone of Voice</Label>
                  <Select value={briefData.toneOfVoice} onValueChange={(value) => handleInputChange('toneOfVoice', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((tone) => (
                        <SelectItem key={tone} value={tone.toLowerCase()}>{tone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cta">Primary Call-to-Action</Label>
                  <Input
                    id="cta"
                    placeholder="e.g., Shop Now, Learn More, Sign Up..."
                    value={briefData.callToAction}
                    onChange={(e) => handleInputChange('callToAction', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hashtags">Hashtags & Keywords</Label>
                <Input
                  id="hashtags"
                  placeholder="e.g., #innovation #sustainability #quality"
                  value={briefData.hashtags}
                  onChange={(e) => handleInputChange('hashtags', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Context */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Additional Context
              </CardTitle>
              <CardDescription>Optional details to enhance your content strategy</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Considerations</Label>
                  <Select value={briefData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minimal">Minimal Budget</SelectItem>
                      <SelectItem value="moderate">Moderate Budget</SelectItem>
                      <SelectItem value="substantial">Substantial Budget</SelectItem>
                      <SelectItem value="unlimited">No Budget Constraints</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="metrics">Success Metrics</Label>
                  <Input
                    id="metrics"
                    placeholder="e.g., Reach, Engagement, Conversions..."
                    value={briefData.successMetrics}
                    onChange={(e) => handleInputChange('successMetrics', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any other context, inspiration, or specific requirements..."
                  value={briefData.additionalNotes}
                  onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Strategy Integration Notice */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Megaphone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary">Smart Content Generation</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your content will be generated using your completed brand strategy, content pillars, 
                    platform preferences, and competitor insights for maximum impact.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator />

        <DialogFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Only campaign name, timeframe, and content types are required
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content Brief
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentGenerationDialog;