import { BusinessContextProfile } from './businessContextProfile';

// Enhanced context profile structure for multi-piece campaigns
export interface ComprehensiveSwipeProfile extends Omit<BusinessContextProfile, 'resource_requirements'> {
  // Campaign/Series Planning
  campaign_overview: {
    campaign_name: string;
    campaign_type: 'email_series' | 'article_series' | 'social_campaign' | 'content_funnel' | 'product_launch' | 'educational_sequence' | 'nurture_sequence';
    total_pieces: number;
    timeline: string;
    sequence_strategy: string;
    campaign_objective: string;
    success_criteria: string[];
  };
  
  // Multi-Piece Content Framework
  content_sequence: ContentPiece[];
  
  // Advanced Audience Journey
  audience_journey: {
    awareness_stage: {
      content_pieces: number[];
      key_messages: string[];
      goals: string[];
    };
    consideration_stage: {
      content_pieces: number[];
      key_messages: string[];
      goals: string[];
    };
    decision_stage: {
      content_pieces: number[];
      key_messages: string[];
      goals: string[];
    };
    retention_stage: {
      content_pieces: number[];
      key_messages: string[];
      goals: string[];
    };
  };
  
  // Performance Tracking
  success_metrics_per_piece: {
    [piece_number: string]: {
      primary_kpis: string[];
      engagement_targets: string[];
      conversion_goals: string[];
    };
  };
  
  // Campaign Consistency Framework
  consistency_framework: {
    brand_voice_guidelines: string[];
    visual_consistency: string[];
    message_progression: string[];
    tone_evolution: string[];
  };
  
  // Campaign Resource Planning (different from BusinessContextProfile)
  campaign_resource_requirements: {
    content_creation_time: string;
    design_requirements: string[];
    approval_workflow: string[];
    publication_schedule: string[];
  };
  
  // Keep original resource requirements from BusinessContextProfile
  resource_requirements: Array<{
    role: string;
    count: number;
    salary: string;
    priority: 'high' | 'medium' | 'low';
  }>;
}

export interface ContentPiece {
  piece_number: number;
  piece_type: 'email' | 'article' | 'social_post' | 'landing_page' | 'video_script' | 'infographic' | 'case_study' | 'whitepaper' | 'onbrand_image';
  title: string;
  purpose: string;
  key_message: string;
  cta_strategy: string;
  progression_role: string; // How it fits in the sequence
  audience_stage: 'awareness' | 'consideration' | 'decision' | 'retention';
  content_length: 'short' | 'medium' | 'long';
  required_assets: string[];
  dependencies: number[]; // Which pieces this depends on
  estimated_engagement: string;
  conversion_potential: 'low' | 'medium' | 'high';
}

// Campaign Templates for quick setup
export interface CampaignTemplate {
  name: string;
  description: string;
  campaign_type: ComprehensiveSwipeProfile['campaign_overview']['campaign_type'];
  default_pieces: number;
  template_structure: Partial<ContentPiece>[];
  recommended_timeline: string;
  success_benchmarks: string[];
}

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    name: 'Welcome Email Series',
    description: 'Onboard new subscribers with a comprehensive introduction sequence',
    campaign_type: 'email_series',
    default_pieces: 5,
    template_structure: [
      {
        piece_number: 1,
        piece_type: 'email',
        title: 'Welcome & Set Expectations',
        purpose: 'Introduce brand and set expectations',
        audience_stage: 'awareness',
        progression_role: 'Introduction and expectation setting'
      },
      {
        piece_number: 2,
        piece_type: 'email',
        title: 'Core Value Proposition',
        purpose: 'Communicate unique value and benefits',
        audience_stage: 'awareness',
        progression_role: 'Value demonstration'
      },
      {
        piece_number: 3,
        piece_type: 'email',
        title: 'Social Proof & Testimonials',
        purpose: 'Build trust through social validation',
        audience_stage: 'consideration',
        progression_role: 'Trust building'
      },
      {
        piece_number: 4,
        piece_type: 'email',
        title: 'Educational Content',
        purpose: 'Provide valuable insights and knowledge',
        audience_stage: 'consideration',
        progression_role: 'Value delivery'
      },
      {
        piece_number: 5,
        piece_type: 'email',
        title: 'Soft CTA & Next Steps',
        purpose: 'Guide towards desired action',
        audience_stage: 'decision',
        progression_role: 'Conversion facilitation'
      }
    ],
    recommended_timeline: '5 days (daily send)',
    success_benchmarks: ['Open rate >25%', 'Click rate >5%', 'Conversion rate >2%']
  },
  {
    name: 'Educational Article Series',
    description: 'Comprehensive educational content to establish thought leadership',
    campaign_type: 'article_series',
    default_pieces: 6,
    template_structure: [
      {
        piece_number: 1,
        piece_type: 'article',
        title: 'Problem Introduction',
        purpose: 'Identify and articulate the core problem',
        audience_stage: 'awareness',
        progression_role: 'Problem identification'
      },
      {
        piece_number: 2,
        piece_type: 'article',
        title: 'Market Context',
        purpose: 'Provide industry context and trends',
        audience_stage: 'awareness',
        progression_role: 'Context building'
      },
      {
        piece_number: 3,
        piece_type: 'article',
        title: 'Solution Framework',
        purpose: 'Introduce systematic approach to solving the problem',
        audience_stage: 'consideration',
        progression_role: 'Solution introduction'
      },
      {
        piece_number: 4,
        piece_type: 'article',
        title: 'Implementation Guide',
        purpose: 'Provide step-by-step implementation instructions',
        audience_stage: 'consideration',
        progression_role: 'Practical guidance'
      },
      {
        piece_number: 5,
        piece_type: 'article',
        title: 'Case Study Analysis',
        purpose: 'Demonstrate real-world application and results',
        audience_stage: 'decision',
        progression_role: 'Proof of concept'
      },
      {
        piece_number: 6,
        piece_type: 'article',
        title: 'Advanced Strategies',
        purpose: 'Share advanced techniques and optimizations',
        audience_stage: 'retention',
        progression_role: 'Value amplification'
      }
    ],
    recommended_timeline: '6 weeks (weekly publication)',
    success_benchmarks: ['Avg. reading time >3 min', 'Social shares >50', 'Lead generation >10%']
  },
  {
    name: 'Product Launch Campaign',
    description: 'Multi-channel campaign for new product introduction',
    campaign_type: 'product_launch',
    default_pieces: 8,
    template_structure: [
      {
        piece_number: 1,
        piece_type: 'social_post',
        title: 'Teaser Announcement',
        purpose: 'Generate anticipation and awareness',
        audience_stage: 'awareness',
        progression_role: 'Anticipation building'
      },
      {
        piece_number: 2,
        piece_type: 'article',
        title: 'Problem Statement',
        purpose: 'Articulate the problem this product solves',
        audience_stage: 'awareness',
        progression_role: 'Need identification'
      },
      {
        piece_number: 3,
        piece_type: 'email',
        title: 'Exclusive Preview',
        purpose: 'Provide insider access to engaged audience',
        audience_stage: 'consideration',
        progression_role: 'Exclusive access'
      },
      {
        piece_number: 4,
        piece_type: 'video_script',
        title: 'Product Demo',
        purpose: 'Showcase product capabilities and benefits',
        audience_stage: 'consideration',
        progression_role: 'Feature demonstration'
      },
      {
        piece_number: 5,
        piece_type: 'case_study',
        title: 'Beta User Success Story',
        purpose: 'Provide social proof and real-world validation',
        audience_stage: 'decision',
        progression_role: 'Social validation'
      },
      {
        piece_number: 6,
        piece_type: 'landing_page',
        title: 'Launch Landing Page',
        purpose: 'Convert interest into purchases',
        audience_stage: 'decision',
        progression_role: 'Conversion optimization'
      },
      {
        piece_number: 7,
        piece_type: 'email',
        title: 'Launch Day Announcement',
        purpose: 'Drive immediate action and purchases',
        audience_stage: 'decision',
        progression_role: 'Action catalyst'
      },
      {
        piece_number: 8,
        piece_type: 'social_post',
        title: 'Launch Celebration & Social Proof',
        purpose: 'Amplify launch momentum with social validation',
        audience_stage: 'retention',
        progression_role: 'Momentum amplification'
      }
    ],
    recommended_timeline: '4 weeks (pre-launch to post-launch)',
    success_benchmarks: ['Awareness lift >30%', 'Pre-orders >500', 'Launch day sales target']
  },
  {
    name: 'Social Media Content Campaign',
    description: 'Cohesive social media campaign for brand awareness and engagement',
    campaign_type: 'social_campaign',
    default_pieces: 12,
    template_structure: [
      {
        piece_number: 1,
        piece_type: 'social_post',
        title: 'Campaign Kickoff',
        purpose: 'Introduce campaign theme and engage audience',
        audience_stage: 'awareness',
        progression_role: 'Campaign introduction'
      },
      // Additional pieces would be defined based on campaign strategy
    ],
    recommended_timeline: '3 weeks (4 posts per week)',
    success_benchmarks: ['Engagement rate >3%', 'Reach growth >25%', 'Follower growth >10%']
  }
];

// Swipe File Context Generator for multi-piece campaigns
export class SwipeContextGenerator {
  static generateCampaignProfile(input: {
    campaignType: ComprehensiveSwipeProfile['campaign_overview']['campaign_type'];
    campaignName: string;
    totalPieces: number;
    businessProfile: BusinessContextProfile;
    customRequirements?: Partial<ComprehensiveSwipeProfile>;
  }): ComprehensiveSwipeProfile {
    
    const template = CAMPAIGN_TEMPLATES.find(t => t.campaign_type === input.campaignType);
    const baseStructure = template?.template_structure || [];
    
    // Generate content sequence based on template and requirements
    const content_sequence: ContentPiece[] = [];
    for (let i = 1; i <= input.totalPieces; i++) {
      const templatePiece = baseStructure.find(p => p.piece_number === i);
      content_sequence.push({
        piece_number: i,
        piece_type: templatePiece?.piece_type || this.inferContentType(input.campaignType),
        title: templatePiece?.title || `${input.campaignName} - Part ${i}`,
        purpose: templatePiece?.purpose || this.generatePurpose(i, input.totalPieces, input.campaignType),
        key_message: this.generateKeyMessage(i, input.totalPieces, input.businessProfile),
        cta_strategy: this.generateCTAStrategy(i, input.totalPieces, input.campaignType),
        progression_role: templatePiece?.progression_role || this.generateProgressionRole(i, input.totalPieces),
        audience_stage: templatePiece?.audience_stage || this.mapAudienceStage(i, input.totalPieces),
        content_length: this.determineContentLength(templatePiece?.piece_type || 'article'),
        required_assets: this.generateRequiredAssets(templatePiece?.piece_type || 'article'),
        dependencies: this.calculateDependencies(i),
        estimated_engagement: this.estimateEngagement(i, input.totalPieces),
        conversion_potential: this.assessConversionPotential(i, input.totalPieces)
      });
    }
    
    // Map content to audience journey stages
    const audience_journey = this.mapContentToJourney(content_sequence, input.businessProfile);
    
    // Generate performance metrics for each piece
    const success_metrics_per_piece = this.generatePerformanceMetrics(content_sequence, input.campaignType);
    
    // Create comprehensive profile
    const comprehensiveProfile: ComprehensiveSwipeProfile = {
      ...input.businessProfile,
      campaign_overview: {
        campaign_name: input.campaignName,
        campaign_type: input.campaignType,
        total_pieces: input.totalPieces,
        timeline: template?.recommended_timeline || `${input.totalPieces} weeks`,
        sequence_strategy: this.generateSequenceStrategy(input.campaignType, input.totalPieces),
        campaign_objective: this.generateCampaignObjective(input.campaignType, input.businessProfile),
        success_criteria: template?.success_benchmarks || this.generateSuccessCriteria(input.campaignType)
      },
      content_sequence,
      audience_journey,
      success_metrics_per_piece,
      consistency_framework: {
        brand_voice_guidelines: this.generateBrandVoiceGuidelines(input.businessProfile),
        visual_consistency: this.generateVisualConsistency(input.businessProfile),
        message_progression: this.generateMessageProgression(content_sequence),
        tone_evolution: this.generateToneEvolution(content_sequence, input.businessProfile)
      },
      campaign_resource_requirements: {
        content_creation_time: this.estimateCreationTime(content_sequence),
        design_requirements: this.generateDesignRequirements(content_sequence),
        approval_workflow: this.generateApprovalWorkflow(input.campaignType),
        publication_schedule: this.generatePublicationSchedule(content_sequence, template?.recommended_timeline)
      },
      // Merge any custom requirements
      ...input.customRequirements
    };
    
    return comprehensiveProfile;
  }
  
  // Helper methods for generating specific aspects of the profile
  private static inferContentType(campaignType: string): ContentPiece['piece_type'] {
    const typeMap: Record<string, ContentPiece['piece_type']> = {
      'email_series': 'email',
      'article_series': 'article',
      'social_campaign': 'social_post',
      'content_funnel': 'landing_page',
      'product_launch': 'article',
      'educational_sequence': 'article',
      'nurture_sequence': 'email'
    };
    return typeMap[campaignType] || 'article';
  }
  
  private static generatePurpose(pieceNumber: number, totalPieces: number, campaignType: string): string {
    const position = pieceNumber / totalPieces;
    
    if (position <= 0.33) {
      return 'Introduce core concepts and establish foundation';
    } else if (position <= 0.66) {
      return 'Build on previous concepts and provide deeper insights';
    } else {
      return 'Consolidate learning and drive action';
    }
  }
  
  private static generateKeyMessage(pieceNumber: number, totalPieces: number, businessProfile: BusinessContextProfile): string {
    return `Strategic message ${pieceNumber} aligned with ${businessProfile.solution_overview}`;
  }
  
  private static generateCTAStrategy(pieceNumber: number, totalPieces: number, campaignType: string): string {
    const position = pieceNumber / totalPieces;
    
    if (position <= 0.33) {
      return 'Soft engagement - encourage continued consumption';
    } else if (position <= 0.66) {
      return 'Medium engagement - build relationship and trust';
    } else {
      return 'Strong CTA - drive conversion and action';
    }
  }
  
  private static generateProgressionRole(pieceNumber: number, totalPieces: number): string {
    const roles = [
      'Foundation building',
      'Concept development',
      'Insight delivery',
      'Trust building',
      'Value demonstration',
      'Social proof',
      'Action facilitation',
      'Relationship strengthening'
    ];
    
    const index = Math.min(pieceNumber - 1, roles.length - 1);
    return roles[index];
  }
  
  private static mapAudienceStage(pieceNumber: number, totalPieces: number): ContentPiece['audience_stage'] {
    const position = pieceNumber / totalPieces;
    
    if (position <= 0.25) return 'awareness';
    if (position <= 0.50) return 'consideration';
    if (position <= 0.75) return 'decision';
    return 'retention';
  }
  
  private static determineContentLength(contentType: ContentPiece['piece_type']): ContentPiece['content_length'] {
    const lengthMap: Record<ContentPiece['piece_type'], ContentPiece['content_length']> = {
      'email': 'medium',
      'article': 'long',
      'social_post': 'short',
      'landing_page': 'medium',
      'video_script': 'medium',
      'infographic': 'short',
      'case_study': 'long',
      'whitepaper': 'long',
      'onbrand_image': 'short'
    };
    return lengthMap[contentType] || 'medium';
  }
  
  private static generateRequiredAssets(contentType: ContentPiece['piece_type']): string[] {
    const assetMap: Record<ContentPiece['piece_type'], string[]> = {
      'email': ['Subject line variations', 'Header image', 'CTA button design'],
      'article': ['Hero image', 'In-content graphics', 'Social share images'],
      'social_post': ['Visual content', 'Hashtag research', 'Story/Reel assets'],
      'landing_page': ['Hero section design', 'Form elements', 'Conversion tracking'],
      'video_script': ['Storyboard', 'Visual cues', 'Audio requirements'],
      'infographic': ['Data visualization', 'Brand elements', 'Share-ready formats'],
      'case_study': ['Customer quotes', 'Results data', 'Before/after visuals'],
      'whitepaper': ['Research data', 'Charts/graphs', 'Professional layout'],
      'onbrand_image': ['Brand color palette', 'Typography guidelines', 'Moodboard/reference images']
    };
    return assetMap[contentType] || ['Supporting visuals', 'Brand assets'];
  }
  
  private static calculateDependencies(pieceNumber: number): number[] {
    if (pieceNumber === 1) return [];
    if (pieceNumber === 2) return [1];
    return [pieceNumber - 1]; // Simple linear dependency
  }
  
  private static estimateEngagement(pieceNumber: number, totalPieces: number): string {
    const position = pieceNumber / totalPieces;
    
    if (position <= 0.33) return 'High - novel content attracts attention';
    if (position <= 0.66) return 'Medium - building on established interest';
    return 'Variable - depends on conversion intent';
  }
  
  private static assessConversionPotential(pieceNumber: number, totalPieces: number): ContentPiece['conversion_potential'] {
    const position = pieceNumber / totalPieces;
    
    if (position <= 0.33) return 'low';
    if (position <= 0.66) return 'medium';
    return 'high';
  }
  
  private static mapContentToJourney(contentSequence: ContentPiece[], businessProfile: BusinessContextProfile) {
    const journey = {
      awareness_stage: { content_pieces: [], key_messages: [], goals: [] },
      consideration_stage: { content_pieces: [], key_messages: [], goals: [] },
      decision_stage: { content_pieces: [], key_messages: [], goals: [] },
      retention_stage: { content_pieces: [], key_messages: [], goals: [] }
    };
    
    contentSequence.forEach(piece => {
      const stageKey = `${piece.audience_stage}_stage` as keyof typeof journey;
      journey[stageKey].content_pieces.push(piece.piece_number);
      journey[stageKey].key_messages.push(piece.key_message);
      journey[stageKey].goals.push(piece.purpose);
    });
    
    return journey;
  }
  
  private static generatePerformanceMetrics(contentSequence: ContentPiece[], campaignType: string) {
    const metrics: any = {};
    
    contentSequence.forEach(piece => {
      metrics[piece.piece_number.toString()] = {
        primary_kpis: this.generateKPIs(piece.piece_type, piece.conversion_potential),
        engagement_targets: this.generateEngagementTargets(piece.piece_type),
        conversion_goals: this.generateConversionGoals(piece.conversion_potential, piece.audience_stage)
      };
    });
    
    return metrics;
  }
  
  private static generateKPIs(pieceType: string, conversionPotential: string): string[] {
    const baseKPIs = ['Views/Impressions', 'Engagement rate', 'Time spent'];
    
    if (conversionPotential === 'high') {
      return [...baseKPIs, 'Conversion rate', 'Revenue attribution'];
    }
    
    return baseKPIs;
  }
  
  private static generateEngagementTargets(pieceType: string): string[] {
    const targets: Record<string, string[]> = {
      'email': ['Open rate >25%', 'Click rate >5%', 'Forward rate >2%'],
      'article': ['Reading time >3 min', 'Social shares >20', 'Comments >5'],
      'social_post': ['Engagement rate >3%', 'Reach >1000', 'Saves >50'],
      'landing_page': ['Conversion rate >5%', 'Bounce rate <40%', 'Time on page >2 min']
    };
    
    return targets[pieceType] || ['Engagement rate >2%', 'Time spent >1 min'];
  }
  
  private static generateConversionGoals(conversionPotential: string, audienceStage: string): string[] {
    if (conversionPotential === 'high' && audienceStage === 'decision') {
      return ['Direct sales', 'Lead generation', 'Demo requests'];
    }
    
    if (audienceStage === 'consideration') {
      return ['Email signups', 'Content downloads', 'Social follows'];
    }
    
    return ['Brand awareness', 'Engagement increase', 'Audience growth'];
  }
  
  // Additional helper methods...
  private static generateSequenceStrategy(campaignType: string, totalPieces: number): string {
    return `${totalPieces}-piece ${campaignType.replace('_', ' ')} designed to guide audience through complete customer journey`;
  }
  
  private static generateCampaignObjective(campaignType: string, businessProfile: BusinessContextProfile): string {
    return `Achieve ${businessProfile.executive_summary} through strategic ${campaignType.replace('_', ' ')} execution`;
  }
  
  private static generateSuccessCriteria(campaignType: string): string[] {
    const criteriaMap: Record<string, string[]> = {
      'email_series': ['Open rate >25%', 'Click rate >5%', 'Conversion rate >2%'],
      'article_series': ['Avg reading time >3 min', 'Social shares >50', 'Lead generation >10%'],
      'social_campaign': ['Engagement rate >3%', 'Reach growth >25%', 'Follower growth >10%'],
      'product_launch': ['Awareness lift >30%', 'Pre-orders target', 'Launch day sales goal']
    };
    
    return criteriaMap[campaignType] || ['Engagement increase >20%', 'Audience growth >15%'];
  }
  
  private static generateBrandVoiceGuidelines(businessProfile: BusinessContextProfile): string[] {
    const firstPersona = businessProfile.target_customer_personas[0];
    return [
      `Maintain ${firstPersona?.additional_characteristics?.content_preferences?.join(', ') || 'professional tone'} throughout series`,
      `Align with target persona: ${firstPersona?.persona || 'primary customer'}`,
      'Ensure consistent terminology and messaging',
      'Adapt complexity to audience expertise level'
    ];
  }
  
  private static generateVisualConsistency(businessProfile: BusinessContextProfile): string[] {
    return [
      'Use consistent color palette across all pieces',
      'Maintain typography hierarchy',
      'Apply brand logo and visual elements consistently',
      'Ensure mobile-responsive design'
    ];
  }
  
  private static generateMessageProgression(contentSequence: ContentPiece[]): string[] {
    return [
      'Build complexity gradually across sequence',
      'Reference previous pieces to create continuity',
      'Escalate value proposition with each piece',
      'Maintain thematic consistency while avoiding repetition'
    ];
  }
  
  private static generateToneEvolution(contentSequence: ContentPiece[], businessProfile: BusinessContextProfile): string[] {
    return [
      'Start with welcoming, educational tone',
      'Progress to more confident, authoritative voice',
      'Conclude with action-oriented, persuasive messaging',
      'Maintain brand personality throughout'
    ];
  }
  
  private static estimateCreationTime(contentSequence: ContentPiece[]): string {
    const timePerPiece = 2; // hours
    const totalTime = contentSequence.length * timePerPiece;
    return `${totalTime} hours (${timePerPiece} hours per piece)`;
  }
  
  private static generateDesignRequirements(contentSequence: ContentPiece[]): string[] {
    const requirements = new Set<string>();
    
    contentSequence.forEach(piece => {
      piece.required_assets.forEach(asset => requirements.add(asset));
    });
    
    return Array.from(requirements);
  }
  
  private static generateApprovalWorkflow(campaignType: string): string[] {
    return [
      'Content strategy review',
      'Brand compliance check',
      'Legal/compliance approval',
      'Final stakeholder sign-off'
    ];
  }
  
  private static generatePublicationSchedule(contentSequence: ContentPiece[], recommendedTimeline?: string): string[] {
    const schedule = [];
    const interval = recommendedTimeline?.includes('daily') ? 1 : 7; // days
    
    contentSequence.forEach((piece, index) => {
      const day = index * interval + 1;
      schedule.push(`Day ${day}: ${piece.title}`);
    });
    
    return schedule;
  }
}

export default SwipeContextGenerator;
