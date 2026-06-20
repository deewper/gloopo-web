// Supabase Edge Function: crystara-proxy
// Serves as a secure proxy to query Crystara API. Retrieves the Crystara API Key from the database using service_role key to bypass RLS, keeping it secure from the client.

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the API key from website_settings table using service role (bypassing RLS)
    const { data, error: dbError } = await supabase
      .from('website_settings')
      .select('value')
      .eq('key', 'crystara_api_key')
      .single();

    if (dbError || !data?.value?.apiKey) {
      console.error('Error fetching API key:', dbError);
      return new Response(
        JSON.stringify({ error: 'Crystara API Key is not configured in settings' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const crystaraApiKey = data.value.apiKey;

    // Parse requested body
    const body = await req.json();
    const { creator, collection, page = 1, limit = 50, network = 'mainnet' } = body;

    if (!creator || !collection) {
      return new Response(
        JSON.stringify({ error: 'Missing creator or collection parameter' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Call Crystara API
    const baseUrl = network === 'testnet' 
      ? 'https://api.crystara.trade/testnet' 
      : 'https://api.crystara.trade/mainnet';
      
    const url = `${baseUrl}/tokens-by-collection?creator=${encodeURIComponent(creator)}&collection=${encodeURIComponent(collection)}&page=${page}&limit=${limit}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': crystaraApiKey,
        'Content-Type': 'application/json'
      }
    });

    const responseData = await res.json();
    
    return new Response(
      JSON.stringify(responseData),
      { 
        status: res.status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (err: any) {
    console.error('Crystara Proxy Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal Server Error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
