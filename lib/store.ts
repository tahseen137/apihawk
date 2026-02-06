// In-memory store for MVP
export interface Endpoint {
  id: string;
  name: string;
  url: string;
  expectedStatus: number;
  checks: Check[];
}

export interface Check {
  timestamp: number;
  status: number | null;
  responseTime: number | null;
  error?: string;
}

class Store {
  private endpoints: Map<string, Endpoint> = new Map();

  addEndpoint(name: string, url: string, expectedStatus: number = 200): Endpoint {
    const id = Math.random().toString(36).substring(2, 15);
    const endpoint: Endpoint = {
      id,
      name,
      url,
      expectedStatus,
      checks: [],
    };
    this.endpoints.set(id, endpoint);
    return endpoint;
  }

  getEndpoint(id: string): Endpoint | undefined {
    return this.endpoints.get(id);
  }

  getAllEndpoints(): Endpoint[] {
    return Array.from(this.endpoints.values());
  }

  deleteEndpoint(id: string): boolean {
    return this.endpoints.delete(id);
  }

  addCheck(id: string, check: Check): void {
    const endpoint = this.endpoints.get(id);
    if (endpoint) {
      endpoint.checks.push(check);
      // Keep only last 100 checks
      if (endpoint.checks.length > 100) {
        endpoint.checks.shift();
      }
    }
  }

  getUptime(id: string): number {
    const endpoint = this.endpoints.get(id);
    if (!endpoint || endpoint.checks.length === 0) return 0;
    
    const successfulChecks = endpoint.checks.filter(
      c => c.status === endpoint.expectedStatus
    ).length;
    
    return (successfulChecks / endpoint.checks.length) * 100;
  }

  getAverageResponseTime(id: string): number {
    const endpoint = this.endpoints.get(id);
    if (!endpoint || endpoint.checks.length === 0) return 0;
    
    const validChecks = endpoint.checks.filter(c => c.responseTime !== null);
    if (validChecks.length === 0) return 0;
    
    const sum = validChecks.reduce((acc, c) => acc + (c.responseTime || 0), 0);
    return Math.round(sum / validChecks.length);
  }

  getLastCheck(id: string): Check | undefined {
    const endpoint = this.endpoints.get(id);
    if (!endpoint || endpoint.checks.length === 0) return undefined;
    return endpoint.checks[endpoint.checks.length - 1];
  }
}

export const store = new Store();
