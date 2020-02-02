import { TestBed } from '@angular/core/testing';

import { SocialAuthService } from './social-auth.service';

describe('SocialAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocialAuthService = TestBed.get(SocialAuthService);
    expect(service).toBeTruthy();
  });
});
