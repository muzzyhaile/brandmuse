import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  Edit2, 
  RefreshCw, 
  Calendar, 
  Target, 
  Users, 
  MessageCircle,
  Sparkles,
  FileText,
  Video,
  MessageSquare,
  Image
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface ContentItem {
  id: string;
  date: Date;
  title: string;
  type: 'post' | 'story' | 'video' | 'article';
  status: 'draft' | 'ready' | 'published';
  content: string;
  campaign: string;
  briefData: any;
}

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentItems: ContentItem[];
  campaignBrief: any;
  onApprove: (items: ContentItem[]) => void;
  onRegenerate: () => void;
}

const ContentPreviewModal = ({ 
  isOpen, 
  onClose, 
  contentItems, 
  campaignBrief, 
  onApprove, 
  onRegenerate 
}: ContentPreviewModalProps) => {
  const [editingItems, setEditingItems] = useState<ContentItem[]>(contentItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const contentTypeIcons = {
    post: MessageSquare,
    story: Image,
    video: Video,
    article: FileText
  };

  const contentTypeColors = {
    post: 'bg-blue-100 text-blue-800',
    story: 'bg-purple-100 text-purple-800',
    video: 'bg-red-100 text-red-800',
    article: 'bg-green-100 text-green-800'
  };

  const handleEditItem = (id: string, field: string, value: string) => {
    setEditingItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleApprove = () => {
    onApprove(editingItems);
    toast({
      title: "Content Added to Calendar",
      description: `Successfully added ${editingItems.length} content pieces to your calendar.`,
    });
    onClose();
  };

  const mockStrategy = {
    brandPersonality: "Professional, innovative, customer-focused",
    contentPillars: ["Product Education", "Industry Insights", "Customer Success", "Behind the Scenes"],
    platforms: ["LinkedIn", "Instagram", "YouTube"],
    audience: "B2B professionals and decision makers"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Content Preview & Strategy Alignment
          </DialogTitle>
          <DialogDescription>
            Review your generated content and see how it aligns with your content strategy
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="strategy" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strategy">Strategy Overview</TabsTrigger>
            <TabsTrigger value="campaign">Campaign Brief</TabsTrigger>
            <TabsTrigger value="content">Generated Content ({editingItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="strategy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Your Content Strategy Foundation
                </CardTitle>
                <CardDescription>
                  The strategy framework guiding this campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Brand Personality</Label>
                    <p className="text-sm text-muted-foreground">{mockStrategy.brandPersonality}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Target Audience</Label>
                    <p className="text-sm text-muted-foreground">{mockStrategy.audience}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Content Pillars</Label>
                  <div className="flex flex-wrap gap-2">
                    {mockStrategy.contentPillars.map((pillar, index) => (
                      <Badge key={index} variant="secondary">{pillar}</Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Primary Platforms</Label>
                  <div className="flex flex-wrap gap-2">
                    {mockStrategy.platforms.map((platform, index) => (
                      <Badge key={index} variant="outline">{platform}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaign" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Campaign Brief Summary
                </CardTitle>
                <CardDescription>
                  The specific campaign parameters for this content generation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Campaign Name</Label>
                    <p className="text-sm text-muted-foreground">{campaignBrief.campaignName}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Timeframe</Label>
                    <p className="text-sm text-muted-foreground">{campaignBrief.timeframe}</p>
                  </div>
                </div>
                
                {campaignBrief.objectives && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Objectives</Label>
                    <p className="text-sm text-muted-foreground">{campaignBrief.objectives}</p>
                  </div>
                )}
                
                {campaignBrief.targetAudience && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Target Audience</Label>
                    <p className="text-sm text-muted-foreground">{campaignBrief.targetAudience}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Content Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {campaignBrief.contentTypes.map((type: string, index: number) => {
                      const Icon = contentTypeIcons[type as keyof typeof contentTypeIcons];
                      return (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <Icon className="h-3 w-3" />
                          {type}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Content Pieces</h3>
              <Button variant="outline" onClick={onRegenerate}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Regenerate All
              </Button>
            </div>
            
            <div className="space-y-4">
              {editingItems.map((item, index) => {
                const Icon = contentTypeIcons[item.type];
                const isEditing = editingId === item.id;
                
                return (
                  <Card key={item.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={contentTypeColors[item.type]}>
                            <Icon className="h-3 w-3 mr-1" />
                            {item.type}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(item.date, 'MMM dd, yyyy')}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingId(isEditing ? null : item.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                              value={item.title}
                              onChange={(e) => handleEditItem(item.id, 'title', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea
                              value={item.content}
                              onChange={(e) => handleEditItem(item.id, 'content', e.target.value)}
                              rows={3}
                            />
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => setEditingId(null)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.content}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <DialogFooter className="flex justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            Content aligned with your strategy and campaign goals
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outline" onClick={onRegenerate}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Add to Calendar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentPreviewModal;