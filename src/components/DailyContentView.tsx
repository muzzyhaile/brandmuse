import { useState } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  FileText,
  Video,
  Camera,
  PenTool,
  Shield,
  Lightbulb,
  Library,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'post' | 'story' | 'video' | 'article';
  status: 'draft' | 'ready' | 'published';
  platform: string[];
  tags: string[];
  alignmentScore?: number;
  feedback?: string[];
}

interface DailyContentViewProps {
  date: Date;
  content?: ContentItem[];
}

const contentTypeIcons = {
  post: FileText,
  story: Camera,
  video: Video,
  article: PenTool
};

const statusColors = {
  draft: 'bg-calendar-empty text-calendar-empty-foreground',
  ready: 'bg-calendar-today text-calendar-today-foreground',
  published: 'bg-calendar-content text-calendar-content-foreground'
};

const DailyContentView = ({ date, content = [] }: DailyContentViewProps) => {
  const navigate = useNavigate();
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showValidator, setShowValidator] = useState(false);
  const [showSwipeFile, setShowSwipeFile] = useState(false);

  const handleBack = () => {
    navigate('/');
  };

  const handleValidateContent = (content: ContentItem) => {
    setSelectedContent(content);
    setShowValidator(true);
    // Simulate validation
    setTimeout(() => {
      setSelectedContent(prev => prev ? {
        ...prev,
        alignmentScore: Math.floor(Math.random() * 30) + 70, // 70-100
        feedback: [
          'Tone matches brand guidelines',
          'Consider adding more engaging call-to-action',
          'Color scheme aligns with brand palette'
        ]
      } : null);
    }, 1500);
  };

  const mockSwipeFileTemplates = [
    { id: '1', title: 'Product Launch Template', type: 'post', category: 'Marketing' },
    { id: '2', title: 'Behind the Scenes Story', type: 'story', category: 'Engagement' },
    { id: '3', title: 'Tutorial Video Script', type: 'video', category: 'Education' },
    { id: '4', title: 'Industry Insights Article', type: 'article', category: 'Thought Leadership' }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="hover:bg-secondary-hover"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Calendar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {format(date, 'EEEE, MMMM d, yyyy')}
            </h1>
            <p className="text-muted-foreground">Content planning for this day</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content List */}
            <Card className="shadow-card border-card-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Content for Today
                </CardTitle>
                <Button size="sm" className="bg-gradient-primary hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Content
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No content planned for this day</p>
                    <p className="text-sm">Click "Add Content" to start planning</p>
                  </div>
                ) : (
                  content.map((item) => {
                    const IconComponent = contentTypeIcons[item.type];
                    return (
                      <Card key={item.id} className="border-card-border hover:shadow-card transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <IconComponent className="h-5 w-5 text-primary" />
                              <div>
                                <h3 className="font-medium text-foreground">{item.title}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {item.type}
                                  </Badge>
                                  <Badge className={cn("text-xs", statusColors[item.status])}>
                                    {item.status}
                                  </Badge>
                                  {item.alignmentScore && (
                                    <Badge variant="outline" className="text-xs">
                                      Alignment: {item.alignmentScore}%
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => handleValidateContent(item)}>
                                <Shield className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {item.content}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>Platforms: {item.platform.join(', ')}</span>
                            <Separator orientation="vertical" className="h-3" />
                            <span>Tags: {item.tags.join(', ')}</span>
                          </div>
                          {item.feedback && (
                            <div className="mt-3 p-3 bg-accent rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="h-4 w-4 text-accent-foreground" />
                                <span className="text-sm font-medium text-accent-foreground">AI Feedback</span>
                              </div>
                              <ul className="text-xs text-accent-foreground space-y-1">
                                {item.feedback.map((fb, index) => (
                                  <li key={index}>• {fb}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="shadow-card border-card-border">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowValidator(!showValidator)}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Alignment Validator
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Creative Strategist
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setShowSwipeFile(!showSwipeFile)}
                >
                  <Library className="h-4 w-4 mr-2" />
                  Swipe File Library
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export to Sheets
                </Button>
              </CardContent>
            </Card>

            {/* Swipe File Library */}
            {showSwipeFile && (
              <Card className="shadow-card border-card-border animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Library className="h-5 w-5 text-primary" />
                    Template Library
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockSwipeFileTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="p-3 border border-card-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{template.title}</p>
                          <p className="text-xs text-muted-foreground">{template.category}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {template.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Validator Results */}
            {showValidator && selectedContent && (
              <Card className="shadow-card border-card-border animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Validation Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedContent.alignmentScore ? (
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-calendar-content">
                          {selectedContent.alignmentScore}%
                        </div>
                        <p className="text-sm text-muted-foreground">Brand Alignment Score</p>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Feedback:</h4>
                        <ul className="text-xs space-y-1">
                          {selectedContent.feedback?.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 text-calendar-content mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Clock className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                      <p className="text-sm text-muted-foreground">Validating content...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyContentView;