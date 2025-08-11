import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Target,
  BarChart3,
  Shield,
  Users,
  TrendingUp,
  Calendar as CalendarIcon,
  CheckCircle,
  AlertTriangle,
  Layers3,
  Megaphone,
} from 'lucide-react';
import { BusinessContextProfile } from '@/lib/businessContextProfile';

// Lightweight types for saved onboarding strategy. Stored under 'contentStrategy'.
// We intentionally keep this permissive since onboarding shapes can evolve.
type SavedStrategy = {
  brand?: {
    companyName?: string;
    industry?: string;
    targetAudience?: string;
    toneOfVoice?: string;
    brandValues?: string[];
  } | null;
  contentPillars?: {
    pillars?: Array<{ name: string; description?: string; topics?: string[]; percentage?: number }>; 
    contentMix?: Record<string, number>;
  } | null;
  platformStrategy?: {
    platforms?: Array<{
      platform: string;
      enabled: boolean;
      postingFrequency?: string;
      bestTimes?: string[];
      contentTypes?: string[];
      tone?: string;
      hashtags?: string[];
      goals?: string[];
    }>;
  } | null;
  competitorAnalysis?: any;
} | null;

const readLocalJson = <T,>(key: string): T | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

const RiskBadge = ({ likelihood, impact }: { likelihood: string; impact: string }) => {
  const color = useMemo(() => {
    const score = `${likelihood}-${impact}`.toLowerCase();
    if (score.includes('high')) return 'bg-red-100 text-red-700 border-red-200';
    if (score.includes('medium')) return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    return 'bg-green-100 text-green-700 border-green-200';
  }, [likelihood, impact]);
  return (
    <span className={`text-xs px-2 py-0.5 rounded border ${color}`}>
      {likelihood}/{impact}
    </span>
  );
};

const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded bg-gradient-primary flex items-center justify-center text-primary-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="font-semibold leading-tight">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const EmptyState = () => {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base">Marketing Roadmap</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p className="mb-1">No roadmap data found yet.</p>
        <p className="text-xs">Once you create a business profile or strategy, your roadmap will appear here.</p>
      </CardContent>
    </Card>
  );
};

const MarketingRoadmap = () => {
  const [businessProfile, setBusinessProfile] = useState<BusinessContextProfile | null>(null);
  const [strategy, setStrategy] = useState<SavedStrategy>(null);

  useEffect(() => {
    setBusinessProfile(readLocalJson<BusinessContextProfile>('businessContextProfile'));
    setStrategy(readLocalJson<SavedStrategy>('contentStrategy'));
  }, []);

  // Early empty state when nothing is present
  if (!businessProfile && !strategy) {
    return <EmptyState />;
  }

  // Overview values
  const brandName = businessProfile?.product_name || strategy?.brand?.companyName || 'Your Brand';
  const industry = businessProfile?.market_analysis?.target_segment || strategy?.brand?.industry || undefined;
  const audience = businessProfile?.target_customer_personas?.[0]?.persona || strategy?.brand?.targetAudience || undefined;

  // Content pillars from business profile or onboarding
  const contentPillars = businessProfile?.content_strategy?.content_pillars
    || strategy?.contentPillars?.pillars?.map((p) => p.name).filter(Boolean)
    || [];

  // Platforms
  const primaryPlatforms = businessProfile?.content_strategy?.platform_strategy?.primary_platforms
    || strategy?.platformStrategy?.platforms?.filter(p => p.enabled).map(p => p.platform)
    || [];

  const timelineEntries = businessProfile?.implementation_timeline
    ? Object.entries(businessProfile.implementation_timeline)
    : [];

  const keyMetrics = businessProfile?.key_business_metrics || null;
  const gtm = businessProfile?.go_to_market_strategy || [];
  const successKpis = businessProfile?.success_metrics_kpis || [];
  const risks = businessProfile?.risk_assessment_and_mitigation || [];
  const resources = businessProfile?.resource_requirements || [];
  const strengths = businessProfile?.key_strengths || [];
  const challenges = businessProfile?.key_challenges || [];
  const brandVoice = businessProfile?.content_strategy?.brand_voice;
  const platformContentMix = businessProfile?.content_strategy?.platform_strategy?.content_mix || null;
  const globalContentMix = strategy?.contentPillars?.contentMix || null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Marketing Roadmap</h2>
          <p className="text-sm text-muted-foreground">Strategic overview from your business context and content strategy</p>
        </div>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarIcon className="h-4 w-4" /> Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-muted-foreground">Brand</p>
            <p className="font-medium">{brandName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Industry</p>
            <p className="font-medium">{industry || '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Primary Audience</p>
            <p className="font-medium">{audience || '—'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Grid sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Strategy */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Layers3 className="h-4 w-4" /> Strategy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Brand Voice */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <SectionHeader icon={Target} title="Tone" />
                <p className="text-sm mt-1">{brandVoice?.tone || strategy?.brand?.toneOfVoice || '—'}</p>
              </div>
              <div>
                <SectionHeader icon={Users} title="Personality" />
                <div className="mt-2 flex flex-wrap gap-2">
                  {(brandVoice?.personality || []).map((p, i) => (
                    <Badge key={i} variant="secondary">{p}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <SectionHeader icon={Megaphone} title="Primary Platforms" />
                <div className="mt-2 flex flex-wrap gap-2">
                  {primaryPlatforms.length > 0 ? primaryPlatforms.map((p, i) => (
                    <Badge key={i} variant="outline">{p}</Badge>
                  )) : <span className="text-sm text-muted-foreground">—</span>}
                </div>
              </div>
            </div>

            <Separator />

            {/* Content Pillars */}
            <div>
              <SectionHeader icon={Layers3} title="Content Pillars" />
              <div className="mt-2 flex flex-wrap gap-2">
                {contentPillars.length > 0 ? contentPillars.map((p, i) => (
                  <Badge key={i} variant="secondary">{p}</Badge>
                )) : <span className="text-sm text-muted-foreground">—</span>}
              </div>
            </div>

            <Separator />

            {/* Marketing Mix */}
            <div>
              <SectionHeader icon={BarChart3} title="Marketing Mix" subtitle="Content distribution" />
              {globalContentMix ? (
                <div className="mt-3 space-y-3">
                  {Object.entries(globalContentMix).map(([label, value]) => (
                    <div key={label}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="capitalize text-muted-foreground">{label}</span>
                        <span className="font-medium">{Number(value)}%</span>
                      </div>
                      <Progress value={Number(value)} />
                    </div>
                  ))}
                </div>
              ) : platformContentMix ? (
                <div className="mt-2 space-y-3">
                  {Object.entries(platformContentMix).map(([platform, types]) => (
                    <div key={platform}>
                      <div className="text-xs text-muted-foreground mb-1">{platform}</div>
                      <div className="flex flex-wrap gap-2">
                        {(types as string[]).map((t, i) => (
                          <Badge key={i} variant="outline">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            {keyMetrics ? (
              <div className="space-y-2 text-sm">
                {Object.entries(keyMetrics).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{k.replace(/_/g, ' ')}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">KPIs will appear once your business profile is generated.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Implementation Roadmap */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Implementation Roadmap</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {timelineEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {timelineEntries.map(([phase, info]) => (
                  <div key={phase} className="p-3 rounded border bg-card">
                    <div className="text-xs text-muted-foreground mb-1 uppercase">{phase.replace(/_/g, ' ')}</div>
                    <div className="text-sm font-medium">{(info as any)?.timeline || '—'}</div>
                    <div className="text-xs text-muted-foreground">Focus: {(info as any)?.focus || '—'}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No timeline available yet.</p>
            )}
          </CardContent>
        </Card>

        {/* GTM & Success */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="h-4 w-4" /> GTM & Success</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Go-to-Market</p>
              <div className="flex flex-wrap gap-2">
                {gtm.length > 0 ? gtm.map((g, i) => (
                  <Badge key={i} variant="outline">{g}</Badge>
                )) : <span className="text-sm text-muted-foreground">—</span>}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Success Metrics</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {successKpis.length > 0 ? successKpis.map((m, i) => (
                  <li key={i}>{m}</li>
                )) : <span className="text-sm text-muted-foreground">—</span>}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Risks & Mitigation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {risks.length > 0 ? risks.map((r, i) => (
              <div key={i} className="p-3 rounded border bg-card">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm flex items-center gap-2">
                    {r.impact === 'high' ? (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    {r.risk}
                  </div>
                  <RiskBadge likelihood={r.likelihood} impact={r.impact} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Mitigation: {r.mitigation}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground">No risks documented yet.</p>}
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {resources.length > 0 ? resources.map((res, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{res.role}</div>
                  <div className="text-xs text-muted-foreground">{res.count} • {res.priority}</div>
                </div>
                <div className="text-xs text-muted-foreground">{res.salary}</div>
              </div>
            )) : <p className="text-sm text-muted-foreground">No resource plan documented yet.</p>}
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Challenges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            {strengths.length > 0 ? (
              <ul className="list-disc list-inside text-sm space-y-1">
                {strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            ) : <p className="text-sm text-muted-foreground">—</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            {challenges.length > 0 ? (
              <ul className="list-disc list-inside text-sm space-y-1">
                {challenges.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            ) : <p className="text-sm text-muted-foreground">—</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketingRoadmap;
