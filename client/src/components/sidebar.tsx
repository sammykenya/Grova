import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { 
  X,
  User,
  Shield,
  Bell,
  Globe,
  HelpCircle,
  FileText,
  LogOut,
  Settings
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const menuItems = [
    { icon: User, label: 'Profile Settings', href: '#' },
    { icon: Shield, label: 'Security', href: '#' },
    { icon: Bell, label: 'Notifications', href: '#' },
    { icon: Globe, label: 'Language', href: '#' },
    { icon: Settings, label: 'Preferences', href: '#' },
    { icon: HelpCircle, label: 'Help & Support', href: '#' },
    { icon: FileText, label: 'Terms & Privacy', href: '#' },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-80 max-w-sm bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={user?.profileImageUrl} />
                <AvatarFallback>
                  {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email || 'User'
                  }
                </h3>
                <p className="text-sm text-slate-500">
                  {user?.email || 'No email'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-slate-500 p-0"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-3 rounded-lg hover:bg-slate-100 text-left"
                    onClick={onClose}
                  >
                    <Icon className="w-5 h-5 mr-3 text-[hsl(207,90%,54%)]" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          <Separator className="my-4" />

          {/* Logout Button */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start p-3 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span>Sign Out</span>
          </Button>

          {/* App Info */}
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="text-center text-xs text-slate-500">
              <p className="font-medium">UniFi</p>
              <p>Finance without Borders</p>
              <p className="mt-1">Version 1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
