'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Coin {
  id: string;
  name: string;
  amount: number;
  purchase_price: number;
  purchase_date: string;
  created_at: string;
  user_id: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('Dashboard: No user found, redirecting to auth');
      router.replace('/auth');
      return;
    }

    if (user) {
      fetchUserCoins();
    }
  }, [user, isLoading]);

  const fetchUserCoins = async () => {
    try {
      const { data, error } = await supabase
        .from('coins')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoins(data || []);
    } catch (error) {
      console.error('Error fetching coins:', error);
      toast({
        title: "Error",
        description: "Failed to load your coins. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setDashboardLoading(false);
    }
  };

  if (isLoading || dashboardLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Crypto Dashboard</h1>
        <Button 
          onClick={() => router.push('/dashboard/add-coin')}
          className="bg-primary text-white"
        >
          Add New Coin
        </Button>
      </div>

      {coins.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Your Dashboard</CardTitle>
            <CardDescription>
              You haven't added any coins yet. Start building your portfolio by adding your first coin.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Button 
              onClick={() => router.push('/dashboard/add-coin')}
              className="bg-primary text-white"
            >
              Add Your First Coin
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coins.map((coin) => (
            <Card key={coin.id}>
              <CardHeader>
                <CardTitle>{coin.name}</CardTitle>
                <CardDescription>
                  Added on {new Date(coin.created_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p>Amount: {coin.amount}</p>
                  <p>Purchase Price: ${coin.purchase_price}</p>
                  <p>Purchase Date: {new Date(coin.purchase_date).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto">
              {JSON.stringify({
                email: user.email,
                id: user.id,
                lastSignIn: user.last_sign_in_at,
              }, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

