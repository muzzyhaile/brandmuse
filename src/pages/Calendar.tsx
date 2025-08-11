import Navigation from '@/components/Navigation';
import Calendar from '@/components/Calendar';
import MarketingRoadmap from '@/components/MarketingRoadmap';

const CalendarPage = () => {
  return (
    <>
      <Navigation />
      <div className="w-full max-w-5xl mx-auto p-6 mb-6">
        <MarketingRoadmap />
      </div>
      <Calendar />
    </>
  );
};

export default CalendarPage;
