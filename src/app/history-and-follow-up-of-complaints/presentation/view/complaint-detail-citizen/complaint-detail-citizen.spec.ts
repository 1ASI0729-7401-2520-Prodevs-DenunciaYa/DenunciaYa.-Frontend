import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintDetailCitizen } from './complaint-detail-citizen';

describe('ComplaintDetailCitizen', () => {
  let component: ComplaintDetailCitizen;
  let fixture: ComponentFixture<ComplaintDetailCitizen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintDetailCitizen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintDetailCitizen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
