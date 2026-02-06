import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

async function checkEndpoint(url: string): Promise<{
  status: number | null;
  responseTime: number | null;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(10000), // 10s timeout
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      status: response.status,
      responseTime,
    };
  } catch (error) {
    return {
      status: null,
      responseTime: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function POST() {
  const endpoints = store.getAllEndpoints();
  
  const checks = await Promise.all(
    endpoints.map(async (endpoint) => {
      const result = await checkEndpoint(endpoint.url);
      
      store.addCheck(endpoint.id, {
        timestamp: Date.now(),
        ...result,
      });
      
      return {
        id: endpoint.id,
        ...result,
      };
    })
  );

  return NextResponse.json({ checks });
}
