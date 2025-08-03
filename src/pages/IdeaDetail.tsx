import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ArrowLeft, Wand2, Share2, TrendingUp, Users, Zap, Bookmark } from 'lucide-react';

const IdeaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Extended idea data (in real app this would come from API/database)
  const idea = {
    id: parseInt(id || '1'),
    title: 'Behind-the-Scenes Content Trend',
    description: 'Show the human side of your brand with authentic behind-the-scenes content',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Authenticity',
    engagement: '12.3K',
    platform: 'Instagram',
    type: 'trend',
    hashtags: ['#BehindTheScenes', '#TeamWork', '#Authentic'],
    fullDescription: `Behind-the-scenes content has become one of the most engaging content types across all platforms. It humanizes your brand, builds trust, and creates genuine connections with your audience.

This trend works because:
• People crave authenticity in an increasingly polished digital world
• It satisfies curiosity about how things really work
• Creates emotional connection through storytelling
• Shows the people behind the brand

Content ideas within this trend:
• Team morning routines or coffee chats
• Product creation process from start to finish
• Office space tours and work environment
• Decision-making processes and team meetings
• Celebrating small wins and learning from failures
• Day-in-the-life content from different team members`,
    examples: [
      'Team brainstorming session for new product features',
      'Coffee chat with founder discussing company values',
      'Time-lapse of product packaging process',
      'Remote team virtual meeting highlights',
      'Office dog interrupting important calls'
    ],
    analytics: {
      avgEngagement: '15.2%',
      bestTimeToPost: '6-8 PM weekdays',
      topPerformingVariant: 'Video content with captions',
      audienceDemographic: '25-45 years, professionals'
    },
    competitors: [
      'Buffer - Team transparency posts',
      'Mailchimp - Creative process videos',
      'Slack - Remote work culture content'
    ],
    actionableSteps: [
      'Identify 3-5 regular processes that could be interesting to your audience',
      'Set up simple recording equipment (phone is sufficient)',
      'Create a content calendar for BTS content (aim for 2-3 per week)',
      'Train team members on basic video/photo etiquette',
      'Establish guidelines for what can and cannot be shared'
    ]
  };

  const handleUseInGenerator = () => {
    navigate('/generate', { 
      state: { 
        ideaInspiration: idea.title,
        contentType: 'social',
        prefilledPrompt: `Create content inspired by: ${idea.title}. ${idea.description}`,
        ideaId: idea.id 
      } 
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'competitor': return Users;
      case 'viral': return Zap;
      default: return TrendingUp;
    }
  };

  const TypeIcon = getTypeIcon(idea.type);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/ideas')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Ideas
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                    <TypeIcon className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="secondary">{idea.category}</Badge>
                  <Badge variant="outline">{idea.platform}</Badge>
                </div>
                <CardTitle className="text-2xl">{idea.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img 
                    src={idea.image} 
                    alt={idea.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Full Description</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {idea.fullDescription}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Content Examples</h3>
                  <ul className="space-y-2">
                    {idea.examples.map((example, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm">{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-2">
                  {idea.hashtags.map((tag) => (
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
                  <Button variant="outline" size="icon">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actionable Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {idea.actionableSteps.map((step, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analytics Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Avg. Engagement</label>
                  <p className="text-2xl font-bold text-primary">{idea.analytics.avgEngagement}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Best Time</label>
                  <p className="text-sm text-muted-foreground">{idea.analytics.bestTimeToPost}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Top Variant</label>
                  <p className="text-sm text-muted-foreground">{idea.analytics.topPerformingVariant}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Audience</label>
                  <p className="text-sm text-muted-foreground">{idea.analytics.audienceDemographic}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Competitor Examples</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {idea.competitors.map((competitor, index) => (
                    <div key={index} className="p-2 bg-muted/50 rounded text-sm">
                      {competitor}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Engagement Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{idea.engagement}</p>
                  <p className="text-sm text-muted-foreground">Total Engagement</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdeaDetail;