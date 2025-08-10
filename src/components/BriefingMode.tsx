import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Trash2, 
  Calendar, 
  Target, 
  BarChart3, 
  Users, 
  Lightbulb,
  FileText,
  Mail,
  Megaphone,
  Layout,
  Video,
  Image,
  BookOpen,
  Zap,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  Save,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  CAMPAIGN_TEMPLATES, 
  CampaignTemplate, 
  ComprehensiveSwipeProfile,
  ContentPiece,
  SwipeContextGenerator 
} from '@/lib/swipeContextProfile';
import { BusinessContextProfile } from '@/lib/businessContextProfile';
import { toast } from 'sonner';

interface BriefingModeProps {
  businessProfile?: BusinessContextProfile;
  onPlanGenerated: (profile: ComprehensiveSwipeProfile) => void;
  onSwitchToGenerate: () => void;
}

const CONTENT_TYPE_ICONS = {
  email: Mail,
  article: FileText,
  social_post: Megaphone,
  landing_page: Layout,
  video_script: Video,
  infographic: Image,
  case_study: BookOpen,
  whitepaper: FileText,
  onbrand_image: Image
};

const AUDIENCE_STAGE_COLORS = {
  awareness: 'from-blue-500 to-cyan-500',
  consideration: 'from-yellow-500 to-orange-500',
  decision: 'from-green-500 to-teal-500',
  retention: 'from-purple-500 to-pink-500'
};

const BriefingMode = ({ businessProfile, onPlanGenerated, onSwitchToGenerate }: BriefingModeProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const [campaignName, setCampaignName] = useState('');
  const [totalPieces, setTotalPieces] = useState(5);
  const [customObjective, setCustomObjective] = useState('');
  const [timeline, setTimeline] = useState('');
  const [contentSequence, setContentSequence] = useState<Partial<ContentPiece>[]>([]);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [currentStep, setCurrentStep] = useState<'template' | 'customize' | 'sequence' | 'review'>('template');
  
  // New template modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<CampaignTemplate>>({});
  const [templateStructure, setTemplateStructure] = useState<Partial<ContentPiece>[]>([]);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

  // Initialize content sequence when template is selected
  const handleTemplateSelect = (template: CampaignTemplate) => {
    setSelectedTemplate(template);
    setCampaignName(template.name);
    setTotalPieces(template.default_pieces);
    setTimeline(template.recommended_timeline);
    
    // Initialize sequence with template structure
    const initialSequence = Array.from({ length: template.default_pieces }, (_, index) => {
      const templatePiece = template.template_structure.find(p => p.piece_number === index + 1);
      return {
        piece_number: index + 1,
        piece_type: templatePiece?.piece_type || 'article',
        title: templatePiece?.title || `${template.name} - Part ${index + 1}`,
        purpose: templatePiece?.purpose || `Purpose for piece ${index + 1}`,
        audience_stage: templatePiece?.audience_stage || 'awareness'
      };
    });
    
    setContentSequence(initialSequence);
    setCurrentStep('customize');
  };

  // Update content sequence when total pieces changes
  const handleTotalPiecesChange = (newTotal: number) => {
    setTotalPieces(newTotal);
    
    if (newTotal > contentSequence.length) {
      // Add new pieces
      const additionalPieces = Array.from({ length: newTotal - contentSequence.length }, (_, index) => ({
        piece_number: contentSequence.length + index + 1,
        piece_type: 'article' as ContentPiece['piece_type'],
        title: `${campaignName} - Part ${contentSequence.length + index + 1}`,
        purpose: `Purpose for piece ${contentSequence.length + index + 1}`,
        audience_stage: 'awareness' as ContentPiece['audience_stage']
      }));
      setContentSequence([...contentSequence, ...additionalPieces]);
    } else if (newTotal < contentSequence.length) {
      // Remove pieces
      setContentSequence(contentSequence.slice(0, newTotal));
    }
  };

  // Update individual piece in sequence
  const updateContentPiece = (index: number, updates: Partial<ContentPiece>) => {
    const newSequence = [...contentSequence];
    newSequence[index] = { ...newSequence[index], ...updates };
    setContentSequence(newSequence);
  };

  // Reset modal state
  const resetModalState = () => {
    setNewTemplate({});
    setTemplateStructure([]);
    setIsCreatingTemplate(false);
  };

  // Handle creating new template
  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.description || !newTemplate.campaign_type || !newTemplate.default_pieces) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreatingTemplate(true);
    
    try {
      // Create the complete template object
      const completeTemplate: CampaignTemplate = {
        name: newTemplate.name,
        description: newTemplate.description,
        campaign_type: newTemplate.campaign_type,
        default_pieces: newTemplate.default_pieces,
        template_structure: templateStructure.map((piece, index) => ({
          piece_number: index + 1,
          piece_type: piece.piece_type || 'article',
          title: piece.title || `${newTemplate.name} - Part ${index + 1}`,
          purpose: piece.purpose || `Purpose for piece ${index + 1}`,
          audience_stage: piece.audience_stage || 'awareness',
          progression_role: piece.progression_role || 'Foundation building'
        })),
        recommended_timeline: newTemplate.recommended_timeline || '1 week',
        success_benchmarks: newTemplate.success_benchmarks || ['Engagement rate >20%', 'Completion rate >15%']
      };

      // Here you would typically save to a database or state management
      // For now, we'll add it to the existing templates array
      CAMPAIGN_TEMPLATES.push(completeTemplate);
      
      toast.success('Template created successfully!');
      setIsCreateModalOpen(false);
      resetModalState();
      
      // Optionally auto-select the new template
      handleTemplateSelect(completeTemplate);
      
    } catch (error) {
      toast.error('Failed to create template');
      console.error('Template creation error:', error);
    } finally {
      setIsCreatingTemplate(false);
    }
  };

  // Add piece to template structure
  const addPieceToTemplate = () => {
    const newPiece: Partial<ContentPiece> = {
      piece_number: templateStructure.length + 1,
      piece_type: 'article',
      title: '',
      purpose: '',
      audience_stage: 'awareness',
      progression_role: 'Foundation building'
    };
    setTemplateStructure([...templateStructure, newPiece]);
  };

  // Remove piece from template structure
  const removePieceFromTemplate = (index: number) => {
    const updated = templateStructure.filter((_, i) => i !== index);
    // Update piece numbers
    const renumbered = updated.map((piece, i) => ({ ...piece, piece_number: i + 1 }));
    setTemplateStructure(renumbered);
  };

  // Update template structure piece
  const updateTemplatePiece = (index: number, updates: Partial<ContentPiece>) => {
    const updated = [...templateStructure];
    updated[index] = { ...updated[index], ...updates };
    setTemplateStructure(updated);
  };

  // Generate comprehensive campaign plan
  const handleGeneratePlan = async () => {
    if (!selectedTemplate || !businessProfile) {
      toast.error('Please select a template and ensure business profile is available');
      return;
    }

    setIsGeneratingPlan(true);
    
    try {
      // Create comprehensive swipe profile
      const swipeProfile = SwipeContextGenerator.generateCampaignProfile({
        campaignType: selectedTemplate.campaign_type,
        campaignName: campaignName || selectedTemplate.name,
        totalPieces,
        businessProfile,
        customRequirements: {
          campaign_overview: {
            campaign_name: campaignName || selectedTemplate.name,
            campaign_type: selectedTemplate.campaign_type,
            total_pieces: totalPieces,
            timeline: timeline || selectedTemplate.recommended_timeline,
            sequence_strategy: `Custom ${totalPieces}-piece strategy`,
            campaign_objective: customObjective || `Achieve business goals through ${selectedTemplate.campaign_type.replace('_', ' ')}`,
            success_criteria: selectedTemplate.success_benchmarks
          }
        }
      });

      toast.success('Comprehensive campaign plan generated!');
      onPlanGenerated(swipeProfile);
      
    } catch (error) {
      toast.error('Failed to generate campaign plan. Please try again.');
      console.error('Campaign plan generation error:', error);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Choose Campaign Template</h3>
          <p className="text-sm text-muted-foreground">
            Select a proven template or start from scratch
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CAMPAIGN_TEMPLATES.map((template) => (
          <Card 
            key={template.name}
            className={cn(
              "cursor-pointer transition-all duration-200 hover:shadow-md border-2",
              selectedTemplate?.name === template.name 
                ? "border-primary bg-primary/5" 
                : "border-border hover:border-primary/50"
            )}
            onClick={() => handleTemplateSelect(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">{template.name}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {template.default_pieces} pieces
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 mr-1" />
                  {template.recommended_timeline}
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.success_benchmarks.slice(0, 2).map((benchmark, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {benchmark}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={() => setCurrentStep('customize')}
          disabled={!selectedTemplate}
          className="bg-gradient-primary hover:bg-primary/90"
        >
          Continue with Template
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderCampaignCustomization = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Customize Your Campaign</h3>
        <p className="text-muted-foreground mb-4">
          Tailor the campaign details to match your specific goals and timeline.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="e.g., Q1 Product Launch Series"
            />
          </div>
          
          <div>
            <Label htmlFor="total-pieces">Total Content Pieces</Label>
            <Select value={totalPieces.toString()} onValueChange={(value) => handleTotalPiecesChange(parseInt(value))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 15 }, (_, i) => i + 3).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} pieces
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="timeline">Campaign Timeline</Label>
            <Input
              id="timeline"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder="e.g., 6 weeks (weekly posts)"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="objective">Custom Campaign Objective</Label>
            <Textarea
              id="objective"
              value={customObjective}
              onChange={(e) => setCustomObjective(e.target.value)}
              placeholder="Describe your specific goals for this campaign..."
              rows={4}
            />
          </div>
          
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-medium text-sm">Success Benchmarks</span>
              </div>
              <div className="space-y-1">
                {selectedTemplate?.success_benchmarks.map((benchmark, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {benchmark}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('template')}>
          Back to Templates
        </Button>
        <Button 
          onClick={() => setCurrentStep('sequence')}
          className="bg-gradient-primary hover:bg-primary/90"
        >
          Configure Content Sequence
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderSequencePlanning = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Content Sequence Planning</h3>
        <p className="text-muted-foreground mb-4">
          Define the structure and progression of your content pieces.
        </p>
      </div>

      <div className="space-y-4">
        {contentSequence.map((piece, index) => {
          const IconComponent = CONTENT_TYPE_ICONS[piece.piece_type || 'article'];
          
          return (
            <Card key={index} className="border-l-4 border-l-primary/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium",
                      `bg-gradient-to-r ${AUDIENCE_STAGE_COLORS[piece.audience_stage || 'awareness']}`
                    )}>
                      {piece.piece_number}
                    </div>
                  </div>
                  
                  <div className="flex-grow space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <Label className="text-xs">Title</Label>
                        <Input
                          value={piece.title || ''}
                          onChange={(e) => updateContentPiece(index, { title: e.target.value })}
                          placeholder="Content piece title"
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs">Content Type</Label>
                        <Select 
                          value={piece.piece_type} 
                          onValueChange={(value) => updateContentPiece(index, { piece_type: value as ContentPiece['piece_type'] })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="article">Article</SelectItem>
                            <SelectItem value="social_post">Social Post</SelectItem>
                            <SelectItem value="landing_page">Landing Page</SelectItem>
                            <SelectItem value="video_script">Video Script</SelectItem>
                            <SelectItem value="infographic">Infographic</SelectItem>
                            <SelectItem value="case_study">Case Study</SelectItem>
                            <SelectItem value="whitepaper">Whitepaper</SelectItem>
                            <SelectItem value="onbrand_image">On-Brand Image</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="text-xs">Audience Stage</Label>
                        <Select 
                          value={piece.audience_stage} 
                          onValueChange={(value) => updateContentPiece(index, { audience_stage: value as ContentPiece['audience_stage'] })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="awareness">Awareness</SelectItem>
                            <SelectItem value="consideration">Consideration</SelectItem>
                            <SelectItem value="decision">Decision</SelectItem>
                            <SelectItem value="retention">Retention</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Purpose & Goal</Label>
                      <Textarea
                        value={piece.purpose || ''}
                        onChange={(e) => updateContentPiece(index, { purpose: e.target.value })}
                        placeholder="What should this piece accomplish?"
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <IconComponent className="h-3 w-3 mr-1" />
                        {piece.piece_type}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-xs",
                          piece.audience_stage === 'awareness' && "bg-blue-50 text-blue-700",
                          piece.audience_stage === 'consideration' && "bg-yellow-50 text-yellow-700",
                          piece.audience_stage === 'decision' && "bg-green-50 text-green-700",
                          piece.audience_stage === 'retention' && "bg-purple-50 text-purple-700"
                        )}
                      >
                        {piece.audience_stage}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('customize')}>
          Back to Customization
        </Button>
        <Button 
          onClick={() => setCurrentStep('review')}
          className="bg-gradient-primary hover:bg-primary/90"
        >
          Review & Generate Plan
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderPlanReview = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Review Campaign Plan</h3>
        <p className="text-muted-foreground mb-4">
          Review your campaign structure before generating the comprehensive briefing document.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Campaign Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs text-muted-foreground">Campaign Name</Label>
              <p className="font-medium">{campaignName}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Type</Label>
              <p className="font-medium capitalize">{selectedTemplate?.campaign_type.replace('_', ' ')}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Timeline</Label>
              <p className="font-medium">{timeline}</p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Total Pieces</Label>
              <p className="font-medium">{totalPieces} content pieces</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Content Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['awareness', 'consideration', 'decision', 'retention'].map((stage) => {
                const stageCount = contentSequence.filter(p => p.audience_stage === stage).length;
                const percentage = Math.round((stageCount / totalPieces) * 100);
                
                return (
                  <div key={stage} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{stage}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{stageCount} pieces</span>
                      <Badge variant="outline" className="text-xs">
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Content Sequence Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {contentSequence.map((piece, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-muted/30 rounded">
                <span className="text-sm font-medium text-muted-foreground">#{piece.piece_number}</span>
                <span className="font-medium">{piece.title}</span>
                <Badge variant="outline" className="text-xs ml-auto">
                  {piece.piece_type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('sequence')}>
          Back to Sequence
        </Button>
        <Button 
          onClick={handleGeneratePlan}
          disabled={isGeneratingPlan}
          className="bg-gradient-primary hover:bg-primary/90"
        >
          {isGeneratingPlan ? (
            <>
              Generating Plan...
              <Zap className="h-4 w-4 ml-2 animate-spin" />
            </>
          ) : (
            <>
              Generate Campaign Plan
              <Zap className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderTemplateCreationModal = () => {
    return (
      <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
        setIsCreateModalOpen(open);
        if (!open) resetModalState();
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Campaign Template</DialogTitle>
            <DialogDescription>
              Build a reusable template for your content campaigns
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Template Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Template Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Template Name *</Label>
                    <Input
                      id="template-name"
                      placeholder="e.g., Product Launch Series"
                      value={newTemplate.name || ''}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-type">Campaign Type *</Label>
                    <Select
                      value={newTemplate.campaign_type}
                      onValueChange={(value) => setNewTemplate(prev => ({ ...prev, campaign_type: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email_series">Email Series</SelectItem>
                        <SelectItem value="article_series">Article Series</SelectItem>
                        <SelectItem value="social_campaign">Social Campaign</SelectItem>
                        <SelectItem value="content_funnel">Content Funnel</SelectItem>
                        <SelectItem value="product_launch">Product Launch</SelectItem>
                        <SelectItem value="educational_sequence">Educational Sequence</SelectItem>
                        <SelectItem value="nurture_sequence">Nurture Sequence</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-description">Description *</Label>
                  <Textarea
                    id="template-description"
                    placeholder="Describe what this template is for and when to use it..."
                    value={newTemplate.description || ''}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-pieces">Default Number of Pieces *</Label>
                    <Input
                      id="default-pieces"
                      type="number"
                      min="1"
                      max="20"
                      value={newTemplate.default_pieces || ''}
                      onChange={(e) => {
                        const count = parseInt(e.target.value);
                        setNewTemplate(prev => ({ ...prev, default_pieces: count }));
                        // Auto-adjust template structure
                        if (count && count !== templateStructure.length) {
                          const newStructure = Array.from({ length: count }, (_, i) => ({
                            piece_number: i + 1,
                            piece_type: 'article' as ContentPiece['piece_type'],
                            title: '',
                            purpose: '',
                            audience_stage: 'awareness' as ContentPiece['audience_stage'],
                            progression_role: 'Foundation building'
                          }));
                          setTemplateStructure(newStructure);
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recommended-timeline">Recommended Timeline</Label>
                    <Input
                      id="recommended-timeline"
                      placeholder="e.g., 2 weeks, 5 days"
                      value={newTemplate.recommended_timeline || ''}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, recommended_timeline: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Structure */}
            {newTemplate.default_pieces && templateStructure.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">Content Structure</CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addPieceToTemplate}
                      disabled={templateStructure.length >= 20}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Piece
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {templateStructure.map((piece, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Piece {index + 1}</span>
                          {templateStructure.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePieceFromTemplate(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Content Type</Label>
                            <Select
                              value={piece.piece_type || 'article'}
                              onValueChange={(value) => updateTemplatePiece(index, { piece_type: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="article">Article</SelectItem>
                                <SelectItem value="social_post">Social Post</SelectItem>
                                <SelectItem value="landing_page">Landing Page</SelectItem>
                                <SelectItem value="video_script">Video Script</SelectItem>
                                <SelectItem value="infographic">Infographic</SelectItem>
                                <SelectItem value="case_study">Case Study</SelectItem>
                                <SelectItem value="whitepaper">Whitepaper</SelectItem>
                                <SelectItem value="onbrand_image">On-Brand Image</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Audience Stage</Label>
                            <Select
                              value={piece.audience_stage || 'awareness'}
                              onValueChange={(value) => updateTemplatePiece(index, { audience_stage: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="awareness">Awareness</SelectItem>
                                <SelectItem value="consideration">Consideration</SelectItem>
                                <SelectItem value="decision">Decision</SelectItem>
                                <SelectItem value="retention">Retention</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Title Template</Label>
                          <Input
                            placeholder="e.g., Introduction to [Topic]"
                            value={piece.title || ''}
                            onChange={(e) => updateTemplatePiece(index, { title: e.target.value })}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Purpose</Label>
                          <Textarea
                            placeholder="What is the goal of this piece?"
                            value={piece.purpose || ''}
                            onChange={(e) => updateTemplatePiece(index, { purpose: e.target.value })}
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateModalOpen(false);
                resetModalState();
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTemplate}
              disabled={isCreatingTemplate || !newTemplate.name || !newTemplate.description || !newTemplate.campaign_type || !newTemplate.default_pieces}
            >
              {isCreatingTemplate ? (
                <>
                  Creating...
                  <Zap className="h-4 w-4 ml-2 animate-spin" />
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Template
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Campaign Briefing Mode</h2>
          <p className="text-muted-foreground">
            Plan comprehensive multi-piece content campaigns with strategic sequencing
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Now
          </Button>
          <Button variant="outline" onClick={onSwitchToGenerate}>
            Switch to Generate Mode
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {currentStep === 'template' && renderTemplateSelection()}
          {currentStep === 'customize' && renderCampaignCustomization()}
          {currentStep === 'sequence' && renderSequencePlanning()}
          {currentStep === 'review' && renderPlanReview()}
        </CardContent>
      </Card>
      
      {/* Template Creation Modal */}
      {renderTemplateCreationModal()}
    </div>
  );
};

export default BriefingMode;
