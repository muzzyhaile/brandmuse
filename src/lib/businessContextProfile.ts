export interface BusinessContextProfile {
  // Core Business Information
  product_name: string;
  executive_summary: string;
  problem_statement: string;
  solution_overview: string;
  
  // Target Audience Analysis
  target_customer_personas: Array<{
    persona: string;
    age_range: string;
    income_range: string;
    pain_point: string;
    additional_characteristics?: {
      profession?: string;
      education_level?: string;
      location?: string;
      lifestyle?: string[];
      values?: string[];
      content_preferences?: string[];
      decision_making_style?: string;
    };
  }>;
  
  // Business Model & Revenue
  business_model: {
    primary_model: string;
    revenue_streams: string[];
    pricing_strategy?: {
      individual?: string;
      enterprise?: string;
      freemium_tier?: boolean;
    };
  };
  
  // Market Intelligence
  market_analysis: {
    total_market: string;
    target_segment: string;
    growth_rate: string;
    competition_level: string;
    market_trends?: string[];
  };
  
  // Feasibility & Validation
  feasibility_assessment: {
    technical_feasibility: string;
    market_demand: string;
    competitive_advantage: string;
  };
  
  // Technology & Implementation
  technology_stack: {
    frontend: string;
    backend: string;
    ai_models?: string[];
    database: string;
    cloud_infrastructure: string;
    additional_tools?: string[];
  };
  
  // Competitive Landscape
  competitive_analysis: Array<{
    competitor: string;
    strength: string;
    weakness: string;
    market_share?: string;
  }>;
  
  // Financial Projections
  financial_projections: Array<{
    year: number;
    revenue: string;
    users: number;
    expenses: string;
  }>;
  
  // Key Performance Indicators
  key_business_metrics: {
    time_to_mvp: string;
    initial_investment: string;
    break_even_point: string;
    [key: string]: string;
  };
  
  // Implementation Roadmap
  implementation_timeline: {
    [phase: string]: {
      timeline: string;
      focus: string;
    };
  };
  
  // Resource Planning
  resource_requirements: Array<{
    role: string;
    count: number;
    salary: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  
  // Risk Management
  risk_assessment_and_mitigation: Array<{
    risk: string;
    likelihood: 'low' | 'medium' | 'high';
    impact: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  
  // Go-to-Market Strategy
  go_to_market_strategy: string[];
  
  // Success Metrics
  success_metrics_kpis: string[];
  
  // SWOT Analysis
  key_strengths: string[];
  key_challenges: string[];
  opportunities?: string[];
  threats?: string[];
  
  // Action Plan
  recommended_next_steps: string[];
  
  // Content Strategy Context
  content_strategy?: {
    brand_voice: {
      tone: string;
      personality: string[];
      messaging_pillars: string[];
    };
    content_pillars: string[];
    platform_strategy: {
      primary_platforms: string[];
      content_mix: { [platform: string]: string[] };
    };
  };
  
  // Metadata
  profile_metadata: {
    id: string;
    created_at: string;
    wizard_type: 'brand_blueprint' | 'content_pillars' | 'platform_strategy' | 'competitor_analysis';
    confidence_score: number;
    version: string;
  };
}

export class BusinessContextGenerator {
  static generateProfile(inputs: {
    wizardType: 'brand_blueprint' | 'content_pillars' | 'platform_strategy' | 'competitor_analysis';
    userInputs: any;
    existingProfile?: Partial<BusinessContextProfile>;
  }): BusinessContextProfile {
    const timestamp = new Date().toISOString();
    const id = `${inputs.wizardType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      product_name: inputs.userInputs.productName || inputs.userInputs.brandName || 'Business Product',
      executive_summary: this.generateExecutiveSummary(inputs.userInputs, inputs.wizardType),
      problem_statement: this.generateProblemStatement(inputs.wizardType),
      solution_overview: this.generateSolutionOverview(inputs.wizardType),
      
      target_customer_personas: this.generatePersonas(inputs.userInputs, inputs.wizardType),
      business_model: {
        primary_model: inputs.userInputs.businessModel || 'Subscription-based',
        revenue_streams: this.generateRevenueStreams(inputs.wizardType)
      },
      
      market_analysis: {
        total_market: inputs.userInputs.marketSize || '$1B+',
        target_segment: '10% of total market',
        growth_rate: '15% CAGR',
        competition_level: 'Medium'
      },
      
      feasibility_assessment: {
        technical_feasibility: '85%',
        market_demand: '90%',
        competitive_advantage: '78%'
      },
      
      technology_stack: this.generateTechStack(inputs.wizardType),
      competitive_analysis: this.generateCompetitiveAnalysis(inputs.wizardType),
      financial_projections: this.generateFinancialProjections(),
      key_business_metrics: this.generateKeyMetrics(inputs.wizardType),
      implementation_timeline: this.generateTimeline(inputs.wizardType),
      resource_requirements: this.generateResourceRequirements(inputs.wizardType),
      risk_assessment_and_mitigation: this.generateRiskAssessment(inputs.wizardType),
      go_to_market_strategy: this.generateGoToMarketStrategy(inputs.wizardType),
      success_metrics_kpis: this.generateSuccessMetrics(inputs.wizardType),
      key_strengths: this.generateStrengths(inputs.wizardType),
      key_challenges: this.generateChallenges(inputs.wizardType),
      recommended_next_steps: this.generateNextSteps(inputs.wizardType),
      content_strategy: this.generateContentStrategy(inputs.userInputs, inputs.wizardType),
      
      profile_metadata: {
        id,
        created_at: timestamp,
        wizard_type: inputs.wizardType,
        confidence_score: 0.85,
        version: '1.0'
      }
    };
  }
  
  private static generateExecutiveSummary(inputs: any, wizardType: string): string {
    const summaries = {
      brand_blueprint: `${inputs.brandName || 'This business'} aims to deliver exceptional value through clear brand positioning and consistent messaging across all touchpoints.`,
      content_pillars: `Content strategy centered around strategic pillars to build thought leadership and drive audience engagement.`,
      platform_strategy: `Multi-platform digital strategy leveraging social media and content marketing to reach target demographics.`,
      competitor_analysis: `Competitive positioning analysis identifying key differentiators and market opportunities.`
    };
    return summaries[wizardType as keyof typeof summaries];
  }
  
  private static generateProblemStatement(wizardType: string): string {
    const problems = {
      brand_blueprint: 'Lack of clear brand identity leads to confused market positioning and reduced customer trust.',
      content_pillars: 'Content creation without strategic framework results in inconsistent messaging and reduced engagement.',
      platform_strategy: 'Businesses struggle with platform-specific optimization, leading to poor engagement rates.',
      competitor_analysis: 'Companies lack comprehensive competitive intelligence, missing differentiation opportunities.'
    };
    return problems[wizardType as keyof typeof problems];
  }
  
  private static generateSolutionOverview(wizardType: string): string {
    const solutions = {
      brand_blueprint: 'Comprehensive brand strategy framework defining identity, voice, and messaging architecture.',
      content_pillars: 'Strategic content pillar framework ensuring consistent, valuable content aligned with objectives.',
      platform_strategy: 'Data-driven platform strategy optimizing content formats and engagement tactics per channel.',
      competitor_analysis: 'Systematic competitive analysis identifying market gaps and strategic positioning opportunities.'
    };
    return solutions[wizardType as keyof typeof solutions];
  }
  
  private static generatePersonas(inputs: any, wizardType: string): BusinessContextProfile['target_customer_personas'] {
    return [
      {
        persona: 'Primary Customer',
        age_range: '25-45',
        income_range: '$50-120K',
        pain_point: 'Seeking effective business solutions',
        additional_characteristics: {
          profession: 'Professional/Manager',
          decision_making_style: 'Research-driven'
        }
      }
    ];
  }
  
  private static generateRevenueStreams(wizardType: string): string[] {
    const streams = {
      brand_blueprint: ['Brand consulting', 'Asset licensing', 'Training services'],
      content_pillars: ['Content subscriptions', 'Premium tiers', 'Licensing'],
      platform_strategy: ['Management services', 'Advertising', 'Partnerships'],
      competitor_analysis: ['Research reports', 'Intelligence subscriptions', 'Consulting']
    };
    return streams[wizardType as keyof typeof streams];
  }
  
  private static generateTechStack(wizardType: string): BusinessContextProfile['technology_stack'] {
    return {
      frontend: 'React/Next.js',
      backend: 'Node.js/Python',
      database: 'PostgreSQL',
      cloud_infrastructure: 'AWS',
      additional_tools: ['Analytics', 'CRM', 'Automation tools']
    };
  }
  
  private static generateCompetitiveAnalysis(wizardType: string): BusinessContextProfile['competitive_analysis'] {
    return [
      { competitor: 'Market Leader A', strength: 'Brand recognition', weakness: 'High costs' },
      { competitor: 'Emerging Player B', strength: 'Innovation', weakness: 'Limited reach' }
    ];
  }
  
  private static generateFinancialProjections(): BusinessContextProfile['financial_projections'] {
    return [
      { year: 1, revenue: '$100K', users: 2000, expenses: '$200K' },
      { year: 2, revenue: '$500K', users: 10000, expenses: '$400K' },
      { year: 3, revenue: '$1.5M', users: 30000, expenses: '$900K' }
    ];
  }
  
  private static generateKeyMetrics(wizardType: string): BusinessContextProfile['key_business_metrics'] {
    return {
      time_to_mvp: '3-6 months',
      initial_investment: '$100K-500K',
      break_even_point: '12-18 months'
    };
  }
  
  private static generateTimeline(wizardType: string): BusinessContextProfile['implementation_timeline'] {
    return {
      phase_1: { timeline: 'Months 1-3', focus: 'Foundation and planning' },
      phase_2: { timeline: 'Months 4-6', focus: 'Implementation and testing' },
      phase_3: { timeline: 'Months 7-9', focus: 'Optimization and scaling' }
    };
  }
  
  private static generateResourceRequirements(wizardType: string): BusinessContextProfile['resource_requirements'] {
    const roles = {
      brand_blueprint: [{ role: 'Brand Strategist', count: 1, salary: '$95K/year', priority: 'high' as const }],
      content_pillars: [{ role: 'Content Strategist', count: 1, salary: '$85K/year', priority: 'high' as const }],
      platform_strategy: [{ role: 'Social Media Manager', count: 1, salary: '$70K/year', priority: 'high' as const }],
      competitor_analysis: [{ role: 'Market Analyst', count: 1, salary: '$90K/year', priority: 'high' as const }]
    };
    return roles[wizardType as keyof typeof roles];
  }
  
  private static generateRiskAssessment(wizardType: string): BusinessContextProfile['risk_assessment_and_mitigation'] {
    return [
      {
        risk: 'Market competition intensity',
        likelihood: 'medium' as const,
        impact: 'high' as const,
        mitigation: 'Strong differentiation strategy and continuous innovation'
      }
    ];
  }
  
  private static generateGoToMarketStrategy(wizardType: string): string[] {
    return ['Digital marketing campaigns', 'Partnership development', 'Content marketing', 'Industry events'];
  }
  
  private static generateSuccessMetrics(wizardType: string): string[] {
    return ['User acquisition rate', 'Customer satisfaction', 'Revenue growth', 'Market share'];
  }
  
  private static generateStrengths(wizardType: string): string[] {
    return ['Strong value proposition', 'Experienced team', 'Market opportunity', 'Innovative approach'];
  }
  
  private static generateChallenges(wizardType: string): string[] {
    return ['Market competition', 'User acquisition', 'Resource constraints', 'Technology complexity'];
  }
  
  private static generateNextSteps(wizardType: string): string[] {
    return ['Market validation', 'MVP development', 'Team building', 'Funding strategy'];
  }
  
  private static generateContentStrategy(inputs: any, wizardType: string): BusinessContextProfile['content_strategy'] {
    return {
      brand_voice: {
        tone: inputs.tone || 'Professional yet approachable',
        personality: ['Knowledgeable', 'Helpful', 'Innovative'],
        messaging_pillars: ['Quality', 'Innovation', 'Results']
      },
      content_pillars: inputs.contentPillars || ['Education', 'Inspiration', 'Solutions'],
      platform_strategy: {
        primary_platforms: ['LinkedIn', 'Twitter', 'Blog'],
        content_mix: {
          'LinkedIn': ['Articles', 'Updates', 'Videos'],
          'Twitter': ['Tips', 'News', 'Engagement'],
          'Blog': ['Guides', 'Case studies', 'Insights']
        }
      }
    };
  }
}
