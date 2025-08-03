import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, TrendingUp, Users, Heart, MessageCircle, Share, ExternalLink, Eye, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';

// Mock data for ideas
const mockIdeas = [
  {
    id: 1,
    type: 'trend',
    title: 'Sustainable Fashion Movement',
    description: 'Gen Z driving eco-conscious fashion choices',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
    category: 'Fashion',
    engagement: '2.3M',
    platform: 'TikTok',
    hashtags: ['#SustainableFashion', '#EcoFriendly', '#GenZ']
  },
  {
    id: 2,
    type: 'competitor',
    title: 'Nike\'s Interactive Stories',
    description: 'Behind-the-scenes athlete training content',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    category: 'Sports',
    engagement: '1.8M',
    platform: 'Instagram',
    hashtags: ['#JustDoIt', '#AthleteLife', '#Training']
  },
  {
    id: 3,
    type: 'post',
    title: 'Minimalist Workspace Setup',
    description: 'Clean desk aesthetic with productivity tips',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
    category: 'Lifestyle',
    engagement: '845K',
    platform: 'Pinterest',
    hashtags: ['#Minimalism', '#Workspace', '#Productivity']
  },
  {
    id: 4,
    type: 'trend',
    title: 'AI-Generated Art',
    description: 'Artists using AI tools for creative collaboration',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=300&fit=crop',
    category: 'Technology',
    engagement: '3.1M',
    platform: 'Twitter',
    hashtags: ['#AIArt', '#DigitalArt', '#Innovation']
  },
  {
    id: 5,
    type: 'competitor',
    title: 'Spotify\'s Playlist Stories',
    description: 'User-generated content around music discovery',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    category: 'Music',
    engagement: '2.7M',
    platform: 'TikTok',
    hashtags: ['#SpotifyWrapped', '#MusicDiscovery', '#Playlist']
  },
  {
    id: 6,
    type: 'post',
    title: 'Plant Parent Journey',
    description: 'Indoor gardening tips and plant care hacks',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    category: 'Lifestyle',
    engagement: '692K',
    platform: 'Instagram',
    hashtags: ['#PlantParent', '#IndoorGarden', '#PlantCare']
  }
];

const Ideas = () => {
  const navigate = useNavigate();
  const [savedIdeas, setSavedIdeas] = useState<number[]>([]);

  const toggleSave = (ideaId: number) => {
    setSavedIdeas(prev => 
      prev.includes(ideaId) 
        ? prev.filter(id => id !== ideaId)
        : [...prev, ideaId]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      case 'competitor':
        return <Users className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trend':
        return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'competitor':
        return 'bg-gradient-to-r from-blue-500 to-purple-500';
      default:
        return 'bg-gradient-to-r from-green-500 to-teal-500';
    }
  };

  const filteredIdeas = (type?: string) => {
    if (!type) return mockIdeas;
    return mockIdeas.filter(idea => idea.type === type);
  };

  const IdeaCard = ({ idea }: { idea: typeof mockIdeas[0] }) => (
    <Card className="group overflow-hidden hover:shadow-elegant transition-all duration-300 cursor-pointer">
      <div className="relative">
        <img 
          src={idea.image} 
          alt={idea.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className={`${getTypeColor(idea.type)} text-white border-none`}>
            {getTypeIcon(idea.type)}
            <span className="ml-1 capitalize">{idea.type}</span>
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white"
            onClick={(e) => {
              e.stopPropagation();
              toggleSave(idea.id);
            }}
          >
            <Heart 
              className={`h-4 w-4 ${savedIdeas.includes(idea.id) ? 'fill-red-500 text-red-500' : ''}`} 
            />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">{idea.category}</Badge>
          <span className="text-sm text-muted-foreground">{idea.platform}</span>
        </div>
        
        <h3 className="font-semibold mb-2 line-clamp-1">{idea.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{idea.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {idea.hashtags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {idea.hashtags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{idea.hashtags.length - 2}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {idea.engagement}
            </span>
          </div>
          
          <div className="flex gap-1">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 px-2 text-xs"
              onClick={() => navigate(`/ideas/${idea.id}`)}
            >
              <Eye className="h-3 w-3 mr-1" />
              Details
            </Button>
            <Button 
              size="sm" 
              className="h-7 px-2 text-xs"
              onClick={() => navigate('/generate', { 
                state: { 
                  ideaInspiration: idea.title,
                  contentType: 'social',
                  prefilledPrompt: `Create content inspired by: ${idea.title}. ${idea.description}`,
                  ideaId: idea.id 
                } 
              })}
            >
              <Wand2 className="h-3 w-3 mr-1" />
              Use
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Ideas & Inspiration
          </h1>
          <p className="text-muted-foreground">
            Discover trending content, competitor insights, and viral posts to inspire your strategy
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All Ideas</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="competitors">Competitors</TabsTrigger>
            <TabsTrigger value="posts">Viral Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {mockIdeas.map((idea) => (
                <div key={idea.id} className="break-inside-avoid">
                  <IdeaCard idea={idea} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredIdeas('trend').map((idea) => (
                <div key={idea.id} className="break-inside-avoid">
                  <IdeaCard idea={idea} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="competitors">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredIdeas('competitor').map((idea) => (
                <div key={idea.id} className="break-inside-avoid">
                  <IdeaCard idea={idea} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="posts">
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {filteredIdeas('post').map((idea) => (
                <div key={idea.id} className="break-inside-avoid">
                  <IdeaCard idea={idea} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Ideas;