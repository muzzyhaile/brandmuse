import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { getBoardContent, updateBoard, deleteBoard, Content, createContent } from '@/lib/userDataService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash2, FileText, Image, Video } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { toast } from 'sonner';

interface Board {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  title: string;
  description: string | null;
  is_active: boolean;
}

const BoardDetail = () => {
  const { id: boardId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board | null>(null);
  const [contentItems, setContentItems] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBoard, setEditingBoard] = useState(false);
  const [boardTitle, setBoardTitle] = useState('');
  const [boardDescription, setBoardDescription] = useState('');
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    content_type: 'post',
    status: 'draft'
  });
  const [isCreatingContent, setIsCreatingContent] = useState(false);

  useEffect(() => {
    const fetchBoardData = async () => {
      if (!boardId) return;
      
      try {
        // Check if user has completed strategy
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/auth');
          return;
        }
        
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('strategy_completed')
          .eq('id', session.user.id)
          .single();
        
        if (userError) throw userError;
        
        if (!userData.strategy_completed) {
          toast.error('Please complete your strategy first');
          navigate('/onboarding');
          return;
        }
        
        // Fetch board details
        const { data: boardData, error: boardError } = await supabase
          .from('boards')
          .select('*')
          .eq('id', boardId)
          .single();
          
        if (boardError) throw boardError;
        
        setBoard(boardData);
        setBoardTitle(boardData.title);
        setBoardDescription(boardData.description || '');
        
        // Fetch content items
        const contentData = await getBoardContent(boardId);
        setContentItems(contentData);
      } catch (error) {
        console.error('Error fetching board data:', error);
        toast.error('Failed to load board data');
      } finally {
        setLoading(false);
      }
    };

    fetchBoardData();
  }, [boardId, navigate]);

  const handleUpdateBoard = async () => {
    if (!board) return;
    
    try {
      const updatedBoard = await updateBoard(board.id, {
        title: boardTitle,
        description: boardDescription
      });
      
      setBoard(updatedBoard);
      setEditingBoard(false);
      toast.success('Board updated successfully');
    } catch (error) {
      console.error('Error updating board:', error);
      toast.error('Failed to update board');
    }
  };

  const handleDeleteBoard = async () => {
    if (!board) return;
    
    if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      try {
        await deleteBoard(board.id);
        toast.success('Board deleted successfully');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error deleting board:', error);
        toast.error('Failed to delete board');
      }
    }
  };

  const handleCreateContent = async () => {
    if (!boardId) return;
    
    try {
      const content = await createContent({
        board_id: boardId,
        title: newContent.title,
        description: newContent.description,
        content_type: newContent.content_type,
        status: newContent.status
      });
      
      setContentItems([content, ...contentItems]);
      setNewContent({
        title: '',
        description: '',
        content_type: 'post',
        status: 'draft'
      });
      setIsCreatingContent(false);
      toast.success('Content created successfully');
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Failed to create content');
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'post': return <FileText className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading board...</p>
        </div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Board not found</h1>
          <p className="text-muted-foreground mb-6">The board you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          {editingBoard ? (
            <div className="flex-1 mr-4">
              <Input
                value={boardTitle}
                onChange={(e) => setBoardTitle(e.target.value)}
                className="text-3xl font-bold text-foreground mb-2"
              />
              <Textarea
                value={boardDescription}
                onChange={(e) => setBoardDescription(e.target.value)}
                placeholder="Board description"
                className="text-muted-foreground"
              />
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold text-foreground">{board.title}</h1>
              <p className="text-muted-foreground mt-2">{board.description || 'No description'}</p>
            </div>
          )}
          
          <div className="flex gap-2">
            {editingBoard ? (
              <>
                <Button variant="outline" onClick={() => setEditingBoard(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateBoard}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setEditingBoard(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" onClick={handleDeleteBoard}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Content Items</h2>
          <Dialog open={isCreatingContent} onOpenChange={setIsCreatingContent}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Content</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newContent.title}
                    onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                    placeholder="Content title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newContent.description}
                    onChange={(e) => setNewContent({...newContent, description: e.target.value})}
                    placeholder="Content description"
                  />
                </div>
                <div>
                  <Label htmlFor="content_type">Content Type</Label>
                  <Select value={newContent.content_type} onValueChange={(value) => setNewContent({...newContent, content_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="post">Post</SelectItem>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newContent.status} onValueChange={(value) => setNewContent({...newContent, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateContent}>Create Content</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {contentItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-primary-muted flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">No content yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Get started by adding your first content item to this board.
            </p>
            <Button onClick={() => setIsCreatingContent(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add your first content
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentItems.map((item) => (
              <Card key={item.id} className="bg-card border-border hover:shadow-card transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-muted flex items-center justify-center">
                      {getContentIcon(item.content_type || 'post')}
                    </div>
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.description || 'No description'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BoardDetail;