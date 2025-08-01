import { Calendar, FileText, Settings, Download, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      name: 'Calendar',
      icon: Calendar,
      path: '/',
      description: 'View content calendar'
    },
    {
      name: 'Brand Setup',
      icon: Settings,
      path: '/onboarding',
      description: 'Edit brand guidelines'
    },
    {
      name: 'Swipe File',
      icon: Library,
      path: '/swipe-file',
      description: 'Content templates'
    },
    {
      name: 'Export',
      icon: Download,
      path: '/export',
      description: 'Export to Google Sheets'
    }
  ];

  return (
    <nav className="bg-gradient-nav border-b border-card-border shadow-navigation">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              ContentFlow
            </h1>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-200",
                    isActive && "bg-primary text-primary-foreground shadow-primary",
                    !isActive && "hover:bg-secondary text-secondary-foreground hover:shadow-card"
                  )}
                  title={item.description}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;