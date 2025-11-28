import { TestBed } from '@angular/core/testing';

import { RegisterWorkerService } from './register-worker.service';

describe('RegisterWorkerService', () => {
  let service: RegisterWorkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegisterWorkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
