export interface ContentContextProfile {
  // Basic Information
  id: string;
  timestamp: string;
  contentType: string;
  
  // Brand Context
  brand: {
    name: string;
    industry: string;
    values: string[];
    voice: {
      tone: string;
      personality: string[];
      vocabulary: string;
      formality: 'casual' | 'professional' | 'formal';
    };
    visualIdentity: {
      colors: string[];
      style: string;
      imagery: string;
    };
  };
  
  // Audience Profile
  audience: {
    primary: {
      demographics: {
        ageRange: string;
        location: string[];
        income: string;
        education: string;
        occupation: string[];
      };
      psychographics: {
        interests: string[];
        values: string[];
        lifestyle: string[];
        painPoints: string[];
        goals: string[];
      };
      behaviorPatterns: {
        contentConsumption: string[];
        preferredPlatforms: string[];
        engagementTimes: string[];
        decisionMaking: string;
      };
    };
    secondary?: {
      demographics: Partial<typeof this.audience.primary.demographics>;
      psychographics: Partial<typeof this.audience.primary.psychographics>;
      behaviorPatterns: Partial<typeof this.audience.primary.behaviorPatterns>;
    };
  };
  
  // Content Strategy
  strategy: {
    objectives: string[];
    keyMessages: string[];
    contentPillars: string[];
    competitorAnalysis: {
      strengths: string[];
      gaps: string[];
      opportunities: string[];
    };
    contentFramework: {
      hook: string;
      structure: string[];
      callToAction: string;
    };
  };
  
  // Platform-Specific Context
  platformContext: {
    platform: string;
    specifications: {
      characterLimits?: number;
      recommendedLength?: string;
      hashtagLimit?: number;
      imageRequirements?: string;
      bestPostingTimes?: string[];
    };
    audienceBehavior: {
      engagementPatterns: string[];
      contentPreferences: string[];
      interactionStyle: string;
    };
  };
  
  // Compliance & Guidelines
  compliance: {
    regulations: string[];
    brandGuidelines: string[];
    ethicalConsiderations: string[];
    accessibilityRequirements: string[];
  };
  
  // Performance Metrics
  metrics: {
    primaryKPIs: string[];
    successCriteria: string[];
    benchmarks: {
      engagement: number;
      reach: number;
      conversions: number;
    };
  };
  
  // Context Metadata
  metadata: {
    confidenceScore: number;
    dataSource: string[];
    lastUpdated: string;
    version: string;
  };
}

export class ContextProfileGenerator {
  static generateProfile(inputs: {
    contentType: string;
    prompt: string;
    platform?: string;
    tone?: string;
    audience?: string;
    brand?: any;
  }): ContentContextProfile {
    const timestamp = new Date().toISOString();
    const id = `profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Analyze inputs to determine audience characteristics
    const audienceAnalysis = this.analyzeAudience(inputs.audience, inputs.prompt);
    const brandAnalysis = this.analyzeBrand(inputs.brand, inputs.tone);
    const platformAnalysis = this.analyzePlatform(inputs.platform, inputs.contentType);
    const strategyAnalysis = this.analyzeStrategy(inputs.prompt, inputs.contentType);
    
    return {
      id,
      timestamp,
      contentType: inputs.contentType,
      
      brand: brandAnalysis,
      audience: audienceAnalysis,
      strategy: strategyAnalysis,
      platformContext: platformAnalysis,
      
      compliance: {
        regulations: this.getRelevantRegulations(inputs.contentType, inputs.platform),
        brandGuidelines: this.getBrandGuidelines(brandAnalysis),
        ethicalConsiderations: this.getEthicalConsiderations(inputs.contentType),
        accessibilityRequirements: this.getAccessibilityRequirements(inputs.platform)
      },
      
      metrics: {
        primaryKPIs: this.getPrimaryKPIs(inputs.contentType, inputs.platform),
        successCriteria: this.getSuccessCriteria(inputs.contentType),
        benchmarks: {
          engagement: this.getEngagementBenchmark(inputs.platform),
          reach: this.getReachBenchmark(inputs.platform),
          conversions: this.getConversionBenchmark(inputs.contentType)
        }
      },
      
      metadata: {
        confidenceScore: this.calculateConfidenceScore(inputs),
        dataSource: ['user_input', 'platform_data', 'industry_benchmarks'],
        lastUpdated: timestamp,
        version: '1.0'
      }
    };
  }
  
  private static analyzeAudience(audienceInput?: string, prompt?: string) {
    // Extract audience insights from inputs
    const insights = this.extractAudienceInsights(audienceInput, prompt);
    
    return {
      primary: {
        demographics: {
          ageRange: insights.ageRange || '25-45',
          location: insights.location || ['Global'],
          income: insights.income || 'Middle to Upper-Middle Class',
          education: insights.education || 'College Educated',
          occupation: insights.occupation || ['Professional', 'Manager', 'Entrepreneur']
        },
        psychographics: {
          interests: insights.interests || ['Technology', 'Business Growth', 'Innovation'],
          values: insights.values || ['Quality', 'Efficiency', 'Innovation'],
          lifestyle: insights.lifestyle || ['Busy Professional', 'Digital Native'],
          painPoints: insights.painPoints || ['Time Constraints', 'Information Overload'],
          goals: insights.goals || ['Career Growth', 'Business Success', 'Work-Life Balance']
        },
        behaviorPatterns: {
          contentConsumption: insights.contentConsumption || ['Mobile-First', 'Video Preferred', 'Quick Reads'],
          preferredPlatforms: insights.preferredPlatforms || ['LinkedIn', 'Twitter', 'Email'],
          engagementTimes: insights.engagementTimes || ['9-11 AM', '1-3 PM', '7-9 PM'],
          decisionMaking: insights.decisionMaking || 'Research-Driven'
        }
      }
    };
  }
  
  private static analyzeBrand(brandInput?: any, tone?: string) {
    return {
      name: brandInput?.brand || 'Contentmix.ai',
      industry: brandInput?.industry || 'Marketing Technology',
      values: brandInput?.values || ['Innovation', 'Quality', 'User-Centric'],
      voice: {
        tone: tone || brandInput?.tone || 'Professional yet approachable',
        personality: ['Knowledgeable', 'Helpful', 'Forward-thinking'],
        vocabulary: 'Industry-specific but accessible',
        formality: (tone?.toLowerCase().includes('casual') ? 'casual' : 
                   tone?.toLowerCase().includes('formal') ? 'formal' : 'professional') as 'casual' | 'professional' | 'formal'
      },
      visualIdentity: {
        colors: ['#3B82F6', '#8B5CF6', '#10B981'],
        style: 'Modern, Clean, Tech-forward',
        imagery: 'Professional, Diverse, Solution-focused'
      }
    };
  }
  
  private static analyzePlatform(platform?: string, contentType?: string) {
    const platformSpecs = this.getPlatformSpecifications(platform);
    const audienceBehavior = this.getPlatformAudienceBehavior(platform);
    
    return {
      platform: platform || 'Multi-platform',
      specifications: platformSpecs,
      audienceBehavior
    };
  }
  
  private static analyzeStrategy(prompt?: string, contentType?: string) {
    const objectives = this.extractObjectives(prompt, contentType);
    const keyMessages = this.extractKeyMessages(prompt);
    
    return {
      objectives,
      keyMessages,
      contentPillars: ['Education', 'Innovation', 'Problem-Solving', 'Results'],
      competitorAnalysis: {
        strengths: ['Market Leadership', 'Innovation'],
        gaps: ['Personal Touch', 'Community Building'],
        opportunities: ['Thought Leadership', 'Educational Content']
      },
      contentFramework: {
        hook: 'Problem-focused opening',
        structure: ['Hook', 'Problem', 'Solution', 'Benefit', 'Call to Action'],
        callToAction: 'Learn more or Get Started'
      }
    };
  }
  
  // Helper methods for data extraction and analysis
  private static extractAudienceInsights(audienceInput?: string, prompt?: string) {
    const insights: any = {};
    
    if (audienceInput) {
      // Extract age ranges
      const ageMatch = audienceInput.match(/(\d+)[-–](\d+)/);
      if (ageMatch) insights.ageRange = `${ageMatch[1]}-${ageMatch[2]}`;
      
      // Extract interests from keywords
      const businessKeywords = ['business', 'entrepreneur', 'startup', 'corporate'];
      const techKeywords = ['tech', 'digital', 'software', 'AI'];
      
      if (businessKeywords.some(kw => audienceInput.toLowerCase().includes(kw))) {
        insights.interests = ['Business Growth', 'Entrepreneurship', 'Leadership'];
      }
      if (techKeywords.some(kw => audienceInput.toLowerCase().includes(kw))) {
        insights.interests = [...(insights.interests || []), 'Technology', 'Innovation', 'Digital Transformation'];
      }
    }
    
    return insights;
  }
  
  private static extractObjectives(prompt?: string, contentType?: string) {
    const objectives = [];
    
    if (prompt) {
      if (prompt.toLowerCase().includes('awareness')) objectives.push('Brand Awareness');
      if (prompt.toLowerCase().includes('engagement')) objectives.push('Audience Engagement');
      if (prompt.toLowerCase().includes('lead') || prompt.toLowerCase().includes('conversion')) {
        objectives.push('Lead Generation');
      }
      if (prompt.toLowerCase().includes('education') || prompt.toLowerCase().includes('learn')) {
        objectives.push('Education');
      }
    }
    
    // Default objectives based on content type
    if (objectives.length === 0) {
      switch (contentType) {
        case 'article':
          objectives.push('Education', 'Thought Leadership');
          break;
        case 'social':
          objectives.push('Engagement', 'Brand Awareness');
          break;
        case 'email':
          objectives.push('Nurturing', 'Conversion');
          break;
        case 'ad':
          objectives.push('Lead Generation', 'Conversion');
          break;
        default:
          objectives.push('Brand Awareness', 'Engagement');
      }
    }
    
    return objectives;
  }
  
  private static extractKeyMessages(prompt?: string) {
    if (!prompt) return ['Quality Solutions', 'Innovation Focus', 'User Success'];
    
    // Extract key themes from prompt
    const messages = [];
    if (prompt.toLowerCase().includes('solution')) messages.push('Problem-Solving Focus');
    if (prompt.toLowerCase().includes('quality')) messages.push('Quality Commitment');
    if (prompt.toLowerCase().includes('innovation')) messages.push('Innovation Leadership');
    
    return messages.length > 0 ? messages : ['Quality Solutions', 'Innovation Focus', 'User Success'];
  }
  
  private static getPlatformSpecifications(platform?: string) {
    const specs: any = {};
    
    switch (platform?.toLowerCase()) {
      case 'twitter':
        specs.characterLimits = 280;
        specs.hashtagLimit = 3;
        specs.recommendedLength = 'Concise, under 280 characters';
        break;
      case 'linkedin':
        specs.characterLimits = 3000;
        specs.recommendedLength = '150-300 words for posts';
        specs.hashtagLimit = 5;
        break;
      case 'instagram':
        specs.characterLimits = 2200;
        specs.hashtagLimit = 30;
        specs.imageRequirements = 'High-quality, 1080x1080 or 1080x1350';
        break;
      case 'facebook':
        specs.characterLimits = 63206;
        specs.recommendedLength = '40-80 words for optimal engagement';
        break;
      default:
        specs.recommendedLength = 'Platform-optimized';
    }
    
    return specs;
  }
  
  private static getPlatformAudienceBehavior(platform?: string) {
    switch (platform?.toLowerCase()) {
      case 'twitter':
        return {
          engagementPatterns: ['Real-time interaction', 'News-focused', 'Quick engagement'],
          contentPreferences: ['Breaking news', 'Industry insights', 'Quick tips'],
          interactionStyle: 'Fast-paced, conversational'
        };
      case 'linkedin':
        return {
          engagementPatterns: ['Professional networking', 'Thought leadership', 'B2B focus'],
          contentPreferences: ['Industry insights', 'Career advice', 'Business updates'],
          interactionStyle: 'Professional, value-driven'
        };
      case 'instagram':
        return {
          engagementPatterns: ['Visual-first', 'Story engagement', 'Hashtag discovery'],
          contentPreferences: ['Behind-the-scenes', 'Visual tutorials', 'Brand stories'],
          interactionStyle: 'Visual, authentic, creative'
        };
      default:
        return {
          engagementPatterns: ['Multi-platform behavior'],
          contentPreferences: ['Quality content', 'Value-driven posts'],
          interactionStyle: 'Varied based on context'
        };
    }
  }
  
  private static getRelevantRegulations(contentType?: string, platform?: string) {
    const regulations = ['GDPR Compliance', 'Accessibility Standards'];
    
    if (contentType === 'ad') {
      regulations.push('Advertising Standards', 'Truth in Advertising');
    }
    
    if (platform === 'email') {
      regulations.push('CAN-SPAM Act', 'Email Marketing Compliance');
    }
    
    return regulations;
  }
  
  private static getBrandGuidelines(brand: any) {
    return [
      `Maintain ${brand.voice.tone} tone`,
      `Use approved color palette`,
      `Follow brand voice guidelines`,
      'Ensure consistent messaging'
    ];
  }
  
  private static getEthicalConsiderations(contentType?: string) {
    const considerations = ['Inclusive language', 'Cultural sensitivity', 'Truthful representation'];
    
    if (contentType === 'ad') {
      considerations.push('Transparent advertising', 'Avoid misleading claims');
    }
    
    return considerations;
  }
  
  private static getAccessibilityRequirements(platform?: string) {
    const requirements = ['Alt text for images', 'Clear, readable fonts', 'Color contrast compliance'];
    
    if (platform === 'instagram' || platform === 'facebook') {
      requirements.push('Video captions', 'Audio descriptions');
    }
    
    return requirements;
  }
  
  private static getPrimaryKPIs(contentType?: string, platform?: string) {
    const kpis = [];
    
    switch (contentType) {
      case 'social':
        kpis.push('Engagement Rate', 'Reach', 'Shares');
        break;
      case 'article':
        kpis.push('Page Views', 'Time on Page', 'Social Shares');
        break;
      case 'email':
        kpis.push('Open Rate', 'Click-through Rate', 'Conversion Rate');
        break;
      case 'ad':
        kpis.push('Click-through Rate', 'Conversion Rate', 'Cost per Acquisition');
        break;
      default:
        kpis.push('Engagement', 'Reach', 'Conversions');
    }
    
    return kpis;
  }
  
  private static getSuccessCriteria(contentType?: string) {
    switch (contentType) {
      case 'social':
        return ['High engagement rate', 'Positive sentiment', 'Increased followers'];
      case 'article':
        return ['High page views', 'Low bounce rate', 'Social sharing'];
      case 'email':
        return ['Above-average open rate', 'High click-through rate', 'Low unsubscribe rate'];
      case 'ad':
        return ['Cost-effective CPA', 'High conversion rate', 'Positive ROI'];
      default:
        return ['Meets objectives', 'Positive audience response', 'Brand alignment'];
    }
  }
  
  private static getEngagementBenchmark(platform?: string) {
    switch (platform?.toLowerCase()) {
      case 'instagram': return 1.22;
      case 'facebook': return 0.09;
      case 'twitter': return 0.045;
      case 'linkedin': return 0.54;
      default: return 1.0;
    }
  }
  
  private static getReachBenchmark(platform?: string) {
    switch (platform?.toLowerCase()) {
      case 'instagram': return 23.2;
      case 'facebook': return 5.2;
      case 'twitter': return 8.8;
      case 'linkedin': return 2.1;
      default: return 10.0;
    }
  }
  
  private static getConversionBenchmark(contentType?: string) {
    switch (contentType) {
      case 'ad': return 2.35;
      case 'email': return 18.0;
      case 'social': return 0.9;
      case 'article': return 2.9;
      default: return 2.0;
    }
  }
  
  private static calculateConfidenceScore(inputs: any) {
    let score = 0.5; // Base confidence
    
    if (inputs.audience) score += 0.15;
    if (inputs.platform) score += 0.1;
    if (inputs.tone) score += 0.1;
    if (inputs.prompt && inputs.prompt.length > 50) score += 0.15;
    
    return Math.min(score, 1.0);
  }
}

// Utility functions for profile analysis
export const ProfileAnalyzer = {
  analyzeProfileCompleteness(profile: ContentContextProfile): {
    score: number;
    missingFields: string[];
    recommendations: string[];
  } {
    const missingFields: string[] = [];
    const recommendations: string[] = [];
    let score = 0;
    
    // Check critical fields
    if (!profile.audience.primary.demographics.ageRange) {
      missingFields.push('Age Range');
      recommendations.push('Define target age demographics for better content tailoring');
    } else score += 0.15;
    
    if (profile.audience.primary.psychographics.interests.length === 0) {
      missingFields.push('Audience Interests');
      recommendations.push('Add audience interests to create more relevant content');
    } else score += 0.15;
    
    if (profile.strategy.objectives.length === 0) {
      missingFields.push('Content Objectives');
      recommendations.push('Define clear content objectives for better strategy alignment');
    } else score += 0.20;
    
    if (!profile.platformContext.platform || profile.platformContext.platform === 'Multi-platform') {
      missingFields.push('Specific Platform');
      recommendations.push('Choose specific platform for optimized content formatting');
    } else score += 0.15;
    
    if (profile.brand.voice.tone === 'Professional yet approachable') {
      recommendations.push('Customize brand voice to be more specific to your unique brand');
    } else score += 0.10;
    
    if (profile.audience.primary.psychographics.painPoints.length === 0) {
      missingFields.push('Audience Pain Points');
      recommendations.push('Identify audience pain points for more targeted messaging');
    } else score += 0.15;
    
    score += 0.10; // Base completeness
    
    return {
      score: Math.min(score, 1.0),
      missingFields,
      recommendations
    };
  },
  
  generateContentRecommendations(profile: ContentContextProfile): string[] {
    const recommendations: string[] = [];
    
    // Platform-specific recommendations
    if (profile.platformContext.platform === 'instagram') {
      recommendations.push('Include high-quality visuals and use up to 30 relevant hashtags');
      recommendations.push('Consider Instagram Stories for behind-the-scenes content');
    }
    
    if (profile.platformContext.platform === 'linkedin') {
      recommendations.push('Focus on professional value and industry insights');
      recommendations.push('Use native video for higher engagement');
    }
    
    // Audience-based recommendations
    if (profile.audience.primary.psychographics.interests.includes('Technology')) {
      recommendations.push('Include latest tech trends and innovations in your content');
    }
    
    if (profile.audience.primary.behaviorPatterns.contentConsumption.includes('Video Preferred')) {
      recommendations.push('Consider creating video content or adding video elements');
    }
    
    // Strategy-based recommendations
    if (profile.strategy.objectives.includes('Education')) {
      recommendations.push('Include how-to elements, tips, and educational value');
    }
    
    if (profile.strategy.objectives.includes('Lead Generation')) {
      recommendations.push('Include clear call-to-action and lead capture elements');
    }
    
    return recommendations;
  }
};
