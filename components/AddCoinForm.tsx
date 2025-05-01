'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddCoinFormProps {
  onSuccess?: () => void;
}

export default function AddCoinForm({ onSuccess }: AddCoinFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    coin_id: '',
    amount: '',
    purchase_price: '',
    purchase_date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // First, fetch existing portfolio
      const { data: existingPortfolio, error: fetchError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw fetchError;
      }

      const newHolding = {
        coinId: formData.coin_id.toLowerCase(),
        amount: Number(formData.amount),
        purchasePrice: Number(formData.purchase_price),
        purchaseDate: formData.purchase_date
      };

      console.log("Adding new holding:", newHolding); // Debug log

      if (existingPortfolio) {
        // Update existing portfolio
        const holdings = existingPortfolio.holdings || [];
        const { error: updateError } = await supabase
          .from('portfolios')
          .update({
            holdings: [...holdings, newHolding],
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } else {
        // Create new portfolio
        const { error: insertError } = await supabase
          .from('portfolios')
          .insert([
            {
              user_id: user.id,
              holdings: [newHolding],
              settings: { currency: 'USD', refresh_interval: 60000 }
            }
          ]);

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Coin added to your portfolio",
      });

      setOpen(false);
      setFormData({
        coin_id: '',
        amount: '',
        purchase_price: '',
        purchase_date: new Date().toISOString().split('T')[0]
      });
      
      console.log("Calling onSuccess callback"); // Debug log
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Error adding coin:", error); // Debug log
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Coin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Coin to Portfolio</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="coin_id">Coin ID (e.g., bitcoin, ethereum)</Label>
            <Input
              id="coin_id"
              value={formData.coin_id}
              onChange={(e) => setFormData(prev => ({ ...prev, coin_id: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="any"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="purchase_price">Purchase Price (USD)</Label>
            <Input
              id="purchase_price"
              type="number"
              step="any"
              value={formData.purchase_price}
              onChange={(e) => setFormData(prev => ({ ...prev, purchase_price: e.target.value }))}
              required
            />
          </div>
          <div>
            <Label htmlFor="purchase_date">Purchase Date</Label>
            <Input
              id="purchase_date"
              type="date"
              value={formData.purchase_date}
              onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Coin'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}



