import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, FileText, Image, Megaphone, Layout, Wand2, Download, Copy, CheckCircle, AlertCircle, Target, Shield, Eye, Mail, User, Brain, BarChart3, Briefcase, Zap, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';
import BriefingMode from '@/components/BriefingMode';
import { toast } from 'sonner';
import { ContextProfileGenerator, ContentContextProfile, ProfileAnalyzer } from '@/lib/contextProfile';
import { BusinessContextProfile } from '@/lib/businessContextProfile';
import { ComprehensiveSwipeProfile, ContentPiece } from '@/lib/swipeContextProfile';

const contentTypes = [
  {
    id: 'article',
    name: 'Article',
    icon: FileText,
    description: 'Blog posts, tutorials, guides',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'social',
    name: 'Social Post',
    icon: Megaphone,
    description: 'Instagram, Twitter, LinkedIn posts',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'email',
    name: 'Email',
    icon: Mail,
    description: 'Newsletters, campaigns, sequences',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'image',
    name: 'Visual Content',
    icon: Image,
    description: 'Banners, graphics, images',
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 'onbrand_image',
    name: 'On-Brand Image',
    icon: Image,
    description: 'Image brief aligned to brand style',
    color: 'from-emerald-500 to-lime-500'
  },
  {
    id: 'ad',
    name: 'Advertisement',
    icon: Layout,
    description: 'Ad copy, banners, campaigns',
    color: 'from-orange-500 to-red-500'
  }
];

const Generate = () => {
  const location = useLocation();
  const [currentMode, setCurrentMode] = useState<'briefing' | 'generate'>('briefing');
  const [selectedType, setSelectedType] = useState('');
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('');
  const [tone, setTone] = useState('');
  const [audience, setAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isCheckingAlignment, setIsCheckingAlignment] = useState(false);
  const [alignmentResults, setAlignmentResults] = useState<any>(null);
  const [contextProfile, setContextProfile] = useState<ContentContextProfile | null>(null);
  const [showProfileDetails, setShowProfileDetails] = useState(false);
  
  // Briefing Mode State
  const [activeCampaignPlan, setActiveCampaignPlan] = useState<ComprehensiveSwipeProfile | null>(null);
  const [selectedContentPiece, setSelectedContentPiece] = useState<ContentPiece | null>(null);
  const [businessProfile, setBusinessProfile] = useState<BusinessContextProfile | null>(null);
  const [campaignProgress, setCampaignProgress] = useState<Record<number, boolean>>({});

  // Pre-fill prompt from navigation state and load business profile
  useEffect(() => {
    if (location.state?.prompt) {
      setPrompt(location.state.prompt);
    }
    
    // Load business profile from localStorage or context
    // In a real app, this would come from your state management or API
    const savedProfile = localStorage.getItem('businessContextProfile');
    if (savedProfile) {
      try {
        setBusinessProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Failed to load business profile:', error);
      }
    }
  }, [location.state]);

  // Mock content strategy data (in real app, this would come from localStorage or context)
  const contentStrategy = {
    brand: 'Contentmix.ai',
    industry: 'Marketing Technology',
    targetAudience: 'Content creators and marketing professionals',
    tone: 'Professional yet approachable',
    pillars: ['Content Strategy', 'Social Media', 'Analytics', 'Automation']
  };

  // Handle campaign plan generation from Briefing Mode
  const handleCampaignPlanGenerated = (swipeProfile: ComprehensiveSwipeProfile) => {
    setActiveCampaignPlan(swipeProfile);
    setCurrentMode('generate');
    toast.success(`Campaign plan "${swipeProfile.campaign_overview.campaign_name}" generated! Switch to Generate Mode to create content.`);
  };

  // Handle content piece selection from campaign
  const handleContentPieceSelect = (piece: ContentPiece) => {
    setSelectedContentPiece(piece);
    setSelectedType(piece.piece_type);
    setPrompt(`Create ${piece.title}: ${piece.purpose}`);
    toast.info(`Selected piece ${piece.piece_number}: ${piece.title}`);
  };

  // Mark content piece as completed
  const markPieceCompleted = (pieceNumber: number) => {
    setCampaignProgress(prev => ({ ...prev, [pieceNumber]: true }));
    toast.success(`Content piece ${pieceNumber} marked as completed!`);
  };

  const handleGenerate = async () => {
    if (!selectedType || !prompt) {
      toast.error('Please select a content type and enter a prompt');
      return;
    }

    setIsGenerating(true);
    
    // Generate comprehensive context profile (enhanced with campaign context if available)
    const profile = ContextProfileGenerator.generateProfile({
      contentType: selectedType,
      prompt,
      platform,
      tone,
      audience,
      brand: contentStrategy,
      // Add campaign context if generating from a campaign plan
      campaignContext: activeCampaignPlan ? {
        campaignName: activeCampaignPlan.campaign_overview.campaign_name,
        pieceNumber: selectedContentPiece?.piece_number || 1,
        totalPieces: activeCampaignPlan.campaign_overview.total_pieces,
        audienceStage: selectedContentPiece?.audience_stage || 'awareness',
        progressionRole: selectedContentPiece?.progression_role || 'foundation building'
      } : undefined
    });
    
    setContextProfile(profile);
    
    // Simulate API call with profile-enhanced content generation
    setTimeout(() => {
      const mockContent = generateMockContent(selectedType, prompt, platform, tone, profile);
      setGeneratedContent(mockContent);
      setIsGenerating(false);
      
      // If this is an image-type generation, save a placeholder image into the Assets library
      if (selectedType === 'image' || selectedType === 'onbrand_image') {
        const query = prompt && prompt.trim().length > 0 ? prompt : 'brand,marketing';
        const url = `https://source.unsplash.com/800x600/?${encodeURIComponent(query)}&sig=${Date.now()}`;
        try {
          const raw = localStorage.getItem('generatedImages');
          const arr = raw ? JSON.parse(raw) : [];
          const next = Array.isArray(arr) ? [url, ...arr] : [url];
          localStorage.setItem('generatedImages', JSON.stringify(next.slice(0, 200)));
          toast.success('Image saved to Assets > Image Library');
        } catch (e) {
          console.warn('Failed to save image to Assets library:', e);
        }
      }
      
      // If generating from campaign, mark piece as completed
      if (selectedContentPiece) {
        markPieceCompleted(selectedContentPiece.piece_number);
      }
      
      toast.success('Content generated with comprehensive audience profile!');
    }, 2000);
  };

  const generateMockContent = (type: string, userPrompt: string, platform: string, tone: string, profile?: ContentContextProfile) => {
    // Use profile data to enhance content generation
    const audienceInsights = profile ? `
Audience Context: ${profile.audience.primary.psychographics.interests.join(', ')}
Pain Points: ${profile.audience.primary.psychographics.painPoints.join(', ')}
Goals: ${profile.audience.primary.psychographics.goals.join(', ')}
Preferred Platforms: ${profile.audience.primary.behaviorPatterns.preferredPlatforms.join(', ')}
` : '';
    
    const baseContent: Record<string, string> = {
      article: `# ${userPrompt}

In today's fast-paced digital landscape, businesses are constantly seeking innovative solutions to streamline their content creation process. This comprehensive guide explores cutting-edge strategies that can transform your content workflow.${audienceInsights}

## Key Benefits
- Increased efficiency by 300%
- Reduced production time
- Enhanced audience engagement
- Scalable content systems

## Understanding Your Audience
${profile ? `Our analysis shows your target audience (${profile.audience.primary.demographics.ageRange}, ${profile.audience.primary.demographics.occupation.join('/')}) values ${profile.audience.primary.psychographics.values.join(', ')}. They primarily consume content through ${profile.audience.primary.behaviorPatterns.contentConsumption.join(', ')}.` : 'Understanding your audience is crucial for content success.'}

## Implementation Strategy
1. **Assessment Phase**: Analyze current content processes
2. **Planning Phase**: Develop customized content frameworks  
3. **Execution Phase**: Deploy automated content systems
4. **Optimization Phase**: Continuously refine and improve

## Platform-Specific Optimization
${profile?.platformContext.platform !== 'Multi-platform' ? `For ${profile?.platformContext.platform}, focus on ${profile?.platformContext.audienceBehavior.contentPreferences.join(', ')} with ${profile?.platformContext.audienceBehavior.interactionStyle} approach.` : 'Optimize for your chosen platforms.'}

## Conclusion
By implementing these strategic approaches, organizations can achieve remarkable improvements in their content creation efficiency while maintaining high-quality standards that resonate with their target audience.

*Ready to transform your content strategy? Get started today.*`,
      
      social: `🚀 ${userPrompt}\n\nDid you know that ${userPrompt.toLowerCase()} can transform your ${contentStrategy.industry.toLowerCase()} strategy?\n\nHere's why it matters:\n✅ Drives authentic engagement\n✅ Builds trust with your audience\n✅ Generates measurable results\n\nWhat's your experience with ${userPrompt.toLowerCase()}? Share in the comments! 👇\n\n#${userPrompt.replace(/\s+/g, '')} #MarketingTips #ContentStrategy`,
      
      image: `Image Concept: "${userPrompt}"\n\nVisual Elements:\n- Bold, modern typography\n- Brand colors: Primary blue (#0066CC) with accent orange (#FF6B35)\n- Clean, minimalist layout\n- High-contrast text for readability\n- Subtle gradient background\n\nText Overlay: "${userPrompt}"\nSubtext: "Powered by ${contentStrategy.brand}"\n\nDimensions: 1080x1080px (Instagram square)\nStyle: Professional, eye-catching, on-brand`,
      
      email: `Subject: ${userPrompt} - Your ${contentStrategy.industry} Edge\n\nHi [Name],\n\nHave you been thinking about ${userPrompt.toLowerCase()}? You're not alone.\n\nAs a ${contentStrategy.targetAudience.toLowerCase()}, you know that ${userPrompt.toLowerCase()} can be the difference between standing out and blending in.\n\nHere's what we've learned:\n• 73% of professionals see immediate results\n• Implementation takes less than 30 minutes\n• ROI typically shows within the first week\n\nReady to get started? Just reply to this email or click the link below.\n\n[Get Started Now]\n\nBest regards,\nThe ${contentStrategy.brand} Team\n\nP.S. Don't miss out on our limited-time bonus materials!\n\n---\nYou're receiving this because you subscribed to ${contentStrategy.brand} updates.\nUnsubscribe | Manage Preferences`,
      
      ad: `🎯 ${userPrompt}\n\nHeadline: "Transform Your ${contentStrategy.industry} with ${userPrompt}"\n\nBody Copy:\nReady to take your ${contentStrategy.industry.toLowerCase()} to the next level? Our proven ${userPrompt.toLowerCase()} strategies have helped thousands of ${contentStrategy.targetAudience.toLowerCase()} achieve breakthrough results.\n\n✨ Get started in minutes\n📈 See results in days\n🚀 Scale with confidence\n\nCTA: "Start Your Free Trial Today"\n\nTarget Audience: ${contentStrategy.targetAudience}\nTone: ${tone || contentStrategy.tone}`
    };

    // Build On-Brand Image brief using brand visual identity
    const platformKey = (profile?.platformContext.platform || '').toLowerCase();
    const suggestedRatios: Record<string, string> = {
      instagram: '1080x1350 (portrait) or 1080x1080 (square)',
      linkedin: '1200x627 (landscape)',
      twitter: '1200x675 (landscape)',
      facebook: '1200x630 (landscape)'
    };
    const ratio = suggestedRatios[platformKey] || '1080x1080 (square)';
    const colors = profile?.brand.visualIdentity.colors || ['#3B82F6', '#8B5CF6', '#10B981'];
    const style = profile?.brand.visualIdentity.style || 'Modern, Clean, Tech-forward';
    const imagery = profile?.brand.visualIdentity.imagery || 'Professional, Diverse, Solution-focused';
    const platformHint = (profile?.platformContext.platform && profile.platformContext.platform !== 'Multi-platform')
      ? `Primary Platform: ${profile.platformContext.platform}`
      : 'Primary Platform: Instagram';
    baseContent['onbrand_image'] = `On-Brand Image Brief: "${userPrompt}"

Brand Visual Identity
- Core Colors: ${colors.join(', ')}
- Design Style: ${style}
- Imagery Guidance: ${imagery}

Creative Direction
- Concept: Translate "${userPrompt}" into a visual that reflects the brand tone (${profile?.brand.voice.tone || tone || 'Professional yet approachable'})
- Typography: Use brand-approved type; maintain readability and hierarchy
- Composition: Clean, generous whitespace, strong focal point, accessible contrast

Content Elements
- Primary Headline: "${userPrompt}"
- Optional Subtext: Value prop or CTA aligned to campaign goals
- Logo Usage: Subtle placement, clear safe area

Production Specs
- ${platformHint}
- Recommended Dimensions: ${ratio}
- File Format: PNG (static) or SVG (vector elements)
- Accessibility: Provide alt text; avoid color-only meaning; ensure 4.5:1 contrast

Notes
- Align with content pillars: ${(profile?.strategy.contentPillars || ['Education', 'Innovation']).join(', ')}
- Audience focus: ${profile ? profile.audience.primary.psychographics.values.join(', ') : 'Value-driven, solution-oriented'}
${audienceInsights}`;

    return baseContent[type as keyof typeof baseContent] || 'Content generated successfully!';
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    toast.success('Content copied to clipboard!');
  };

  const checkBrandAlignment = async () => {
    setIsCheckingAlignment(true);
    
    // Simulate brand alignment and bias analysis
    setTimeout(() => {
      const mockAlignment = {
        overallScore: 85,
        toneAlignment: 92,
        audienceRelevance: 78,
        pillarAlignment: 88,
        brandConsistency: 85,
        biasScore: 94, // Higher is better (less bias)
        feedback: [
          { type: 'success', message: 'Tone matches your brand voice perfectly' },
          { type: 'warning', message: 'Consider adding more specific industry terminology' },
          { type: 'success', message: 'Content aligns well with your target audience' },
          { type: 'info', message: 'Suggestion: Include a call-to-action that reflects your content pillars' }
        ],
        biasAnalysis: {
          overallRisk: 'low',
          detectedBiases: [
            { type: 'gender', risk: 'low', message: 'Language appears gender-neutral' },
            { type: 'cultural', risk: 'medium', message: 'Some terminology may not translate across all cultures' },
            { type: 'accessibility', risk: 'low', message: 'Content is accessible and inclusive' },
            { type: 'ageism', risk: 'low', message: 'No age-related bias detected' },
            { type: 'socioeconomic', risk: 'low', message: 'Language is inclusive of different backgrounds' }
          ],
          recommendations: [
            'Consider using "professionals" instead of industry-specific jargon',
            'Add alt text descriptions when mentioning visual elements',
            'Include diverse examples in your content'
          ]
        },
        recommendations: [
          'Add more technical details to appeal to marketing professionals',
          'Include specific metrics or data points',
          'Consider mentioning one of your content pillars: "Analytics"'
        ]
      };
      
      setAlignmentResults(mockAlignment);
      setIsCheckingAlignment(false);
      toast.success('Brand alignment and bias analysis complete!');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Dual Mode Interface */}
        {currentMode === 'briefing' ? (
          <BriefingMode 
            businessProfile={businessProfile || undefined}
            onPlanGenerated={handleCampaignPlanGenerated}
            onSwitchToGenerate={() => setCurrentMode('generate')}
          />
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl">
                    <Wand2 className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                      Content Generator
                    </h1>
                    <p className="text-lg text-muted-foreground">
                      Create amazing content pieces based on your strategy. From articles to ads, we've got you covered.
                    </p>
                  </div>
                </div>
                
                {/* Mode Toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentMode('briefing')}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Briefing Mode
                  </Button>
                  <Button
                    variant="default"
                    className="bg-gradient-primary"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Generate Mode
                  </Button>
                </div>
              </div>
              
              {/* Campaign Progress Indicator */}
              {activeCampaignPlan && (
                <Card className="mb-6 border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-left">
                        <h3 className="font-semibold text-primary">
                          Active Campaign: {activeCampaignPlan.campaign_overview.campaign_name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {activeCampaignPlan.campaign_overview.total_pieces} pieces • {activeCampaignPlan.campaign_overview.timeline}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-white">
                        {Object.keys(campaignProgress).length} / {activeCampaignPlan.campaign_overview.total_pieces} completed
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {activeCampaignPlan.content_sequence.map((piece) => {
                        const isCompleted = campaignProgress[piece.piece_number];
                        const isSelected = selectedContentPiece?.piece_number === piece.piece_number;
                        
                        return (
                          <Button
                            key={piece.piece_number}
                            variant={isSelected ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleContentPieceSelect(piece)}
                            className={cn(
                              'justify-start text-left h-auto p-2',
                              isCompleted && 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
                              isSelected && !isCompleted && 'bg-primary text-primary-foreground'
                            )}
                          >
                            <div className="flex items-center gap-2 w-full">
                              <div className={cn(
                                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                                isCompleted ? 'bg-green-500 text-white' : 
                                isSelected ? 'bg-white text-primary' : 'bg-muted text-muted-foreground'
                              )}>
                                {isCompleted ? <CheckCircle className="h-3 w-3" /> : piece.piece_number}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-xs truncate">{piece.title}</p>
                                <p className="text-xs opacity-75 truncate">{piece.piece_type}</p>
                              </div>
                            </div>
                          </Button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

        {/* Strategy Summary */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Content Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Brand</Label>
                <p className="font-semibold">{contentStrategy.brand}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Industry</Label>
                <p className="font-semibold">{contentStrategy.industry}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Audience</Label>
                <p className="font-semibold">{contentStrategy.targetAudience}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Tone</Label>
                <p className="font-semibold">{contentStrategy.tone}</p>
              </div>
            </div>
            <div className="mt-4">
              <Label className="text-sm font-medium text-muted-foreground">Content Pillars</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {contentStrategy.pillars.map((pillar, index) => (
                  <Badge key={index} variant="secondary">{pillar}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Type Selection */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Choose Content Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Card
                        key={type.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-card ${
                          selectedType === type.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedType(type.id)}
                      >
                        <CardContent className="p-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold mb-1">{type.name}</h3>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Generation Form */}
            <Card>
              <CardHeader>
                <CardTitle>Content Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="prompt">What do you want to create?</Label>
                  <Textarea
                    id="prompt"
                    placeholder="E.g., A guide about social media marketing for small businesses"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="platform">Platform (optional)</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="blog">Blog/Website</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tone">Tone Override</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Use strategy tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual</SelectItem>
                        <SelectItem value="humorous">Humorous</SelectItem>
                        <SelectItem value="inspirational">Inspirational</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !selectedType || !prompt}
                  className="w-full bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Generated Content */}
          <div>
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Generated Content</CardTitle>
                {generatedContent && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={checkBrandAlignment}
                      disabled={isCheckingAlignment}
                      className="bg-primary/5 border-primary/20 hover:bg-primary/10"
                    >
                      {isCheckingAlignment ? (
                        <>
                          <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <Target className="h-4 w-4 mr-2" />
                          Check Brand Fit
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {generatedContent ? (
                  <div className="space-y-4">
                    <div className="rounded-lg p-4 border min-h-[400px] bg-card overflow-auto">
                      <pre className="whitespace-pre-wrap font-mono text-base leading-relaxed text-foreground">
                        {generatedContent}
                      </pre>
                    </div>
                    
                    {/* Brand Alignment Results */}
                    {alignmentResults && (
                      <Card className="mt-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Target className="h-5 w-5 text-primary" />
                            Brand Alignment & Bias Analysis
                            <div className="flex gap-2 ml-auto">
                              <Badge variant="secondary">
                                {alignmentResults.overallScore}% Brand Match
                              </Badge>
                              <Badge 
                                variant={alignmentResults.biasScore >= 90 ? "default" : alignmentResults.biasScore >= 70 ? "secondary" : "destructive"}
                                className="flex items-center gap-1"
                              >
                                <Shield className="h-3 w-3" />
                                {alignmentResults.biasScore}% Bias-Free
                              </Badge>
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Score Breakdown */}
                          <div>
                            <Label className="text-sm font-medium mb-3 block">Brand Alignment Metrics</Label>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Tone Alignment</span>
                                  <span>{alignmentResults.toneAlignment}%</span>
                                </div>
                                <Progress value={alignmentResults.toneAlignment} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Audience Relevance</span>
                                  <span>{alignmentResults.audienceRelevance}%</span>
                                </div>
                                <Progress value={alignmentResults.audienceRelevance} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Pillar Alignment</span>
                                  <span>{alignmentResults.pillarAlignment}%</span>
                                </div>
                                <Progress value={alignmentResults.pillarAlignment} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Brand Consistency</span>
                                  <span>{alignmentResults.brandConsistency}%</span>
                                </div>
                                <Progress value={alignmentResults.brandConsistency} className="h-2" />
                              </div>
                            </div>
                          </div>

                          {/* Bias Detection */}
                          <div>
                            <Label className="text-sm font-medium mb-3 flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Bias Detection Analysis
                              <Badge 
                                variant={alignmentResults.biasAnalysis.overallRisk === 'low' ? "default" : 
                                        alignmentResults.biasAnalysis.overallRisk === 'medium' ? "secondary" : "destructive"}
                                className="text-xs"
                              >
                                {alignmentResults.biasAnalysis.overallRisk} risk
                              </Badge>
                            </Label>
                            <div className="space-y-3">
                              {alignmentResults.biasAnalysis.detectedBiases.map((bias: any, index: number) => (
                                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    bias.risk === 'low' ? 'bg-green-500' : 
                                    bias.risk === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}></div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-sm capitalize">{bias.type} Bias</span>
                                      <Badge 
                                        variant={bias.risk === 'low' ? "default" : bias.risk === 'medium' ? "secondary" : "destructive"}
                                        className="text-xs"
                                      >
                                        {bias.risk}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{bias.message}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Feedback */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Brand Feedback</Label>
                            <div className="space-y-2">
                              {alignmentResults.feedback.map((item: any, index: number) => (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                  {item.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />}
                                  {item.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />}
                                  {item.type === 'info' && <Sparkles className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />}
                                  <span className={`${
                                    item.type === 'success' ? 'text-green-700' : 
                                    item.type === 'warning' ? 'text-yellow-700' : 
                                    'text-blue-700'
                                  }`}>
                                    {item.message}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Bias Recommendations */}
                          <div>
                            <Label className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Bias Prevention Recommendations
                            </Label>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {alignmentResults.biasAnalysis.recommendations.map((rec: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="w-1 h-1 bg-orange-500 rounded-full mt-2 flex-shrink-0"></span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Brand Recommendations */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">Brand Enhancement Recommendations</Label>
                            <ul className="space-y-1 text-sm text-muted-foreground">
                              {alignmentResults.recommendations.map((rec: string, index: number) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold mb-2">Ready to create?</h3>
                    <p className="text-muted-foreground">
                      Select a content type and describe what you want to generate
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Generate;