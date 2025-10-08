import { TestBed } from '@angular/core/testing';

import { DistrictCoordinatesService } from './district-coordinates.service';

describe('DistrictCoordinatesService', () => {
  let service: DistrictCoordinatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistrictCoordinatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
