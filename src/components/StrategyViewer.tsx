import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabaseClient';
import { getUserStrategy } from '@/lib/userDataService';
import { toast } from 'sonner';
import { 
  Target, 
  Users, 
  MessageSquare, 
  Palette, 
  Layers3, 
  Megaphone, 
  TrendingUp,
  Edit,
  Save,
  X
} from 'lucide-react';

const StrategyViewer = () => {
  const [strategyData, setStrategyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    fetchStrategyData();
  }, []);

  const fetchStrategyData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const userData = await getUserStrategy(session.user.id);
      
      if (userData?.strategy_data) {
        setStrategyData(userData.strategy_data);
        // Also update localStorage for immediate access
        localStorage.setItem('contentStrategy', JSON.stringify(userData.strategy_data));
      }
    } catch (error) {
      console.error('Error fetching strategy data:', error);
      toast.error('Failed to load strategy data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: string, data: any) => {
    setEditingSection(section);
    // Initialize editData with the current data if it doesn't exist
    setEditData(data || {});
  };

  const handleSave = async (section: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Update the specific section in strategy data
      const updatedStrategy = { ...strategyData };
      
      switch (section) {
        case 'brand':
          updatedStrategy.brand = editData;
          break;
        case 'contentPillars':
          updatedStrategy.contentPillars = editData;
          break;
        case 'platformStrategy':
          updatedStrategy.platformStrategy = editData;
          break;
        case 'competitorAnalysis':
          updatedStrategy.competitorAnalysis = editData;
          break;
      }

      // Save to database
      const { error } = await supabase
        .from('users')
        .update({ strategy_data: updatedStrategy })
        .eq('id', session.user.id);

      if (error) throw error;

      // Update state and localStorage
      setStrategyData(updatedStrategy);
      localStorage.setItem('contentStrategy', JSON.stringify(updatedStrategy));
      
      // Reset editing state
      setEditingSection(null);
      setEditData({});
      
      toast.success('Strategy updated successfully');
    } catch (error) {
      console.error('Error saving strategy data:', error);
      toast.error('Failed to save strategy data');
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    setEditData({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!strategyData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Strategy Data Found</CardTitle>
          <CardDescription>
            You haven't completed your strategy setup yet. Please complete the onboarding process.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.hash = '#/onboarding'}>
            Go to Onboarding
          </Button>
        </CardContent>
      </Card>
    );
  }

  const renderBrandSection = () => {
    const brand = strategyData.brand || {};
    
    if (editingSection === 'brand') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Brand Blueprint
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={editData.companyName || ''}
                onChange={(e) => setEditData({ ...editData, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input
                value={editData.industry || ''}
                onChange={(e) => setEditData({ ...editData, industry: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Target Audience</Label>
              <Textarea
                value={editData.targetAudience || ''}
                onChange={(e) => setEditData({ ...editData, targetAudience: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Brand Values</Label>
              <div className="flex flex-wrap gap-2">
                {editData.brandValues?.map((value: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {value}
                    <button
                      className="ml-1 hover:text-destructive"
                      onClick={() => {
                        const newValues = [...editData.brandValues];
                        newValues.splice(index, 1);
                        setEditData({ ...editData, brandValues: newValues });
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a brand value"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = e.currentTarget.value.trim();
                      if (value && !editData.brandValues.includes(value)) {
                        setEditData({
                          ...editData,
                          brandValues: [...(editData.brandValues || []), value]
                        });
                        e.currentTarget.value = '';
                      }
                    }
                  }}
                />
                <Button
                  variant="outline"
                  onClick={(e) => {
                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                    const value = input.value.trim();
                    if (value && !editData.brandValues.includes(value)) {
                      setEditData({
                        ...editData,
                        brandValues: [...(editData.brandValues || []), value]
                      });
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tone of Voice</Label>
              <Textarea
                value={editData.toneOfVoice || ''}
                onChange={(e) => setEditData({ ...editData, toneOfVoice: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={() => handleSave('brand')}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Brand Blueprint
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit('brand', brand)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Company Name</Label>
              <p className="text-sm text-muted-foreground">{brand.companyName || 'Not specified'}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Industry</Label>
              <p className="text-sm text-muted-foreground">{brand.industry || 'Not specified'}</p>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Target Audience</Label>
            <p className="text-sm text-muted-foreground">{brand.targetAudience || 'Not specified'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium">Brand Values</Label>
            <div className="flex flex-wrap gap-2 mt-1">
              {brand.brandValues?.length > 0 ? (
                brand.brandValues.map((value: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {value}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No values specified</p>
              )}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Tone of Voice</Label>
            <p className="text-sm text-muted-foreground">{brand.toneOfVoice || 'Not specified'}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderContentPillarsSection = () => {
    const pillars = strategyData.contentPillars || {};
    
    if (editingSection === 'contentPillars') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers3 className="h-5 w-5" />
              Content Pillars
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {editData.pillars?.map((pillar: any, index: number) => (
                <div key={index} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Pillar {index + 1}</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newPillars = [...editData.pillars];
                        newPillars.splice(index, 1);
                        setEditData({ ...editData, pillars: newPillars });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Pillar name"
                    value={pillar.name || ''}
                    onChange={(e) => {
                      const newPillars = [...editData.pillars];
                      newPillars[index].name = e.target.value;
                      setEditData({ ...editData, pillars: newPillars });
                    }}
                  />
                  <Textarea
                    placeholder="Description"
                    value={pillar.description || ''}
                    onChange={(e) => {
                      const newPillars = [...editData.pillars];
                      newPillars[index].description = e.target.value;
                      setEditData({ ...editData, pillars: newPillars });
                    }}
                    rows={2}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  setEditData({
                    ...editData,
                    pillars: [...(editData.pillars || []), { name: '', description: '' }]
                  });
                }}
              >
                Add Pillar
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={() => handleSave('contentPillars')}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Layers3 className="h-5 w-5" />
              Content Pillars
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit('contentPillars', pillars)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {pillars.pillars?.length > 0 ? (
            pillars.pillars.map((pillar: any, index: number) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium">{pillar.name}</h4>
                <p className="text-sm text-muted-foreground">{pillar.description}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No content pillars defined</p>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderPlatformStrategySection = () => {
    const platform = strategyData.platformStrategy || {};
    
    if (editingSection === 'platformStrategy') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Platform Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {editData.platforms?.map((platform: any, index: number) => (
                <div key={index} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>{platform.platform}</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Enabled</span>
                      <input
                        type="checkbox"
                        checked={platform.enabled}
                        onChange={(e) => {
                          const newPlatforms = [...editData.platforms];
                          newPlatforms[index].enabled = e.target.checked;
                          setEditData({ ...editData, platforms: newPlatforms });
                        }}
                      />
                    </div>
                  </div>
                  {platform.enabled && (
                    <>
                      <Input
                        placeholder="Posting Frequency"
                        value={platform.postingFrequency || ''}
                        onChange={(e) => {
                          const newPlatforms = [...editData.platforms];
                          newPlatforms[index].postingFrequency = e.target.value;
                          setEditData({ ...editData, platforms: newPlatforms });
                        }}
                      />
                      <Textarea
                        placeholder="Best Times"
                        value={platform.bestTimes?.join(', ') || ''}
                        onChange={(e) => {
                          const newPlatforms = [...editData.platforms];
                          newPlatforms[index].bestTimes = e.target.value.split(',').map(t => t.trim());
                          setEditData({ ...editData, platforms: newPlatforms });
                        }}
                        rows={2}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={() => handleSave('platformStrategy')}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Platform Strategy
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit('platformStrategy', platform)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {platform.platforms?.length > 0 ? (
            platform.platforms.map((platform: any, index: number) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{platform.platform}</h4>
                  <Badge variant={platform.enabled ? "default" : "secondary"}>
                    {platform.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                {platform.enabled && (
                  <>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Frequency:</span> {platform.postingFrequency}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Best Times:</span> {platform.bestTimes?.join(', ') || 'Not specified'}
                    </p>
                  </>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No platform strategy defined</p>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderCompetitorAnalysisSection = () => {
    const competitor = strategyData.competitorAnalysis || {};
    
    if (editingSection === 'competitorAnalysis') {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Competitor Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              {editData.competitors?.map((comp: any, index: number) => (
                <div key={index} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Input
                      placeholder="Competitor Name"
                      value={comp.name || ''}
                      onChange={(e) => {
                        const newCompetitors = [...editData.competitors];
                        newCompetitors[index].name = e.target.value;
                        setEditData({ ...editData, competitors: newCompetitors });
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newCompetitors = [...editData.competitors];
                        newCompetitors.splice(index, 1);
                        setEditData({ ...editData, competitors: newCompetitors });
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Strengths"
                    value={comp.strengths?.join(', ') || ''}
                    onChange={(e) => {
                      const newCompetitors = [...editData.competitors];
                      newCompetitors[index].strengths = e.target.value.split(',').map(s => s.trim());
                      setEditData({ ...editData, competitors: newCompetitors });
                    }}
                    rows={2}
                  />
                  <Textarea
                    placeholder="Weaknesses"
                    value={comp.weaknesses?.join(', ') || ''}
                    onChange={(e) => {
                      const newCompetitors = [...editData.competitors];
                      newCompetitors[index].weaknesses = e.target.value.split(',').map(w => w.trim());
                      setEditData({ ...editData, competitors: newCompetitors });
                    }}
                    rows={2}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  setEditData({
                    ...editData,
                    competitors: [...(editData.competitors || []), { name: '', strengths: [], weaknesses: [] }]
                  });
                }}
              >
                Add Competitor
              </Button>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={() => handleSave('competitorAnalysis')}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Competitor Analysis
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit('competitorAnalysis', competitor)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {competitor.competitors?.length > 0 ? (
            competitor.competitors.map((comp: any, index: number) => (
              <div key={index} className="space-y-2">
                <h4 className="font-medium">{comp.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <Label className="text-sm">Strengths</Label>
                    <p className="text-sm text-muted-foreground">{comp.strengths?.join(', ') || 'Not specified'}</p>
                  </div>
                  <div>
                    <Label className="text-sm">Weaknesses</Label>
                    <p className="text-sm text-muted-foreground">{comp.weaknesses?.join(', ') || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No competitor analysis defined</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Your Content Strategy</h2>
          <p className="text-muted-foreground">
            View and edit your saved content strategy
          </p>
        </div>
        <Button onClick={fetchStrategyData} variant="outline" size="sm">
          Refresh Data
        </Button>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 gap-6">
        {renderBrandSection()}
        {renderContentPillarsSection()}
        {renderPlatformStrategySection()}
        {renderCompetitorAnalysisSection()}
      </div>
    </div>
  );
};

export default StrategyViewer;