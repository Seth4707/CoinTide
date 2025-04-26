'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/';
  const router = useRouter();
  const { user, isLoading, signIn, signUp } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        router.push(redirectTo);
      } else {
        await signUp(formData.email, formData.password);
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account.",
          duration: 6000,
        });
        setIsLogin(true);
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Authentication failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">{isLogin ? 'Sign In' : 'Create Account'}</h2>
          <p className="mt-2 text-muted-foreground">
            {isLogin ? "Welcome back!" : "Get started with your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              required
              className="w-full p-2 border rounded"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <input
              type="password"
              required
              className="w-full p-2 border rounded"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>
          {!isLogin && (
            <div>
              <input
                type="password"
                required
                className="w-full p-2 border rounded"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-primary-foreground py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

