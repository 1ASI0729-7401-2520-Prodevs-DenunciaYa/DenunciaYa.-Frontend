import { TestBed } from '@angular/core/testing';

import { ComplaintsStore } from './complaints.store';

describe('ComplaintsStore', () => {
  let service: ComplaintsStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComplaintsStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
