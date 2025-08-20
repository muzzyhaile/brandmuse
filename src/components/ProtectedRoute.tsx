import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/auth');
          return;
        }
        
        // Check if user has completed strategy
        const { data: userData, error } = await supabase
          .from('users')
          .select('strategy_completed')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error('Database error:', error);
          // If there's a database error, redirect to onboarding
          navigate('/onboarding');
          return;
        }
        
        // If user doesn't exist in users table, create them and redirect to onboarding
        if (!userData) {
          try {
            await supabase
              .from('users')
              .insert({
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || null,
                avatar_url: session.user.user_metadata?.avatar_url || null,
                onboarded: false,
                strategy_completed: false
              });
          } catch (insertError) {
            console.error('Error creating user profile:', insertError);
          }
          navigate('/onboarding');
          return;
        }
        
        if (userData.strategy_completed) {
          setIsAuthorized(true);
        } else {
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Error checking authorization:', error);
        navigate('/onboarding');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
};

export default ProtectedRoute;