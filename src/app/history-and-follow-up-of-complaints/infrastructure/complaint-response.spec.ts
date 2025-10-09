import { TestBed } from '@angular/core/testing';

import { ComplaintResponse } from './complaint-response';

describe('ComplaintResponse', () => {
  let service: ComplaintResponse;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplaintResponse);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
