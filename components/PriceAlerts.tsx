'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface PriceAlert {
  id: string;
  coin_id: string;
  price: number;
  condition: 'above' | 'below';
}

export default function PriceAlerts() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [newAlert, setNewAlert] = useState({
    coin_id: '',
    price: '',
    condition: 'above' as 'above' | 'below'
  });

  const loadAlerts = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      
      setAlerts(data || []);
    } catch (error) {
      console.error('Error loading alerts:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load price alerts",
      });
    }
  };

  const addAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newAlert.coin_id || !newAlert.price) return;

    try {
      const { error } = await supabase
        .from('price_alerts')
        .insert({
          user_id: user.id,
          coin_id: newAlert.coin_id,
          price: parseFloat(newAlert.price),
          condition: newAlert.condition
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Price alert created",
      });

      setNewAlert({
        coin_id: '',
        price: '',
        condition: 'above'
      });

      loadAlerts();
    } catch (error) {
      console.error('Error adding alert:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create alert",
      });
    }
  };

  const removeAlert = async (alertId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Alert removed",
      });

      loadAlerts();
    } catch (error) {
      console.error('Error removing alert:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove alert",
      });
    }
  };

  useEffect(() => {
    if (user) {
      loadAlerts();

      // Set up real-time subscription
      const subscription = supabase
        .channel('price_alerts_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'price_alerts',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            loadAlerts();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Price Alerts</h2>
      <form onSubmit={addAlert} className="space-y-4">
        <div className="flex gap-4">
          <Input
            placeholder="Coin ID (e.g., bitcoin)"
            value={newAlert.coin_id}
            onChange={(e) => setNewAlert({ ...newAlert, coin_id: e.target.value })}
            className="flex-1"
          />
          <Input
            type="number"
            step="any"
            placeholder="Price"
            value={newAlert.price}
            onChange={(e) => setNewAlert({ ...newAlert, price: e.target.value })}
            className="w-32"
          />
          <Select
            value={newAlert.condition}
            onValueChange={(value: 'above' | 'below') => 
              setNewAlert({ ...newAlert, condition: value })
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="above">Above</SelectItem>
              <SelectItem value="below">Below</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">Add Alert</Button>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {alerts.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No price alerts set. Add one above to get started.
          </p>
        ) : (
          alerts.map(alert => (
            <div 
              key={alert.id} 
              className="flex justify-between items-center p-3 border rounded hover:bg-accent/50"
            >
              <div>
                <span className="font-medium">{alert.coin_id}</span>
                <span className="text-muted-foreground">
                  {' '}{alert.condition}{' '}
                  ${alert.price.toLocaleString()}
                </span>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => removeAlert(alert.id)}
              >
                Remove
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}


