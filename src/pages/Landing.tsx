import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Calendar, FileText, Image, BarChart3, Check } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const Landing = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // If user is authenticated, redirect to dashboard
        navigate('/dashboard');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Create on-brand content in seconds with our intelligent content generation engine."
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Plan and schedule your content across all platforms with our intuitive calendar."
    },
    {
      icon: FileText,
      title: "Content Strategy",
      description: "Build comprehensive content strategies with our guided blueprint system."
    },
    {
      icon: Image,
      title: "Visual Assets",
      description: "Generate on-brand visual content and manage your asset library."
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Track and optimize your content performance with detailed analytics."
    }
  ];

  const benefits = [
    "Create content 10x faster with AI assistance",
    "Maintain perfect brand consistency across all channels",
    "Collaborate seamlessly with your team",
    "Scale your content output without increasing headcount",
    "Measure ROI with detailed analytics"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/landing" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <span className="text-xl font-bold text-primary-foreground">CM</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Contentmix<span className="text-primary">.ai</span>
          </span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link to="/generate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Product</Link>
          <Link to="/calendar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Solutions</Link>
          <Link to="/auth">
            <Button size="sm" variant="outline" className="border-border text-foreground hover:bg-muted">
              Sign in
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <section className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-muted border border-border mb-6">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="text-sm text-primary-foreground">AI Marketing for Businesses & Agencies</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            AI Marketing<br />
            <span className="text-primary">for Businesses and Agencies</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Get paying customers through proven digital marketing strategies. Perfect for companies ready
            to scale their customer acquisition.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl">
                Get started free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/generate">
              <Button size="lg" variant="outline" className="bg-card text-card-foreground border-border hover:bg-muted px-8 py-6 text-lg rounded-xl">
                See demo
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            No credit card required. Start creating in seconds.
          </p>
        </section>

        {/* Showcase panel */}
        <section className="mt-24 rounded-2xl border border-border bg-card p-8 md:p-12 shadow-card">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Everything you need for content success
            </h2>
            <p className="text-lg text-muted-foreground">
              From strategy to execution, Contentmix.ai streamlines your entire content workflow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight mb-4">Your marketing, orchestrated</h3>
              <p className="text-muted-foreground mb-6">
                Build your brand blueprint, define content pillars, map your platform strategy, and
                generate on-brand assets — all in one fluid workflow.
              </p>
              <ul className="space-y-3 text-muted-foreground mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 w-5 h-5 rounded-full bg-primary-muted flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>
              <Link to="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Start your strategy
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="rounded-xl bg-gradient-hero border border-border aspect-video flex items-center justify-center">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-xl bg-primary-muted flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h4 className="font-semibold text-lg mb-2">Content Dashboard Preview</h4>
                <p className="text-muted-foreground text-sm">Interactive content planning and generation interface</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mt-24">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Powerful features for modern marketers
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to create, manage, and optimize your content strategy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="rounded-xl border border-border bg-card p-6 hover:shadow-card transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-muted flex items-center justify-center mb-4 group-hover:bg-accent">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Testimonial */}
        <section className="mt-24 rounded-2xl border border-border bg-card p-8 md:p-12 shadow-card">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 text-calendar-today" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-2xl font-medium mb-6 text-foreground">
              "Contentmix.ai has transformed how we create and manage content. We've reduced our content creation time by 70% while improving consistency and engagement across all our channels."
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="font-bold text-primary-foreground">SJ</span>
              </div>
              <div className="text-left">
                <p className="font-semibold">Sarah Johnson</p>
                <p className="text-muted-foreground">Head of Marketing, TechInnovate</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-24 rounded-2xl border border-border bg-gradient-hero p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            Ready to transform your content workflow?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of marketers who use Contentmix.ai to plan, create, and schedule their content.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl">
              Start your free trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Free 14-day trial. No credit card required.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 pb-12 text-center text-muted-foreground text-sm">
        © {new Date().getFullYear()} Contentmix.ai — Crafted with care
      </footer>
    </div>
  );
};

export default Landing;