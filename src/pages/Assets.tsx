import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Heart, Star, Eye, Image as ImageIcon, Trash2, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_TEMPLATES = [
  {
    id: 1,
    title: 'Product Launch Announcement',
    category: 'Product Marketing',
    content: "🚀 Exciting news! We're thrilled to announce [Product Name] - the game-changer you've been waiting for!",
    engagement: 'High',
    tags: ['product', 'launch', 'announcement']
  },
  {
    id: 2,
    title: 'Behind the Scenes',
    category: 'Storytelling',
    content: "Take a peek behind the curtain! Here's what goes into making [Your Product/Service] amazing...",
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

// Local storage helpers for image assets
const LS_KEY = 'generatedImages';
const readImages = (): string[] => {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr.filter(Boolean) as string[]) : [];
  } catch {
    return [];
  }
};
const writeImages = (images: string[]) => {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(images.slice(0, 200)));
  } catch {}
};

const Assets = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [useBrand, setUseBrand] = useState(true);

  // Load saved content strategy from onboarding to guide on-brand image generation
  const contentStrategy: any = useMemo(() => {
    try {
      const raw = localStorage.getItem('contentStrategy');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const brandSummary = useMemo(() => {
    const brand = contentStrategy?.brand || {};
    const pillars = Array.isArray(contentStrategy?.contentPillars?.pillars)
      ? contentStrategy.contentPillars.pillars.map((p: any) => p?.name).filter(Boolean)
      : [];
    return {
      company: brand?.companyName || '',
      tone: brand?.toneOfVoice || '',
      colors: Array.isArray(brand?.primaryColors) ? brand.primaryColors.join(', ') : '',
      pillars,
    };
  }, [contentStrategy]);

  // Live preview prompt and URL
  const previewPrompt = useMemo(() => {
    const base = imagePrompt.trim();
    if (!base) return '';
    return useBrand ? buildBrandPrompt(base) : base;
  }, [imagePrompt, useBrand, contentStrategy]);

  const previewUrl = useMemo(() => {
    if (!previewPrompt) return '';
    // Simple stable signature from prompt to avoid constant image changes while typing
    const sig = Math.abs(Array.from(previewPrompt).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 10000);
    return `https://source.unsplash.com/800x600/?${encodeURIComponent(previewPrompt)}&sig=${sig}`;
  }, [previewPrompt]);

  useEffect(() => {
    setImages(readImages());
  }, []);

  const handleAddImage = () => {
    const url = newImageUrl.trim();
    if (!url) return;
    const next = [url, ...images];
    setImages(next);
    writeImages(next);
    setNewImageUrl('');
  };

  const buildBrandPrompt = (plain: string) => {
    try {
      const brand = contentStrategy?.brand || {};
      const pillars = Array.isArray(contentStrategy?.contentPillars?.pillars)
        ? contentStrategy.contentPillars.pillars.map((p: any) => p?.name).filter(Boolean)
        : [];
      const values = Array.isArray(brand?.brandValues) ? brand.brandValues.join(', ') : '';
      const colors = Array.isArray(brand?.primaryColors) ? brand.primaryColors.join(', ') : '';
      const tone = brand?.toneOfVoice;
      const personality = brand?.brandPersonality;
      const banned = Array.isArray(brand?.bannedWords) ? brand.bannedWords.join(', ') : '';
      const company = brand?.companyName || 'our brand';
      const desc = [
        `brand: ${company}`,
        tone ? `tone: ${tone}` : null,
        personality ? `personality: ${personality}` : null,
        values ? `values: ${values}` : null,
        colors ? `colors: ${colors}` : null,
        pillars.length ? `themes: ${pillars.slice(0, 5).join(', ')}` : null,
        banned ? `avoid: ${banned}` : null,
        'style: clean, modern, minimal, high-contrast, consistent spacing and typography, marketing graphic',
      ]
        .filter(Boolean)
        .join('; ');
      return `${plain}. ${desc}`;
    } catch {
      return plain;
    }
  };

  const handleGenerateOnBrand = () => {
    const base = imagePrompt.trim();
    if (!base) return;
    const finalPrompt = useBrand ? buildBrandPrompt(base) : base;
    const url = `https://source.unsplash.com/800x600/?${encodeURIComponent(finalPrompt)}&sig=${Date.now()}`;
    const next = [url, ...images];
    setImages(next);
    writeImages(next);
    setAddOpen(false);
    setImagePrompt('');
    toast.success('On-brand image added to library');
  };

  const handleRemove = (idx: number) => {
    const next = images.filter((_, i) => i !== idx);
    setImages(next);
    writeImages(next);
  };

  const hasImages = images.length > 0;
  const templates = useMemo(() => DEFAULT_TEMPLATES, []);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Assets
          </h1>
          <p className="text-muted-foreground">
            Manage your Swipe Files and image assets in one place.
          </p>
        </div>

        <Tabs defaultValue="swipe">
          <TabsList className="mb-6">
            <TabsTrigger value="swipe">Swipe Files</TabsTrigger>
            <TabsTrigger value="images">Image Library</TabsTrigger>
          </TabsList>

          {/* Swipe Files Tab */}
          <TabsContent value="swipe">
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
                        onClick={() => navigate(`/assets/swipe/${template.id}`)}
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
          </TabsContent>

          {/* Image Library Tab */}
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5" /> Image Library</CardTitle>
                <CardDescription>
                  Save and preview your generated visual assets. Add by URL for now; later we can wire this to generation and Supabase Storage.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-end mb-4">
                  <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                      <Button className="shrink-0"><Plus className="h-4 w-4 mr-1" /> Add</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl sm:max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Add Image to Library</DialogTitle>
                        <DialogDescription>
                          Generate an image using your brand strategy or add by URL.
                        </DialogDescription>
                      </DialogHeader>
                      <Tabs defaultValue="generate">
                        <TabsList className="mb-4">
                          <TabsTrigger value="generate">Generate on-brand</TabsTrigger>
                          <TabsTrigger value="url">By URL</TabsTrigger>
                        </TabsList>
                        <TabsContent value="generate">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left: Prompt controls */}
                            <div className="space-y-3">
                              <Label htmlFor="imagePrompt">Image prompt</Label>
                              <Textarea
                                id="imagePrompt"
                                placeholder="E.g., happy customers using our product, lifestyle scene, hero banner"
                                value={imagePrompt}
                                onChange={(e) => setImagePrompt(e.target.value)}
                              />
                              <div className="flex items-center justify-between">
                                <div className="text-sm">
                                  <div className="font-medium">Use brand strategy</div>
                                  <div className="text-muted-foreground">
                                    Tone: {brandSummary.tone || '—'}{brandSummary.colors ? ` • Colors: ${brandSummary.colors}` : ''}
                                  </div>
                                </div>
                                <Switch checked={useBrand} onCheckedChange={setUseBrand} />
                              </div>
                              <div className="flex justify-end">
                                <Button onClick={handleGenerateOnBrand} disabled={!imagePrompt.trim()}>
                                  Generate & Save
                                </Button>
                              </div>
                            </div>
                            {/* Right: Live preview */}
                            <div>
                              <div className="text-sm font-medium mb-2">Live Preview</div>
                              <div className="relative overflow-hidden rounded-md border bg-card h-64 flex items-center justify-center">
                                {previewUrl ? (
                                  <img src={previewUrl} alt="preview" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="text-center text-muted-foreground px-6">
                                    Start typing a prompt to preview an on-brand image.
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground mt-2 line-clamp-3">
                                {previewPrompt || '—'}
                              </div>
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="url">
                          <div className="space-y-3">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                              id="imageUrl"
                              placeholder="https://..."
                              value={newImageUrl}
                              onChange={(e) => setNewImageUrl(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                              <Button onClick={() => { handleAddImage(); setAddOpen(false); }}>Save</Button>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                      <DialogFooter />
                    </DialogContent>
                  </Dialog>
                </div>

                {hasImages ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {images.map((src, idx) => (
                      <div key={`${src}-${idx}`} className="group relative overflow-hidden rounded-lg border bg-card">
                        <img src={src} alt="asset" className="h-40 w-full object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors" />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="secondary" onClick={() => handleRemove(idx)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                      <ImageIcon className="h-8 w-8" />
                    </div>
                    <p className="max-w-sm">No images yet. Add an image URL above to start your asset library. We\'ll also hook this up to your generated content.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Assets;
