'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Portfolio from '@/components/Portfolio';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/components/ui/use-toast";

export default function PortfolioPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to view your portfolio",
      });
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <Portfolio />;
}



