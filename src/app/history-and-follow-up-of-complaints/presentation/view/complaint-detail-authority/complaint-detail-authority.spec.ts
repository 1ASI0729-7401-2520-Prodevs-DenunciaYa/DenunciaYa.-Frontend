import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintDetailAuthority } from './complaint-detail-authority';

describe('ComplaintDetailAuthority', () => {
  let component: ComplaintDetailAuthority;
  let fixture: ComponentFixture<ComplaintDetailAuthority>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintDetailAuthority]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintDetailAuthority);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
