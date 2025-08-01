import { useParams } from 'react-router-dom';
import { parse } from 'date-fns';
import DailyContentView from '@/components/DailyContentView';

// Mock data for demonstration
const mockContent = [
  {
    id: '1',
    title: 'Product Launch Announcement',
    content: 'Exciting news! We are thrilled to announce the launch of our latest innovation. This groundbreaking product represents months of research and development.',
    type: 'post' as const,
    status: 'ready' as const,
    platform: ['Instagram', 'LinkedIn'],
    tags: ['product', 'launch', 'innovation'],
    alignmentScore: 85,
    feedback: [
      'Tone matches brand guidelines perfectly',
      'Strong call-to-action present',
      'Consider adding user testimonial for credibility'
    ]
  },
  {
    id: '2',
    title: 'Behind the Scenes Story',
    content: 'Take a peek behind the curtain! Our team has been working around the clock to bring you something special.',
    type: 'story' as const,
    status: 'draft' as const,
    platform: ['Instagram Stories', 'TikTok'],
    tags: ['behind-the-scenes', 'team', 'process']
  },
  {
    id: '3',
    title: 'Weekly Tutorial Video',
    content: 'This week we are exploring advanced techniques that will transform your workflow. Join us for an in-depth tutorial.',
    type: 'video' as const,
    status: 'published' as const,
    platform: ['YouTube', 'LinkedIn'],
    tags: ['tutorial', 'education', 'tips']
  }
];

const DayView = () => {
  const { date } = useParams<{ date: string }>();
  
  if (!date) {
    return <div>Invalid date</div>;
  }

  const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
  
  // In a real app, you would filter content based on the selected date
  const dayContent = mockContent;

  return <DailyContentView date={parsedDate} content={dayContent} />;
};

export default DayView;