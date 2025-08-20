import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { getUserBoards, createBoard, Board } from '@/lib/userDataService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Calendar, FileText, Image } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { toast } from 'sonner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/auth');
          return;
        }
        
        // Check if user has completed strategy
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('strategy_completed')
          .eq('id', session.user.id)
          .single();
        
        if (userError) throw userError;
        
        if (!userData.strategy_completed) {
          // Redirect to onboarding if strategy is not completed
          navigate('/onboarding');
          return;
        }
        
        setUser(session.user);
        const userBoards = await getUserBoards(session.user.id);
        setBoards(userBoards);
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load dashboard data');
        navigate('/onboarding');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/auth');
      } else {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleCreateBoard = async () => {
    if (!user) return;
    
    try {
      const newBoard = await createBoard({
        user_id: user.id,
        title: 'My New Board',
        description: 'A fresh content board'
      });
      
      setBoards([newBoard, ...boards]);
      toast.success('Board created successfully');
      navigate(`/board/${newBoard.id}`);
    } catch (error) {
      console.error('Error creating board:', error);
      toast.error('Failed to create board');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name.split(' ')[0]}` : ''}!</h1>
            <p className="text-muted-foreground mt-2">Here's what's happening with your content today.</p>
          </div>
          <Button onClick={handleCreateBoard} className="bg-primary hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Board
          </Button>
        </div>

        {boards.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary-muted flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No boards yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Get started by creating your first content board to organize and plan your content strategy.
            </p>
            <Button onClick={handleCreateBoard} size="lg" className="bg-primary hover:bg-primary/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create your first board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board) => (
              <Card 
                key={board.id} 
                className="bg-card border-border hover:shadow-card transition-all cursor-pointer"
                onClick={() => navigate(`/board/${board.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-muted flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    {board.title}
                  </CardTitle>
                  <CardDescription>{board.description || 'No description'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(board.created_at).toLocaleDateString()}
                    </span>
                    <span className={board.is_active ? 'text-green-600' : 'text-muted-foreground'}>
                      {board.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card 
              className="bg-card border-2 border-dashed border-border hover:border-primary hover:shadow-card transition-all cursor-pointer flex flex-col items-center justify-center text-center p-8"
              onClick={handleCreateBoard}
            >
              <PlusCircle className="h-10 w-10 text-muted-foreground mb-3" />
              <CardTitle className="text-lg text-foreground mb-1">New Board</CardTitle>
              <CardDescription>Create a new content board</CardDescription>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;