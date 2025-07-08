import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Globe, 
  Wifi, 
  Wallet, 
  Mic, 
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  User,
  Shield,
  Zap
} from "lucide-react";
import { FaGoogle, FaFacebook, FaApple } from "react-icons/fa";

export default function Landing() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'login'>('welcome');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Redirect to Replit Auth
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 1000);
  };

  const WelcomeScreen = () => (
    <div className="min-h-screen bg-white">
      {/* Hero Zone - Bold Blue Background */}
      <div className="bg-grova-blue text-white">
        {/* Status Bar */}
        <div className="text-white text-xs px-6 py-2 flex justify-between items-center opacity-90">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span>Online</span>
          </span>
          <span>9:41 AM</span>
          <span className="flex items-center gap-1">
            <div className="w-4 h-2 bg-white rounded-sm"></div>
            <Wifi className="w-3 h-3" />
          </span>
        </div>

        {/* Header */}
        <header className="px-6 py-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-white text-3xl font-black tracking-tight" style={{ fontFamily: 'Lufga, sans-serif', fontWeight: 900 }}>Grova</span>
            </div>
          </div>
        </header>

        {/* Welcome Content */}
        <div className="px-6 py-8 pb-12">
          <div className="text-center mb-12">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm neo-floating">
                <Wallet className="w-10 h-10 text-white" />
              </div>
              <span className="text-white text-7xl font-black block mb-4 gradient-text-glow" style={{ fontFamily: 'Lufga, sans-serif', fontWeight: 900 }}>Grova</span>
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px bg-white/30 flex-1 max-w-16"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/80 text-sm font-medium">Next-Gen Finance</span>
                </div>
                <div className="h-px bg-white/30 flex-1 max-w-16"></div>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-2xl text-white leading-relaxed font-semibold">
                Finance without Borders
              </p>
              <p className="text-lg text-white/90 leading-relaxed">
                Revolutionary AI-powered platform for<br />
                developing economies worldwide
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex items-center text-left bg-white/15 p-5 rounded-2xl backdrop-blur-sm border border-white/20 neo-card-interactive">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <Wifi className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">Global Connectivity</div>
                <div className="text-white/80 text-sm">Works offline & online in 50+ countries</div>
              </div>
            </div>
            <div className="flex items-center text-left bg-white/15 p-5 rounded-2xl backdrop-blur-sm border border-white/20 neo-card-interactive">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">Triple Wallet System</div>
                <div className="text-white/80 text-sm">Fiat, Crypto & Community Credits unified</div>
              </div>
            </div>
            <div className="flex items-center text-left bg-white/15 p-5 rounded-2xl backdrop-blur-sm border border-white/20 neo-card-interactive">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">AI Voice Assistant</div>
                <div className="text-white/80 text-sm">Multi-language support with local dialects</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => setCurrentScreen('login')}
              className="w-full bg-gradient-to-r from-white to-gray-100 text-grova-blue py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 neo-button-primary"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 bg-grova-blue/10 rounded-full flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-grova-blue" />
                </div>
                Start Your Journey
              </div>
            </Button>
            <Button 
              onClick={() => setCurrentScreen('login')}
              variant="outline"
              className="w-full border-2 border-white/60 text-white py-4 rounded-2xl font-semibold text-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white transition-all duration-300 neo-glass-button"
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                Sign In
              </div>
            </Button>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <div className="text-white/80 text-xs font-medium">50+ Countries</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-white/80 text-xs font-medium">Bank-Grade Security</div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div className="text-white/80 text-xs font-medium">Instant Transfers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const LoginScreen = () => (
    <div className="min-h-screen bg-white">
      {/* Header with blue background */}
      <div className="bg-grova-blue text-white px-6 py-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setCurrentScreen('welcome')}
            className="text-white mb-0 p-0 hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-3">
            <span className="text-white text-xl font-black" style={{ fontFamily: 'Lufga, sans-serif', fontWeight: 900 }}>Grova</span>
          </div>
          <div className="w-6"></div> {/* Spacer for center alignment */}
        </div>
      </div>

      {/* Login content */}
      <div className="p-6">
        <div className="mb-8 pt-8">
          <h2 className="grova-headline text-3xl font-bold mb-2 text-grova-navy">Welcome back</h2>
          <p className="grova-body text-grova-gray">Sign in to your Grova account</p>
        </div>

      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Phone or Email
          </Label>
          <Input
            type="text"
            className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-grova-blue focus:border-transparent"
            placeholder="+254 700 000 000"
            required
          />
        </div>

        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Password
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-4 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-grova-blue focus:border-transparent"
              placeholder="Enter your password"
              required
            />
            <Button
              type="button"
              variant="ghost"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 h-auto"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <Label htmlFor="remember" className="text-sm text-slate-600">
              Remember me
            </Label>
          </div>
          <a href="#" className="text-sm text-grova-blue font-medium">
            Forgot password?
          </a>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="grova-button-primary bg-grova-blue text-white hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </form>

      <div className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-6">
          <Button 
            variant="outline"
            className="flex justify-center items-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50"
          >
            <FaGoogle className="w-5 h-5 text-red-500" />
          </Button>
          <Button 
            variant="outline"
            className="flex justify-center items-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50"
          >
            <FaFacebook className="w-5 h-5 text-blue-600" />
          </Button>
          <Button 
            variant="outline"
            className="flex justify-center items-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50"
          >
            <FaApple className="w-5 h-5 text-slate-900" />
          </Button>
        </div>
      </div>

      <p className="text-center text-sm text-grova-gray mt-8">
        Don't have an account?{' '}
        <a href="#" className="text-grova-blue font-medium">
          Sign up
        </a>
      </p>
      </div>
    </div>
  );

  // Placeholder for Bluetooth transfer functionality (implementation not provided)
  const BluetoothTransferScreen = () => (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-4">Bluetooth Money Transfer</h2>
      <p>Implementation for peer-to-peer money transfer via Bluetooth will go here.</p>
      {/* Add UI elements for selecting a nearby device, entering amount, and initiating transfer */}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Status Bar */}
      <div className="status-bar text-white text-xs px-4 py-1 flex justify-between items-center">
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Online</span>
        </span>
        <span>9:41 AM</span>
        <span className="flex items-center gap-1">
          <div className="w-4 h-2 bg-white rounded-sm"></div>
          <Wifi className="w-3 h-3" />
        </span>
      </div>

      {currentScreen === 'welcome' ? <WelcomeScreen /> : <LoginScreen />}
    </div>
  );
}