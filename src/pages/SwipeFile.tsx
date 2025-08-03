import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Heart, Star, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SwipeFile = () => {
  const navigate = useNavigate();
  const templates = [
    {
      id: 1,
      title: 'Product Launch Announcement',
      category: 'Product Marketing',
      content: '🚀 Exciting news! We\'re thrilled to announce [Product Name] - the game-changer you\'ve been waiting for!',
      engagement: 'High',
      tags: ['product', 'launch', 'announcement']
    },
    {
      id: 2,
      title: 'Behind the Scenes',
      category: 'Storytelling',
      content: 'Take a peek behind the curtain! Here\'s what goes into making [Your Product/Service] amazing...',
      engagement: 'Medium',
      tags: ['bts', 'team', 'process']
    },
    {
      id: 3,
      title: 'Customer Success Story',
      category: 'Social Proof',
      content: '✨ Success Story Alert! Meet [Customer Name] who achieved [Result] using [Your Solution]...',
      engagement: 'High',
      tags: ['testimonial', 'success', 'customer']
    },
    {
      id: 4,
      title: 'Industry Tip',
      category: 'Educational',
      content: '💡 Pro Tip: Did you know that [Industry Insight]? Here\'s how you can apply this...',
      engagement: 'Medium',
      tags: ['tips', 'education', 'value']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Swipe File Library
          </h1>
          <p className="text-muted-foreground">
            Pre-made content templates organized by goals and niches
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-card transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{template.category}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-muted-foreground">{template.engagement}</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{template.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {template.content}
                </CardDescription>
                
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/swipe-file/${template.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button size="sm" variant="outline">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SwipeFile;