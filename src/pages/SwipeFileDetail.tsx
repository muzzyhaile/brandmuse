import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Heart, Star, ArrowLeft, Wand2, Download, Share2 } from 'lucide-react';

const SwipeFileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Extended template data (in real app this would come from API/database)
  const template = {
    id: parseInt(id || '1'),
    title: 'Product Launch Announcement',
    category: 'Product Marketing',
    content: '🚀 Exciting news! We\'re thrilled to announce [Product Name] - the game-changer you\'ve been waiting for!',
    engagement: 'High',
    tags: ['product', 'launch', 'announcement'],
    fullContent: `🚀 Exciting news! We're thrilled to announce [Product Name] - the game-changer you've been waiting for!

✨ What makes [Product Name] special?
• [Key Feature 1] - Revolutionary approach to [benefit]
• [Key Feature 2] - Save up to [X] hours per week
• [Key Feature 3] - Built specifically for [target audience]

🎯 Perfect for: [Target Audience Description]
💡 Use Case: [Specific scenario where this shines]

Ready to transform your [industry/workflow]? 

🔗 Learn more: [Link]
💬 Questions? Drop them below!

#ProductLaunch #Innovation #[YourIndustry] #GameChanger`,
    variations: [
      'Short version for Twitter/X',
      'LinkedIn professional tone',
      'Instagram story-friendly',
      'Email announcement version'
    ],
    metrics: {
      averageEngagement: '8.5%',
      bestPlatforms: ['LinkedIn', 'Twitter', 'Instagram'],
      optimalTiming: '10-11 AM, Tuesday-Thursday'
    },
    tips: [
      'Replace [Product Name] with your actual product name',
      'Customize the key features to match your offering',
      'Add relevant industry hashtags',
      'Include a clear call-to-action',
      'Use emojis sparingly but effectively'
    ]
  };

  const handleUseInGenerator = () => {
    // Navigate to generator with pre-filled template
    navigate('/generate', { 
      state: { 
        prefilledContent: template.fullContent,
        contentType: 'social',
        templateId: template.id 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/assets')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Assets
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{template.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">{template.engagement}</span>
                  </div>
                </div>
                <CardTitle className="text-2xl">{template.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Full Template</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {template.fullContent}
                    </pre>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleUseInGenerator} className="flex-1">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Use in Generator
                  </Button>
                  <Button variant="outline">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {template.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Average Engagement</label>
                  <p className="text-2xl font-bold text-primary">{template.metrics.averageEngagement}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Best Platforms</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {template.metrics.bestPlatforms.map((platform) => (
                      <Badge key={platform} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Optimal Timing</label>
                  <p className="text-sm text-muted-foreground">{template.metrics.optimalTiming}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Variations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {template.variations.map((variation, index) => (
                    <Button 
                      key={index} 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start text-xs"
                    >
                      <Download className="h-3 w-3 mr-2" />
                      {variation}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwipeFileDetail;