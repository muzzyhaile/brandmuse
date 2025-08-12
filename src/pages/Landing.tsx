import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/landing" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <span className="text-lg font-bold">CM</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">Contentmix.ai</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link to="/generate" className="text-sm text-white/70 hover:text-white transition-colors">App</Link>
          <Link to="/calendar" className="text-sm text-white/70 hover:text-white transition-colors">Calendar</Link>
          <Link to="/auth">
            <Button size="sm" className="bg-white text-black hover:bg-white/90">Sign in</Button>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 pt-10 pb-24">
        <section className="text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.05]">
            Strategy to content.
            <br />
            Beautifully simple.
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
            Plan, generate, and schedule on-brand content with a system that feels effortless.
            Crafted with precision. Inspired by what’s next.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-black hover:bg-white/90">Get started</Button>
            </Link>
            <Link to="/generate">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white/20 hover:bg-white/10">Explore the app</Button>
            </Link>
          </div>
        </section>

        {/* Showcase panel */}
        <section className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 md:p-10 backdrop-blur-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Your marketing, orchestrated</h2>
              <p className="mt-3 text-white/70">
                Build your brand blueprint, define content pillars, map your platform strategy, and
                generate on-brand assets — all in one fluid workflow.
              </p>
              <ul className="mt-6 space-y-2 text-white/80">
                <li>• Brand Blueprint, Pillars, Platform Strategy, Competitor Analysis</li>
                <li>• Calendar with day view, ideas, and swipe file templates</li>
                <li>• On-brand generators and export to Google Sheets</li>
              </ul>
              <div className="mt-6">
                <Link to="/onboarding">
                  <Button variant="secondary" className="bg-white/90 text-black hover:bg-white">Start a strategy</Button>
                </Link>
              </div>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-white/15 to-white/5 border border-white/10 aspect-[16/10]"/>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 pb-12 text-center text-white/50 text-sm">
        © {new Date().getFullYear()} Contentmix.ai — Crafted with care
      </footer>
    </div>
  );
};

export default Landing;
