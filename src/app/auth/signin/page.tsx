"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { useState } from "react";
import { Sparkles, Presentation, Zap, Shield, ArrowRight } from "lucide-react";
import AllweoneText from "@/components/globals/allweone-logo";

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/presentation";
  const error = searchParams.get("error");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (provider: string) => {
    setIsLoading(true);
    try {
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Create stunning presentations with advanced AI models"
    },
    {
      icon: Presentation,
      title: "Professional Templates",
      description: "Choose from dozens of professionally designed themes"
    },
    {
      icon: Zap,
      title: "Real-time Editing",
      description: "Collaborative editing with auto-save and version history"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Pattern - Simple geometric pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg mx-auto">
            {/* Logo */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Presentation className="h-8 w-8 text-white" />
                </div>
                <AllweoneText className="scale-125" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                AI Presentation Generator
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Create professional presentations in seconds, not hours
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <feature.icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Enterprise-grade security • GDPR compliant • 99.9% uptime</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 lg:max-w-md xl:max-w-lg flex items-center justify-center px-6 py-12">
          <Card className="w-full shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-6">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Presentation className="h-6 w-6 text-white" />
                </div>
                <AllweoneText />
              </div>
              
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Sign in to your account to continue creating amazing presentations
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-4">
              {error && (
                <div
                  className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm"
                  role="alert"
                >
                  Authentication failed. Please try again or contact support if the issue persists.
                </div>
              )}

              <Button
                variant="outline"
                className="flex items-center justify-center gap-3 h-12 text-base border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-200"
                onClick={() => handleSignIn("google")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <FaGoogle className="h-5 w-5" />
                    Continue with Google
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </>
                )}
              </Button>

              {/* Additional Options */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-800 px-2 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Demo Account Option */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
                    <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Try Demo Mode
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      Explore features without creating an account
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col items-center justify-center gap-4 pt-6">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
                By signing in, you agree to our{" "}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Privacy Policy
                </a>
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Secure authentication</span>
                <span>•</span>
                <span>No data sharing</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
