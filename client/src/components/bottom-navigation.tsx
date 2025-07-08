import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  QrCode, 
  TrendingUp, 
  UserCheck, 
  MoreHorizontal 
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
      path: '/qr-payments', 
      icon: QrCode, 
      label: 'QR Pay',
      key: 'qr-payments'
    },
    { 
      path: '/investments', 
      icon: TrendingUp, 
      label: 'Invest',
      key: 'investments'
    },
    { 
      path: '/advisors', 
      icon: UserCheck, 
      label: 'Advisors',
      key: 'advisors'
    },
    { 
      path: '/more', 
      icon: MoreHorizontal, 
      label: 'More',
      key: 'more'
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
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-30">
      <div className="neo-card m-0 p-0" style={{ borderRadius: '24px 24px 0 0', padding: '8px' }}>
        <div className="grid grid-cols-5 gap-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.key);

            return (
              <Link key={item.key} href={item.path}>
                <Button
                  variant="ghost"
                  className={`neo-nav-smooth flex flex-col items-center py-3 px-2 rounded-xl h-auto border-none transition-all duration-300 ${
                    active 
                      ? 'active neo-button-primary text-white shadow-lg' 
                      : 'text-slate-500 hover:text-[hsl(207,90%,54%)] neo-nav-item'
                  }`}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <div className={active ? 'neo-icon-container' : ''}>
                    <Icon className={`w-5 h-5 mb-1 transition-all duration-300 ${active ? 'animate-pulse' : ''}`} />
                  </div>
                  <span className={`text-xs font-medium transition-all duration-300 ${active ? 'font-bold' : ''}`}>
                    {item.label}
                  </span>
                  {active && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-[hsl(25,85%,53%)] rounded-full animate-bounce"></div>
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}