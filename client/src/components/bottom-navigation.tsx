import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Bot, 
  Users, 
  MapPin, 
  User 
} from "lucide-react";

interface BottomNavigationProps {
  currentPage?: string;
}

export default function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [location] = useLocation();

  const navItems = [
    { 
      path: '/', 
      icon: Home, 
      label: 'Home',
      key: 'home'
    },
    { 
      path: '/ai-coach', 
      icon: Bot, 
      label: 'AI Coach',
      key: 'ai-coach'
    },
    { 
      path: '/community', 
      icon: Users, 
      label: 'Community',
      key: 'community'
    },
    { 
      path: '/agents', 
      icon: MapPin, 
      label: 'Agents',
      key: 'agents'
    },
    { 
      path: '#', 
      icon: User, 
      label: 'Profile',
      key: 'profile'
    },
  ];

  const isActive = (path: string, key: string) => {
    if (currentPage) {
      return currentPage === key;
    }
    if (path === '/') {
      return location === '/';
    }
    return location.startsWith(path) && path !== '/';
  };

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 z-30">
      <div className="grid grid-cols-5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.key);
          
          return (
            <Link key={item.key} href={item.path}>
              <Button
                variant="ghost"
                className={`nav-item flex flex-col items-center py-3 px-2 rounded-none h-auto ${
                  active 
                    ? 'text-[hsl(207,90%,54%)] border-t-2 border-[hsl(207,90%,54%)]' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
