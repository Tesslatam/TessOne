import { Injectable } from '@nestjs/common';

@Injectable()
export class MonitoringService {
  private readonly endpointCounters = new Map<string, number>();

  increment(endpointKey: string): number {
    const current = this.endpointCounters.get(endpointKey) || 0;
    const next = current + 1;
    this.endpointCounters.set(endpointKey, next);
    return next;
  }

  getCount(endpointKey: string): number {
    return this.endpointCounters.get(endpointKey) || 0;
  }

  getAllCounts() {
    return Array.from(this.endpointCounters.entries()).map(
      ([endpoint, count]) => ({
        endpoint,
        count,
      }),
    );
  }
}
