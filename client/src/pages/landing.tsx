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
  Loader2
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
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-[hsl(207,90%,54%)] to-[hsl(252,83%,57%)] text-white p-8">
      <div className="text-center mb-12">
        <Globe className="w-20 h-20 mx-auto mb-6 text-blue-200" />
        <h1 className="text-4xl font-bold mb-4">Grova</h1>
        <p className="text-xl text-blue-100 leading-relaxed">
          Finance without Borders.<br />
          Access without Limits.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex items-center text-left bg-white/10 p-4 rounded-xl">
          <Wifi className="w-6 h-6 mr-4" />
          <span>Works offline & online globally</span>
        </div>
        <div className="flex items-center text-left bg-white/10 p-4 rounded-xl">
          <Wallet className="w-6 h-6 mr-4" />
          <span>Fiat, Crypto & Credits in one app</span>
        </div>
        <div className="flex items-center text-left bg-white/10 p-4 rounded-xl">
          <Mic className="w-6 h-6 mr-4" />
          <span>Voice interface in local languages</span>
        </div>
      </div>

      <div className="space-y-3">
        <Button 
          onClick={() => setCurrentScreen('login')}
          className="w-full bg-white text-[hsl(207,90%,54%)] py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-gray-50"
        >
          Get Started
        </Button>
        <Button 
          onClick={() => setCurrentScreen('login')}
          variant="outline"
          className="w-full border-2 border-white text-white py-4 rounded-xl font-semibold text-lg bg-transparent hover:bg-white/10"
        >
          Log In
        </Button>
      </div>
    </div>
  );

  const LoginScreen = () => (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-8 pt-12">
        <Button
          variant="ghost"
          onClick={() => setCurrentScreen('welcome')}
          className="text-[hsl(207,90%,54%)] mb-6 p-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-3xl font-bold mb-2">Welcome back</h2>
        <p className="text-slate-600">Sign in to your Grova account</p>
      </div>

      <form className="space-y-6" onSubmit={handleLogin}>
        <div>
          <Label className="block text-sm font-medium text-slate-700 mb-2">
            Phone or Email
          </Label>
          <Input
            type="text"
            className="w-full px-4 py-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[hsl(207,90%,54%)] focus:border-transparent"
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
              className="w-full px-4 py-4 pr-12 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[hsl(207,90%,54%)] focus:border-transparent"
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
          <a href="#" className="text-sm text-[hsl(207,90%,54%)] font-medium">
            Forgot password?
          </a>
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-[hsl(207,90%,54%)] text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:bg-blue-700 transition-colors"
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

      <p className="text-center text-sm text-slate-600 mt-8">
        Don't have an account?{' '}
        <a href="#" className="text-[hsl(207,90%,54%)] font-medium">
          Sign up
        </a>
      </p>
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