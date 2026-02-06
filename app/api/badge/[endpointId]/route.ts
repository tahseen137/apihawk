import { NextResponse } from 'next/server';
import { store } from '@/lib/store';

function generateBadge(status: 'up' | 'down' | 'unknown', uptime: number): string {
  const color = status === 'up' ? '#22c55e' : status === 'down' ? '#ef4444' : '#94a3b8';
  const text = status === 'up' 
    ? `${uptime.toFixed(1)}% uptime` 
    : status === 'down' 
    ? 'down' 
    : 'unknown';
  
  const textWidth = text.length * 7;
  const totalWidth = 60 + textWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img">
  <linearGradient id="grad" x2="0" y2="100%">
    <stop offset="0" stop-color="#555" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="45" height="20" fill="#555"/>
    <rect x="45" width="${totalWidth - 45}" height="20" fill="${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#grad)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="22.5" y="15" fill="#010101" fill-opacity=".3">status</text>
    <text x="22.5" y="14">status</text>
    <text x="${45 + (totalWidth - 45) / 2}" y="15" fill="#010101" fill-opacity=".3">${text}</text>
    <text x="${45 + (totalWidth - 45) / 2}" y="14">${text}</text>
  </g>
</svg>`;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ endpointId: string }> }
) {
  const { endpointId } = await params;
  const endpoint = store.getEndpoint(endpointId);

  if (!endpoint) {
    const svg = generateBadge('unknown', 0);
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-cache',
      },
    });
  }

  const lastCheck = store.getLastCheck(endpointId);
  const uptime = store.getUptime(endpointId);
  
  const isUp = lastCheck && lastCheck.status === endpoint.expectedStatus;
  const status = lastCheck ? (isUp ? 'up' : 'down') : 'unknown';

  const svg = generateBadge(status, uptime);

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache',
    },
  });
}
