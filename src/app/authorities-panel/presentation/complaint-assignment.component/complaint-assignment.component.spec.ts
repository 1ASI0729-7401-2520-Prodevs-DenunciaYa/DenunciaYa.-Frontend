import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintAssignmentComponent } from './complaint-assignment.component';

describe('ComplaintAssignmentComponent', () => {
  let component: ComplaintAssignmentComponent;
  let fixture: ComponentFixture<ComplaintAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
