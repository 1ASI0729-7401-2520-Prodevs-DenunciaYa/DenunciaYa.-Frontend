import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoverPasswordOwnerComponent } from './recover-password-owner.component';

describe('RecoverPasswordOwnerComponent', () => {
  let component: RecoverPasswordOwnerComponent;
  let fixture: ComponentFixture<RecoverPasswordOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecoverPasswordOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecoverPasswordOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
