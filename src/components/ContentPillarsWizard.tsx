import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Lightbulb } from 'lucide-react';

interface ContentPillar {
  name: string;
  description: string;
  topics: string[];
  percentage: number;
}

interface ContentPillarsData {
  pillars: ContentPillar[];
  contentMix: {
    educational: number;
    promotional: number;
    entertaining: number;
    inspirational: number;
  };
}

interface ContentPillarsWizardProps {
  onComplete: (data: ContentPillarsData) => void;
  onBack: () => void;
}

const ContentPillarsWizard = ({ onComplete, onBack }: ContentPillarsWizardProps) => {
  const [pillars, setPillars] = useState<ContentPillar[]>([
    { name: '', description: '', topics: [], percentage: 25 }
  ]);
  const [contentMix, setContentMix] = useState({
    educational: 40,
    promotional: 20,
    entertaining: 25,
    inspirational: 15
  });
  const [currentTopic, setCurrentTopic] = useState('');
  const [selectedPillar, setSelectedPillar] = useState(0);

  const addPillar = () => {
    if (pillars.length < 6) {
      const newPercentage = Math.floor(100 / (pillars.length + 1));
      setPillars([...pillars, { name: '', description: '', topics: [], percentage: newPercentage }]);
    }
  };

  const removePillar = (index: number) => {
    if (pillars.length > 1) {
      setPillars(pillars.filter((_, i) => i !== index));
    }
  };

  const updatePillar = (index: number, field: keyof ContentPillar, value: any) => {
    const updated = pillars.map((pillar, i) => 
      i === index ? { ...pillar, [field]: value } : pillar
    );
    setPillars(updated);
  };

  const addTopic = () => {
    if (currentTopic.trim()) {
      const updated = [...pillars];
      updated[selectedPillar].topics.push(currentTopic.trim());
      setPillars(updated);
      setCurrentTopic('');
    }
  };

  const removeTopic = (pillarIndex: number, topicIndex: number) => {
    const updated = [...pillars];
    updated[pillarIndex].topics = updated[pillarIndex].topics.filter((_, i) => i !== topicIndex);
    setPillars(updated);
  };

  const handleSubmit = () => {
    const validPillars = pillars.filter(p => p.name.trim());
    if (validPillars.length > 0) {
      onComplete({ pillars: validPillars, contentMix });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Content Pillars Setup
        </h1>
        <p className="text-muted-foreground">
          Define your core content themes and topics to maintain consistency
        </p>
      </div>

      <div className="grid gap-6">
        {/* Content Pillars */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Content Pillars
            </CardTitle>
            <CardDescription>
              Create 3-5 core themes that will guide your content creation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pillars.map((pillar, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Pillar {index + 1}</Label>
                  {pillars.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePillar(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`pillar-name-${index}`}>Name</Label>
                    <Input
                      id={`pillar-name-${index}`}
                      placeholder="e.g., Industry Insights"
                      value={pillar.name}
                      onChange={(e) => updatePillar(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`pillar-percentage-${index}`}>Content % (approx)</Label>
                    <Input
                      id={`pillar-percentage-${index}`}
                      type="number"
                      min="0"
                      max="100"
                      value={pillar.percentage}
                      onChange={(e) => updatePillar(index, 'percentage', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`pillar-description-${index}`}>Description</Label>
                  <Textarea
                    id={`pillar-description-${index}`}
                    placeholder="Describe what this pillar covers..."
                    value={pillar.description}
                    onChange={(e) => updatePillar(index, 'description', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Topics & Keywords</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add a topic or keyword"
                      value={selectedPillar === index ? currentTopic : ''}
                      onChange={(e) => {
                        setSelectedPillar(index);
                        setCurrentTopic(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          setSelectedPillar(index);
                          addTopic();
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        setSelectedPillar(index);
                        addTopic();
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {pillar.topics.map((topic, topicIndex) => (
                      <Badge
                        key={topicIndex}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => removeTopic(index, topicIndex)}
                      >
                        {topic} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {pillars.length < 6 && (
              <Button variant="outline" onClick={addPillar} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Another Pillar
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Content Mix */}
        <Card>
          <CardHeader>
            <CardTitle>Content Mix Strategy</CardTitle>
            <CardDescription>
              Define the balance of different content types
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(contentMix).map(([type, percentage]) => (
              <div key={type} className="space-y-2">
                <Label className="capitalize">{type}</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={(e) => setContentMix({
                    ...contentMix,
                    [type]: parseInt(e.target.value) || 0
                  })}
                />
                <span className="text-xs text-muted-foreground">{percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit}>
          Next: Platform Strategy
        </Button>
      </div>
    </div>
  );
};

export default ContentPillarsWizard;