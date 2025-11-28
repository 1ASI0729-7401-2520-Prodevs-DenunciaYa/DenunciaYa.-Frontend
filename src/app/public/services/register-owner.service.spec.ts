import { TestBed } from '@angular/core/testing';

import { RegisterOwnerService } from './register-owner.service';

describe('RegisterOwnerService', () => {
  let service: RegisterOwnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterOwnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
