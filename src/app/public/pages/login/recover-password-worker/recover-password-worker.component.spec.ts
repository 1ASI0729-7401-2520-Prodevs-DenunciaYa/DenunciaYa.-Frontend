import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverPasswordWorkerComponent } from './recover-password-worker.component';

describe('RecoverPasswordWorkerComponent', () => {
  let component: RecoverPasswordWorkerComponent;
  let fixture: ComponentFixture<RecoverPasswordWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoverPasswordWorkerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoverPasswordWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
