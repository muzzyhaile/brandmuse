import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ArrowUp, Zap, Mail, FileText, Image, MessageSquare, Megaphone, Video } from 'lucide-react';

const quickPrompts = [
  {
    icon: Mail,
    title: "Email Campaign",
    prompt: "Create a welcome email sequence for new subscribers to my fitness newsletter"
  },
  {
    icon: MessageSquare,
    title: "Social Media Post",
    prompt: "Write an engaging Instagram post about the benefits of morning routines"
  },
  {
    icon: FileText,
    title: "Blog Article",
    prompt: "Write a comprehensive guide about sustainable living for beginners"
  },
  {
    icon: Megaphone,
    title: "Advertisement",
    prompt: "Create a Facebook ad for a new productivity app targeting remote workers"
  },
  {
    icon: Video,
    title: "Video Script",
    prompt: "Write a YouTube video script about the top 5 digital marketing trends"
  },
  {
    icon: Image,
    title: "Visual Content",
    prompt: "Create a carousel post explaining the customer journey for social media"
  }
];

const ContentPromptEntry = () => {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (prompt.trim()) {
      navigate('/generate', { state: { prompt: prompt.trim() } });
    }
  };

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-foreground">
            Create professional content
          </h1>
          <p className="text-xl text-muted-foreground">
            Describe what content you want to create and watch it come to life
          </p>
        </div>

        {/* Main Prompt Input */}
        <Card className="bg-card/50 border-0 p-4 shadow-sm backdrop-blur-sm">
          <div className="relative">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask Contentmix.ai to create content about..."
              className="min-h-[80px] text-lg resize-none bg-background border-border text-foreground placeholder:text-muted-foreground focus:bg-background transition-colors"
            />
            <Button
              onClick={handleSubmit}
              disabled={!prompt.trim()}
              className="absolute bottom-3 right-3 h-10 w-10 p-0"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </Card>

        {/* Quick Prompts */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground text-center">
            Or try one of these popular requests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickPrompts.map((item, index) => (
              <Card
                key={index}
                className="bg-card border-border p-4 cursor-pointer hover:bg-muted transition-colors group"
                onClick={() => handleQuickPrompt(item.prompt)}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.prompt}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Additional Navigation */}
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={() => navigate('/swipe-file')}
          >
            Browse Templates
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/ideas')}
          >
            Get Ideas
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentPromptEntry;