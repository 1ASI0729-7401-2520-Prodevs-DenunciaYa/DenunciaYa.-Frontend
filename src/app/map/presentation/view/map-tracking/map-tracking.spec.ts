import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTracking } from './map-tracking';

describe('MapTracking', () => {
  let component: MapTracking;
  let fixture: ComponentFixture<MapTracking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapTracking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapTracking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
