import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus, CheckCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import ContentGenerationDialog from '@/components/ContentGenerationDialog';
import { supabase } from '@/lib/supabaseClient';

interface ContentData {
  id: string;
  date: Date;
  title: string;
  type: string;
  status: 'draft' | 'ready' | 'published';
  content?: string;
}

interface CalendarProps {
  contentData?: ContentData[];
  onContentGenerated?: (content: any[]) => void;
}

const Calendar = ({ contentData = [], onContentGenerated }: CalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<ContentData[]>(contentData || []);
  const navigate = useNavigate();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const startCalendar = new Date(monthStart);
  startCalendar.setDate(startCalendar.getDate() - monthStart.getDay());
  
  const endCalendar = new Date(monthEnd);
  endCalendar.setDate(endCalendar.getDate() + (6 - monthEnd.getDay()));
  
  const calendarDays = eachDayOfInterval({ start: startCalendar, end: endCalendar });

  // Keep local prop in sync
  useEffect(() => {
    setEvents(contentData || []);
  }, [contentData]);

  // Fetch calendar events from Supabase for the visible grid range when session exists
  useEffect(() => {
    const hasSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
    if (!hasSupabase) return;

    let cancelled = false;
    const fetchEvents = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session) return;

        // Compute the visible range (same as grid)
        const startCal = new Date(startOfMonth(currentDate));
        startCal.setDate(startCal.getDate() - startCal.getDay());
        const endCal = new Date(endOfMonth(currentDate));
        endCal.setDate(endCal.getDate() + (6 - endCal.getDay()));

        const { data, error } = await supabase
          .from('calendar_events')
          .select('*')
          .gte('date', format(startCal, 'yyyy-MM-dd'))
          .lte('date', format(endCal, 'yyyy-MM-dd'))
          .order('date', { ascending: true });

        if (error) throw error;
        if (cancelled) return;

        const mapped: ContentData[] = (data || []).map((row: any) => ({
          id: row.id,
          date: new Date(row.date),
          title: row.title || 'Untitled',
          type: row.content_type || 'post',
          status: (['draft', 'ready', 'published'] as const).includes(row.status) ? row.status : 'draft',
          content: row.metadata?.content || undefined,
        }));

        setEvents(mapped);
      } catch (e) {
        console.warn('[Calendar] Supabase fetch failed:', e);
      }
    };

    fetchEvents();
    return () => { cancelled = true; };
  }, [currentDate]);

  const getContentForDay = (date: Date) => {
    return events.filter(content => isSameDay(content.date, date));
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDayClick = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    navigate(`/day/${formattedDate}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Calendar Header */}
      <Card className="mb-6 bg-gradient-hero border-card-border shadow-card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Content Calendar
            </h1>
            <div className="flex items-center justify-between gap-4">
            <ContentGenerationDialog
              trigger={
                <Button className="bg-gradient-primary hover:bg-gradient-primary/90">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </Button>
              }
              onContentGenerated={onContentGenerated || (() => {})}
            />
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousMonth}
                  className="hover:bg-secondary-hover"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-xl font-semibold min-w-[200px] text-center">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextMonth}
                  className="hover:bg-secondary-hover"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Calendar Grid */}
      <Card className="shadow-calendar border-card-border overflow-hidden">
        <div className="bg-gradient-calendar">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 border-b border-card-border bg-primary-muted">
            {weekDays.map((day) => (
              <div key={day} className="p-4 text-center font-semibold text-primary">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {calendarDays.map((date, index) => {
              const dayContent = getContentForDay(date);
              const isCurrentMonth = isSameMonth(date, currentDate);
              const isTodayDate = isToday(date);
              const hasContent = dayContent.length > 0;

              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[120px] p-3 border-r border-b border-card-border cursor-pointer transition-all duration-300 hover:bg-accent hover:shadow-card",
                    !isCurrentMonth && "bg-muted text-muted-foreground",
                    isTodayDate && "bg-calendar-today/20 border-calendar-today ring-1 ring-calendar-today",
                    hasContent && "bg-calendar-content/10"
                  )}
                  onClick={() => handleDayClick(date)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isTodayDate && "bg-calendar-today text-calendar-today-foreground px-2 py-1 rounded-full",
                        !isCurrentMonth && "text-muted-foreground"
                      )}
                    >
                      {format(date, 'd')}
                    </span>
                    {!hasContent && isCurrentMonth && (
                      <Plus className="h-4 w-4 text-muted-foreground opacity-50 hover:opacity-100 transition-opacity" />
                    )}
                  </div>

                  {/* Content Preview */}
                  <div className="space-y-1">
                    {dayContent.slice(0, 2).map((content) => (
                      <div
                        key={content.id}
                        className={cn(
                          "text-xs p-2 rounded-md transition-colors",
                          content.status === 'published' && "bg-calendar-content text-calendar-content-foreground",
                          content.status === 'ready' && "bg-calendar-today text-calendar-today-foreground",
                          content.status === 'draft' && "bg-calendar-empty text-calendar-empty-foreground"
                        )}
                      >
                        <div className="flex items-center gap-1">
                          {content.status === 'published' && <CheckCircle className="h-3 w-3" />}
                          <span className="truncate font-medium">{content.title}</span>
                        </div>
                        <div className="text-xs opacity-75 capitalize">{content.type}</div>
                      </div>
                    ))}
                    {dayContent.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center py-1">
                        +{dayContent.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Calendar;