import { TestBed } from '@angular/core/testing';

import { ComplaintApi } from './complaint-api';

describe('ComplaintApi', () => {
  let service: ComplaintApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplaintApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
