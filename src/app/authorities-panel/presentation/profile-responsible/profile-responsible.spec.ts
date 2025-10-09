import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileResponsible } from './profile-responsible';

describe('ProfileResponsible', () => {
  let component: ProfileResponsible;
  let fixture: ComponentFixture<ProfileResponsible>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileResponsible]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileResponsible);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
