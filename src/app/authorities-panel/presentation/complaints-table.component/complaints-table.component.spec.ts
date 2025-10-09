import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintsTableComponent } from './complaints-table.component';

describe('ComplaintsTableComponent', () => {
  let component: ComplaintsTableComponent;
  let fixture: ComponentFixture<ComplaintsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
