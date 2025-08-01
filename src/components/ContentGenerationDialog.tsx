import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Calendar, Video, Image, FileText, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentGenerationDialogProps {
  trigger: React.ReactNode;
}

const ContentGenerationDialog = ({ trigger }: ContentGenerationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [timeframe, setTimeframe] = useState<string>('');
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const { toast } = useToast();

  const contentTypes = [
    { id: 'post', label: 'Social Media Posts', icon: MessageSquare },
    { id: 'story', label: 'Stories', icon: Image },
    { id: 'video', label: 'Videos', icon: Video },
    { id: 'article', label: 'Articles/Blogs', icon: FileText },
  ];

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleGenerate = async () => {
    if (!timeframe || !campaignTitle || selectedChannels.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select at least one content type.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate content generation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "Content Generated Successfully!",
        description: `Created ${timeframe} worth of content for your "${campaignTitle}" campaign.`,
      });
      
      setIsOpen(false);
      // Reset form
      setTimeframe('');
      setCampaignTitle('');
      setCampaignDescription('');
      setSelectedChannels([]);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Content Campaign
          </DialogTitle>
          <DialogDescription>
            Create content based on your content strategy for a specific timeframe and campaign.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Campaign Details</CardTitle>
              <CardDescription>Tell us about your content campaign</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe *</Label>
                <Select value={timeframe} onValueChange={setTimeframe}>
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

              <div className="space-y-2">
                <Label htmlFor="campaign-title">Campaign Title *</Label>
                <Input
                  id="campaign-title"
                  placeholder="e.g., Summer Product Launch, Holiday Campaign..."
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="campaign-description">Campaign Description</Label>
                <Textarea
                  id="campaign-description"
                  placeholder="Describe your campaign goals, target audience, key messages..."
                  value={campaignDescription}
                  onChange={(e) => setCampaignDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Types */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Types *</CardTitle>
              <CardDescription>Select the types of content you want to generate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {contentTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedChannels.includes(type.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleChannelToggle(type.id)}
                    >
                      <Checkbox
                        checked={selectedChannels.includes(type.id)}
                        onChange={() => handleChannelToggle(type.id)}
                      />
                      <Icon className="h-4 w-4 text-primary" />
                      <Label className="cursor-pointer">{type.label}</Label>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Content Strategy Integration */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-primary">Content Strategy Integration</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Content will be generated based on your completed brand blueprint, content pillars, 
                    platform strategy, and competitor analysis.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentGenerationDialog;