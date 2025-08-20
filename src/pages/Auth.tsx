import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, CheckCircle } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'signin' | 'signup'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        toast.success('Signed in successfully');
        // Check if user has completed strategy
        try {
          const { data: userData, error } = await supabase
            .from('users')
            .select('strategy_completed')
            .eq('id', session.user.id)
            .single();
          
          if (error) throw error;
          
          if (userData.strategy_completed) {
            // Redirect to dashboard if strategy is completed
            navigate('/dashboard');
          } else {
            // Redirect to onboarding if strategy is not completed
            navigate('/onboarding');
          }
        } catch (err) {
          console.error('Error checking strategy completion:', err);
          // Default to onboarding if there's an error
          navigate('/onboarding');
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full space-y-4 text-center">
          <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Supabase not configured</h1>
          <p className="text-muted-foreground">
            Please set <code className="bg-muted px-1.5 py-0.5 rounded">VITE_SUPABASE_URL</code> and <code className="bg-muted px-1.5 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> in your <code className="bg-muted px-1.5 py-0.5 rounded">.env</code> file.
          </p>
          <Button onClick={() => navigate('/landing')} className="bg-primary hover:bg-primary/90">
            Back to landing
          </Button>
        </div>
      </div>
    );
  }

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdprConsent) {
      toast.error('Please consent to the privacy policy and terms to continue');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`
        }
      });
      if (error) throw error;
      setShowConfirmation(true);
    } catch (err: any) {
      toast.error(err.message ?? 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session) {
        toast.success('Welcome back');
        navigate('/index');
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  // Confirmation screen for email verification
  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/landing" className="inline-flex items-center gap-2 mx-auto">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">CM</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Contentmix<span className="text-primary">.ai</span>
              </span>
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-card p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-calendar-content">
              <CheckCircle className="h-8 w-8 text-calendar-content-foreground" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-foreground">Check your email</h2>
            <p className="mt-2 text-muted-foreground">
              We've sent a confirmation link to <span className="font-semibold">{email}</span>. 
              Please click the link to verify your email address and complete your registration.
            </p>
            <div className="mt-6">
              <Button 
                onClick={() => setShowConfirmation(false)}
                className="bg-primary hover:bg-primary/90"
              >
                Back to sign in
              </Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or{' '}
              <button 
                onClick={() => setShowConfirmation(false)}
                className="font-medium text-primary hover:text-primary/90"
              >
                try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/landing" className="inline-flex items-center gap-2 mx-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <span className="text-xl font-bold text-primary-foreground">CM</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              Contentmix<span className="text-primary">.ai</span>
            </span>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight mt-6 text-foreground">
            {tab === 'signin' ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {tab === 'signin' 
              ? 'Sign in to your account to continue' 
              : 'Get started with your free account'}
          </p>
        </div>

        {/* Auth Form */}
        <div className="rounded-2xl border border-border bg-card shadow-card p-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as 'signin' | 'signup')} className="w-full">
            <TabsList className="grid grid-cols-2 w-full bg-muted p-1 rounded-lg h-10">
              <TabsTrigger 
                value="signup" 
                className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-md text-sm"
              >
                Sign up
              </TabsTrigger>
              <TabsTrigger 
                value="signin" 
                className="data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-md text-sm"
              >
                Sign in
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signup" className="mt-6">
              <form onSubmit={signUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="flex items-center gap-2 text-foreground">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="you@example.com"
                    className="py-5 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="flex items-center gap-2 text-foreground">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input 
                      id="signup-password" 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      placeholder="••••••••"
                      className="py-5 pr-12 border-border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Use 8 or more characters with a mix of letters, numbers & symbols
                  </p>
                </div>
                
                <div className="flex items-start space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="gdpr-consent"
                    checked={gdprConsent}
                    onChange={(e) => setGdprConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <Label htmlFor="gdpr-consent" className="text-sm text-foreground">
                    I agree to the <Link to="#" className="font-medium text-primary hover:text-primary/90">Terms of Service</Link> and <Link to="#" className="font-medium text-primary hover:text-primary/90">Privacy Policy</Link>, and I consent to the processing of my personal data in accordance with GDPR regulations.
                  </Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-6 bg-primary hover:bg-primary/90" 
                  disabled={loading || !gdprConsent}
                >
                  {loading ? 'Creating account…' : 'Create account'}
                </Button>
              </form>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button
                  type="button"
                  className="font-medium text-primary hover:text-primary/90"
                  onClick={() => setTab('signin')}
                >
                  Sign in
                </button>
              </div>
            </TabsContent>
            
            <TabsContent value="signin" className="mt-6">
              <form onSubmit={signIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="flex items-center gap-2 text-foreground">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input 
                    id="signin-email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    placeholder="you@example.com"
                    className="py-5 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="flex items-center gap-2 text-foreground">
                    <Lock className="h-4 w-4" />
                    Password
                  </Label>
                  <div className="relative">
                    <Input 
                      id="signin-password" 
                      type={showPassword ? "text" : "password"} 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                      placeholder="••••••••"
                      className="py-5 pr-12 border-border"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <Label htmlFor="remember" className="text-sm text-foreground">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    className="text-sm font-medium text-primary hover:text-primary/90"
                    onClick={() => toast.info('Password reset coming soon')}
                  >
                    Forgot password?
                  </button>
                </div>
                <Button 
                  type="submit" 
                  className="w-full py-6 bg-primary hover:bg-primary/90" 
                  disabled={loading}
                >
                  {loading ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
              
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  type="button"
                  className="font-medium text-primary hover:text-primary/90"
                  onClick={() => setTab('signup')}
                >
                  Sign up
                </button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Test Accounts Section - Development Only */}
        <div className="mt-8 p-4 rounded-xl bg-muted border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2">🧪 Test Accounts (Development)</h3>
          <div className="text-xs text-muted-foreground space-y-2">
            <div className="flex flex-col gap-1">
              <p><strong>Account 1 - John Doe:</strong></p>
              <p>Email: <code className="bg-background px-1 py-0.5 rounded">john.doe@test.com</code></p>
              <p>Password: <code className="bg-background px-1 py-0.5 rounded">password123</code></p>
              <p className="text-xs">Has TechStartup Pro brand with Q4 campaign data</p>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex flex-col gap-1">
                <p><strong>Account 2 - Jane Smith:</strong></p>
                <p>Email: <code className="bg-background px-1 py-0.5 rounded">jane.smith@test.com</code></p>
                <p>Password: <code className="bg-background px-1 py-0.5 rounded">password123</code></p>
                <p className="text-xs">Has EcoFriendly Goods brand with sustainability campaigns</p>
              </div>
            </div>
            <div className="border-t border-border pt-2 text-amber-600">
              <p><strong>Setup Required:</strong> Run <code className="bg-background px-1 py-0.5 rounded">test-data.sql</code> in your Supabase SQL editor first!</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setEmail('john.doe@test.com');
                setPassword('password123');
                setTab('signin');
              }}
            >
              Load John's Login
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setEmail('jane.smith@test.com');
                setPassword('password123');
                setTab('signin');
              }}
            >
              Load Jane's Login
            </Button>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{' '}
          <Link to="#" className="underline hover:text-foreground">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="#" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
};

export default Auth;