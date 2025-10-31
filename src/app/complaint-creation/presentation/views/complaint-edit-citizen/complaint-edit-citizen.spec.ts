import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintEditCitizen } from './complaint-edit-citizen';

describe('ComplaintEditCitizen', () => {
  let component: ComplaintEditCitizen;
  let fixture: ComponentFixture<ComplaintEditCitizen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintEditCitizen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintEditCitizen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
