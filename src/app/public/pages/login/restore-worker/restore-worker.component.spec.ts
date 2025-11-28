import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreWorkerComponent } from './restore-worker.component';

describe('RestoreWorkerComponent', () => {
  let component: RestoreWorkerComponent;
  let fixture: ComponentFixture<RestoreWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestoreWorkerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestoreWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
