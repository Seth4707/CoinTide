'use client';

import { useState, useEffect } from 'react';

// Define an interface for the status state
interface NetworkStatusState {
  supabaseReachable: boolean;
  apiReachable: boolean;
  checking: boolean;
  error: string | null;
}

export default function NetworkStatus() {
  const [status, setStatus] = useState<NetworkStatusState>({
    supabaseReachable: false,
    apiReachable: false,
    checking: true,
    error: null
  });

  useEffect(() => {
    const checkConnections = async () => {
      try {
        // Check Supabase connection
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseRes = await fetch(`${supabaseUrl}/auth/v1/health`, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        }).catch(err => {
          console.error('Supabase health check error:', err);
          return { ok: false };
        });

        // Check CoinGecko API
        const apiRes = await fetch('https://api.coingecko.com/api/v3/ping', {
          method: 'GET',
          mode: 'cors',
        }).catch(err => {
          console.error('CoinGecko ping error:', err);
          return { ok: false };
        });

        setStatus({
          supabaseReachable: supabaseRes.ok,
          apiReachable: apiRes.ok,
          checking: false,
          error: null
        });
      } catch (error: unknown) {
        setStatus({
          supabaseReachable: false,
          apiReachable: false,
          checking: false,
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        });
      }
    };

    checkConnections();
  }, []);

  if (status.checking) {
    return <div className="text-sm text-gray-500">Checking network status...</div>;
  }

  return (
    <div className="text-sm p-2 border rounded-md">
      <h3 className="font-bold">Network Status</h3>
      <div>Supabase: {status.supabaseReachable ? '✅' : '❌'}</div>
      <div>CoinGecko API: {status.apiReachable ? '✅' : '❌'}</div>
      {status.error && <div className="text-red-500">Error: {status.error}</div>}
    </div>
  );
}




