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
