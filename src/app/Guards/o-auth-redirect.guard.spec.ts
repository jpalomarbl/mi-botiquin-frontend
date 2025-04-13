import { TestBed } from '@angular/core/testing';

import { OAuthRedirectGuard } from './o-auth-redirect.guard';

describe('OAuthRedirectGuard', () => {
  let guard: OAuthRedirectGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OAuthRedirectGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
