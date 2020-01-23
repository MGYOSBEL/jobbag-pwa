import { TestBed } from '@angular/core/testing';

import { DashboardResolverService } from './dashboard-resolver.service';

describe('DashboardResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardResolverService = TestBed.get(DashboardResolverService);
    expect(service).toBeTruthy();
  });
});
