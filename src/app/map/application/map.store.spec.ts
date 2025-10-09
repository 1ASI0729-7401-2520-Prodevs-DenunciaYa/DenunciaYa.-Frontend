import { TestBed } from '@angular/core/testing';

import { MapStore } from './map.store';

describe('MapStore', () => {
  let service: MapStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
