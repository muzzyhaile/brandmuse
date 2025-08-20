import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentPromptEntry from '@/components/ContentPromptEntry';
import Navigation from '@/components/Navigation';
import { supabase } from '@/lib/supabaseClient';
import { addDays, subDays } from 'date-fns';

// Mock content data for demonstration
const mockContentData = [
  {
    id: '1',
    date: new Date(),
    title: 'Product Launch Post',
    type: 'post' as const,
    status: 'ready' as const,
    content: 'Exciting product launch announcement'
  },
  {
    id: '2',
    date: addDays(new Date(), 1),
    title: 'Behind the Scenes Story',
    type: 'story' as const,
    status: 'draft' as const,
    content: 'Team working on new features'
  },
  {
    id: '3',
    date: addDays(new Date(), 3),
    title: 'Weekly Tutorial',
    type: 'video' as const,
    status: 'published' as const,
    content: 'How to maximize your workflow'
  },
  {
    id: '4',
    date: subDays(new Date(), 2),
    title: 'Industry Insights',
    type: 'article' as const,
    status: 'published' as const,
    content: 'Latest trends in content marketing'
  },
  {
    id: '5',
    date: addDays(new Date(), 5),
    title: 'Community Highlight',
    type: 'post' as const,
    status: 'draft' as const,
    content: 'Featuring our amazing community members'
  }
];

const Index = () => {
  const navigate = useNavigate();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [contentData, setContentData] = useState(mockContentData);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // If user is authenticated, redirect to dashboard
        navigate('/dashboard');
        return;
      }
      
      // Check if user has completed onboarding
      const onboardingComplete = localStorage.getItem('onboardingComplete');
      if (!onboardingComplete) {
        // Temporarily bypass onboarding for development
        // navigate('/onboarding');
        console.log('Onboarding not complete, but bypassing for development');
        setIsOnboardingComplete(true);
      } else {
        setIsOnboardingComplete(true);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleContentGenerated = (newContent: any[]) => {
    setContentData(prev => [...prev, ...newContent]);
  };

  if (!isOnboardingComplete) {
    return null; // Will redirect to onboarding
  }

  return (
    <>
      <Navigation />
      <ContentPromptEntry />
    </>
  );
};

export default Index;
