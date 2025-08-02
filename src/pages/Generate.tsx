import { useState } from 'react';
import { Sparkles, FileText, Image, Megaphone, Layout, Wand2, Download, Copy, CheckCircle, AlertCircle, Target, Shield, Eye } from 'lucide-react';
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
import { toast } from 'sonner';

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
    id: 'image',
    name: 'Visual Content',
    icon: Image,
    description: 'Banners, graphics, images',
    color: 'from-green-500 to-teal-500'
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
  const [selectedType, setSelectedType] = useState('');
  const [prompt, setPrompt] = useState('');
  const [platform, setPlatform] = useState('');
  const [tone, setTone] = useState('');
  const [audience, setAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [isCheckingAlignment, setIsCheckingAlignment] = useState(false);
  const [alignmentResults, setAlignmentResults] = useState<any>(null);

  // Mock content strategy data (in real app, this would come from localStorage or context)
  const contentStrategy = {
    brand: 'ContentFlow',
    industry: 'Marketing Technology',
    targetAudience: 'Content creators and marketing professionals',
    tone: 'Professional yet approachable',
    pillars: ['Content Strategy', 'Social Media', 'Analytics', 'Automation']
  };

  const handleGenerate = async () => {
    if (!selectedType || !prompt) {
      toast.error('Please select a content type and enter a prompt');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockContent = generateMockContent(selectedType, prompt, platform, tone);
      setGeneratedContent(mockContent);
      setIsGenerating(false);
      toast.success('Content generated successfully!');
    }, 2000);
  };

  const generateMockContent = (type: string, userPrompt: string, platform: string, tone: string) => {
    const baseContent = {
      article: `# ${userPrompt}\n\n## Introduction\n\nIn today's digital landscape, ${userPrompt.toLowerCase()} has become increasingly important for businesses looking to engage their audience effectively.\n\n## Key Benefits\n\n1. **Enhanced Engagement**: Drive meaningful interactions with your target audience\n2. **Brand Awareness**: Increase visibility and recognition in your industry\n3. **Lead Generation**: Convert prospects into loyal customers\n\n## Best Practices\n\n- Focus on providing value to your audience\n- Maintain consistency across all platforms\n- Monitor and analyze performance metrics\n\n## Conclusion\n\nBy implementing these strategies around ${userPrompt.toLowerCase()}, you'll be well-positioned to achieve your marketing goals and build lasting relationships with your audience.`,
      
      social: `🚀 ${userPrompt}\n\nDid you know that ${userPrompt.toLowerCase()} can transform your ${contentStrategy.industry.toLowerCase()} strategy?\n\nHere's why it matters:\n✅ Drives authentic engagement\n✅ Builds trust with your audience\n✅ Generates measurable results\n\nWhat's your experience with ${userPrompt.toLowerCase()}? Share in the comments! 👇\n\n#${userPrompt.replace(/\s+/g, '')} #MarketingTips #ContentStrategy`,
      
      image: `Image Concept: "${userPrompt}"\n\nVisual Elements:\n- Bold, modern typography\n- Brand colors: Primary blue (#0066CC) with accent orange (#FF6B35)\n- Clean, minimalist layout\n- High-contrast text for readability\n- Subtle gradient background\n\nText Overlay: "${userPrompt}"\nSubtext: "Powered by ${contentStrategy.brand}"\n\nDimensions: 1080x1080px (Instagram square)\nStyle: Professional, eye-catching, on-brand`,
      
      ad: `🎯 ${userPrompt}\n\nHeadline: "Transform Your ${contentStrategy.industry} with ${userPrompt}"\n\nBody Copy:\nReady to take your ${contentStrategy.industry.toLowerCase()} to the next level? Our proven ${userPrompt.toLowerCase()} strategies have helped thousands of ${contentStrategy.targetAudience.toLowerCase()} achieve breakthrough results.\n\n✨ Get started in minutes\n📈 See results in days\n🚀 Scale with confidence\n\nCTA: "Start Your Free Trial Today"\n\nTarget Audience: ${contentStrategy.targetAudience}\nTone: ${tone || contentStrategy.tone}`
    };

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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-xl">
              <Wand2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Content Generator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create amazing content pieces based on your strategy. From articles to ads, we've got you covered.
          </p>
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
                    <div className="bg-muted/50 rounded-lg p-4 border min-h-[400px]">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
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
      </div>
    </div>
  );
};

export default Generate;